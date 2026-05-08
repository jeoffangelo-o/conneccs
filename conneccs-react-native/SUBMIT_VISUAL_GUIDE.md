# Visual Guide - How to Know IPCR is Submitted

## Before Submission

### My IPCR Screen
```
┌─────────────────────────────────────────────┐
│ Maica DL. Bagaporo                          │
│ Jan-Dec 2026                                │
│ [IN PROGRESS] ← Yellow badge                │
│                                             │
│ Completion Progress                         │
│ 63/63 targets                               │
│ [████████████████████] 100%                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ [Submit IPCR for Review] ← Blue button      │
└─────────────────────────────────────────────┘
```

## Submission Process

### Step 1: Click "Submit IPCR for Review"
- Browser shows confirmation dialog:
  ```
  Are you sure you want to submit your IPCR for review?
  [Cancel] [OK]
  ```

### Step 2: Click "OK"
- Console shows:
  ```
  Submitting IPCR...
  Updated IPCR: {status: "SUBMITTED", ...}
  IPCR submitted successfully!
  ```
- Browser shows success alert:
  ```
  Success! Your IPCR has been submitted for review. 
  Status updated to SUBMITTED.
  [OK]
  ```

### Step 3: Click "OK" on success alert
- Screen automatically updates

## After Submission

### My IPCR Screen
```
┌─────────────────────────────────────────────┐
│ Maica DL. Bagaporo                          │
│ Jan-Dec 2026                                │
│ [SUBMITTED] ← Blue badge (changed!)         │
│                                             │
│ Completion Progress                         │
│ 63/63 targets                               │
│ [████████████████████] 100%                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ✓ IPCR Submitted Successfully!              │
│                                             │
│ Your IPCR has been submitted for review.    │
│ You will be notified once it has been       │
│ reviewed by the secretary.                  │
│                                             │
│ Submitted on: 5/8/2026, 10:30:45 AM        │
└─────────────────────────────────────────────┘
```

## Visual Indicators

### 1. Status Badge
**Before:** Yellow "IN PROGRESS"  
**After:** Blue "SUBMITTED"

### 2. Submit Button
**Before:** Visible blue button  
**After:** Hidden (replaced with success message)

### 3. Success Card
**Before:** Not visible  
**After:** Blue card with checkmark icon and submission details

### 4. Console Logs
**Before:** No logs  
**After:** 
```
=== SUBMIT IPCR DEBUG ===
All targets rated? true
Submitting IPCR...
Updated IPCR: {status: "SUBMITTED", overallStatus: "SUBMITTED", ...}
IPCR submitted successfully!
```

## How to Verify Submission

### Method 1: Visual Check
1. Look for **blue "SUBMITTED" badge** at top
2. Check if **submit button is gone**
3. See **blue success card** with timestamp

### Method 2: Console Check
1. Open browser console (F12)
2. Look for "IPCR submitted successfully!"
3. Check Updated IPCR object has `status: "SUBMITTED"`

### Method 3: LocalStorage Check
1. Open browser console (F12)
2. Go to Application tab → Local Storage
3. Find `ipcrs` key
4. Look for your IPCR
5. Check `status` and `overallStatus` fields = "SUBMITTED"
6. Check `submittedAt` field has a timestamp

### Method 4: Refresh Test
1. Refresh the page (F5)
2. Navigate to My IPCR
3. Status should still show "SUBMITTED"
4. Success card should still be visible
5. Submit button should still be hidden

## Troubleshooting

### Issue: No confirmation dialog appears
**Solution:** Check console for errors, hard refresh (Ctrl+Shift+R)

### Issue: Confirmation appears but nothing happens after clicking OK
**Check:**
1. Console for "Submitting IPCR..." message
2. Console for any errors (red text)
3. Browser popup blocker (may block alert)

### Issue: Success alert doesn't appear
**Workaround:** Check console logs and visual indicators instead

### Issue: Status doesn't change
**Check:**
1. Console shows "Updated IPCR" with status: "SUBMITTED"
2. Hard refresh the page
3. Check localStorage (see Method 3 above)

### Issue: After refresh, status goes back to IN_PROGRESS
**Problem:** Data not saving to localStorage  
**Solution:** Check console for updateIPCR errors

## Expected Timeline

1. **Click Submit** → Immediate
2. **Confirmation Dialog** → Immediate
3. **Click OK** → Immediate
4. **Status Update** → Immediate (< 1 second)
5. **Success Alert** → Immediate
6. **Visual Changes** → Immediate after closing alert

## What Happens Next

After submission:
1. **Secretary** will see your IPCR in their review queue
2. **You** will receive a notification when secretary reviews it
3. **Status** will change to "RATED" after secretary rates
4. **Dean** will then review and approve

## Quick Reference

| Indicator | Before Submit | After Submit |
|-----------|--------------|--------------|
| Status Badge | Yellow "IN PROGRESS" | Blue "SUBMITTED" |
| Submit Button | Visible | Hidden |
| Success Card | Hidden | Visible |
| Timestamp | None | Shows submission date/time |
| Console | No submit logs | "IPCR submitted successfully!" |

---

**Created:** May 8, 2026  
**Purpose:** Visual guide for IPCR submission verification
