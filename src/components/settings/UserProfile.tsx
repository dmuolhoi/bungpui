
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const profileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  date_of_birth: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const UserProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      date_of_birth: "",
      website: "",
      twitter: "",
      facebook: "",
      instagram: "",
    }
  });

  // Load profile data from localStorage
  useEffect(() => {
    if (user) {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const profileData = JSON.parse(storedProfile);
        form.reset({
          name: profileData.name || "",
          bio: profileData.bio || "",
          date_of_birth: profileData.date_of_birth || "",
          website: profileData.website || "",
          twitter: profileData.twitter || "",
          facebook: profileData.facebook || "",
          instagram: profileData.instagram || "",
        });
      }
    }
  }, [user?.id, form]);

  // Save profile
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Save to localStorage for now
      localStorage.setItem('userProfile', JSON.stringify(values));
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-chatapp-inputBorder bg-chatapp-userBubble">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription className="text-chatapp-secondaryText">
          Manage your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text" />
                  </FormControl>
                  <FormDescription className="text-chatapp-secondaryText">
                    Your full name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text" />
                  </FormControl>
                  <FormDescription className="text-chatapp-secondaryText">
                    Tell us about yourself
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      {...field} 
                      className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-chatapp-inputBg border-chatapp-inputBorder text-chatapp-text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-white text-black hover:bg-black hover:text-white"
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
