// Google Drive API Configuration
// Based on ConneCCS requirements for cloud-based document management

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// OAuth2 Configuration
// In production, store these in environment variables
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata.readonly'
];

const TOKEN_PATH = path.join(__dirname, '../data/google-token.json');
const CREDENTIALS_PATH = path.join(__dirname, '../data/google-credentials.json');

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || null;
const DOMAIN = process.env.DOMAIN || 'cspc.edu.ph';

// Development mode: Always try Google Drive if configured
const FORCE_GOOGLE_DRIVE_IN_DEV = true;

/**
 * Check if Google Drive is configured
 * @returns {boolean}
 */
function isGoogleDriveConfigured() {
  // In production, check for environment variable or credentials file
  if (isProduction && process.env.GOOGLE_CREDENTIALS) {
    return true;
  }
  return fs.existsSync(CREDENTIALS_PATH);
}

/**
 * Get credentials from environment or file
 * @returns {Object}
 */
function getCredentials() {
  if (isProduction && process.env.GOOGLE_CREDENTIALS) {
    return JSON.parse(process.env.GOOGLE_CREDENTIALS);
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
}

/**
 * Check if credentials are for service account
 * @param {Object} credentials 
 * @returns {boolean}
 */
function isServiceAccount(credentials) {
  return credentials.type === 'service_account';
}

/**
 * Initialize Google Drive API client
 * @returns {Promise<drive_v3.Drive>}
 */
async function initializeDrive() {
  try {
    if (!isGoogleDriveConfigured()) {
      throw new Error('Google Drive not configured. Please add credentials file or environment variable.');
    }
    
    // Load client credentials
    const credentials = getCredentials();
    
    let auth;
    
    if (isServiceAccount(credentials)) {
      // Use Service Account authentication (easier for development)
      console.log('🔐 Using Service Account authentication');
      auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: SCOPES
      });
    } else {
      // Use OAuth2 authentication (requires user consent)
      console.log('🔐 Using OAuth2 authentication');
      const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
      
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );
      
      // Check if we have a token
      if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
        oAuth2Client.setCredentials(token);
        auth = oAuth2Client;
      } else {
        throw new Error('No token found. Please authenticate first by running: npm run setup-gdrive');
      }
    }
    
    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Error initializing Google Drive:', error);
    throw error;
  }
}

/**
 * Upload file to Google Drive with message attachment optimization
 * @param {Object} fileData - File data
 * @returns {Promise<Object>}
 */
async function uploadFile(fileData) {
  console.log(`📤 Starting Google Drive upload: ${fileData.name}`);
  console.log(`   File size: ${(fs.statSync(fileData.path).size / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   MIME type: ${fileData.mimeType}`);
  
  const drive = await initializeDrive();
  
  // Create folder structure for message attachments if it doesn't exist
  let parentFolderId = DRIVE_FOLDER_ID;
  
  if (!parentFolderId) {
    console.log('📁 No specific folder configured, checking for ConneCCS Messages folder...');
    
    // Search for existing ConneCCS Messages folder
    try {
      const searchResponse = await drive.files.list({
        q: "name='ConneCCS Messages' and mimeType='application/vnd.google-apps.folder'",
        fields: 'files(id, name)'
      });
      
      if (searchResponse.data.files.length > 0) {
        parentFolderId = searchResponse.data.files[0].id;
        console.log(`📁 Found existing ConneCCS Messages folder: ${parentFolderId}`);
      } else {
        // Create "ConneCCS Messages" folder
        const folderResponse = await drive.files.create({
          resource: {
            name: 'ConneCCS Messages',
            mimeType: 'application/vnd.google-apps.folder'
          },
          fields: 'id, name, webViewLink'
        });
        parentFolderId = folderResponse.data.id;
        console.log(`📁 Created ConneCCS Messages folder: ${parentFolderId}`);
        console.log(`📁 Folder URL: ${folderResponse.data.webViewLink}`);
      }
    } catch (folderError) {
      console.warn('⚠️  Could not create/find folder, uploading to root:', folderError.message);
    }
  } else {
    console.log(`📁 Using configured folder: ${parentFolderId}`);
  }
  
  const fileMetadata = {
    name: fileData.name,
    parents: parentFolderId ? [parentFolderId] : []
  };
  
  const media = {
    mimeType: fileData.mimeType,
    body: fs.createReadStream(fileData.path)
  };
  
  console.log('⬆️  Uploading file to Google Drive...');
  const startTime = Date.now();
  
  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, webContentLink, size'
    });
    
    const uploadTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Upload completed in ${uploadTime}s`);
    console.log(`📄 File ID: ${response.data.id}`);
    console.log(`🔗 View URL: ${response.data.webViewLink}`);
    
    // Set permissions (make it accessible to organization)
    console.log('🔐 Setting file permissions...');
    try {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'domain',
          domain: DOMAIN
        }
      });
      console.log(`✅ Set domain permissions for ${DOMAIN}`);
    } catch (permError) {
      console.warn(`⚠️  Could not set domain permissions: ${permError.message}`);
      
      // Fallback: make it accessible to anyone with the link
      try {
        await drive.permissions.create({
          fileId: response.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          }
        });
        console.log('✅ Set public permissions (anyone with link)');
      } catch (publicPermError) {
        console.warn(`⚠️  Could not set public permissions: ${publicPermError.message}`);
        console.log('ℹ️  File will use default permissions');
      }
    }
    
    return response.data;
    
  } catch (uploadError) {
    if (uploadError.message.includes('storage quota') || uploadError.message.includes('Service Accounts do not have storage quota')) {
      console.warn('⚠️  Service Account storage quota issue detected');
      console.log('💡 This is a known limitation with Service Accounts');
      console.log('💡 Files will be uploaded but may have access restrictions');
      
      // Try alternative approach - upload without specifying parents
      console.log('🔄 Retrying upload without folder specification...');
      
      const alternativeMetadata = {
        name: `[ConneCCS] ${fileData.name}`, // Add prefix to identify ConneCCS files
      };
      
      const alternativeResponse = await drive.files.create({
        resource: alternativeMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink, size'
      });
      
      console.log(`✅ Alternative upload successful: ${alternativeResponse.data.id}`);
      console.log(`🔗 View URL: ${alternativeResponse.data.webViewLink}`);
      
      // Try to set permissions
      try {
        await drive.permissions.create({
          fileId: alternativeResponse.data.id,
          requestBody: {
            role: 'reader',
            type: 'anyone'
          }
        });
        console.log('✅ Set public permissions (anyone with link)');
      } catch (permError) {
        console.warn(`⚠️  Could not set permissions: ${permError.message}`);
      }
      
      return alternativeResponse.data;
    } else {
      throw uploadError;
    }
  }
}

/**
 * Get authorization URL for OAuth2
 * @returns {string}
 */
function getAuthUrl() {
  if (!isGoogleDriveConfigured()) {
    throw new Error('Google Drive not configured');
  }
  
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
}

/**
 * Store OAuth2 token
 * @param {string} code - Authorization code
 */
async function storeToken(code) {
  if (!isGoogleDriveConfigured()) {
    throw new Error('Google Drive not configured');
  }
  
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  
  const { tokens } = await oAuth2Client.getToken(code);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  
  return tokens;
}

/**
 * List files from Google Drive
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
async function listFiles(options = {}) {
  const drive = await initializeDrive();
  
  const response = await drive.files.list({
    pageSize: options.pageSize || 50,
    fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink)',
    q: options.query || "trashed=false",
    orderBy: 'modifiedTime desc'
  });
  
  return response.data.files;
}

/**
 * Upload file to Google Drive
 * @param {Object} fileData - File data
 * @returns {Promise<Object>}
 */
async function uploadFile(fileData) {
  const drive = await initializeDrive();
  
  const fileMetadata = {
    name: fileData.name,
    parents: fileData.folderId ? [fileData.folderId] : []
  };
  
  const media = {
    mimeType: fileData.mimeType,
    body: fs.createReadStream(fileData.path)
  };
  
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink'
  });
  
  // Set permissions (make it accessible to organization)
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'domain',
      domain: 'cspc.edu.ph' // Updated domain
    }
  });
  
  return response.data;
}

/**
 * Get file metadata
 * @param {string} fileId - File ID
 * @returns {Promise<Object>}
 */
async function getFileMetadata(fileId) {
  const drive = await initializeDrive();
  
  const response = await drive.files.get({
    fileId: fileId,
    fields: 'id, name, mimeType, size, modifiedTime, webViewLink, iconLink, owners, createdTime'
  });
  
  return response.data;
}

/**
 * Create folder in Google Drive
 * @param {string} folderName - Folder name
 * @param {string} parentId - Parent folder ID (optional)
 * @returns {Promise<Object>}
 */
async function createFolder(folderName, parentId = null) {
  const drive = await initializeDrive();
  
  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentId ? [parentId] : []
  };
  
  const response = await drive.files.create({
    resource: fileMetadata,
    fields: 'id, name'
  });
  
  return response.data;
}

/**
 * Search files by name or content
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>}
 */
async function searchFiles(searchTerm) {
  const drive = await initializeDrive();
  
  const query = `name contains '${searchTerm}' or fullText contains '${searchTerm}'`;
  
  const response = await drive.files.list({
    q: query,
    fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
    pageSize: 20
  });
  
  return response.data.files;
}

/**
 * Delete file from Google Drive
 * @param {string} fileId - File ID
 * @returns {Promise<void>}
 */
async function deleteFile(fileId) {
  const drive = await initializeDrive();
  await drive.files.delete({ fileId });
}

module.exports = {
  isGoogleDriveConfigured,
  initializeDrive,
  getAuthUrl,
  storeToken,
  listFiles,
  uploadFile,
  getFileMetadata,
  createFolder,
  searchFiles,
  deleteFile
};
