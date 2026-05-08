# Secretary Rating Screen - Implementation Plan

**Date:** May 8, 2026  
**Status:** 🔄 IN PROGRESS - Needs Dedicated Screen

---

## Current Issues

When secretary clicks faculty card and goes to IPCRDetail:
- ❌ Shows read-only input boxes (Description, Measures)
- ❌ Can't edit/enter Q/E/T ratings
- ❌ No "Rate This Target" buttons
- ❌ Wrong interface for secretary

---

## Solution: Create Dedicated Secretary Rating Screen

Instead of reusing IPCRDetail (which is designed for viewing), create a new **SecretaryRatingScreen** specifically for rating targets.

---

## Screen Design: SecretaryRatingScreen

### Purpose:
- Show all targets for one faculty
- Allow secretary to rate each target
- Preview uploaded documents
- Mark targets incomplete if needed

### Layout:
```
┌─────────────────────────────────────────────────────────┐
│ ← Back    Secretary Rating                              │
│           Maica DL. Bagaporo • Jan-Jun 2025             │
├─────────────────────────────────────────────────────────┤
│ Progress: 5 of 63 targets rated                         │
│ [████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 8%           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ TARGET 1                                  [SUBMITTED]   │
│ KRA 1 - Core Functions                                  │
│                                                         │
│ Description:                                            │
│ 100% submission of SALN on or before January 31st...   │
│                                                         │
│ Measures:                                               │
│ SALN submitted on time                                  │
│                                                         │
│ Accomplishment:                                         │
│ hahh                                                    │
│                                                         │
│ Faculty Self-Rating: Q:4 E:4 T:5  Avg: 4.33           │
│                                                         │
│ Documents: 2 file(s)                                    │
│ [📄 document1.pdf] [📄 document2.jpg]                  │
│                                                         │
│ [⭐ Rate This Target]  [❌ Mark Incomplete]            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ TARGET 2                                  [SUBMITTED]   │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Features

### 1. Header
- Back button
- Faculty name
- IPCR period
- Progress indicator

### 2. Target Cards
Each target shows:
- **Target number** and **status badge**
- **KRA type** and **major function**
- **Description** (read-only text, not input)
- **Measures** (read-only text, not input)
- **Accomplishment** (read-only text)
- **Faculty self-rating** (display only)
- **Documents** with preview buttons
- **Action buttons**

### 3. Document Preview
- List of uploaded files
- Click to preview/download
- File type icons
- File names

### 4. Action Buttons
- **Rate This Target** - Opens rating modal
- **Mark Incomplete** - Opens note modal

### 5. Rating Modal (Reuse from ReviewQueueScreen)
- Enter Q/E/T ratings
- See computed average
- Rate & Forward to Dean
- Or Mark Incomplete with note

---

## Implementation Steps

### Step 1: Create SecretaryRatingScreen.tsx
```typescript
// New file: src/screens/SecretaryRatingScreen.tsx

export default function SecretaryRatingScreen({ navigation, route }) {
  const { ipcrId } = route.params;
  const { ipcrs, secretaryRateTarget, secretaryReturnTarget } = useData();
  
  const ipcr = ipcrs.find(i => i.id === ipcrId);
  
  // Get all targets for this IPCR
  const targets = ipcr.majorFunctions.flatMap(mf => 
    mf.targets.map(t => ({ target: t, majorFunction: mf }))
  );
  
  // Filter only SUBMITTED/ENDORSED targets
  const targetsToRate = targets.filter(t => 
    t.target.status === 'SUBMITTED' || t.target.status === 'ENDORSED'
  );
  
  return (
    // Render target cards with rating buttons
  );
}
```

### Step 2: Update Navigation in ReviewQueueScreen
```typescript
// In renderRatingTab()
onPress={() => {
  navigation.navigate('SecretaryRating', { 
    ipcrId: group.ipcr.id 
  });
}}
```

### Step 3: Register Route in App.js
```javascript
<Stack.Screen 
  name="SecretaryRating" 
  component={SecretaryRatingScreen}
  options={{ headerShown: false }}
/>
```

### Step 4: Add Document Preview
```typescript
// Component for document list
const DocumentList = ({ files }) => (
  <View style={styles.documentList}>
    {files.map((file, index) => (
      <TouchableOpacity 
        key={index}
        style={styles.documentButton}
        onPress={() => previewDocument(file)}
      >
        <SvgIcon name="document" size={16} color={colors.accent} />
        <Text style={styles.documentName}>{file}</Text>
      </TouchableOpacity>
    ))}
  </View>
);
```

### Step 5: Reuse Rating Modal
Copy the rating modal logic from ReviewQueueScreen

---

## Key Differences from IPCRDetail

### IPCRDetail (Viewing):
- Shows all tabs (Targets, Accomplishments, MOV, Rating Summary)
- Input boxes for editing (for faculty)
- Read-only for secretary
- Designed for viewing complete IPCR

### SecretaryRatingScreen (Rating):
- Single scrollable list of targets
- Read-only text display (not inputs)
- "Rate This Target" buttons
- Document preview
- Progress tracking
- Designed specifically for rating workflow

---

## Benefits

### ✅ Proper Interface
- No confusing input boxes
- Clear read-only display
- Obvious action buttons

### ✅ Better UX
- Dedicated rating workflow
- Progress tracking
- Document preview
- Focused on rating task

### ✅ Scalability
- Works with any number of targets
- Efficient scrolling
- Clear organization

### ✅ Maintainability
- Separate concerns
- IPCRDetail for viewing
- SecretaryRatingScreen for rating
- Clean code structure

---

## Alternative: Quick Fix for IPCRDetail

If creating a new screen is too much work, we can modify IPCRDetail to:

1. Detect if user is Secretary
2. Show targets with read-only TEXT (not input boxes)
3. Add "Rate This Target" buttons
4. Reuse rating modal

**Changes needed in IPCRDetail:**
```typescript
// In renderTargetsTab()
if (isSecretary && hasSubmittedTargets) {
  return (
    // Show targets as read-only text
    // Add "Rate This Target" buttons
    // Open rating modal on click
  );
}
```

---

## Recommendation

**Option 1: Create SecretaryRatingScreen** (Better)
- ✅ Clean separation of concerns
- ✅ Optimized for rating workflow
- ✅ Easier to maintain
- ❌ More work upfront

**Option 2: Modify IPCRDetail** (Faster)
- ✅ Reuses existing screen
- ✅ Less code to write
- ❌ More complex logic
- ❌ Harder to maintain

**Suggested:** Option 2 for now (quick fix), then Option 1 later (proper solution)

---

## Quick Fix Implementation

### Update IPCRDetailScreen.tsx:

```typescript
const renderTargetsTab = () => {
  // Secretary Rating Interface
  if (isSecretary && hasSubmittedTargets) {
    return (
      <YStack>
        {ipcr.majorFunctions.map((mf) => (
          <YStack key={mf.id}>
            <Text>{mf.title}</Text>
            {mf.targets
              .filter(t => t.status === 'SUBMITTED' || t.status === 'ENDORSED')
              .map((target, index) => (
                <View key={target.id} style={styles.targetCard}>
                  <Text>Target {index + 1}</Text>
                  
                  {/* Read-only text, not input */}
                  <Text style={styles.label}>Description:</Text>
                  <Text style={styles.text}>{target.description}</Text>
                  
                  <Text style={styles.label}>Measures:</Text>
                  <Text style={styles.text}>{target.measures}</Text>
                  
                  <Text style={styles.label}>Accomplishment:</Text>
                  <Text style={styles.text}>{target.actualAccomplishments}</Text>
                  
                  {/* Faculty self-rating */}
                  <Text>Faculty Self-Rating: Q:{target.selfRatingQ} E:{target.selfRatingE} T:{target.selfRatingT}</Text>
                  
                  {/* Documents */}
                  {target.movFileUrls?.map(file => (
                    <Text key={file}>📄 {file}</Text>
                  ))}
                  
                  {/* Rate button */}
                  <TouchableOpacity onPress={() => openRatingModal(target)}>
                    <Text>⭐ Rate This Target</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </YStack>
        ))}
      </YStack>
    );
  }
  
  // Dean Review Interface
  if (isDean && hasRatedTargets) {
    // ... existing Dean code
  }
  
  // Default View (Faculty)
  return (
    // ... existing default view
  );
};
```

---

## Summary

**Current Problem:**
- Secretary sees read-only input boxes
- Can't rate targets
- Wrong interface

**Solution:**
- Show targets as read-only TEXT (not inputs)
- Add "Rate This Target" buttons
- Open rating modal to enter Q/E/T
- Add document preview

**Implementation:**
- Quick fix: Modify IPCRDetail to detect Secretary
- Proper solution: Create dedicated SecretaryRatingScreen

---

**Status:** 🔄 Needs Implementation  
**Priority:** HIGH - Blocking secretary workflow  
**Estimated Time:** 2-3 hours for quick fix, 1 day for proper screen
