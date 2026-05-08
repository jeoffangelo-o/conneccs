# Secretary Rating Interface Implementation

## Summary
Successfully implemented a dedicated secretary rating interface in IPCRDetailScreen that allows secretaries to review and rate faculty targets from a clean, organized view.

## Changes Made

### 1. IPCRDetailScreen.tsx - Complete Secretary Rating Interface

#### Added Imports and Functions
- Imported `secretaryRateTarget` and `secretaryReturnTarget` from DataContext
- Added secretary rating modal state: `secretaryRatingModalVisible`, `secretaryRatingInputs`

#### New Handler Functions
- `handleOpenSecretaryRatingModal(target)` - Opens rating modal for a specific target
- `handleSecretaryRateTarget()` - Validates and submits secretary rating (Q, E, T scores)
- `handleSecretaryMarkIncomplete()` - Returns target to faculty with note

#### Modified renderTargetsTab()
The function now has **three distinct interfaces**:

**1. Secretary Rating Interface** (`isSecretary && hasSubmittedTargets`)
- Shows only targets with status 'SUBMITTED' or 'ENDORSED'
- Displays target information as **read-only TEXT** (not TextInput)
- Shows:
  - Target description (read-only text)
  - Target measures (read-only text)
  - Late submission warning (if applicable)
  - Faculty self-rating (Q, E, T, Average)
  - Accomplishments (read-only text)
  - Documents list with icons
  - **"Rate This Target" button** for each target

**2. Dean Review Interface** (`isDean && hasRatedTargets`)
- Shows targets with status 'RATED' awaiting Dean approval
- Displays:
  - Faculty self-rating
  - Secretary rating
  - Official rating (if approved)
  - Accomplishments and documents
  - Action buttons: Approve, Override, Return

**3. Default Faculty View** (all other cases)
- Shows editable TextInput fields for description/measures
- Shows RatingInput components for Q/E/T ratings
- Used during target setting and review phases

#### New Secretary Rating Modal
Complete modal implementation with:
- Faculty name and target description preview
- Faculty self-rating display
- Three numeric inputs for Q, E, T ratings (1-5 scale)
- Real-time computed average display
- Note field for marking incomplete
- Two action buttons:
  - "Mark Incomplete" - Returns to faculty with note
  - "Rate & Forward to Dean" - Submits rating and forwards
- Cancel button to close modal

#### New Styles Added
```typescript
secretaryTargetCard       // Card container for secretary view
secretaryTargetHeader     // Header with target number and status
readOnlySection          // Container for read-only fields
readOnlyLabel            // Label for read-only fields
readOnlyText             // Text display (not input)
documentsList            // Container for document list
documentItem             // Individual document row
documentName             // Document filename text
rateTargetButton         // "Rate This Target" button
rateTargetButtonText     // Button text style
modalTargetDesc          // Target description in modal
modalSelfRating          // Faculty self-rating in modal
noteInputGroup           // Note input container
noteInput                // Multiline note input
incompleteButton         // "Mark Incomplete" button
incompleteButtonText     // Button text
rateSubmitButton         // "Rate & Forward" button
rateSubmitButtonText     // Button text
modalCloseButton         // Cancel button
modalCloseButtonText     // Cancel text
badgeSUBMITTED          // Yellow badge for submitted status
badgeENDORSED           // Green badge for endorsed status
```

## User Workflow

### Secretary Rating Process
1. Secretary navigates to Review Queue screen
2. Clicks on a faculty card showing targets awaiting rating
3. Navigates to IPCRDetailScreen with that faculty's IPCR
4. Sees clean interface with:
   - Each target displayed as read-only text (no input boxes)
   - Faculty self-ratings clearly shown
   - Documents listed with icons
   - "Rate This Target" button for each target
5. Clicks "Rate This Target" button
6. Modal opens with:
   - Target preview
   - Faculty self-rating reference
   - Input fields for Q, E, T ratings
   - Real-time average calculation
   - Note field for incomplete marking
7. Secretary can either:
   - Enter Q/E/T ratings and click "Rate & Forward to Dean"
   - Enter note and click "Mark Incomplete" to return to faculty
8. Target status updates and Dean is notified

## Key Improvements

### Before
- Secretary saw read-only TextInput boxes (confusing)
- No clear way to rate targets
- No document preview
- Wrong interface shown (default view instead of rating view)

### After
- Secretary sees clean read-only TEXT displays
- Clear "Rate This Target" buttons for each target
- Document list with icons
- Dedicated rating modal with validation
- Proper separation of Secretary vs Dean interfaces
- Real-time average calculation
- Option to mark incomplete with notes

## Technical Details

### Conditional Rendering Logic
```typescript
if (isSecretary && hasSubmittedTargets) {
  // Show secretary rating interface
} else if (isDean && hasRatedTargets) {
  // Show dean review interface
} else {
  // Show default faculty view
}
```

### Target Filtering
Secretary interface only shows targets with:
- `status === 'SUBMITTED'` (direct submissions)
- `status === 'ENDORSED'` (coordinator-endorsed submissions)

### Rating Validation
- All ratings must be between 1 and 5
- All three ratings (Q, E, T) required
- Note required for marking incomplete
- Real-time average calculation using `calculateA4()` function

### Status Flow
1. Faculty submits → `status: 'SUBMITTED'`
2. Secretary rates → `status: 'RATED'` (forwarded to Dean)
3. Dean approves → `status: 'APPROVED'`
4. OR Secretary marks incomplete → `status: 'INCOMPLETE'` (returned to faculty)

## Files Modified
- `src/screens/IPCRDetailScreen.tsx` - Complete secretary rating interface implementation

## Testing Checklist
- [x] Secretary can see faculty cards in Rating Queue
- [x] Clicking faculty card navigates to IPCRDetail
- [x] Secretary sees read-only TEXT (not TextInput)
- [x] "Rate This Target" buttons visible
- [x] Rating modal opens with correct data
- [x] Q/E/T inputs accept numeric values 1-5
- [x] Average calculates in real-time
- [x] "Rate & Forward to Dean" validates and submits
- [x] "Mark Incomplete" requires note
- [x] Target status updates correctly
- [x] Dean receives notification after rating

## Next Steps (Optional Enhancements)
1. Add document preview/download functionality
2. Add file type icons (PDF, DOCX, etc.)
3. Add target history/audit trail
4. Add bulk rating capability
5. Add rating guidelines/rubric display
6. Add comparison view (self-rating vs secretary rating)
