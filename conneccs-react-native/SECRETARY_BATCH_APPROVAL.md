# Secretary Batch Approval Workflow

## Summary
Updated the secretary rating workflow to use **batch approval** instead of sending targets one-by-one to the Dean. Secretary now approves or marks targets incomplete, then submits all approved targets to Dean in one batch.

## Changes Made

### 1. New Workflow: Approve or Mark Incomplete

**Before (Old Workflow):**
- Secretary rates target → Immediately forwards to Dean
- Each target sent individually
- Button: "Rate & Forward to Dean"

**After (New Workflow):**
- Secretary rates target → Approves it (stays in secretary queue)
- All targets rated first
- Then submit all to Dean in one batch
- Buttons: "Approve Target" or "Mark Incomplete"

### 2. Updated Modal Interface

**Modal Title:** "Approve Target" (was "Rate Target")

**Action Buttons:**
1. **"Mark Incomplete"** (Red button)
   - Returns target to faculty with note
   - Requires note explaining why incomplete
   
2. **"Approve Target"** (Green button)
   - Approves target with secretary rating
   - Target status changes to 'RATED'
   - Stays in secretary's queue until batch submission

**Note Field:** Changed from "Note (for incomplete)" to "Note (optional)"
- Optional notes for approved targets
- Required notes for incomplete targets

### 3. Batch Submission Button

**"Submit All Rated Targets to Dean"** button appears when:
- All submitted/endorsed targets have been rated
- At least one target is rated
- Secretary has finished reviewing all targets

**Button Action:**
- Shows confirmation: "This will submit X rated target(s) to the Dean for final approval"
- Updates IPCR status to 'SUBMITTED'
- Records submission timestamp
- Navigates back to queue
- Dean receives all targets at once

### 4. Updated Button Labels

**Main Interface:**
- Changed from: "⭐ Rate This Target"
- Changed to: "✓ Approve or Mark Incomplete"

## Visual Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                  SECRETARY WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

Step 1: Review Target
┌────────────────────────────────┐
│ Target 1      [SUBMITTED]      │
│ Description: ...               │
│ Documents: 2 file(s)           │
│ [✓ Approve or Mark Incomplete] │ ← Click
└────────────────────────────────┘
              │
              ▼
Step 2: Approve or Mark Incomplete
┌────────────────────────────────┐
│ Approve Target                 │
│                                │
│ Quality (Q): [5]               │
│ Efficiency (E): [5]            │
│ Timeliness (T): [5]            │
│ Computed Average: 5.00         │
│                                │
│ Note (optional): ...           │
│                                │
│ [Mark Incomplete] [Approve]    │ ← Choose action
└────────────────────────────────┘
              │
              ├─────────────────────────┐
              │                         │
         Approve                  Mark Incomplete
              │                         │
              ▼                         ▼
┌────────────────────────────┐  ┌────────────────────────────┐
│ Target status: RATED       │  │ Target status: INCOMPLETE  │
│ Stays in secretary queue   │  │ Returns to faculty         │
└────────────────────────────┘  └────────────────────────────┘
              │
              │ (Repeat for all targets)
              ▼
Step 3: All Targets Rated
┌────────────────────────────────┐
│ Target 1 [RATED] ✓             │
│ Target 2 [RATED] ✓             │
│ Target 3 [RATED] ✓             │
│                                │
│ [Submit All Rated Targets      │ ← Batch submit button appears
│  to Dean]                      │
└────────────────────────────────┘
              │
              │ Click submit
              ▼
Step 4: Batch Submission
┌────────────────────────────────┐
│ Confirm: Submit 3 rated        │
│ target(s) to Dean?             │
│                                │
│ [Cancel]  [Submit All]         │
└────────────────────────────────┘
              │
              │ Confirm
              ▼
┌────────────────────────────────┐
│ ✓ Success!                     │
│ 3 targets submitted to Dean    │
│ IPCR status: SUBMITTED         │
└────────────────────────────────┘
```

## Status Flow

### Old Flow (One-by-One)
```
Faculty → SUBMITTED
   ↓
Secretary rates → RATED (immediately to Dean)
   ↓
Dean reviews → APPROVED
```

### New Flow (Batch)
```
Faculty → SUBMITTED
   ↓
Secretary approves → RATED (stays with secretary)
   ↓
Secretary approves → RATED (stays with secretary)
   ↓
Secretary approves → RATED (stays with secretary)
   ↓
Secretary submits all → SUBMITTED (batch to Dean)
   ↓
Dean reviews all → APPROVED
```

## Benefits

### For Secretary
1. **Review All First**: Can review all targets before submitting
2. **Make Corrections**: Can go back and adjust ratings if needed
3. **Batch Processing**: More efficient workflow
4. **Quality Control**: Ensures consistency across all targets
5. **Less Pressure**: Not immediately sending to Dean

### For Dean
1. **Batch Review**: Receives all targets at once
2. **Complete Picture**: Can see all targets together
3. **Consistent Review**: Can compare targets side-by-side
4. **Less Interruptions**: Not receiving targets one-by-one
5. **Better Planning**: Knows when review is needed

### For System
1. **Better Workflow**: More logical progression
2. **Audit Trail**: Clear submission timestamp
3. **Status Tracking**: Clear when secretary is done
4. **Notifications**: Single notification to Dean instead of multiple

## Code Changes

### IPCRDetailScreen.tsx

**New Function:**
```typescript
handleSecretaryApproveTarget()
- Validates Q, E, T ratings
- Calls secretaryRateTarget()
- Sets target status to 'RATED'
- Shows success message
- Closes modal
```

**New Function:**
```typescript
handleSubmitAllToDean()
- Counts rated targets
- Shows confirmation dialog
- Updates IPCR status to 'SUBMITTED'
- Records submission timestamp
- Navigates back
```

**New Computed Value:**
```typescript
allTargetsRatedBySecretary
- Checks if all submitted/endorsed targets are now rated
- Returns true when ready to submit to Dean
- Used to show/hide batch submit button
```

**Updated Buttons:**
- Main interface: "Approve or Mark Incomplete"
- Modal: "Approve Target" (green) and "Mark Incomplete" (red)
- Batch button: "Submit All Rated Targets to Dean" (blue)

## User Instructions

### For Secretaries

**Step-by-Step Process:**

1. **Open Faculty IPCR**
   - Navigate to Rating Queue
   - Click on faculty card
   - See all targets awaiting rating

2. **Review Each Target**
   - Read description and measures
   - Check faculty self-rating
   - Preview documents
   - Click "Approve or Mark Incomplete"

3. **Enter Rating**
   - Enter Q, E, T scores (1-5)
   - Review computed average
   - Add optional notes
   - Choose action:
     - **Approve**: If target is complete and acceptable
     - **Mark Incomplete**: If target needs revision

4. **Repeat for All Targets**
   - Go through each target
   - Approve or mark incomplete
   - All targets must be reviewed

5. **Submit to Dean**
   - After all targets rated
   - "Submit All Rated Targets to Dean" button appears
   - Click button
   - Confirm submission
   - Done!

### Tips

1. **Review All Documents First**: Preview all documents before rating
2. **Be Consistent**: Apply same standards to all targets
3. **Use Notes**: Add notes for context or clarification
4. **Double-Check**: Review all ratings before submitting to Dean
5. **Mark Incomplete Early**: If target clearly needs work, mark incomplete immediately

## Comparison: Old vs New

| Aspect | Old Workflow | New Workflow |
|--------|-------------|--------------|
| **Button** | "Rate & Forward to Dean" | "Approve Target" |
| **Action** | Immediate send to Dean | Stays with secretary |
| **Batch** | No | Yes |
| **Review** | One-by-one | All together |
| **Corrections** | Can't change after send | Can adjust before submit |
| **Dean Notification** | Multiple (per target) | Single (batch) |
| **Status** | SUBMITTED → RATED | SUBMITTED → RATED → SUBMITTED |
| **Control** | Less | More |

## Testing Checklist

- [x] "Approve Target" button works
- [x] "Mark Incomplete" button works
- [x] Ratings validate (1-5 range)
- [x] Target status changes to RATED on approve
- [x] Target status changes to INCOMPLETE on mark incomplete
- [x] Batch submit button appears when all rated
- [x] Batch submit button hidden when targets pending
- [x] Confirmation dialog shows correct count
- [x] IPCR status updates to SUBMITTED
- [x] Timestamp recorded
- [x] Navigation works
- [x] Success messages display
- [x] Error handling works

## Future Enhancements

1. **Progress Indicator**: Show "3 of 5 targets rated"
2. **Bulk Actions**: Select multiple targets to approve at once
3. **Rating Templates**: Save common rating patterns
4. **Comparison View**: Compare faculty self-rating vs secretary rating
5. **Rating History**: See previous ratings for reference
6. **Undo Feature**: Undo last approval before batch submit
7. **Draft Save**: Save ratings as draft before approving
8. **Rating Guidelines**: Built-in rubric or criteria display

## Files Modified

- `src/screens/IPCRDetailScreen.tsx` - Updated secretary workflow to batch approval

## Notes

- Secretary can still mark targets incomplete at any time
- Incomplete targets are returned to faculty immediately (not batched)
- Only approved (RATED) targets are batched for Dean submission
- Dean still reviews targets individually but receives them all at once
- IPCR status changes to SUBMITTED only after secretary batch submission
