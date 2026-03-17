#!/usr/bin/env node

/**
 * Test Google Drive Integration
 * Quick test to verify Google Drive is working
 */

const { isGoogleDriveConfigured, uploadFile } = require('./config/google-drive');
const fs = require('fs');
const path = require('path');

async function testGoogleDrive() {
  console.log('🧪 Testing Google Drive Integration');
  console.log('==================================\n');

  // Check if Google Drive is configured
  const isConfigured = isGoogleDriveConfigured();
  console.log(`Google Drive configured: ${isConfigured ? '✅ Yes' : '❌ No'}`);

  if (!isConfigured) {
    console.log('\n❌ Google Drive is not configured.');
    console.log('Run: npm run setup-gdrive');
    return;
  }

  // Create a test file
  const testFileName = `test-${Date.now()}.txt`;
  const testFilePath = path.join(__dirname, 'public', 'uploads', 'messages', testFileName);
  const testContent = `ConneCCS Google Drive Test
Created: ${new Date().toISOString()}
This is a test file to verify Google Drive integration is working.

If you can see this file in your Google Drive, the integration is successful! 🎉`;

  // Ensure upload directory exists
  const uploadDir = path.dirname(testFilePath);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Write test file
  fs.writeFileSync(testFilePath, testContent);
  console.log(`📝 Created test file: ${testFileName}`);

  try {
    // Upload to Google Drive
    console.log('\n📤 Uploading test file to Google Drive...');
    const result = await uploadFile({
      name: testFileName,
      path: testFilePath,
      mimeType: 'text/plain'
    });

    console.log('\n🎉 Test successful!');
    console.log(`📄 File uploaded: ${result.name}`);
    console.log(`🆔 File ID: ${result.id}`);
    console.log(`🔗 View URL: ${result.webViewLink}`);

    // Clean up local test file
    fs.unlinkSync(testFilePath);
    console.log(`🗑️  Cleaned up local test file`);

    console.log('\n✅ Google Drive integration is working correctly!');
    console.log('You can now upload files through the messages interface.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    // Clean up local test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }

    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you ran: npm run setup-gdrive');
    console.log('2. Check that data/google-credentials.json exists');
    console.log('3. Verify that data/google-token.json was created');
    console.log('4. Ensure Google Drive API is enabled in Google Cloud Console');
  }
}

// Run test if called directly
if (require.main === module) {
  testGoogleDrive().catch(console.error);
}

module.exports = { testGoogleDrive };