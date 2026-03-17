#!/usr/bin/env node

/**
 * ConneCCS Production Setup Script
 * Helps configure the application for production deployment
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupProduction() {
  console.log('🚀 ConneCCS Production Setup');
  console.log('============================\n');

  // Check if Google Drive credentials exist
  const credentialsPath = path.join(__dirname, 'data', 'google-credentials.json');
  const hasCredentials = fs.existsSync(credentialsPath);

  console.log(`Google Drive credentials: ${hasCredentials ? '✅ Found' : '❌ Not found'}`);

  if (!hasCredentials) {
    console.log('\n📋 To enable Google Drive storage for message attachments:');
    console.log('1. Go to Google Cloud Console (https://console.cloud.google.com/)');
    console.log('2. Create a project and enable Google Drive API');
    console.log('3. Create a service account and download the JSON key');
    console.log('4. Save it as data/google-credentials.json');
    console.log('5. Run this setup script again\n');
  }

  // Environment configuration
  const envPath = path.join(__dirname, '.env');
  const hasEnv = fs.existsSync(envPath);

  console.log(`Environment file: ${hasEnv ? '✅ Found' : '❌ Not found'}`);

  if (!hasEnv) {
    const createEnv = await question('Create .env file for production? (y/n): ');
    
    if (createEnv.toLowerCase() === 'y') {
      const port = await question('Port (default: 3000): ') || '3000';
      const domain = await question('Organization domain (default: cspc.edu.ph): ') || 'cspc.edu.ph';
      const folderId = await question('Google Drive folder ID (optional): ') || '';

      const envContent = `# ConneCCS Production Configuration
NODE_ENV=production
PORT=${port}
DOMAIN=${domain}
${folderId ? `GOOGLE_DRIVE_FOLDER_ID=${folderId}` : '# GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here'}

# For Heroku/Railway deployment, set GOOGLE_CREDENTIALS as environment variable
# GOOGLE_CREDENTIALS={"type":"service_account",...}
`;

      fs.writeFileSync(envPath, envContent);
      console.log('✅ Created .env file');
    }
  }

  // Check upload directory
  const uploadDir = path.join(__dirname, 'public', 'uploads', 'messages');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Created upload directory');
  } else {
    console.log('✅ Upload directory exists');
  }

  // Deployment recommendations
  console.log('\n🌐 Deployment Recommendations:');
  console.log('===============================');

  if (hasCredentials) {
    console.log('✅ Google Drive configured - files will be stored in the cloud');
    console.log('   - Files are automatically uploaded to Google Drive');
    console.log('   - Local files are deleted after successful upload');
    console.log('   - Files are accessible with proper domain permissions');
  } else {
    console.log('⚠️  Google Drive not configured - files will be stored locally');
    console.log('   - This works for development but not recommended for production');
    console.log('   - Files may be lost when the server restarts (on platforms like Heroku)');
    console.log('   - Consider setting up Google Drive for production deployment');
  }

  console.log('\n📦 Platform-specific deployment:');
  console.log('- Heroku: Set GOOGLE_CREDENTIALS as config var');
  console.log('- Railway: Add environment variables in dashboard');
  console.log('- DigitalOcean: Upload credentials file to app platform');
  console.log('- VPS: Ensure credentials file is in data/ directory');

  console.log('\n📚 For detailed deployment instructions, see DEPLOYMENT_GUIDE.md');

  rl.close();
}

// Run setup if called directly
if (require.main === module) {
  setupProduction().catch(console.error);
}

module.exports = { setupProduction };