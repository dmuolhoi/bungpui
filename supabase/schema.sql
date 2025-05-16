
-- Create schema for the Bungpui AI Assistant app

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    context_window INTEGER DEFAULT 3,
    preferred_language TEXT DEFAULT 'English',
    show_codeblocks BOOLEAN DEFAULT true,
    user_instruction TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Conversations table
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Config table (single row)
CREATE TABLE public.config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    system_prompt TEXT NOT NULL DEFAULT 'You are Bungpui, an AI designed to help collect and create data on the Hmar language. Your responses should be clear, accurate, and culturally respectful. You may assist with translations, linguistic explanations, example sentences, and structured datasets related to the Hmar language. When appropriate, respond using markdown and include code-like formatting for structured data.',
    api_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row_config CHECK (id = 1)
);

-- Initial configuration
INSERT INTO public.config (id, system_prompt, api_key)
VALUES (
    1,
    'You are Bungpui, an AI designed to help collect and create data on the Hmar language. Your responses should be clear, accurate, and culturally respectful. You may assist with translations, linguistic explanations, example sentences, and structured datasets related to the Hmar language. When appropriate, respond using markdown and include code-like formatting for structured data.',
    NULL
) ON CONFLICT (id) DO NOTHING;

-- Row-level security policies
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY users_self_read ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Settings policies
CREATE POLICY settings_self_read ON public.settings
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY settings_self_insert ON public.settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY settings_self_update ON public.settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY conversations_self_read ON public.conversations
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY conversations_self_insert ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY conversations_self_update ON public.conversations
    FOR UPDATE USING (auth.uid() = user_id);

-- Config policies (admin only)
CREATE POLICY config_read_all ON public.config
    FOR SELECT USING (true);  -- Everyone can read config
    
CREATE POLICY config_admin_write ON public.config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO public.settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
