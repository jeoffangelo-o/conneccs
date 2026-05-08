# Debug Guide - Submit IPCR Issue

## Issue
- Dashboard shows "0 of 63 targets completed"
- Submit button not working or no indicator after submission

## Debugging Steps

### Step 1: Check Browser Console

1. Open your browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Click "Submit IPCR for Review" button
5. Look for these console logs:

```
=== SUBMIT IPCR DEBUG ===
My IPCR: {...}
Major Functions: [...]
Checking function: ...
  Target ...: a4Rating=..., selfRatingAvg=..., hasRating=...
All targets rated? true/false
```

### Step 2: Check What's Logged

**If you see "All targets rated? false":**
- Some targets don't have ratings
- Check which targets show `hasRating=false`
- Go back and rate those targets

**If you see "All targets rated? true":**
- The validation passed
- You should see a confirmation dialog
- If dialog doesn't appear, there's a UI issue

**If you see "Submitting IPCR...":**
- The submit was triggered
- Check if "IPCR submitted successfully!" appears
- Check if status updates

### Step 3: Check AsyncStorage (LocalStorage)

1. In Developer Tools, go to **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Find **Local Storage** → your site URL
3. Look for key: `ipcrs`
4. Click on it to see the value
5. Look for your IPCR and check:
   - `status` field
   - `overallStatus` field
   - `submittedAt` field
   - Each target's `a4Rating` and `selfRatingAvg` fields

### Step 4: Force Refresh

After making changes:
1. **Hard refresh** the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or **Clear cache**:
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

### Step 5: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Click "Submit IPCR for Review"
4. Look for any API calls or errors

## Common Issues & Solutions

### Issue 1: "0 of 63 targets completed" on Dashboard

**Cause:** Dashboard not reading the correct rating fields

**Solution:**
1. Check browser console for errors
2. Hard refresh the page (Ctrl + Shift + R)
3. Check if targets have `selfRatingAvg` or `a4Rating` populated

**Debug:**
```javascript
// In browser console, run:
const ipcrs = JSON.parse(localStorage.getItem('ipcrs') || '[]');
const myIPCR = ipcrs.find(i => i.facultyName.includes('YOUR_NAME'));
console.log('Total targets:', myIPCR.majorFunctions.reduce((s, mf) => s + mf.targets.length, 0));
console.log('Rated targets:', myIPCR.majorFunctions.reduce((s, mf) => 
  s + mf.targets.filter(t => t.a4Rating > 0 || t.selfRatingAvg > 0).length, 0
));
```

### Issue 2: Submit Button Not Appearing

**Possible Causes:**
- Status is not 'IN_PROGRESS'
- No rated targets
- Already submitted

**Check:**
```javascript
// In browser console:
const ipcrs = JSON.parse(localStorage.getItem('ipcrs') || '[]');
const myIPCR = ipcrs.find(i => i.facultyName.includes('YOUR_NAME'));
console.log('Status:', myIPCR.status);
console.log('Overall Status:', myIPCR.overallStatus);
console.log('Rated targets:', myIPCR.majorFunctions.reduce((s, mf) => 
  s + mf.targets.filter(t => t.a4Rating > 0 || t.selfRatingAvg > 0).length, 0
));
```

### Issue 3: Submit Button Clicked But Nothing Happens

**Possible Causes:**
- Validation failing silently
- Alert not showing
- JavaScript error

**Check:**
1. Look for console errors (red text in console)
2. Check if alert dialog appears
3. Check if any targets are missing ratings

### Issue 4: No Visual Indicator After Submit

**Expected Behavior After Fix:**
1. Status badge changes to blue "SUBMITTED"
2. Submit button disappears
3. Blue success message appears:
   ```
   ✓ IPCR Submitted Successfully!
   Your IPCR has been submitted for review...
   Submitted on: [date/time]
   ```

**If not showing:**
- Hard refresh the page
- Check console for errors
- Check if `overallStatus` was updated in localStorage

## Manual Fix (If Needed)

If the submit is not working, you can manually update the status:

1. Open browser console (F12)
2. Run this code:

```javascript
// Get IPCRs from storage
const ipcrs = JSON.parse(localStorage.getItem('ipcrs') || '[]');

// Find your IPCR (replace 'YOUR_NAME' with your actual name)
const myIPCRIndex = ipcrs.findIndex(i => i.facultyName.includes('YOUR_NAME'));

if (myIPCRIndex >= 0) {
  // Update status
  ipcrs[myIPCRIndex].status = 'SUBMITTED';
  ipcrs[myIPCRIndex].overallStatus = 'SUBMITTED';
  ipcrs[myIPCRIndex].submittedAt = new Date().toISOString();
  
  // Save back to storage
  localStorage.setItem('ipcrs', JSON.stringify(ipcrs));
  
  console.log('IPCR status updated manually!');
  
  // Refresh the page
  location.reload();
} else {
  console.error('IPCR not found!');
}
```

## Verification Checklist

After submitting, verify:

- [ ] Status badge shows "SUBMITTED" in blue
- [ ] Submit button is hidden
- [ ] Blue success message is displayed
- [ ] Submitted date/time is shown
- [ ] Dashboard shows correct completion count
- [ ] Console shows "IPCR submitted successfully!"

## Still Not Working?

If none of the above works:

1. **Clear all data and start fresh:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **Check for JavaScript errors:**
   - Look for red errors in console
   - Take a screenshot and share

3. **Export your IPCR data:**
   ```javascript
   const ipcrs = JSON.parse(localStorage.getItem('ipcrs') || '[]');
   console.log(JSON.stringify(ipcrs, null, 2));
   ```
   - Copy the output
   - Share for debugging

## Expected Console Output (Success)

When submit works correctly, you should see:

```
=== SUBMIT IPCR DEBUG ===
My IPCR: {id: "...", facultyName: "...", ...}
Major Functions: [{...}, {...}, {...}]
Checking function: Strategic Functions
  Target target-1: a4Rating=4.67, selfRatingAvg=4.67, hasRating=true
  Target target-2: a4Rating=4.5, selfRatingAvg=4.5, hasRating=true
  ...
All targets rated? true
Submitting IPCR...
Updated IPCR: {status: "SUBMITTED", overallStatus: "SUBMITTED", ...}
IPCR submitted successfully!
```

---

**Created:** May 8, 2026  
**Purpose:** Debug submit IPCR issues
