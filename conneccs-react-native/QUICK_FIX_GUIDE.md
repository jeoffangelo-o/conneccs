# Quick Fix Guide - Reportorial System

## 🚨 Current Issues
1. StyleSheet error when opening requirement folders
2. Requirements not showing (blank screen)
3. Cards too wide (already fixed, but may need cache clear)

## ✅ What Was Fixed
- Fixed StyleSheet.create error in ReportorialFolderScreen
- Enhanced data loading in ReportorialContext with better logging
- Added debug buttons to help diagnose issues
- Created cache clearing utilities

## 🔧 How to Fix NOW

### Option 1: Quick Fix (Recommended)
1. **Stop your dev server** (Ctrl+C in terminal)
2. **Clear Metro cache:**
   ```bash
   npx expo start --clear
   ```
3. **Hard refresh browser:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
4. **Done!** Check if requirements show up

### Option 2: Use Debug Buttons
1. Navigate to **Reportorial Requirements** screen
2. Click **"Debug"** button (top right) - check console
3. Click **"Clear Cache"** button (top right)
4. Hard refresh browser (`Ctrl + Shift + R`)

### Option 3: Manual Cache Clear
If options 1 & 2 don't work:

1. Add this code to `App.js` (inside `TamaguiWrapper`, before return):
```javascript
React.useEffect(() => {
  const clearCache = async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage cleared!');
  };
  clearCache();
}, []);
```

2. Refresh browser
3. Check console for "✅ AsyncStorage cleared!"
4. **Remove the code**
5. Refresh again

## ✨ Expected Results

### Console Logs (should see):
```
Loading reportorial data - stored version: 2 current version: 2
Initial requirements loaded: 17
Total requirements: 17
Filtered REPORTORIAL requirements: 15
Filtered OTHER_DOCUMENTS: 2
```

### UI (should see):
- **Reportorial Requirements tab:** 15 cards
- **Other Documents tab:** 2 cards
- Cards sized 280-380px (not full width)
- Each card shows: number, staff, status, title, details
- Clicking card opens folder view (no errors)

## 🎯 Test Checklist

After clearing cache, test these:

### ✅ ReportorialRequirementsScreen
- [ ] Shows 15 reportorial requirements
- [ ] Shows 2 other documents
- [ ] Cards are properly sized (not too wide)
- [ ] Status badges show correctly
- [ ] Can switch between tabs

### ✅ ReportorialFolderScreen
- [ ] Opens without StyleSheet error
- [ ] Shows submission summary
- [ ] Shows progress bar
- [ ] Shows requirement details
- [ ] Secretary can see upload template button
- [ ] Secretary can see action buttons (reminder, reports)
- [ ] Shows faculty list with submission status

## 🐛 Still Having Issues?

### Requirements not showing:
1. Check console for "Loading reportorial data" messages
2. Use "Debug" button to see AsyncStorage contents
3. Use "Clear Cache" button
4. Verify `DATA_VERSION = 2` in `context/ReportorialContext.tsx`

### StyleSheet error persists:
1. Check line 485 in `src/screens/ReportorialFolderScreen.tsx`
2. Should be: `function createStyles(colors: any) {`
3. Should NOT be: `const createStyles = (colors: any) => {`
4. Clear browser cache completely

### Cards still too wide:
1. Check `card` style in `src/screens/ReportorialRequirementsScreen.tsx`
2. Should have: `maxWidth: 380, minWidth: 280`

## 📝 Files Changed
- ✅ `src/screens/ReportorialFolderScreen.tsx` - Fixed createStyles
- ✅ `context/ReportorialContext.tsx` - Enhanced data loading
- ✅ `src/screens/ReportorialRequirementsScreen.tsx` - Added debug buttons
- ✅ `utils/clearReportorialCache.ts` - NEW cache utilities

## 🎉 Next Steps (After Fix)
1. Remove debug buttons (temporary)
2. Test secretary features:
   - Upload template
   - Send reminders
   - Generate reports
   - Rate submissions
3. Implement faculty submission UI (future)

## 💡 Pro Tips
- Always clear Metro cache when seeing weird errors
- Use hard refresh (Ctrl+Shift+R) not regular refresh
- Check console logs for debugging
- Debug buttons are your friend!

---

**Need more help?** Check `CLEAR_CACHE_INSTRUCTIONS.md` or `REPORTORIAL_FIX_SUMMARY.md`
