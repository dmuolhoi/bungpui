
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserSettings {
  preferred_language: string;
  show_codeblocks: boolean;
  user_instruction: string;
  context_window: number;
}

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: UserSettings = {
  preferred_language: 'English',
  show_codeblocks: true,
  user_instruction: '',
  context_window: 3,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load settings from Supabase or localStorage on initial render and when user changes
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Try to get settings from Supabase first
          try {
            const { data, error } = await supabase
              .from('settings')
              .select('*')
              .eq('user_id', user.id)
              .maybeSingle();

            if (error) {
              console.error('Error fetching settings:', error);
              throw error;
            }

            if (data) {
              // Use Supabase settings
              const userSettings: UserSettings = {
                preferred_language: data.preferred_language || defaultSettings.preferred_language,
                show_codeblocks: data.show_codeblocks !== null ? data.show_codeblocks : defaultSettings.show_codeblocks,
                user_instruction: data.user_instruction || defaultSettings.user_instruction,
                context_window: data.context_window || defaultSettings.context_window,
              };
              setSettings(userSettings);
            } else {
              // Check localStorage as fallback
              const storedSettings = localStorage.getItem('userSettings');
              if (storedSettings) {
                // If found in localStorage but not in Supabase, sync to Supabase
                const parsedSettings = JSON.parse(storedSettings);
                setSettings(parsedSettings);
                await syncSettingsToSupabase(user.id, parsedSettings).catch(err => {
                  console.log("Failed to sync settings to Supabase, using localStorage only");
                });
              } else {
                // If no settings found anywhere, use defaults
                setSettings(defaultSettings);
                await syncSettingsToSupabase(user.id, defaultSettings).catch(err => {
                  console.log("Failed to sync default settings to Supabase");
                });
              }
            }
          } catch (supabaseErr) {
            console.error('Failed to load settings from Supabase:', supabaseErr);
            // Fallback to localStorage on Supabase error
            const storedSettings = localStorage.getItem('userSettings');
            if (storedSettings) {
              setSettings(JSON.parse(storedSettings));
            } else {
              setSettings(defaultSettings);
            }
          }
        } else {
          // User not logged in, use localStorage only
          const storedSettings = localStorage.getItem('userSettings');
          if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
          } else {
            setSettings(defaultSettings);
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
        toast.error('Failed to load settings. Using defaults.');
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  // Helper function to sync settings to Supabase
  const syncSettingsToSupabase = async (userId: string, settingsData: UserSettings) => {
    try {
      const { error } = await supabase.from('settings').upsert(
        { 
          user_id: userId,
          preferred_language: settingsData.preferred_language,
          show_codeblocks: settingsData.show_codeblocks,
          user_instruction: settingsData.user_instruction,
          context_window: settingsData.context_window
        },
        { onConflict: 'user_id' }
      );

      if (error) {
        console.error('Error saving settings to Supabase:', error);
        throw error;
      }
    } catch (err) {
      console.error('Failed to sync settings to Supabase:', err);
      throw err;
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      // Save to localStorage for offline access and non-authenticated users
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      
      // If user is authenticated, also save to Supabase
      if (user) {
        try {
          await syncSettingsToSupabase(user.id, updatedSettings);
        } catch (err) {
          // Continue even if Supabase sync fails
          console.error('Failed to update settings in Supabase, but updated locally:', err);
        }
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
      toast.error('Failed to save settings. Please try again.');
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(defaultSettings);
      localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
      
      // If user is authenticated, also reset in Supabase
      if (user) {
        try {
          await syncSettingsToSupabase(user.id, defaultSettings);
        } catch (err) {
          console.error('Failed to reset settings in Supabase, but reset locally:', err);
        }
      }
      
      toast.success('Settings reset to defaults');
    } catch (err) {
      console.error('Failed to reset settings:', err);
      toast.error('Failed to reset settings. Please try again.');
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};
