# Working Google Drive Solution for ConneCCS

## Issue: Service Account Storage Quota

Service Accounts have storage quota limitations and cannot upload files to personal Google Drive. Here are the working solutions:

## ✅ Solution 1: OAuth Client (Recommended for Development)

Since you already have the OAuth consent screen error, let's fix that properly:

### Step 1: Add Yourself as Test User

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your `conneccs` project
3. Go to **APIs & Services** > **OAuth consent screen**
4. Click **Edit App**
5. Go to **Test users** section
6. Click **+ Add Users**
7. Add your email: `jeoffgbanaria@gmail.com`
8. Click **Save**

### Step 2: Create OAuth Client Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials** > **OAuth client ID**
3. Application type: **Desktop application**
4. Name: `ConneCCS Desktop`
5. Click **Create**
6. **Download** the JSON file
7. Replace your current `data/google-credentials.json` with this OAuth client JSON

### Step 3: Authenticate

```bash
npm run setup-gdrive
```

This time it should work because you're added as a test user.

## ✅ Solution 2: Use Your Personal Google Account

If the above still doesn't work, we can use a simpler approach:

### Step 1: Create New Project with Personal Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a **new project** (not the existing conneccs one)
3. Name it: `ConneCCS-Personal`
4. Enable Google Drive API
5. Create OAuth client ID (Desktop application)
6. **Skip** the OAuth consent screen configuration (use default)
7. Download the credentials JSON

### Step 2: Replace Credentials

Replace `data/google-credentials.json` with the new OAuth client JSON.

### Step 3: Test

```bash
npm run setup-gdrive
```

Since it's your personal account, you won't get the "Access blocked" error.

## ✅ Solution 3: Temporary Local Storage (Quick Fix)

If you want to test the messaging system without Google Drive complexity:

### Disable Google Drive Temporarily

1. Rename `data/google-credentials.json` to `data/google-credentials.json.backup`
2. The system will automatically fall back to local storage
3. Files will be stored in `public/uploads/messages/`
4. You can still test file uploads and previews

### Re-enable Later

When you're ready to set up Google Drive properly, rename the file back.

## 🎯 Recommended Approach

For development and testing, I recommend **Solution 3** (local storage) first to test the messaging system, then set up **Solution 2** (personal Google account) when you're ready to test cloud storage.

The messaging system works perfectly with local storage, and you can always add Google Drive later for production deployment.

## Quick Commands

```bash
# Disable Google Drive (use local storage)
mv data/google-credentials.json data/google-credentials.json.backup

# Start server and test messaging
npm start

# Re-enable Google Drive later
mv data/google-credentials.json.backup data/google-credentials.json
```

Would you like to proceed with local storage for now, or set up the OAuth client properly?