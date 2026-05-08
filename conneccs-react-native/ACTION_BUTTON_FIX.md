# Action Button Fix - Secretary Review Queue

**Date:** May 8, 2026  
**Status:** ✅ FIXED - Added "View IPCR" Button

---

## Problem

In the **Compliance Tab** of the Review Queue, the ACTION column only showed bell icons (🔔) for sending reminders. There was no way to **view/review the faculty's IPCR** directly from the compliance dashboard.

**Before:**
```
ACTION
  🔔  ← Only reminder button
  🔔
  🔔
```

---

## Solution

Added a **"View IPCR" button** (eye icon 👁️) next to the reminder button in the ACTION column.

**After:**
```
ACTION
  👁️ 🔔  ← View IPCR + Reminder
  👁️ 🔔
  👁️ 🔔
```

---

## What Changed

### 1. Added "Eye" Icon to SvgIcon Component
**File:** `src/components/SvgIcon.js`

Added new icon:
```javascript
eye: (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
),
```

### 2. Updated Compliance Tab Action Column
**File:** `src/screens/ReviewQueueScreen.tsx`

**Before:**
```tsx
<View style={styles.tableCell}>
  <TouchableOpacity
    style={styles.reminderButton}
    onPress={() => handleSendReminder(item.facultyId, item.facultyName)}
  >
    <SvgIcon name="bell" size={14} color={colors.accent} style={{}} />
  </TouchableOpacity>
</View>
```

**After:**
```tsx
<View style={[styles.tableCell, { flexDirection: 'row', gap: 8 }]}>
  <TouchableOpacity
    style={styles.viewButton}
    onPress={() => {
      const facultyIPCR = ipcrs.find(ipcr => ipcr.facultyId === item.facultyId);
      if (facultyIPCR) {
        navigation.navigate('IPCRDetail', { id: facultyIPCR.id });
      }
    }}
  >
    <SvgIcon name="eye" size={14} color="#fff" style={{}} />
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.reminderButton}
    onPress={() => handleSendReminder(item.facultyId, item.facultyName)}
  >
    <SvgIcon name="bell" size={14} color={colors.accent} style={{}} />
  </TouchableOpacity>
</View>
```

### 3. Added View Button Style
**File:** `src/screens/ReviewQueueScreen.tsx`

```typescript
viewButton: {
  padding: 8,
  backgroundColor: colors.accent,
  borderRadius: 4,
},
```

---

## How It Works Now

### Compliance Tab - Action Column

**Two Buttons:**

#### 1. 👁️ View IPCR Button (Blue/Accent Color)
**What it does:**
- Finds the faculty's IPCR by facultyId
- Navigates to IPCRDetail screen
- Shows full IPCR with all targets

**When to use:**
- Review faculty's complete IPCR
- Check submission status
- See all targets at once
- Navigate to rating interface

#### 2. 🔔 Send Reminder Button (Gray)
**What it does:**
- Sends notification to faculty
- Reminds them to complete pending targets

**When to use:**
- Faculty has pending targets
- Deadline is approaching
- Faculty hasn't started

---

## Updated Workflow

### Scenario: Reviewing Maica's IPCR

**Step 1: Check Compliance Tab**
```
Maica DL. Bagaporo  |  63  |  0  |  63  |  SUBMITTED  |  👁️ 🔔
```

**Step 2: Click 👁️ View IPCR**
- Opens IPCRDetail screen
- Shows all 63 targets
- Can see which targets have self-ratings
- Can navigate to rate individual targets

**Step 3: Review and Rate**
- From IPCRDetail, you can:
  - See all major functions
  - View each target
  - Rate targets individually
  - Mark targets incomplete

**Alternative: Send Reminder**
- If faculty hasn't submitted yet
- Click 🔔 to send reminder
- Faculty receives notification

---

## Visual Guide

### Compliance Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Faculty Compliance Dashboard                                            │
├──────────────────────┬───────┬───────────┬─────────┬──────────┬─────────┤
│ FACULTY NAME         │ TOTAL │ SUBMITTED │ PENDING │ STATUS   │ ACTION  │
├──────────────────────┼───────┼───────────┼─────────┼──────────┼─────────┤
│ Maica DL. Bagaporo   │  63   │     0     │   63    │SUBMITTED │ 👁️  🔔 │
│                      │       │           │         │          │ ↑   ↑  │
│                      │       │           │         │          │ │   │  │
│                      │       │           │         │          │ │   └─ Reminder
│                      │       │           │         │          │ └───── View IPCR
├──────────────────────┼───────┼───────────┼─────────┼──────────┼─────────┤
│ Ichelle Figura-B...  │   0   │     0     │    0    │NOT START │ 👁️  🔔 │
└──────────────────────┴───────┴───────────┴─────────┴──────────┴─────────┘
```

### Button Styles

**View IPCR Button (👁️):**
- Background: Accent color (blue)
- Icon: White eye icon
- Size: 14px
- Padding: 8px
- Border radius: 4px

**Reminder Button (🔔):**
- Background: Light gray (bg3)
- Icon: Accent color bell
- Size: 14px
- Padding: 8px
- Border radius: 4px

---

## Benefits

### ✅ Before Fix:
- ❌ No way to view IPCR from compliance tab
- ❌ Had to navigate elsewhere to find faculty IPCR
- ❌ Inefficient workflow

### ✅ After Fix:
- ✅ Direct access to faculty IPCR
- ✅ One-click navigation
- ✅ Efficient review workflow
- ✅ Can see full IPCR details
- ✅ Still have reminder functionality

---

## Testing Steps

### 1. Login as Secretary
```
Email: ichelle.figurabaluis@example.com
Password: password123
```

### 2. Navigate to Review Queue
Dashboard → Click "Rating Queue" card

### 3. Go to Compliance Tab
Should be the default tab (first tab)

### 4. Test View IPCR Button
- Find a faculty row (e.g., Maica DL. Bagaporo)
- Click the **blue eye icon** (👁️)
- Should navigate to IPCRDetail screen
- Should show faculty's complete IPCR

### 5. Test Reminder Button
- Click the **gray bell icon** (🔔)
- Should show "Reminder sent to [Faculty Name]"
- Faculty should receive notification

### 6. Verify Both Buttons Work
- Both buttons should be clickable
- Both should perform their respective actions
- Buttons should be side-by-side with 8px gap

---

## Expected Behavior

### View IPCR Button (👁️)
**Click:**
1. Finds faculty's IPCR by ID
2. Navigates to IPCRDetail screen
3. Shows complete IPCR with all targets

**If IPCR not found:**
- Nothing happens (graceful failure)
- Should not crash

### Reminder Button (🔔)
**Click:**
1. Sends notification to faculty
2. Shows alert: "Reminder sent to [Name]"
3. Faculty receives notification in their panel

---

## Files Modified

### 1. `src/components/SvgIcon.js`
- Added `eye` icon definition

### 2. `src/screens/ReviewQueueScreen.tsx`
- Updated ACTION column to show two buttons
- Added `viewButton` style
- Added navigation logic to IPCRDetail

---

## Summary

**Problem:** ACTION column only had reminder button  
**Solution:** Added "View IPCR" button with eye icon  
**Result:** Secretary can now directly view faculty IPCRs from compliance dashboard  

**Action Column Now Has:**
- 👁️ **View IPCR** - Navigate to full IPCR detail
- 🔔 **Send Reminder** - Notify faculty about pending targets

---

**Fixed By:** Kiro AI Assistant  
**Date:** May 8, 2026  
**Status:** ✅ COMPLETE - Action Buttons Now Functional!
