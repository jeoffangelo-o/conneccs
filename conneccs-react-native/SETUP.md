# ConneCCS React Native - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd conneccs-react-native
npm install
```

### 2. Install Expo CLI (if not installed)

```bash
npm install -g expo-cli
```

### 3. Start Development Server

```bash
npm start
```

This will open Expo DevTools in your browser.

### 4. Run on Device

**Option A: Physical Device**
1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Scan the QR code from Expo DevTools

**Option B: Simulator/Emulator**
```bash
# iOS (Mac only)
npm run ios

# Android
npm run android
```

## Project Structure

```
conneccs-react-native/
├── App.js                          # Main entry point
├── app.json                        # Expo config
├── package.json                    # Dependencies
├── src/
│   ├── components/
│   │   └── CustomDrawer.js         # Drawer menu
│   ├── context/
│   │   └── ThemeContext.js         # Theme management
│   ├── screens/                    # All app screens
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── FacultyScreen.js
│   │   ├── FacultyDetailScreen.js
│   │   ├── AnnouncementsScreen.js
│   │   ├── AnnouncementFormScreen.js
│   │   ├── ReportsScreen.js
│   │   ├── ReportFormScreen.js
│   │   ├── IPCRScreen.js
│   │   ├── IPCRFormScreen.js
│   │   ├── WorkloadScreen.js
│   │   ├── DocumentsScreen.js
│   │   ├── FolderFormScreen.js
│   │   └── MessagesScreen.js
│   └── styles/
│       └── globalStyles.js         # Shared styles
```

## Features Implemented

### ✅ Core Features
- Authentication (Login/Register)
- Drawer Navigation
- Theme Toggle (Dark/Light)
- Dashboard with Stats
- Faculty Management
- Reports System
- IPCR Monitoring
- Workload Display
- Documents Management
- Announcements
- Messages

### 🎨 Design System
- 1:1 match with web design
- Dark theme (default)
- Light theme (toggle)
- Consistent typography
- Reusable components

### 📱 Navigation
- Drawer menu (side menu)
- Stack navigation (screens)
- Back navigation
- Deep linking ready

## Screens Overview

### Authentication
- **LoginScreen**: Email/password login
- **RegisterScreen**: New user registration

### Main App
- **DashboardScreen**: Overview with stats and quick actions
- **FacultyScreen**: List of all faculty members
- **FacultyDetailScreen**: Individual faculty profile
- **AnnouncementsScreen**: View all announcements
- **AnnouncementFormScreen**: Create new announcement
- **ReportsScreen**: View and manage reports
- **ReportFormScreen**: Submit new report
- **IPCRScreen**: IPCR monitoring dashboard
- **IPCRFormScreen**: Create IPCR entry
- **WorkloadScreen**: Faculty workload distribution
- **DocumentsScreen**: Document management
- **FolderFormScreen**: Create new folder
- **MessagesScreen**: Communication system

## Customization

### Change Theme Colors

Edit `src/context/ThemeContext.js`:

```javascript
const theme = {
  dark: {
    bg: '#0f0e0d',      // Background
    accent: '#4f7cff',  // Primary color
    // ... more colors
  }
};
```

### Add New Screen

1. Create screen file in `src/screens/`
2. Import in `App.js`
3. Add to navigation:

```javascript
<Stack.Screen name="NewScreen" component={NewScreen} />
```

### Modify Drawer Menu

Edit `src/components/CustomDrawer.js`:

```javascript
const menuItems = [
  { name: 'New Item', icon: 'icon-name', route: 'RouteName' },
  // ... more items
];
```

## Testing

### Test on Different Devices

```bash
# iOS Simulator (Mac only)
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

### Test Theme Toggle
1. Open app
2. Open drawer menu
3. Tap sun/moon icon at bottom
4. Theme should switch

### Test Navigation
1. Login with any credentials
2. Navigate through drawer menu
3. Test all screens
4. Test back navigation

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache
expo start -c
```

### iOS Simulator Not Opening
```bash
# Check Xcode installation
xcode-select --install
```

### Android Emulator Issues
```bash
# Check Android Studio setup
# Ensure ANDROID_HOME is set
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## Building for Production

### iOS (Mac only)
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### Web
```bash
expo build:web
```

## Next Steps

1. **Backend Integration**
   - Connect to API
   - Add authentication
   - Implement data fetching

2. **Enhanced Features**
   - Push notifications
   - Offline mode
   - File uploads
   - Real-time updates

3. **Performance**
   - Optimize images
   - Lazy loading
   - Caching strategy

4. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

## Support

For issues or questions:
1. Check this documentation
2. Review Expo documentation
3. Check React Native documentation
4. Contact development team

---

**Note**: This is a mobile conversion of the ConneCCS web application with 1:1 design accuracy.
