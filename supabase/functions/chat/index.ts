
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    )

    // Get the session of the user who sent the request
    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    // For development, allow unauthorized requests
    // In production, you would want to uncomment this check
    /*
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    */

    // Parse request body
    const { message } = await req.json()
    // Use session.user.id if available, otherwise use a placeholder for development
    const userId = session?.user.id || "development_user_id"

    // Get user settings
    // Use .then() syntax instead of await for better error handling
    const { data: userSettings } = await supabaseClient
      .from("settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
      .then(result => result)
      .catch(() => ({ data: null }));

    // Default settings if none found
    const settings = userSettings || {
      context_window: 3,
      preferred_language: "English",
      show_codeblocks: true,
      user_instruction: "",
    }
    
    // Get system config or use default
    const { data: config } = await supabaseClient
      .from("config")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(result => result)
      .catch(() => ({ data: null }));

    // Enhanced system prompt with clearer role definition
    const systemPrompt = config?.system_prompt || 
    `You are Bungpui, an AI designed to help collect and create data on the Hmar language.
Your primary role is to assist users with translations, language learning, and cultural information about Hmar.

Guidelines

- Respect cultural contexts
- Keep answers short, clear, and structured
- Provide pronunciation when helpful
- Explain grammar briefly and clearly
- Use markdown and code blocks for structured data
- Admit uncertainty; never claim fluency
- Don’t fabricate info about yourself, the project, or the creator

Project Context

Bungpui is part of the Hmar Language Development Project, started July 2024 by Donal Muolhoi.
Built using Gemini by Google AI, it aims to document resources for Hmar.

Status: Pre-alpha; still learning, not authoritative.`;
    
    // Get conversation history for context
    const { data: conversations } = await supabaseClient
      .from("conversations")
      .select("messages")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(result => result)
      .catch(() => ({ data: null }));
    
    // Always include exactly 3 previous messages for context, regardless of user settings
    let contextMessages = []
    
    if (conversations && conversations.messages.length > 0) {
      // Take the last 3 messages (or fewer if there aren't 3)
      const lastMessages = conversations.messages.slice(-6); // Get last 6 to potentially get 3 pairs
      
      // Format with clear role indicators (max 3 exchanges)
      contextMessages = lastMessages
        .slice(-Math.min(6, lastMessages.length)) // Get up to 3 exchanges (6 messages)
        .map(msg => `${msg.role === 'user' ? 'User' : 'Bungpui'}: ${msg.content}`)
        .join('\n\n');
    }

    // Format the API request to Gemini model
    const userInstruction = settings.user_instruction 
      ? `\nCustom Instructions: ${settings.user_instruction}\n` 
      : '\n';
    const context = contextMessages.length > 0 ? `\n\nPrevious conversation:\n${contextMessages}\n\n` : '';
    
    const prompt = `${systemPrompt}${userInstruction}${context}User: ${message}`;
    
    console.log("Sending request to Gemini API with prompt:", prompt);
    
    // Get the API key from env vars
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}
    // Call the Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        }),
      }
    )

    const geminiData = await geminiResponse.json()
    
    if (!geminiResponse.ok) {
      console.error("Gemini API error:", geminiData)
      return new Response(
        JSON.stringify({ error: "Error generating AI response", details: geminiData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Extract AI response
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."
    
    // Save the conversation if session exists
    if (session) {
      const newMessages = [
        { role: "user", content: message, timestamp: new Date().toISOString() },
        { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() }
      ]
      
      if (conversations) {
        // Update existing conversation
        await supabaseClient
          .from("conversations")
          .update({ 
            messages: [...conversations.messages, ...newMessages],
            timestamp: new Date().toISOString()
          })
          .eq("user_id", userId)
      } else {
        // Create new conversation
        await supabaseClient
          .from("conversations")
          .insert({ 
            user_id: userId, 
            messages: newMessages,
            timestamp: new Date().toISOString()
          })
      }
    }

    // Return the AI response
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error:", error)
    
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
