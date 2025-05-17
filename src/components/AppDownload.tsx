
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ExternalLink, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const AppDownload = () => {
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGitHubRelease, setIsGitHubRelease] = useState(false);
  const repoOwner = "dmuolhoi";
  const repoName = "bungpui";
  
  useEffect(() => {
    // Always start by checking GitHub releases
    setIsLoading(true);
    
    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('No releases found');
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
            return;
          }
        }
        throw new Error('No APK found in release');
      })
      .catch(() => {
        // Fallback to checking artifacts directly
        return fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/artifacts`)
          .then(response => response.json())
          .then(data => {
            if (data && data.artifacts && data.artifacts.length > 0) {
              // Find the most recent APK artifact
              const apkArtifact = data.artifacts.find((artifact: any) => 
                artifact.name === 'bungpui-android-app'
              );
              
              if (apkArtifact) {
                // For artifacts, we can't provide direct download links without authentication
                // So we'll point to the Actions page
                setApkUrl(`https://github.com/${repoOwner}/${repoName}/actions`);
                setIsGitHubRelease(false);
                return;
              }
            }
            
            // Final fallback to the local APK if it exists
            setApkUrl(`${import.meta.env.BASE_URL}bungpui.apk`);
            setIsGitHubRelease(false);
          });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleDownload = () => {
    if (apkUrl) {
      if (!isGitHubRelease && apkUrl.includes('actions')) {
        // If it's not a direct download (pointing to actions page)
        window.open(apkUrl, '_blank');
        toast.info("Go to the Actions tab and find the latest successful workflow to download the APK artifact");
      } else {
        // Direct download
        window.open(apkUrl, '_blank');
      }
    }
  };

  return (
    <Card className="border-chatapp-inputBorder bg-chatapp-userBubble mt-8">
      <CardHeader>
        <CardTitle>Download Mobile App</CardTitle>
        <CardDescription className="text-chatapp-secondaryText">
          Use Bungpui AI on your Android device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Button disabled className="w-full">
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
            Checking for downloads...
          </Button>
        ) : apkUrl ? (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            onClick={handleDownload}
          >
            <Download size={18} />
            {isGitHubRelease ? 'Download Android APK' : 
              (apkUrl.includes('actions') ? 'View Artifacts on GitHub' : 'Download Android APK')}
          </Button>
        ) : (
          <Button disabled className="w-full">
            APK not available yet
          </Button>
        )}
        
        <Button 
          variant="outline"
          className="w-full border-chatapp-inputBorder hover:bg-chatapp-aiBubble hover:text-white flex items-center justify-center gap-2"
          onClick={() => window.open(`https://github.com/${repoOwner}/${repoName}/actions`, '_blank')}
        >
          <Github size={18} />
          View GitHub Actions
        </Button>
        
        {apkUrl && isGitHubRelease && (
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
