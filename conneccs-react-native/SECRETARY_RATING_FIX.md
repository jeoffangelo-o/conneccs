# Secretary Rating Fix - Proper Rating Workflow

**Date:** May 8, 2026  
**Status:** ✅ FIXED - Secretary Can Now Rate Targets

---

## Problem

When secretary clicked the "View IPCR" button in the Compliance tab, they were taken to the **IPCRDetail screen** which showed:
- ❌ Read-only text inputs (Description, Measures)
- ❌ Disabled rating fields (Q/E/T)
- ❌ No way to provide secretary ratings
- ❌ No approve/rate buttons

**Why This Happened:**
The IPCRDetail screen has two views:
1. **Dean View** - Shows rating/approval interface (only for Dean role)
2. **Default View** - Shows read-only fields (for Faculty/Secretary)

Secretary was getting the Default View, which doesn't allow rating.

---

## Solution

Changed the "View IPCR" button to **switch to the Rating Queue tab** instead of navigating to IPCRDetail screen.

**Before:**
```
Compliance Tab → Click "View IPCR" → Navigate to IPCRDetail (read-only)
```

**After:**
```
Compliance Tab → Click "Rate Targets" → Switch to Rating Queue tab (can rate)
```

---

## What Changed

### File: `src/screens/ReviewQueueScreen.tsx`

**Before:**
```typescript
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
```

**After:**
```typescript
<TouchableOpacity
  style={styles.viewButton}
  onPress={() => {
    // Navigate to Rating Queue tab to rate targets
    setActiveTab('rating');
  }}
>
  <SvgIcon name="star" size={14} color="#fff" style={{}} />
</TouchableOpacity>
```

**Changes:**
1. ✅ Changed action from `navigation.navigate()` to `setActiveTab('rating')`
2. ✅ Changed icon from `eye` to `star` (more intuitive for rating)
3. ✅ Added comment explaining the purpose

---

## How It Works Now

### Compliance Tab - Action Buttons

**Two Buttons:**

#### 1. ⭐ Rate Targets Button (Blue/Accent Color)
**What it does:**
- Switches to "Rating Queue" tab
- Shows targets ready for rating
- Can click "Rate This Target" on each target

**When to use:**
- Faculty has submitted targets
- Ready to provide Q/E/T ratings
- Want to rate multiple targets

#### 2. 🔔 Send Reminder Button (Gray)
**What it does:**
- Sends notification to faculty
- Reminds them to complete pending targets

**When to use:**
- Faculty has pending targets
- Deadline approaching
- Need to follow up

---

## Updated Workflow

### Scenario: Rating Maica's Targets

**Step 1: Check Compliance Tab**
```
┌──────────────────────┬───────┬───────────┬─────────┬──────────┬──────────┐
│ Faculty Name         │ Total │ Submitted │ Pending │ Status   │ Action   │
├──────────────────────┼───────┼───────────┼─────────┼──────────┼──────────┤
│ Maica DL. Bagaporo   │  63   │    63     │    0    │SUBMITTED │  ⭐  🔔  │
└──────────────────────┴───────┴───────────┴─────────┴──────────┴──────────┘
```

**Step 2: Click ⭐ Rate Targets**
- Automatically switches to "Rating Queue" tab
- Shows all 63 targets ready for rating

**Step 3: Rate Each Target**
```
┌─────────────────────────────────────────────────────────┐
│ Maica DL. Bagaporo                        [SUBMITTED]   │
│ KRA 1 - Core Functions                                  │
├─────────────────────────────────────────────────────────┤
│ Target: "Conduct research on educational technology..." │
│                                                         │
│ Accomplishment:                                         │
│ "Completed 3 research papers, presented at..."         │
│                                                         │
│ Faculty Self-Rating: Q:5 E:4 T:5  Avg: 4.67           │
│ Documents: 3 file(s)                                    │
│                                                         │
│ [⭐ Rate This Target]                                   │
└─────────────────────────────────────────────────────────┘
```

**Step 4: Click "Rate This Target"**
- Opens rating modal
- Enter Q/E/T ratings (1-5)
- Click "Rate & Forward to Dean"

**Step 5: Repeat for All Targets**
- Rate all 63 targets
- Each rated target goes to Dean's queue

---

## Secretary Rating Process

### From Compliance Tab:

**1. Click ⭐ Rate Targets**
→ Switches to Rating Queue tab

**2. See All Submitted Targets**
→ Shows targets with self-ratings

**3. Click "Rate This Target"**
→ Opens rating modal

**4. Enter Ratings**
```
Quality (Q):     [5]  ← 1-5
Efficiency (E):  [4]  ← 1-5
Timeliness (T):  [5]  ← 1-5

Computed Average: 4.67
```

**5. Choose Action**
- **Rate & Forward to Dean** → Sends to Dean for approval
- **Mark Incomplete** → Returns to faculty with note

---

## Why This Is Better

### ❌ Old Way (IPCRDetail):
- Showed read-only inputs
- No rating capability
- Confusing interface
- Had to navigate back
- Couldn't rate targets

### ✅ New Way (Rating Queue Tab):
- Shows targets ready to rate
- Full rating interface
- Clear workflow
- Stay in same screen
- Can rate all targets

---

## Visual Guide

### Compliance Tab Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Faculty Compliance Dashboard                                            │
├──────────────────────┬───────┬───────────┬─────────┬──────────┬─────────┤
│ FACULTY NAME         │ TOTAL │ SUBMITTED │ PENDING │ STATUS   │ ACTION  │
├──────────────────────┼───────┼───────────┼─────────┼──────────┼─────────┤
│ Maica DL. Bagaporo   │  63   │    63     │    0    │SUBMITTED │  ⭐ 🔔 │
│                      │       │           │         │          │  ↑  ↑  │
│                      │       │           │         │          │  │  │  │
│                      │       │           │         │          │  │  └─ Reminder
│                      │       │           │         │          │  └──── Rate Targets
│                      │       │           │         │          │         (switches to
│                      │       │           │         │          │          Rating Queue)
└──────────────────────┴───────┴───────────┴─────────┴──────────┴─────────┘
```

### Tab Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│ [Compliance (25)] [Rating Queue (63)] [Returned (0)]       │
│      ↑                    ↑                                 │
│      │                    │                                 │
│      │                    └─ Click ⭐ switches here         │
│      │                                                      │
│      └─ Start here to see overview                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing Steps

### 1. Login as Secretary
```
Email: ichelle.figurabaluis@example.com
Password: password123
```

### 2. Navigate to Review Queue
Dashboard → Click "Rating Queue" card

### 3. Check Compliance Tab
- Should see faculty list
- Should see ⭐ and 🔔 buttons in ACTION column

### 4. Test Rate Targets Button
- Find Maica DL. Bagaporo row
- Click **⭐ star icon** (blue button)
- Should switch to "Rating Queue" tab
- Should see targets ready for rating

### 5. Rate a Target
- Click "Rate This Target" on any target
- Enter Q/E/T ratings
- Click "Rate & Forward to Dean"
- Target should be rated successfully

### 6. Verify Tab Switch
- Go back to Compliance tab
- Click ⭐ again
- Should switch to Rating Queue tab again

---

## Expected Behavior

### Rate Targets Button (⭐)
**Click:**
1. Switches to "Rating Queue" tab
2. Shows all targets ready for rating
3. Can rate targets using modal

**Visual Feedback:**
- Tab changes to "Rating Queue"
- Targets appear in list
- Can see "Rate This Target" buttons

### Reminder Button (🔔)
**Click:**
1. Sends notification to faculty
2. Shows alert: "Reminder sent to [Name]"
3. Faculty receives notification

---

## Button Design

**Rate Targets Button (⭐):**
- Background: Accent color (blue)
- Icon: White star icon
- Size: 14px
- Padding: 8px
- Border radius: 4px
- Action: Switch to Rating Queue tab

**Reminder Button (🔔):**
- Background: Light gray (bg3)
- Icon: Accent color bell
- Size: 14px
- Padding: 8px
- Border radius: 4px
- Action: Send notification

---

## Complete Rating Workflow

```
1. Secretary logs in
   ↓
2. Goes to Review Queue
   ↓
3. Checks Compliance Tab
   ├─ Sees who submitted
   ├─ Sees submission counts
   └─ Sees status
   ↓
4. Clicks ⭐ Rate Targets
   ↓
5. Switches to Rating Queue Tab
   ├─ Sees all submitted targets
   ├─ Reviews accomplishments
   └─ Checks documents
   ↓
6. Clicks "Rate This Target"
   ↓
7. Enters Q/E/T ratings
   ↓
8. Clicks "Rate & Forward to Dean"
   ↓
9. Target goes to Dean's queue
   ↓
10. Repeat for all targets
```

---

## Key Differences

### IPCRDetail Screen (Old Way):
- **Purpose:** View complete IPCR details
- **For:** Dean approval workflow
- **Secretary View:** Read-only, no rating capability
- **Use Case:** Final review, not rating

### Rating Queue Tab (New Way):
- **Purpose:** Rate submitted targets
- **For:** Secretary rating workflow
- **Secretary View:** Full rating interface
- **Use Case:** Provide Q/E/T ratings

---

## Summary

**Problem:** Secretary couldn't rate targets from Compliance tab  
**Root Cause:** "View IPCR" button navigated to read-only IPCRDetail screen  
**Solution:** Changed button to switch to Rating Queue tab  
**Result:** Secretary can now rate targets properly  

**Action Button Now:**
- ⭐ **Rate Targets** - Switch to Rating Queue tab (can rate)
- 🔔 **Send Reminder** - Notify faculty about pending targets

---

**Fixed By:** Kiro AI Assistant  
**Date:** May 8, 2026  
**Status:** ✅ COMPLETE - Secretary Can Now Rate Targets!
