# ConneCCS React Native - Complete Setup & Implementation Guide

## ✅ What's Been Created

### Core Files
- ✅ `App.js` - Main application with navigation
- ✅ `app.json` - Expo configuration
- ✅ `package.json` - Dependencies

### Context & Styles
- ✅ `src/context/ThemeContext.js` - Theme management (dark/light)
- ✅ `src/styles/globalStyles.js` - Global style definitions

### Components
- ✅ `src/components/CustomDrawer.js` - Drawer navigation menu

### Screens (Implemented)
- ✅ `LoginScreen.js` - Full authentication UI
- ✅ `RegisterScreen.js` - User registration
- ✅ `DashboardScreen.js` - Main dashboard with stats
- ✅ `FacultyScreen.js` - Faculty list view
- ✅ `FacultyDetailScreen.js` - Individual faculty profile

### Screens (Need Implementation)
The following screens need to be created using the templates provided:

1. **AnnouncementsScreen.js** - List of announcements
2. **AnnouncementFormScreen.js** - Create announcement
3. **ReportsScreen.js** - Reports list
4. **ReportFormScreen.js** - Submit report
5. **IPCRScreen.js** - IPCR monitoring
6. **IPCRFormScreen.js** - IPCR entry form
7. **WorkloadScreen.js** - Workload management
8. **DocumentsScreen.js** - Document folders
9. **FolderFormScreen.js** - Create folder
10. **MessagesScreen.js** - Messages/chat

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd conneccs-react-native
npm install
```

### 2. Start Development

```bash
npm start
```

### 3. Run on Device

- **iOS**: Press `i` in terminal or scan QR with Expo Go
- **Android**: Press `a` in terminal or scan QR with Expo Go
- **Web**: Press `w` in terminal

## 📱 Current App Flow

1. **Login Screen** → Enter credentials → Dashboard
2. **Dashboard** → View stats, quick actions
3. **Drawer Menu** → Navigate to any section
4. **Faculty** → View list → Tap card → Faculty Detail
5. **Theme Toggle** → Tap sun/moon icon in drawer

## 🎨 Design System (1:1 Match)

### Colors
```javascript
Dark Theme:
- Background: #0f0e0d
- Accent: #4f7cff
- Green: #8fb569
- Red: #d97171

Light Theme:
- Background: #faf8f3
- Accent: #4f7cff
- Green: #6a9048
- Red: #c94545
```

### Typography
- Display: System Bold (800)
- Body: System Regular (400)
- Sizes: 10-28px

### Components
- Buttons: Primary (accent), Secondary (bg3)
- Cards: Panel, Stat, Faculty
- Forms: Input, Textarea, Dropdown
- Badges: Status indicators

## 📝 Creating Remaining Screens

### Template Structure

Each screen follows this pattern:

```javascript
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function ScreenName({ navigation }) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Topbar with back button */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.topbarCenter}>
          <Text style={styles.topbarTitle}>Title</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={22} color={colors.text2} />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.content}>
        {/* Your content here */}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topbar: {
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topbarCenter: { flex: 1, marginHorizontal: 16 },
  topbarTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  content: { flex: 1, padding: 16 },
});
```

### Quick Implementation Steps

1. **Copy template** from above
2. **Rename** `ScreenName` to actual screen name
3. **Add content** specific to that screen
4. **Import** in `App.js`
5. **Add to navigation** stack

## 🔧 Common Patterns

### Panel Component
```javascript
<View style={styles.panel}>
  <View style={styles.panelHeader}>
    <Text style={styles.panelTitle}>Title</Text>
  </View>
  <View style={styles.panelBody}>
    {/* Content */}
  </View>
</View>
```

### Form Input
```javascript
<View style={styles.formGroup}>
  <Text style={styles.label}>Label *</Text>
  <TextInput
    style={styles.input}
    placeholder="Enter value"
    placeholderTextColor={colors.text3}
    value={value}
    onChangeText={setValue}
  />
</View>
```

### Badge
```javascript
<View style={[styles.badge, styles.badgeGreen]}>
  <Text style={[styles.badgeText, styles.badgeGreenText]}>
    Status
  </Text>
</View>
```

### Button
```javascript
<TouchableOpacity style={styles.btnPrimary} onPress={handlePress}>
  <Text style={styles.btnPrimaryText}>Submit</Text>
</TouchableOpacity>
```

## 📦 Dependencies Explained

```json
{
  "expo": "~50.0.0",                    // Expo framework
  "react": "18.2.0",                    // React library
  "react-native": "0.73.0",             // React Native
  "@react-navigation/native": "^6.1.9", // Navigation core
  "@react-navigation/stack": "^6.3.20", // Stack navigation
  "@react-navigation/drawer": "^6.6.6", // Drawer menu
  "@expo/vector-icons": "^14.0.0"       // Icons
}
```

## 🎯 Features Implemented

### ✅ Working Features
- Login/Register authentication UI
- Drawer navigation with all menu items
- Theme toggle (dark/light mode)
- Dashboard with stats and quick actions
- Faculty list with workload visualization
- Faculty detail profile view
- Responsive topbar with navigation
- Consistent styling across screens

### 🚧 To Be Implemented
- Announcements list and form
- Reports list and submission form
- IPCR monitoring and entry form
- Workload management view
- Documents and folder management
- Messages/chat interface
- Backend API integration
- Data persistence
- Push notifications
- File uploads

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
expo start -c  # Clear cache
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

### iOS Simulator Not Opening
```bash
xcode-select --install
```

### Android Emulator Issues
- Ensure Android Studio is installed
- Check ANDROID_HOME environment variable
- Start emulator manually first

## 📚 Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Ionicons](https://ionic.io/ionicons)

## 🎓 Learning Path

1. **Understand the structure** - Review existing screens
2. **Copy a template** - Use LoginScreen or DashboardScreen
3. **Modify for your needs** - Add specific content
4. **Test on device** - Use Expo Go app
5. **Iterate** - Refine based on feedback

## 📞 Next Steps

1. **Create remaining screens** using templates
2. **Test navigation** between all screens
3. **Add form validation** to all forms
4. **Implement data persistence** with AsyncStorage
5. **Connect to backend API** for real data
6. **Add loading states** and error handling
7. **Optimize performance** for large lists
8. **Add animations** for better UX
9. **Test on multiple devices** (iOS/Android)
10. **Prepare for production** build

## ✨ Tips for Success

1. **Start simple** - Get basic structure working first
2. **Test frequently** - Check on device after each change
3. **Use hot reload** - Saves time during development
4. **Follow patterns** - Consistency is key
5. **Reference web design** - Maintain 1:1 match
6. **Ask for help** - Use Expo/React Native communities

---

**Status**: Core structure complete, 5/15 screens implemented, ready for remaining screen development.

**Next Priority**: Implement AnnouncementsScreen, ReportsScreen, and IPCRScreen as they are most frequently used.
