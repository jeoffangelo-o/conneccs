# Rating Requirements System (Q, E, T)

## Overview

Based on the OPCR document, **each target has specific rating requirements**. Not all targets require all three ratings (Q, E, T). The system must dynamically show only the required rating fields for each target.

## Rating Types

- **Q³ (Quality)** - How well was the target accomplished?
- **E² (Efficiency)** - How efficiently were resources used?
- **T³ (Timeliness)** - Was it completed on time?

## Rating Scale (1-5)

- **5** = Outstanding
- **4** = Very Satisfactory
- **3** = Satisfactory
- **2** = Unsatisfactory
- **1** = Poor

## Required Ratings Per Target

Each target in the OPCR has specific rating requirements indicated by "x" marks in the columns:

### Examples from OPCR:

1. **Target with Q + E + T** (all three required)
   - Example: "Submitted PPMP as required on or before..."
   - Shows: Q³ ✓, E² ✓, T³ ✓

2. **Target with Q + T only**
   - Example: "Ensured 100% submission of QO Performance Monitoring Graph..."
   - Shows: Q³ ✓, T³ ✓ (no E²)

3. **Target with Q only**
   - Example: "Submitted final Midyear report on the 10th day of July..."
   - Shows: Q³ ✓ (no E² or T³)

4. **Target with E + T only**
   - Example: Some operational targets
   - Shows: E² ✓, T³ ✓ (no Q³)

## Implementation

### 1. Data Structure

Each `IPCRTarget` has a `requiredRatings` field:

```typescript
export interface IPCRTarget {
  id: string;
  description: string;
  // ... other fields
  
  // Required ratings for this specific target
  requiredRatings?: ('Q' | 'E' | 'T')[];
  
  // Faculty self-ratings (only required ones should be filled)
  selfRatingQ?: number | null;
  selfRatingE?: number | null;
  selfRatingT?: number | null;
  
  // Secretary ratings (only required ones should be filled)
  secretaryQ?: number | null;
  secretaryE?: number | null;
  secretaryT?: number | null;
  
  // Dean ratings (only required ones should be filled)
  deanQ?: number | null;
  deanE?: number | null;
  deanT?: number | null;
}
```

### 2. Example Data

```json
{
  "id": "target-1",
  "description": "Submitted PPMP as required",
  "requiredRatings": ["Q", "E", "T"],  // All three required
  "selfRatingQ": 5,
  "selfRatingE": 4,
  "selfRatingT": 5
}

{
  "id": "target-2",
  "description": "Ensured 100% submission of QO Performance Monitoring Graph",
  "requiredRatings": ["Q", "T"],  // Only Q and T required
  "selfRatingQ": 5,
  "selfRatingT": 5
  // No selfRatingE because E is not required
}

{
  "id": "target-3",
  "description": "Submitted final Midyear report",
  "requiredRatings": ["Q"],  // Only Q required
  "selfRatingQ": 4
  // No selfRatingE or selfRatingT
}
```

### 3. UI Display Logic

**Faculty Self-Rating Screen:**
```typescript
// Show only required rating fields
const target = getTarget(targetId);
const requiredRatings = target.requiredRatings || ['Q', 'E', 'T']; // Default to all if not specified

// Display message
if (requiredRatings.length === 3) {
  message = "This target requires: Quality, Efficiency, and Timeliness";
} else if (requiredRatings.length === 2) {
  message = `This target requires: ${requiredRatings.join(' and ')}`;
} else {
  message = `This target requires: ${requiredRatings[0]}`;
}

// Show only required input fields
{requiredRatings.includes('Q') && (
  <Input label="Quality (Q)" value={selfRatingQ} />
)}

{requiredRatings.includes('E') && (
  <Input label="Efficiency (E)" value={selfRatingE} />
)}

{requiredRatings.includes('T') && (
  <Input label="Timeliness (T)" value={selfRatingT} />
)}
```

**Secretary Rating Screen:**
```typescript
// Same logic - show only required fields
const requiredRatings = target.requiredRatings || ['Q', 'E', 'T'];

// Validation: Only validate required ratings
const missingRatings = [];
if (requiredRatings.includes('Q') && !secretaryQ) missingRatings.push('Quality');
if (requiredRatings.includes('E') && !secretaryE) missingRatings.push('Efficiency');
if (requiredRatings.includes('T') && !secretaryT) missingRatings.push('Timeliness');

if (missingRatings.length > 0) {
  Alert.alert('Missing Ratings', `Please provide: ${missingRatings.join(', ')}`);
  return;
}
```

**Dean Review Screen:**
```typescript
// Same logic for Dean override
const requiredRatings = target.requiredRatings || ['Q', 'E', 'T'];

// Show only required fields in override modal
{requiredRatings.includes('Q') && (
  <Input label="Quality (Q)" value={deanQ} />
)}
// ... etc
```

### 4. Average Calculation

The average should only include the **required ratings**:

```typescript
export function calculateA4(target: IPCRTarget, ratingType: 'self' | 'secretary' | 'dean'): number {
  const requiredRatings = target.requiredRatings || ['Q', 'E', 'T'];
  const ratings: number[] = [];
  
  if (ratingType === 'self') {
    if (requiredRatings.includes('Q') && target.selfRatingQ) ratings.push(target.selfRatingQ);
    if (requiredRatings.includes('E') && target.selfRatingE) ratings.push(target.selfRatingE);
    if (requiredRatings.includes('T') && target.selfRatingT) ratings.push(target.selfRatingT);
  } else if (ratingType === 'secretary') {
    if (requiredRatings.includes('Q') && target.secretaryQ) ratings.push(target.secretaryQ);
    if (requiredRatings.includes('E') && target.secretaryE) ratings.push(target.secretaryE);
    if (requiredRatings.includes('T') && target.secretaryT) ratings.push(target.secretaryT);
  } else if (ratingType === 'dean') {
    if (requiredRatings.includes('Q') && target.deanQ) ratings.push(target.deanQ);
    if (requiredRatings.includes('E') && target.deanE) ratings.push(target.deanE);
    if (requiredRatings.includes('T') && target.deanT) ratings.push(target.deanT);
  }
  
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, r) => acc + r, 0);
  return parseFloat((sum / ratings.length).toFixed(2));
}
```

### 5. Validation Rules

1. **Required ratings must be provided:**
   - If target requires Q, E, T → all three must be filled
   - If target requires Q, T → only Q and T must be filled
   - If target requires Q only → only Q must be filled

2. **Non-required ratings should not be entered:**
   - If E is not required, the E field should not be shown or should be disabled

3. **Average calculation:**
   - Average = Sum of required ratings / Count of required ratings
   - Example: If only Q and T required, and Q=5, T=4 → Average = (5+4)/2 = 4.5

## OPCR Upload Process

When the Secretary uploads the OPCR Excel file, the system must:

1. **Parse the rating columns** (Q³, E², T³)
2. **Detect which ratings are required** for each target (look for "x" marks)
3. **Set the `requiredRatings` array** for each target:
   ```typescript
   // Example parsing logic
   if (row['Q³'] === 'x') requiredRatings.push('Q');
   if (row['E²'] === 'x') requiredRatings.push('E');
   if (row['T³'] === 'x') requiredRatings.push('T');
   ```

## Current Implementation Status

✅ **Type definitions** - `requiredRatings` field exists in `IPCRTarget`  
✅ **Validation logic** - MyIPCRScreen checks required ratings  
✅ **UI display** - Conditionally shows only required fields  
✅ **OPCR parsing** - Extracts required ratings from Excel Q³, E², T³ columns  
✅ **Average calculation** - Uses only required ratings in calculation  
✅ **Helper functions** - Added `calculateA4WithRequired`, `getRequiredRatingsDescription`, `validateRequiredRatings`

## Implementation Complete

All components have been updated to support accurate rating requirements:

1. ✅ **SecretaryOPCRUploadScreen.tsx** - Parses Q³, E², T³ columns from Excel and sets `requiredRatings`
2. ✅ **MyIPCRScreen.tsx** - Shows only required rating fields and validates accordingly
3. ✅ **calculations.ts** - New `calculateA4WithRequired()` function uses only required ratings
4. ✅ **Helper functions** - Added validation and description helpers

### How It Works Now

1. **OPCR Upload**: Secretary uploads Excel file with Q³, E², T³ columns containing 'x' marks
2. **Parsing**: System reads columns 8, 9, 10 to detect which ratings are required
3. **IPCR Generation**: Each target gets `requiredRatings` array (e.g., `['Q', 'T']`)
4. **Faculty UI**: Only shows input fields for required ratings
5. **Validation**: Only validates required ratings are provided
6. **Calculation**: Average = Sum of required ratings / Count of required ratings

### Example Scenarios

**Scenario 1: Target requires Q, E, T (all three)**
- Excel: Q³ = x, E² = x, T³ = x
- UI shows: All three input fields
- Faculty enters: Q=5, E=4, T=5
- Average: (5+4+5)/3 = 4.67

**Scenario 2: Target requires Q, T only**
- Excel: Q³ = x, E² = (empty), T³ = x
- UI shows: Only Q and T input fields (E is hidden)
- Faculty enters: Q=5, T=4
- Average: (5+4)/2 = 4.5

**Scenario 3: Target requires Q only**
- Excel: Q³ = x, E² = (empty), T³ = (empty)
- UI shows: Only Q input field (E and T are hidden)
- Faculty enters: Q=4
- Average: 4.0

## Testing Instructions

To test the rating requirements system:

1. **Prepare Test Excel File**:
   - Create an Excel file with columns: ID | KRA | Function | Indicator | Target | Weight | Period | Accountable | Q³ | E² | T³
   - Add 'x' marks in Q³, E², T³ columns to specify required ratings
   - Example rows:
     - Row 1: x in Q³, E², T³ (requires all three)
     - Row 2: x in Q³, T³ only (requires Q and T)
     - Row 3: x in Q³ only (requires Q only)

2. **Upload OPCR** (as Secretary):
   - Login as secretary (gastilo@cspc.edu.ph / secretary123)
   - Navigate to OPCR Upload screen
   - Upload the test Excel file
   - Verify extraction shows correct rating dimensions

3. **Generate IPCR** (as Faculty):
   - Login as faculty (bagaporo@cspc.edu.ph / faculty123)
   - Navigate to My IPCR screen
   - Click "Generate My IPCR" or "Refresh Targets"
   - Verify targets are created with correct `requiredRatings`

4. **Rate Targets**:
   - For each target, verify only required rating fields are shown
   - Try submitting without filling required ratings (should show error)
   - Fill in required ratings and save
   - Verify average is calculated correctly using only required ratings

5. **Verify Calculations**:
   - Target with Q=5, E=4, T=5 → Average should be 4.67
   - Target with Q=5, T=4 (no E) → Average should be 4.5
   - Target with Q=4 only → Average should be 4.0

---

**Last Updated:** May 8, 2026  
**Status:** ✅ Implementation Complete and Ready for Testing
