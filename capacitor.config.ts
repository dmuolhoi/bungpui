
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.bungpui',
  appName: 'Bungpui AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development purposes, uncomment the following line to use your local dev server
    // url: 'http://your-local-ip:8080', // Replace with your local IP
    // For production, comment out the url property
  },
  // Enable Capacitor's built-in support for deep links
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
