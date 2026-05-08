# New Rating Workflow - Faculty Cards → Dedicated Rating Page

**Date:** May 8, 2026  
**Status:** ✅ IMPROVED - Better UX Design

---

## New Design

Instead of showing all targets in the Rating Queue, show only **faculty cards**. When clicked, navigate to a dedicated page where secretary can rate all targets.

---

## Rating Queue Tab (New Design)

### Shows: Faculty Cards Only

```
┌─────────────────────────────────────────────────────────┐
│ Rating Queue (63)                                       │
├─────────────────────────────────────────────────────────┤
│ Faculty Awaiting Rating                                 │
│ Click on a faculty member to review and rate targets    │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ 👤 Maica DL. Bagaporo          Jan-Jun 2025    →  │  │
│ ├───────────────────────────────────────────────────┤  │
│ │  63          │    61         │      2            │  │
│ │ Targets      │ With Docs     │ Late Submissions  │  │
│ ├───────────────────────────────────────────────────┤  │
│ │ ⭐ Click to review and rate targets               │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ 👤 John Doe                    Jan-Jun 2025    →  │  │
│ ├───────────────────────────────────────────────────┤  │
│ │  45          │    40         │      3            │  │
│ │ Targets      │ With Docs     │ Late Submissions  │  │
│ ├───────────────────────────────────────────────────┤  │
│ │ ⭐ Click to review and rate targets               │  │
│ └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Faculty Rating Card Features

### 1. Faculty Header
- **Avatar**: Circular icon with user symbol
- **Name**: Faculty name in bold
- **Period**: IPCR period (Jan-Jun 2025)
- **Arrow**: Indicates clickable

### 2. Statistics Row
Three key metrics:
- **Targets to Rate**: Total number of targets
- **With Documents**: Targets that have uploaded files
- **Late Submissions**: Targets submitted after deadline

### 3. Action Hint
- Star icon + "Click to review and rate targets"
- Clear call-to-action

---

## Navigation Flow

```
1. Secretary opens Review Queue
   ↓
2. Clicks "Rating Queue" tab
   ↓
3. Sees list of faculty cards
   ↓
4. Clicks on a faculty card
   ↓
5. Navigates to IPCRDetail screen
   (with mode='secretary_rating')
   ↓
6. Sees all targets for that faculty
   ↓
7. Can rate each target
   ↓
8. Can preview documents
   ↓
9. Can approve or mark incomplete
```

---

## IPCRDetail Screen (Secretary Mode)

The IPCRDetail screen needs to show secretary rating interface when navigated from Rating Queue.

### Features Needed:

**1. Target List View**
- Show all targets for the faculty
- Group by major function
- Show target details

**2. Rating Interface**
- Input fields for Q/E/T ratings
- Computed average display
- Faculty self-rating comparison

**3. Document Preview**
- List of uploaded documents
- Click to preview/download
- File type indicators

**4. Actions Per Target**
- **Rate & Forward to Dean** button
- **Mark Incomplete** button
- **Add Note** field

**5. Bulk Actions**
- **Rate All** button (if all have same rating)
- **Approve All** button
- Progress indicator

---

## Benefits of New Design

### ✅ Cleaner Interface
- Rating Queue shows only faculty
- Not cluttered with all targets
- Easy to scan

### ✅ Better Organization
- One faculty at a time
- Focused rating session
- Less overwhelming

### ✅ Scalability
- Works with 1 or 100 faculty
- Doesn't slow down with many targets
- Maintains performance

### ✅ Better UX
- Clear navigation
- Dedicated rating page
- Document preview capability

---

## Implementation Status

### ✅ Completed:
1. Rating Queue now shows faculty cards
2. Faculty cards show statistics
3. Navigation to IPCRDetail configured
4. Styling added for faculty cards

### 🔄 Next Steps:
1. Update IPCRDetail to detect secretary_rating mode
2. Show secretary rating interface in IPCRDetail
3. Add document preview functionality
4. Add bulk rating actions
5. Test complete workflow

---

## Current Code Changes

### File: `src/screens/ReviewQueueScreen.tsx`

**renderRatingTab() function:**
- Groups targets by faculty
- Shows faculty cards instead of target list
- Each card shows:
  - Faculty avatar and name
  - Target count
  - Document count
  - Late submission count
  - Click action

**Navigation:**
```typescript
onPress={() => {
  navigation.navigate('IPCRDetail', { 
    id: group.ipcr.id,
    mode: 'secretary_rating' 
  });
}}
```

---

## Testing Steps

### 1. Click Fix Button
- Login as Secretary
- Go to Review Queue → Compliance tab
- Click "Fix Target Statuses" button
- Targets should now appear

### 2. Check Rating Queue
- Click "Rating Queue" tab
- Should see faculty cards (not individual targets)
- Should see Maica DL. Bagaporo card with stats

### 3. Click Faculty Card
- Click on Maica's card
- Should navigate to IPCRDetail screen
- Should show all 63 targets
- Should have rating interface

### 4. Rate Targets
- Enter Q/E/T ratings for each target
- Preview documents
- Rate & Forward to Dean
- Or Mark Incomplete

---

## Visual Comparison

### Old Design (All Targets):
```
Rating Queue (63)

Target 1 - Maica
Target 2 - Maica
Target 3 - Maica
... (60 more)
Target 1 - John
Target 2 - John
... (messy and long)
```

### New Design (Faculty Cards):
```
Rating Queue (2 faculty, 108 targets)

[Maica DL. Bagaporo - 63 targets] →
[John Doe - 45 targets] →

(Clean and organized!)
```

---

## Summary

**Old Way:**
- ❌ All targets shown in Rating Queue
- ❌ Long scrolling list
- ❌ Confusing with multiple faculty
- ❌ No document preview

**New Way:**
- ✅ Only faculty cards in Rating Queue
- ✅ Click to open dedicated rating page
- ✅ Clean and organized
- ✅ Better for document preview
- ✅ Scalable design

---

**Redesigned By:** Kiro AI Assistant  
**Date:** May 8, 2026  
**Status:** ✅ Rating Queue Updated - IPCRDetail Enhancement Needed
