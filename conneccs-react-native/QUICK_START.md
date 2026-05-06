# Quick Start Guide

## ✅ Status: Ready to Run!

All 15 screens are complete with no errors. The app is ready for demo.

## 🚀 Start the App (3 Steps)

### Step 1: Navigate to folder
```bash
cd conneccs-react-native
```

### Step 2: Install dependencies (if not done)
```bash
npm install
```

### Step 3: Start the app
```bash
npm start
```

## 📱 Run Options

After `npm start`, you'll see a QR code and options:

- **Press `a`** - Open in Android emulator
- **Press `i`** - Open in iOS simulator (Mac only)
- **Press `w`** - Open in web browser
- **Scan QR** - Open in Expo Go app on your phone

## 📲 Using Expo Go App

1. Download "Expo Go" from App Store (iOS) or Play Store (Android)
2. Open Expo Go app
3. Scan the QR code from terminal
4. App will load on your phone

## 🎨 Features to Demo

### 1. Theme Toggle
- Open drawer (swipe right or tap menu)
- Toggle dark/light mode at bottom

### 2. Navigation
- **Drawer**: Dashboard, Reports, IPCR, Workload, Documents, Faculty, Announcements, Messages
- **Forms**: Tap "New" buttons to see form screens
- **Details**: Tap "View Profile" on first faculty member

### 3. All Screens Work
- ✅ Login & Register
- ✅ Dashboard with stats
- ✅ Faculty list & detail
- ✅ Announcements & form
- ✅ Reports & form
- ✅ IPCR & form (Philippine CSC format)
- ✅ Workload distribution
- ✅ Documents & folder form
- ✅ Messages inbox

## 🎯 Design Highlights

- **1:1 Match**: Exact same design as web version
- **Colors**: #d4a574 accent (ConneCCS gold)
- **Layout**: Same sidebar, topbar, panels
- **Data**: Static demo data for presentation

## ⚠️ Notes

- This is a **design mockup** with static data
- Forms don't submit (design only)
- No backend connection
- Perfect for panelist presentation

## 🐛 Troubleshooting

### If you see errors:

1. **"Module not found"**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **"Port already in use"**
   ```bash
   # Kill the process and restart
   npm start
   ```

3. **"Expo Go not connecting"**
   - Make sure phone and computer are on same WiFi
   - Try scanning QR code again

## ✨ You're All Set!

The app is complete and ready to demo. Just run `npm start` and you're good to go!
