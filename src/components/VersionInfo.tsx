
import React from 'react';

export interface VersionProps {
  showLabel?: boolean;
  className?: string;
}

export const APP_VERSION = "1.0.0-pre alpha";

export const VersionInfo = ({ showLabel = false, className = "" }: VersionProps) => {
  return (
    <div className={`text-xs text-chatapp-secondaryText ${className}`}>
      {showLabel ? "Version: " : ""}{APP_VERSION}
    </div>
  );
};
