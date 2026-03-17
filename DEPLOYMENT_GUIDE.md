# ConneCCS Deployment Guide

## File Storage Options

ConneCCS supports two file storage methods for message attachments:

### 1. Local Storage (Development)
- Files stored in `public/uploads/messages/`
- Works for local development and testing
- **Not recommended for production deployment**

### 2. Google Drive Storage (Production)
- Files automatically uploaded to Google Drive
- Accessible from anywhere with proper permissions
- **Recommended for production deployment**

## Setting Up Google Drive for Production

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Drive API

### Step 2: Create Service Account
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name it "conneccs-drive-service"
4. Grant it "Editor" role
5. Create and download JSON key file

### Step 3: Configure Credentials
1. Rename the downloaded JSON file to `google-credentials.json`
2. Place it in the `data/` folder
3. Update the domain in `config/google-drive.js` to your organization's domain

### Step 4: Set Up Google Drive Folder (Optional)
1. Create a folder in Google Drive for message attachments
2. Share it with the service account email
3. Copy the folder ID from the URL
4. Update the `folderId` in the upload function

## Environment Variables for Production

Create a `.env` file with:

```env
NODE_ENV=production
PORT=3000
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
DOMAIN=yourdomain.edu.ph
```

## Deployment Platforms

### Heroku Deployment
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Add Google credentials as config var:
   ```bash
   heroku config:set GOOGLE_CREDENTIALS="$(cat data/google-credentials.json)"
   ```
4. Deploy: `git push heroku main`

### Railway Deployment
1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Upload `google-credentials.json` content as `GOOGLE_CREDENTIALS` variable
4. Deploy automatically on push

### DigitalOcean App Platform
1. Create new app from GitHub
2. Add environment variables
3. Upload credentials file to app's file system
4. Configure build and run commands

## File Storage Behavior

### Development Mode
- Files stored locally in `public/uploads/messages/`
- Accessible via `/messages/file/:filename`
- Good for testing and development

### Production Mode (Google Drive Configured)
- Files automatically uploaded to Google Drive
- Local files deleted after successful upload
- URLs point to Google Drive links
- Files accessible with proper permissions

### Hybrid Mode
- If Google Drive upload fails, falls back to local storage
- Provides reliability and redundancy
- Logs indicate storage method used

## Security Considerations

### File Access Control
- Google Drive files inherit folder permissions
- Set appropriate sharing settings for your organization
- Consider using domain-restricted sharing

### File Size Limits
- Current limit: 10MB per file, 5 files per message
- Adjust in `routes/messages.js` if needed
- Consider Google Drive storage quotas

### File Type Restrictions
- Currently allows: images, documents, archives
- Modify `fileFilter` in multer config to change restrictions

## Monitoring and Maintenance

### Log Monitoring
- Check logs for Google Drive upload failures
- Monitor local storage usage in development
- Track file access patterns

### Storage Cleanup
- Local files are automatically deleted after Google Drive upload
- Consider periodic cleanup of failed uploads
- Monitor Google Drive storage usage

## Troubleshooting

### Google Drive Upload Fails
1. Check service account permissions
2. Verify credentials file is valid
3. Ensure Google Drive API is enabled
4. Check network connectivity

### File Preview Issues
1. Verify file URLs are accessible
2. Check CORS headers for external preview services
3. Test with different file types
4. Monitor browser console for errors

### Performance Issues
1. Monitor file upload times
2. Consider implementing file compression
3. Use CDN for frequently accessed files
4. Implement caching strategies

## Migration from Local to Cloud Storage

If you have existing local files and want to migrate to Google Drive:

1. Run the migration script (create if needed)
2. Update message records with new URLs
3. Verify all files are accessible
4. Clean up local files after verification

## Backup Strategy

### Google Drive Backup
- Files are automatically backed up in Google Drive
- Consider additional backup to another cloud service
- Regular export of file metadata

### Database Backup
- Regular backup of `data/messages.json`
- Include file attachment metadata
- Store backups in secure location