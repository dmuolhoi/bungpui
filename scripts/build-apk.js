
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️ Building Android APK...');

try {
  // First ensure the web app is built
  console.log('🔨 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Sync web app with Capacitor
  console.log('🔄 Syncing web app with Capacitor...');
  execSync('npx cap sync android', { stdio: 'inherit' });
  
  // Build the APK
  console.log('📦 Building debug APK...');
  execSync('cd android && ./gradlew assembleDebug', { stdio: 'inherit' });
  
  // Copy the APK to the public directory so it can be downloaded from the web app
  const apkSource = path.join(__dirname, '../android/app/build/outputs/apk/debug/app-debug.apk');
  const publicDir = path.join(__dirname, '../public');
  const apkDestination = path.join(publicDir, 'bungpui.apk');
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  console.log('📋 Copying APK to public directory...');
  fs.copyFileSync(apkSource, apkDestination);
  
  console.log('✅ APK build completed successfully!');
  console.log(`APK available at: ${apkDestination}`);
  console.log('The APK will be available for download on the About page of your web app.');
} catch (error) {
  console.error('❌ Error building APK:', error.message);
  process.exit(1);
}
