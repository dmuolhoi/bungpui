
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Android platform for Capacitor...');

try {
  // Ensure dist directory exists or Capacitor will fail
  const distPath = path.join(__dirname, '../dist');
  if (!fs.existsSync(distPath)) {
    console.log('📁 Creating dist directory...');
    fs.mkdirSync(distPath);
    fs.writeFileSync(path.join(distPath, 'index.html'), '<html><body>Placeholder</body></html>');
  }

  // Initialize Capacitor if not already done
  console.log('🔧 Initializing Capacitor...');
  execSync('npx cap init "Bungpui AI" app.lovable.bungpui --web-dir dist', { stdio: 'inherit' });
  
  // Add Android platform
  console.log('📱 Adding Android platform...');
  execSync('npx cap add android', { stdio: 'inherit' });

  console.log('✅ Android setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Run "npm run build" to build your web app');
  console.log('2. Run "npm run build-apk" to generate the Android APK');
} catch (error) {
  console.error('❌ Error setting up Android:', error.message);
  process.exit(1);
}
