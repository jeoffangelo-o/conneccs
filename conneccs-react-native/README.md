# ConneCCS React Native

A mobile application for the CCS Faculty Portal, converted from the web design with 1:1 design accuracy.

## 🚀 Features

- **Authentication**: Login and Registration screens
- **Dashboard**: Overview with stats and quick actions
- **Faculty Management**: View faculty profiles and details
- **Reports**: Submit and manage reports
- **IPCR Monitoring**: Individual Performance Commitment and Review
- **Workload Management**: View faculty workload distribution
- **Documents**: Manage folders and files
- **Announcements**: Post and view announcements
- **Messages**: Communication system
- **Theme Toggle**: Dark/Light mode support

## 📱 Screens Implemented

### Core Screens
- ✅ Login Screen
- ✅ Register Screen
- ✅ Dashboard Screen
- ✅ Custom Drawer Navigation

### Main Features
- ✅ Faculty List Screen
- ✅ Faculty Detail Screen
- ✅ Announcements Screen
- ✅ Announcement Form Screen
- ✅ Reports Screen
- ✅ Report Form Screen
- ✅ IPCR Screen
- ✅ IPCR Form Screen
- ✅ Workload Screen
- ✅ Documents Screen
- ✅ Folder Form Screen
- ✅ Messages Screen

## 🎨 Design System

### Colors (Dark Theme)
- Background: `#0f0e0d`
- Background 2: `#1a1816`
- Background 3: `#252220`
- Border: `#3a3530`
- Text: `#f0ebe0`
- Accent: `#4f7cff`
- Green: `#8fb569`
- Red: `#d97171`

### Typography
- Display Font: System (800 weight)
- Body Font: System (400 weight)
- Font Sizes: 10-28px

### Components
- Buttons: Primary, Secondary
- Cards: Panel, Stat Card, Faculty Card
- Forms: Input, Textarea, Select
- Badges: Green, Red, Blue, Yellow, Gray
- Avatar: Small, Medium, Large

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Setup

1. **Install dependencies**
```bash
cd conneccs-react-native
npm install
```

2. **Start the development server**
```bash
npm start
```

3. **Run on device/simulator**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📂 Project Structure

```
conneccs-react-native/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── src/
│   ├── components/
│   │   └── CustomDrawer.js     # Drawer navigation component
│   ├── context/
│   │   └── ThemeContext.js     # Theme provider (dark/light)
│   ├── screens/
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
│       └── globalStyles.js     # Global style definitions
└── assets/                     # Images and icons
```

## 🎯 Key Features

### Navigation
- **Drawer Navigation**: Side menu with all main sections
- **Stack Navigation**: For nested screens (forms, details)
- **Deep Linking**: Support for direct navigation

### Theme System
- **Dark Mode**: Default theme matching web design
- **Light Mode**: Alternative theme
- **Toggle**: Easy switch between themes
- **Persistent**: Theme preference saved

### Forms
- **Validation**: Input validation on all forms
- **Error Handling**: User-friendly error messages
- **Auto-save**: Draft functionality
- **File Upload**: Support for document attachments

### Data Management
- **Local State**: React hooks for component state
- **Context API**: Global state (theme, user)
- **AsyncStorage**: Persistent data storage (future)
- **API Integration**: Ready for backend connection (future)

## 🔧 Configuration

### Theme Customization
Edit `src/context/ThemeContext.js` to modify colors:

```javascript
const theme = {
  dark: {
    bg: '#0f0e0d',
    accent: '#4f7cff',
    // ... more colors
  },
  light: {
    bg: '#faf8f3',
    accent: '#4f7cff',
    // ... more colors
  },
};
```

### Navigation Structure
Edit `App.js` to modify navigation:

```javascript
<Drawer.Navigator>
  <Drawer.Screen name="Dashboard" component={DashboardScreen} />
  // Add more screens
</Drawer.Navigator>
```

## 📱 Platform-Specific Notes

### iOS
- Requires Xcode for iOS Simulator
- CocoaPods for native dependencies
- Safe area handling built-in

### Android
- Requires Android Studio for emulator
- Gradle configuration included
- Material Design components

### Web
- Responsive design for web browsers
- Touch and mouse input support
- Progressive Web App ready

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] Push notifications
- [ ] Offline mode with data sync
- [ ] File upload/download
- [ ] Real-time messaging
- [ ] Biometric authentication
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

## 📄 License

This project is part of the ConneCCS Faculty Portal system.

## 👥 Credits

Converted from the ConneCCS web design to React Native with 1:1 design accuracy.

## 🐛 Known Issues

- File upload functionality requires native modules
- Some animations may differ from web version
- Performance optimization needed for large lists

## 📞 Support

For issues or questions, please refer to the main ConneCCS documentation.

---

**Note**: This is a mobile conversion of the ConneCCS web application. All screens maintain the same design language and user experience as the original web version.
