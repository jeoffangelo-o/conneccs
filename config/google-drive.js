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

/**
 * Initialize Google Drive API client
 * @returns {Promise<drive_v3.Drive>}
 */
async function initializeDrive() {
  try {
    // Load client credentials
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
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
    } else {
      throw new Error('No token found. Please authenticate first.');
    }
    
    return google.drive({ version: 'v3', auth: oAuth2Client });
  } catch (error) {
    console.error('Error initializing Google Drive:', error);
    throw error;
  }
}

/**
 * Get authorization URL for OAuth2
 * @returns {string}
 */
function getAuthUrl() {
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
      domain: 'your-organization.edu' // Replace with actual domain
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
