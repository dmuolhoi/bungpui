
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing Android build configuration...');

try {
  const androidDir = path.join(__dirname, '../android');
  const rootBuildGradle = path.join(androidDir, 'build.gradle');
  
  if (!fs.existsSync(androidDir)) {
    console.error('❌ Android directory not found!');
    process.exit(1);
  }
  
  // Create proper root build.gradle
  console.log('📝 Creating proper root build.gradle...');
  const rootBuildContent = `// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
        classpath 'com.google.gms:google-services:4.3.15'
        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}`;

  fs.writeFileSync(rootBuildGradle, rootBuildContent);
  console.log('✅ Root build.gradle updated successfully');
  
  // Update Java version in all build.gradle files
  console.log('🔄 Updating Java version in build.gradle files...');
  const buildGradleFiles = findFilesRecursively(androidDir, 'build.gradle');
  
  for (const file of buildGradleFiles) {
    console.log(`📝 Processing ${file}...`);
    let content = fs.readFileSync(file, 'utf8');
    
    // Update Java compilation settings
    if (content.includes('compileOptions')) {
      content = content.replace(
        /sourceCompatibility JavaVersion\.[A-Z0-9_]*/g, 
        'sourceCompatibility JavaVersion.VERSION_17'
      );
      content = content.replace(
        /targetCompatibility JavaVersion\.[A-Z0-9_]*/g, 
        'targetCompatibility JavaVersion.VERSION_17'
      );
    } else if (content.includes('android {')) {
      // Add compile options if android block exists but no compile options
      content = content.replace(
        /android \{/,
        'android {\n    compileOptions {\n        sourceCompatibility JavaVersion.VERSION_17\n        targetCompatibility JavaVersion.VERSION_17\n    }'
      );
    }
    
    fs.writeFileSync(file, content);
  }
  
  // Update gradle.properties
  const gradleProps = path.join(androidDir, 'gradle.properties');
  if (fs.existsSync(gradleProps)) {
    console.log('📝 Updating gradle.properties...');
    fs.appendFileSync(gradleProps, '\norg.gradle.java.home=/usr/lib/jvm/java-17-openjdk-amd64\n');
  }
  
  console.log('✅ Android build configuration fixed successfully!');
  
} catch (error) {
  console.error('❌ Error fixing Android build:', error);
  process.exit(1);
}

function findFilesRecursively(dir, fileName) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findFilesRecursively(filePath, fileName));
    } else if (file === fileName) {
      results.push(filePath);
    }
  }
  
  return results;
}
