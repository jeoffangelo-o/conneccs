# Google Drive Integration Setup

## Overview
ConneCCS integrates with Google Drive API for cloud-based document management, allowing automatic upload of files to cloud storage with role-based access control.

## Prerequisites
1. Google Cloud Platform account
2. Node.js installed
3. ConneCCS application running

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "ConneCCS"
3. Enable the Google Drive API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure OAuth consent screen:
   - User Type: Internal (for organization) or External
   - App name: ConneCCS
   - User support email: your-email@your-organization.edu
   - Developer contact: your-email@your-organization.edu
4. Create OAuth Client ID:
   - Application type: Web application
   - Name: ConneCCS Web Client
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
     - `https://your-domain.edu/auth/google/callback`
5. Download the credentials JSON file

### 3. Configure ConneCCS

1. Save the downloaded credentials file as `data/google-credentials.json`
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

### 4. Authenticate

1. Navigate to `/messages` in the application
2. Click the Google Drive icon
3. First-time users will be prompted to authenticate
4. Grant the necessary permissions
5. The token will be saved automatically

## Features Implemented

### Cloud-Based Document Management
- Automatic upload of files to Google Drive
- System-level metadata tracking (filename, uploader, timestamp, file type)
- File access restricted based on assigned user roles

### Integration Points
1. **Messaging System**: Share files from Google Drive to channels
2. **Reports**: Upload report documents to Drive
3. **IPCR**: Store IPCR documents in Drive
4. **Faculty Documents**: Centralized document storage

### Role-Based Access
- **Dean**: Full access to all documents
- **Program Chairs**: Access to program-specific documents
- **Research Coordinators**: Access to research documents
- **Faculty**: Access to own documents and shared resources

## File Structure

```
data/
├── google-credentials.json    # OAuth2 credentials (DO NOT COMMIT)
└── google-token.json          # Access token (auto-generated)

config/
└── google-drive.js            # Google Drive API wrapper
```

## API Functions

### `listFiles(options)`
List files from Google Drive with optional filters

### `uploadFile(fileData)`
Upload a file to Google Drive with metadata

### `getFileMetadata(fileId)`
Get detailed information about a file

### `createFolder(folderName, parentId)`
Create a folder in Google Drive

### `searchFiles(searchTerm)`
Search files by name or content

### `deleteFile(fileId)`
Delete a file from Google Drive

## Security Considerations

1. **Credentials**: Never commit `google-credentials.json` or `google-token.json` to version control
2. **Add to .gitignore**:
   ```
   data/google-credentials.json
   data/google-token.json
   ```

3. **Domain Restriction**: Configure OAuth consent screen to restrict access to your organization's domain

4. **Permissions**: Use least-privilege principle when setting file permissions

## Folder Structure in Google Drive

Recommended folder structure:
```
CCS Documents/
├── Reports/
│   ├── 2024/
│   └── 2025/
├── IPCR/
│   ├── Faculty_Name_1/
│   └── Faculty_Name_2/
├── Research/
│   ├── Proposals/
│   └── Publications/
└── Shared Resources/
    ├── Templates/
    └── Guidelines/
```

## Troubleshooting

### Error: "No token found"
- Run the authentication flow by accessing the Google Drive feature
- Ensure `google-credentials.json` is in the correct location

### Error: "Access denied"
- Check OAuth consent screen configuration
- Verify user email is authorized
- Ensure Google Drive API is enabled

### Error: "Invalid credentials"
- Re-download credentials from Google Cloud Console
- Verify the credentials file is valid JSON

## Production Deployment

1. Use environment variables for sensitive data:
   ```javascript
   const credentials = {
     client_id: process.env.GOOGLE_CLIENT_ID,
     client_secret: process.env.GOOGLE_CLIENT_SECRET,
     redirect_uri: process.env.GOOGLE_REDIRECT_URI
   };
   ```

2. Use a secure token storage solution (e.g., encrypted database)

3. Implement token refresh logic for long-running sessions

4. Set up monitoring and logging for API usage

## Support

For issues or questions:
- Check Google Drive API documentation: https://developers.google.com/drive
- Review ConneCCS documentation
- Contact system administrator
