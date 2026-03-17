#!/usr/bin/env node

/**
 * Google Drive Authentication Setup for ConneCCS
 * Run this script to authenticate with Google Drive API
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

const TOKEN_PATH = path.join(__dirname, 'data', 'google-token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'data', 'google-credentials.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function authenticate() {
  console.log('🔐 Google Drive Authentication Setup');
  console.log('====================================\n');

  // Check if credentials file exists
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.log('❌ Google credentials file not found!');
    console.log('Please ensure data/google-credentials.json exists.');
    console.log('\n📋 Two options to get credentials:');
    console.log('\n🔧 Option 1: Service Account (Recommended for Development)');
    console.log('1. Go to Google Cloud Console (https://console.cloud.google.com/)');
    console.log('2. Create a project and enable Google Drive API');
    console.log('3. Go to "Credentials" > "Create Credentials" > "Service Account"');
    console.log('4. Create service account and download JSON key');
    console.log('5. Save it as data/google-credentials.json');
    console.log('6. Share a Google Drive folder with the service account email');
    console.log('\n🔧 Option 2: OAuth Client (Requires App Verification)');
    console.log('1. Go to Google Cloud Console');
    console.log('2. Create OAuth client ID for "Desktop application"');
    console.log('3. Configure OAuth consent screen and add test users');
    console.log('4. Download JSON and save as data/google-credentials.json');
    console.log('\nSee GOOGLE_OAUTH_SETUP.md for detailed instructions.');
    process.exit(1);
  }

  // Check credential type
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const isServiceAccount = credentials.type === 'service_account';

  console.log(`📋 Credential type: ${isServiceAccount ? 'Service Account' : 'OAuth Client'}`);

  if (isServiceAccount) {
    console.log('✅ Service Account detected - no authentication needed!');
    console.log('Service accounts authenticate automatically.');
    
    // Test the connection
    console.log('\n🧪 Testing Google Drive connection...');
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: SCOPES
      });
      
      const drive = google.drive({ version: 'v3', auth });
      
      const response = await drive.files.list({
        pageSize: 1,
        fields: 'files(id, name)',
      });

      console.log('✅ Google Drive connection successful!');
      
      // Create ConneCCS Messages folder
      console.log('\n📁 Setting up ConneCCS Messages folder...');
      try {
        // Search for existing folder
        const searchResponse = await drive.files.list({
          q: "name='ConneCCS Messages' and mimeType='application/vnd.google-apps.folder'",
          fields: 'files(id, name, webViewLink)'
        });
        
        if (searchResponse.data.files.length > 0) {
          const folder = searchResponse.data.files[0];
          console.log('📁 ConneCCS Messages folder already exists!');
          console.log(`📁 Folder ID: ${folder.id}`);
          console.log(`📁 Folder URL: ${folder.webViewLink}`);
        } else {
          const folderResponse = await drive.files.create({
            resource: {
              name: 'ConneCCS Messages',
              mimeType: 'application/vnd.google-apps.folder'
            },
            fields: 'id, name, webViewLink'
          });
          
          console.log('✅ Created ConneCCS Messages folder!');
          console.log(`📁 Folder ID: ${folderResponse.data.id}`);
          console.log(`📁 Folder URL: ${folderResponse.data.webViewLink}`);
        }
        
        console.log('\n💡 Optional: Add this folder ID to your .env file:');
        console.log(`GOOGLE_DRIVE_FOLDER_ID=${searchResponse.data.files[0]?.id || folderResponse.data.id}`);
        
      } catch (folderError) {
        console.log('⚠️  Could not create/access folder:', folderError.message);
        console.log('Files will be uploaded to the root of your Google Drive.');
      }

      console.log('\n🎉 Setup complete! You can now upload files to Google Drive.');
      console.log('Try uploading a file in the messages interface to test it.');
      
    } catch (error) {
      console.error('❌ Service Account authentication failed:', error.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Ensure Google Drive API is enabled in Google Cloud Console');
      console.log('2. Check that the service account has proper permissions');
      console.log('3. Verify the JSON file is valid');
      process.exit(1);
    }
    
    rl.close();
    return;
  }

  // OAuth flow for OAuth clients
  console.log('🔧 OAuth Client detected - authentication required');
  
  // Check if token already exists
  if (fs.existsSync(TOKEN_PATH)) {
    console.log('✅ Google Drive token already exists!');
    console.log('You should be able to upload files to Google Drive now.');
    
    const reauth = await question('Do you want to re-authenticate? (y/n): ');
    if (reauth.toLowerCase() !== 'y') {
      console.log('Skipping authentication.');
      rl.close();
      return;
    }
  }

  try {
    // Load client credentials
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Generate auth URL
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('\n⚠️  If you see "Access blocked" error:');
    console.log('1. Go to Google Cloud Console > OAuth consent screen');
    console.log('2. Add your email as a test user');
    console.log('3. Or use a Service Account instead (see GOOGLE_OAUTH_SETUP.md)');
    console.log('\n🌐 Please visit this URL to authorize the application:');
    console.log(authUrl);
    console.log('');

    const code = await question('Enter the authorization code from the page: ');

    // Get token
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Store the token
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('✅ Token stored successfully!');

    // Test the connection and create folder (same as service account)
    console.log('\n🧪 Testing Google Drive connection...');
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    
    const response = await drive.files.list({
      pageSize: 1,
      fields: 'files(id, name)',
    });

    console.log('✅ Google Drive connection successful!');
    
    // Create ConneCCS Messages folder
    console.log('\n📁 Creating ConneCCS Messages folder...');
    try {
      const folderResponse = await drive.files.create({
        resource: {
          name: 'ConneCCS Messages',
          mimeType: 'application/vnd.google-apps.folder'
        },
        fields: 'id, name, webViewLink'
      });
      
      console.log('✅ Created ConneCCS Messages folder!');
      console.log(`Folder ID: ${folderResponse.data.id}`);
      console.log(`Folder URL: ${folderResponse.data.webViewLink}`);
      
      console.log('\n💡 Optional: Add this folder ID to your .env file:');
      console.log(`GOOGLE_DRIVE_FOLDER_ID=${folderResponse.data.id}`);
      
    } catch (folderError) {
      if (folderError.message.includes('already exists')) {
        console.log('📁 ConneCCS Messages folder already exists.');
      } else {
        console.log('⚠️  Could not create folder:', folderError.message);
        console.log('Files will be uploaded to the root of your Google Drive.');
      }
    }

    console.log('\n🎉 Setup complete! You can now upload files to Google Drive.');
    console.log('Try uploading a file in the messages interface to test it.');

  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    if (error.message.includes('access_denied')) {
      console.log('\n🔧 This is likely because:');
      console.log('1. Your email is not added as a test user in OAuth consent screen');
      console.log('2. The app needs to be verified by Google');
      console.log('\n💡 Recommended solution: Use Service Account instead');
      console.log('See GOOGLE_OAUTH_SETUP.md for instructions');
    }
    process.exit(1);
  }

  rl.close();
}

// Run authentication if called directly
if (require.main === module) {
  authenticate().catch(console.error);
}

module.exports = { authenticate };