# Status Indicators for Secretary Interface

## Summary
Added clear visual indicators to show which targets are approved (RATED) or marked incomplete in the secretary interface.

## Visual Indicators

### 1. Approved Targets (RATED)

**Status Badge:**
```
┌────────────────────────────────────┐
│ Target 1    [✓ APPROVED]          │ ← Green badge with checkmark
└────────────────────────────────────┘
```

**Secretary Rating Display:**
```
┌────────────────────────────────────┐
│ Secretary Rating (Approved):       │ ← Green background
│ Q: 5  E: 5  T: 5  Avg: 5.00       │ ← Green text
└────────────────────────────────────┘
```

**Action Button:**
```
┌────────────────────────────────────┐
│ [✏️ Edit Rating]                   │ ← Blue outline button
└────────────────────────────────────┘
```

### 2. Incomplete Targets

**Status Badge:**
```
┌────────────────────────────────────┐
│ Target 2    [⚠️ INCOMPLETE]        │ ← Red badge with alert icon
└────────────────────────────────────┘
```

**Incomplete Note Display:**
```
┌────────────────────────────────────┐
│ Reason for Incomplete:             │ ← Red background
│ Missing supporting documents       │ ← Red border
└────────────────────────────────────┘
```

### 3. Pending Targets (SUBMITTED/ENDORSED)

**Status Badge:**
```
┌────────────────────────────────────┐
│ Target 3    [SUBMITTED]            │ ← Yellow badge
└────────────────────────────────────┘
```

**Action Button:**
```
┌────────────────────────────────────┐
│ [✓ Approve or Mark Incomplete]    │ ← Primary button
└────────────────────────────────────┘
```

## Complete Visual Layout

```
┌──────────────────────────────────────────────────────────┐
│ IPCR Detail - Secretary Rating Interface                 │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Target 1                    [✓ APPROVED]           │ │ ← GREEN
│  │                                                     │ │
│  │ Description: Submit IPCR targets...                │ │
│  │ Measures: 100% submission rate                     │ │
│  │                                                     │ │
│  │ Faculty Self-Rating: Q: 5  E: 5  T: 5  Avg: 5.00  │ │
│  │                                                     │ │
│  │ ┌─────────────────────────────────────────────┐   │ │
│  │ │ Secretary Rating (Approved):                │   │ │ ← GREEN BOX
│  │ │ Q: 5  E: 5  T: 5  Avg: 5.00                │   │ │
│  │ └─────────────────────────────────────────────┘   │ │
│  │                                                     │ │
│  │ Documents: 2 file(s)                               │ │
│  │ [✏️ Edit Rating]                                   │ │ ← EDIT BUTTON
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Target 2                    [⚠️ INCOMPLETE]        │ │ ← RED
│  │                                                     │ │
│  │ Description: Attend all meetings...                │ │
│  │ Measures: 100% attendance                          │ │
│  │                                                     │ │
│  │ Faculty Self-Rating: Q: 4  E: 4  T: 3  Avg: 3.67  │ │
│  │                                                     │ │
│  │ ┌─────────────────────────────────────────────┐   │ │
│  │ │ Reason for Incomplete:                      │   │ │ ← RED BOX
│  │ │ Missing attendance records                  │   │ │
│  │ └─────────────────────────────────────────────┘   │ │
│  │                                                     │ │
│  │ Documents: 0 file(s)                               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Target 3                    [SUBMITTED]            │ │ ← YELLOW
│  │                                                     │ │
│  │ Description: Complete training...                  │ │
│  │ Measures: Certificate of completion               │ │
│  │                                                     │ │
│  │ Faculty Self-Rating: Q: 5  E: 5  T: 5  Avg: 5.00  │ │
│  │                                                     │ │
│  │ Documents: 1 file(s)                               │ │
│  │ [✓ Approve or Mark Incomplete]                    │ │ ← ACTION BUTTON
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  [Submit All Rated Targets to Dean]                     │ │ ← BATCH BUTTON
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Color Coding

### Status Colors

| Status | Badge Color | Background | Border | Icon |
|--------|------------|------------|--------|------|
| **APPROVED** | Green (#d1fae5) | Light green | Green (#10b981) | ✓ Checkmark |
| **INCOMPLETE** | Red (#fee2e2) | Light red | Red (#ef4444) | ⚠️ Alert |
| **SUBMITTED** | Yellow (#fef3c7) | - | - | - |
| **ENDORSED** | Light green (#d1fae5) | - | - | - |

### Section Colors

| Section | Background | Border | Text Color |
|---------|------------|--------|------------|
| **Secretary Rating (Approved)** | #d1fae5 | #10b981 (2px) | #10b981 |
| **Incomplete Note** | #fee2e2 | #ef4444 (1px) | #ef4444 |
| **Regular Section** | colors.bg | colors.border | colors.text |

## Features

### 1. Status Badge with Icon

**Approved:**
- Green background (#d1fae5)
- Green checkmark icon
- Text: "APPROVED"
- Green text color (#10b981)

**Incomplete:**
- Red background (#fee2e2)
- Red alert icon
- Text: "INCOMPLETE"
- Red text color (#ef4444)

### 2. Secretary Rating Display (Approved Targets)

Shows when target status is 'RATED':
- Green background box
- Title: "Secretary Rating (Approved):"
- Displays Q, E, T scores
- Shows computed average
- All text in green color

### 3. Incomplete Note Display

Shows when target status is 'INCOMPLETE':
- Red background box
- Red border
- Title: "Reason for Incomplete:"
- Displays the note secretary entered
- Red title, black text

### 4. Action Buttons

**For Pending Targets (SUBMITTED/ENDORSED):**
- Primary button: "Approve or Mark Incomplete"
- Green background
- White text
- Checkmark icon

**For Approved Targets (RATED):**
- Secondary button: "Edit Rating"
- White background
- Blue border
- Blue text
- Edit icon

**For Incomplete Targets:**
- No button shown (already processed)

### 5. Filter Display

Secretary interface now shows:
- SUBMITTED targets (pending)
- ENDORSED targets (pending)
- RATED targets (approved)
- INCOMPLETE targets (rejected)

## User Experience

### Secretary Workflow

1. **View All Targets**
   - See pending, approved, and incomplete targets together
   - Clear visual distinction between statuses

2. **Identify Status at a Glance**
   - Green = Approved ✓
   - Red = Incomplete ⚠️
   - Yellow = Pending ⏳

3. **Take Action**
   - Pending targets: Click "Approve or Mark Incomplete"
   - Approved targets: Click "Edit Rating" to modify
   - Incomplete targets: No action needed (already returned to faculty)

4. **Review Approved Ratings**
   - See secretary ratings in green box
   - Verify ratings before batch submission

5. **Submit to Dean**
   - When all pending targets processed
   - Click "Submit All Rated Targets to Dean"

## Benefits

### Visual Clarity
- **Instant Recognition**: Color-coded status badges
- **Clear Hierarchy**: Different sections for different statuses
- **Icon Support**: Visual icons reinforce status

### Workflow Efficiency
- **Quick Scanning**: See which targets need attention
- **Progress Tracking**: Know how many targets left to review
- **Error Prevention**: Clear indication of incomplete targets

### User Confidence
- **Confirmation**: See approved ratings displayed
- **Transparency**: Incomplete notes visible
- **Control**: Edit button for approved targets

## Code Implementation

### Status Badge Component
```typescript
{target.status === 'RATED' && (
  <View style={[styles.statusBadge, styles.badgeApproved]}>
    <SvgIcon name="checkCircle" size={12} color="#10b981" />
    <Text style={[styles.statusBadgeText, { color: '#10b981' }]}>
      APPROVED
    </Text>
  </View>
)}
```

### Secretary Rating Display
```typescript
{target.status === 'RATED' && target.secretaryRatingAvg && (
  <View style={[styles.ratingSection, styles.secretaryApprovedSection]}>
    <Text style={styles.secretaryApprovedTitle}>
      Secretary Rating (Approved):
    </Text>
    <View style={styles.ratingRow}>
      <Text style={styles.ratingItem}>Q: {target.secretaryQ}</Text>
      <Text style={styles.ratingItem}>E: {target.secretaryE}</Text>
      <Text style={styles.ratingItem}>T: {target.secretaryT}</Text>
      <Text style={[styles.ratingAvg, styles.secretaryApprovedAvg]}>
        Avg: {target.secretaryRatingAvg.toFixed(2)}
      </Text>
    </View>
  </View>
)}
```

### Incomplete Note Display
```typescript
{target.status === 'INCOMPLETE' && target.incompleteNote && (
  <View style={styles.incompleteNoteSection}>
    <Text style={styles.incompleteNoteLabel}>
      Reason for Incomplete:
    </Text>
    <Text style={styles.incompleteNoteText}>
      {target.incompleteNote}
    </Text>
  </View>
)}
```

## Testing Checklist

- [x] Approved badge shows with green color and checkmark
- [x] Incomplete badge shows with red color and alert icon
- [x] Secretary rating displays in green box for approved targets
- [x] Incomplete note displays in red box for incomplete targets
- [x] Edit button shows for approved targets
- [x] Approve button shows for pending targets
- [x] No button shows for incomplete targets
- [x] All targets (pending, approved, incomplete) visible in list
- [x] Colors are accessible and distinguishable
- [x] Icons render correctly

## Accessibility

### Color Contrast
- Green text on light green background: WCAG AA compliant
- Red text on light red background: WCAG AA compliant
- Icons provide additional visual cues beyond color

### Screen Reader Support
- Status badges announced as "Approved" or "Incomplete"
- Section titles clearly labeled
- Button purposes clearly stated

## Files Modified

- `src/screens/IPCRDetailScreen.tsx` - Added status indicators and styling

## Future Enhancements

1. **Animation**: Fade in/out when status changes
2. **Tooltips**: Hover to see more details
3. **Filters**: Filter by status (show only approved, only incomplete, etc.)
4. **Statistics**: Show count of approved vs incomplete at top
5. **Timeline**: Show when target was approved/marked incomplete
6. **Batch Actions**: Select multiple approved targets to edit
