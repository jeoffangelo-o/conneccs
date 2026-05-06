# Screen Templates for ConneCCS React Native

This document provides templates for creating the remaining screens. All screens follow the same pattern for consistency.

## Basic Screen Template

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
      
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.topbarCenter}>
          <Text style={styles.topbarTitle}>Screen Title</Text>
          <Text style={styles.topbarBreadcrumb}>CCS Faculty Portal › Screen</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={22} color={colors.text2} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topbarCenter: { flex: 1, marginHorizontal: 16 },
  topbarTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  topbarBreadcrumb: { fontSize: 11, color: colors.text3, marginTop: 2 },
  content: { flex: 1, padding: 16 },
});
```

## Screens to Create

### 1. FacultyDetailScreen.js
- Shows individual faculty profile
- Workload distribution chart
- Performance metrics
- Teaching load table
- Recent activity

### 2. AnnouncementsScreen.js
- List of announcements
- Pinned announcements at top
- Priority badges
- Date and author info
- "Post Announcement" button

### 3. AnnouncementFormScreen.js
- Title input
- Message textarea
- Target audience dropdown
- Priority level selector
- Pin checkbox
- Submit button

### 4. ReportsScreen.js
- List of reports
- Status badges (Submitted, Pending, Draft)
- Filter by type
- "Submit Report" button
- Download links

### 5. ReportFormScreen.js
- Report type dropdown
- Period selector
- Title input
- Description textarea
- Key accomplishments
- File upload area
- Submit button

### 6. IPCRScreen.js
- IPCR entries table
- Faculty name
- Rating period
- Overall rating
- Status
- View/Approve buttons

### 7. IPCRFormScreen.js
- Faculty selector
- Rating period
- Strategic Priority section (10%)
- Core Functions section (75%)
  - Instruction (45%)
  - Research (15%)
  - Extension (15%)
- Support Functions (15%)
- Overall rating
- Submit button

### 8. WorkloadScreen.js
- Summary stats
- Faculty workload table
- Teaching/Research/Extension breakdown
- Visual distribution bars
- Workload categories legend

### 9. DocumentsScreen.js
- Folder grid/list
- Folder icons with colors
- File count
- Last modified date
- "New Folder" button

### 10. FolderFormScreen.js
- Folder name input
- Description textarea
- Access level dropdown
- Color picker
- Pin checkbox
- Notify checkbox
- Create button

### 11. MessagesScreen.js
- Message list
- Sender avatar
- Message preview
- Timestamp
- Unread badge
- Search bar

## Common Components

### Panel Component
```javascript
<View style={styles.panel}>
  <View style={styles.panelHeader}>
    <Text style={styles.panelTitle}>Panel Title</Text>
  </View>
  <View style={styles.panelBody}>
    {/* Content */}
  </View>
</View>
```

### Badge Component
```javascript
<View style={[styles.badge, styles.badgeGreen]}>
  <Text style={[styles.badgeText, styles.badgeGreenText]}>Status</Text>
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

### Button
```javascript
<TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit}>
  <Text style={styles.btnPrimaryText}>Submit</Text>
</TouchableOpacity>
```

## Style Patterns

### Common Styles
```javascript
const createStyles = (colors) => StyleSheet.create({
  // Layout
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: 16 },
  
  // Panel
  panel: {
    backgroundColor: colors.bg2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  panelBody: { padding: 16 },
  
  // Forms
  formGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text2,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
  },
  
  // Buttons
  btnPrimary: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: colors.text2,
    fontSize: 15,
    fontWeight: '500',
  },
  
  // Badges
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeGreen: { backgroundColor: 'rgba(34,197,94,0.12)' },
  badgeGreenText: { color: colors.green },
  badgeRed: { backgroundColor: 'rgba(244,63,94,0.12)' },
  badgeRedText: { color: colors.red },
  badgeBlue: { backgroundColor: 'rgba(79,124,255,0.12)' },
  badgeBlueText: { color: colors.accent },
});
```

## Navigation Patterns

### Navigate to Screen
```javascript
navigation.navigate('ScreenName');
```

### Navigate with Params
```javascript
navigation.navigate('ScreenName', { param: value });
```

### Go Back
```javascript
navigation.goBack();
```

### Open Drawer
```javascript
navigation.openDrawer();
```

## Data Patterns

### Static Data
```javascript
const data = [
  { id: 1, name: 'Item 1', status: 'Active' },
  { id: 2, name: 'Item 2', status: 'Pending' },
];
```

### State Management
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
```

### Form State
```javascript
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
});

const updateField = (field, value) => {
  setFormData({ ...formData, [field]: value });
};
```

## Tips

1. **Consistency**: Use the same patterns across all screens
2. **Reusability**: Extract common components
3. **Styling**: Use the theme colors from context
4. **Navigation**: Always provide back navigation
5. **Feedback**: Show loading states and success messages
6. **Validation**: Validate forms before submission
7. **Accessibility**: Use proper labels and hints
8. **Performance**: Optimize lists with FlatList for large data

## Next Steps

1. Create each screen using the template
2. Add screen-specific logic
3. Connect to backend API (future)
4. Add error handling
5. Implement loading states
6. Add animations
7. Test on devices
8. Optimize performance

---

**Note**: All screens should maintain the 1:1 design match with the web version while adapting to mobile UX patterns.
