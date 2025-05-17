
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

export const AppDownload = () => {
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [isGitHubRelease, setIsGitHubRelease] = useState(false);
  const repoOwner = "dmuolhoi";
  const repoName = "bungpui";
  
  useEffect(() => {
    // Check if we're on GitHub Pages or other deployment
    const isProduction = window.location.hostname.includes("github.io") || 
                          import.meta.env.MODE === "production";
    
    if (isProduction) {
      // For GitHub Pages deployment
      // Try to fetch the latest release info from GitHub API
      fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`)
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            // Fallback to local APK if GitHub API fails
            setApkUrl(`${import.meta.env.BASE_URL}bungpui.apk`);
            return null;
          }
        })
        .then(data => {
          if (data && data.assets) {
            // Find the APK asset
            const apkAsset = data.assets.find((asset: any) => 
              asset.name.endsWith('.apk')
            );
            
            if (apkAsset) {
              setApkUrl(apkAsset.browser_download_url);
              setIsGitHubRelease(true);
            } else {
              // Fallback to local APK
              setApkUrl(`${import.meta.env.BASE_URL}bungpui.apk`);
            }
          }
        })
        .catch(() => {
          // Fallback to local APK if there's an error
          setApkUrl(`${import.meta.env.BASE_URL}bungpui.apk`);
        });
    } else {
      // For local development
      setApkUrl(`${import.meta.env.BASE_URL}bungpui.apk`);
    }
  }, []);

  return (
    <Card className="border-chatapp-inputBorder bg-chatapp-userBubble mt-8">
      <CardHeader>
        <CardTitle>Download Mobile App</CardTitle>
        <CardDescription className="text-chatapp-secondaryText">
          Use Bungpui AI on your Android device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apkUrl ? (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            onClick={() => window.open(apkUrl, '_blank')}
          >
            <Download size={18} />
            Download Android APK
          </Button>
        ) : (
          <Button disabled className="w-full">
            Loading download link...
          </Button>
        )}
        
        {isGitHubRelease && (
          <Button 
            variant="outline"
            className="w-full border-chatapp-inputBorder hover:bg-chatapp-aiBubble hover:text-white flex items-center justify-center gap-2"
            onClick={() => window.open(`https://github.com/${repoOwner}/${repoName}/releases`, '_blank')}
          >
            <ExternalLink size={18} />
            View All Releases
          </Button>
        )}
        
        <p className="text-sm text-chatapp-secondaryText mt-2">
          To install: download the APK file, open it on your Android device and follow the installation prompts. 
          You may need to allow installation from unknown sources in your device settings.
        </p>
      </CardContent>
    </Card>
  );
};
