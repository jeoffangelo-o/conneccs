# Google OAuth Setup for ConneCCS - Complete Guide

## Issue: Access Blocked - App Not Verified

If you're seeing "Access blocked: ConneCCS has not completed the Google verification process", you need to configure your Google Cloud project for testing.

## 🚀 Quick Solution: Use Service Account (Recommended)

**Service Accounts are easier and don't require OAuth verification!**

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** dropdown at the top
3. Click **New Project**
4. Enter project name: `ConneCCS`
5. Click **Create**
6. Wait for project creation, then select it

### Step 2: Enable Google Drive API
1. In the left sidebar, go to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click on **Google Drive API**
4. Click **Enable**
5. Wait for it to be enabled

### Step 3: Create Service Account
1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials** at the top
3. Select **Service Account**
4. Fill in details:
   - **Service account name**: `conneccs-drive`
   - **Service account ID**: `conneccs-drive` (auto-filled)
   - **Description**: `Service account for ConneCCS file uploads`
5. Click **Create and Continue**
6. **Grant this service account access to project**:
   - Role: Select **Editor** (or **Storage Admin** for more security)
7. Click **Continue**
8. **Grant users access to this service account** (optional):
   - Leave blank for now
9. Click **Done**

### Step 4: Create and Download Key
1. You'll see your service account in the list
2. Click on the service account email (e.g., `conneccs-drive@your-project.iam.gserviceaccount.com`)
3. Go to the **Keys** tab
4. Click **Add Key** > **Create New Key**
5. Select **JSON** format
6. Click **Create**
7. The JSON file will download automatically
8. **IMPORTANT**: Rename this file to `google-credentials.json`
9. **IMPORTANT**: Move it to your `data/` folder in your ConneCCS project

### Step 5: Share Google Drive Folder (Optional but Recommended)
1. Open [Google Drive](https://drive.google.com/)
2. Create a new folder called "ConneCCS Messages"
3. Right-click the folder > **Share**
4. In the "Add people and groups" field, paste the service account email from the JSON file
   - It looks like: `conneccs-drive@your-project.iam.gserviceaccount.com`
5. Set permission to **Editor**
6. **UNCHECK** "Notify people" (service accounts don't need notifications)
7. Click **Share**
8. Copy the folder ID from the URL (the long string after `/folders/`)
9. Add this to your `.env` file: `GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here`

### Step 6: Test the Setup
```bash
npm run setup-gdrive
```

---

## 🔧 Alternative: OAuth Client Setup (More Complex)

**Only use this if you specifically need OAuth instead of Service Account**

### Step 1: Create Google Cloud Project
(Same as Service Account steps 1-2 above)

### Step 2: Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have Google Workspace)
3. Click **Create**

### Step 3: Fill OAuth Consent Screen - App Information
**App Information:**
- **App name**: `ConneCCS`
- **User support email**: Select your email from dropdown
- **App logo**: Leave blank (optional)

**App domain (all optional for testing):**
- **Application home page**: Leave blank
- **Application privacy policy link**: Leave blank
- **Application terms of service link**: Leave blank

**Authorized domains:**
- Leave blank for testing

**Developer contact information:**
- **Email addresses**: Enter your email address

Click **Save and Continue**

### Step 4: Scopes Configuration
1. Click **Add or Remove Scopes**
2. In the **Manually add scopes** section at the bottom, add these scopes one by one:
   ```
   https://www.googleapis.com/auth/drive.file
   https://www.googleapis.com/auth/drive.metadata.readonly
   ```
3. **How to add scopes manually**:
   - Scroll down to "Manually add scopes"
   - Paste the first scope: `https://www.googleapis.com/auth/drive.file`
   - Click **Add to Table**
   - Paste the second scope: `https://www.googleapis.com/auth/drive.metadata.readonly`
   - Click **Add to Table**
4. Click **Update**
5. Click **Save and Continue**

### Step 5: Test Users (CRITICAL!)
1. Click **+ Add Users**
2. Add your email address: `jeoffgbanaria@gmail.com`
3. Add any other emails that need access during development
4. Click **Add**
5. Click **Save and Continue**

### Step 6: Summary and Publishing
1. Review your settings
2. Click **Back to Dashboard**
3. **Publishing status** should show "Testing"
4. **DO NOT** click "Publish App" unless you want to go through Google's verification process

### Step 7: Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials**
3. Select **OAuth client ID**
4. **Application type**: Select **Desktop application**
5. **Name**: `ConneCCS Desktop Client`
6. Click **Create**
7. **Download** the JSON file
8. Rename it to `google-credentials.json`
9. Move it to your `data/` folder

### Step 8: Test OAuth Setup
```bash
npm run setup-gdrive
```

---

## 🔍 Troubleshooting

### "Access blocked" Error
- **Cause**: Your email is not added as a test user
- **Solution**: Go to OAuth consent screen > Test users > Add your email

### "App not verified" Error
- **Cause**: App is in testing mode (this is normal)
- **Solution**: Add your email as test user, or use Service Account instead

### "Invalid scope" Error
- **Cause**: Scopes not properly configured
- **Solution**: Check that you added the exact scopes listed above

### "Credentials not found" Error
- **Cause**: JSON file not in correct location
- **Solution**: Ensure `google-credentials.json` is in the `data/` folder

### Service Account "Permission denied" Error
- **Cause**: Service account doesn't have access to Google Drive folder
- **Solution**: Share the Google Drive folder with the service account email

---

## 📋 Which Method Should I Use?

### Use **Service Account** if:
- ✅ You want simple setup without OAuth complexity
- ✅ You're developing/testing the application
- ✅ You don't need users to authenticate with their own Google accounts
- ✅ You want files stored in a shared organizational folder

### Use **OAuth Client** if:
- ✅ You need users to authenticate with their own Google accounts
- ✅ You want files stored in each user's personal Google Drive
- ✅ You're building a multi-user application where each user has their own storage
- ✅ You're willing to go through Google's app verification process for production

**For ConneCCS development and testing, Service Account is recommended!**