# Clear Cache Instructions

## Issue
The ReportorialFolderScreen has a StyleSheet error and requirements are not showing up properly due to browser/Metro bundler caching issues.

## Solution Steps

### 1. Clear Metro Bundler Cache

Stop your development server (Ctrl+C in terminal), then run ONE of these commands:

**Option A (Expo):**
```bash
npx expo start --clear
```

**Option B (npm):**
```bash
npm start -- --reset-cache
```

**Option C (Manual):**
```bash
# Delete cache folders
rmdir /s /q node_modules\.cache
rmdir /s /q .expo
# Then restart
npm start
```

### 2. Clear Browser Cache

**Hard Refresh:**
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Or Clear All:**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 3. Clear AsyncStorage (if requirements still don't show)

Add this temporary code to your App.js (inside TamaguiWrapper, before return):

```javascript
// TEMPORARY - Remove after clearing cache
React.useEffect(() => {
  const clearCache = async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared!');
  };
  clearCache();
}, []);
```

Then:
1. Refresh the browser
2. Check console for "AsyncStorage cleared!"
3. Remove the code
4. Refresh again

### 4. Verify Fix

After clearing cache:

1. **Check ReportorialRequirementsScreen:**
   - Should show 15 reportorial requirements
   - Should show 2 other documents
   - Cards should be properly sized (maxWidth: 380px)

2. **Check ReportorialFolderScreen:**
   - Click any requirement card
   - Should open folder view without StyleSheet error
   - Should show submission dashboard

3. **Check Console Logs:**
   ```
   Loading reportorial data - stored version: 2 current version: 2
   Initial requirements loaded: 17
   Total requirements: 17
   Filtered REPORTORIAL requirements: 15
   Filtered OTHER_DOCUMENTS: 2
   ```

## What Was Fixed

### ReportorialFolderScreen.tsx
- Changed `const createStyles = (colors) => { ... }` to `function createStyles(colors) { ... }`
- Removed unnecessary StyleSheet safety check that was causing issues

### ReportorialContext.tsx
- Added comprehensive logging to track data loading
- Improved version check to clear all storage on mismatch
- Added fallback to initial data on any error
- Ensured initial requirements (17 items) are always available

### ReportorialRequirementsScreen.tsx
- Added detailed logging to track filtering
- Shows requirement names in console for debugging

## Expected Behavior

**ReportorialRequirementsScreen:**
- Shows 15 reportorial requirements in "Reportorial Requirements" tab
- Shows 2 other documents in "Other Documents" tab
- Each card shows: number, staff, status, title, template, copies, size, deadline, remarks
- Cards are responsive (280-380px width)

**ReportorialFolderScreen:**
- Shows submission summary with progress bar
- Shows requirement details
- Secretary can upload template
- Secretary can send reminders
- Secretary can generate reports
- Shows all faculty with submission status
- Secretary can rate submissions

## Troubleshooting

**If requirements still don't show:**
1. Check console for "Loading reportorial data" messages
2. Verify DATA_VERSION is 2 in ReportorialContext.tsx
3. Clear AsyncStorage using the code above
4. Check that ReportorialProvider is wrapping the app in App.js

**If StyleSheet error persists:**
1. Check line 487 in ReportorialFolderScreen.tsx
2. Should be: `function createStyles(colors: any) {`
3. Should NOT have any safety checks before `StyleSheet.create`
4. Clear browser cache completely

**If cards are too wide:**
1. Check styles in ReportorialRequirementsScreen.tsx
2. Card style should have: `maxWidth: 380, minWidth: 280`
3. Grid should have: `flexWrap: 'wrap'`
