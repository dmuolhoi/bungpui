
const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.join(__dirname, '../package.json');

try {
  // Read the current package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add our new scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    "setup-android": "node scripts/setup-android.js",
    "build-apk": "node scripts/build-apk.js",
    "capacitor:sync": "npx cap sync",
    "capacitor:open:android": "npx cap open android",
    "capacitor:run:android": "npx cap run android"
  };
  
  // Write the updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('✅ Successfully updated package.json scripts');
} catch (error) {
  console.error('❌ Error updating package.json scripts:', error);
  process.exit(1);
}
