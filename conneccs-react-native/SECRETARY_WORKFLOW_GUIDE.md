# Secretary Rating Workflow Guide

## Visual Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                     REVIEW QUEUE SCREEN                          │
│  (Secretary sees faculty cards in "Rating Queue" tab)           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Click faculty card
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    IPCR DETAIL SCREEN                            │
│  (Secretary Rating Interface - Clean View)                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Target 1                                    [SUBMITTED]  │   │
│  │                                                           │   │
│  │ Description: (read-only text, not input box)            │   │
│  │ Submit IPCR targets on or before the deadline...        │   │
│  │                                                           │   │
│  │ Measures: (read-only text)                              │   │
│  │ 100% submission rate                                     │   │
│  │                                                           │   │
│  │ Faculty Self-Rating:                                     │   │
│  │ Q: 5  E: 5  T: 5  Avg: 5.00                            │   │
│  │                                                           │   │
│  │ Accomplishment:                                          │   │
│  │ All targets submitted on time...                        │   │
│  │                                                           │   │
│  │ Documents: 2 file(s)                                     │   │
│  │ 📄 evidence1.pdf                                         │   │
│  │ 📄 evidence2.docx                                        │   │
│  │                                                           │   │
│  │ [⭐ Rate This Target]                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Target 2                                    [SUBMITTED]  │   │
│  │ ...                                                       │   │
│  │ [⭐ Rate This Target]                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Click "Rate This Target"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RATING MODAL                                │
│                                                                   │
│  Rate Target                                                     │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Juan Dela Cruz                                           │   │
│  │ Submit IPCR targets on or before the deadline...        │   │
│  │ Faculty Self-Rating: 5.00                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Quality (Q): 1-5        Efficiency (E): 1-5    Timeliness (T)  │
│  ┌─────┐                ┌─────┐                 ┌─────┐        │
│  │  5  │                │  5  │                 │  5  │        │
│  └─────┘                └─────┘                 └─────┘        │
│                                                                   │
│  Computed Average: 5.00                                          │
│                                                                   │
│  Note (for incomplete):                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Reason for marking incomplete...                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Mark Incomplete]  [Rate & Forward to Dean]                    │
│                                                                   │
│  [Cancel]                                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Click "Rate & Forward to Dean"
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Success: Target rated successfully and forwarded to Dean     │
│                                                                   │
│  • Target status: SUBMITTED → RATED                              │
│  • Secretary ratings saved (Q, E, T, Average)                    │
│  • Dean receives notification                                    │
│  • Target appears in Dean's approval queue                       │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Clean Read-Only Display
- **Before**: TextInput boxes (confusing, looked editable)
- **After**: Plain text display (clear, obviously read-only)

### 2. Clear Action Buttons
- **Before**: No clear way to rate
- **After**: "Rate This Target" button for each target

### 3. Document Preview
- **Before**: Just count of files
- **After**: List with icons showing each document

### 4. Rating Modal
- **Before**: No rating interface
- **After**: Complete modal with:
  - Target preview
  - Faculty self-rating reference
  - Q/E/T input fields
  - Real-time average calculation
  - Option to mark incomplete
  - Clear action buttons

## Interface Comparison

### Secretary View (NEW)
```
┌─────────────────────────────────────┐
│ Description:                         │
│ Submit IPCR targets...              │  ← Plain text (read-only)
│                                      │
│ Measures:                            │
│ 100% submission rate                │  ← Plain text (read-only)
│                                      │
│ Faculty Self-Rating:                 │
│ Q: 5  E: 5  T: 5  Avg: 5.00        │  ← Display only
│                                      │
│ [⭐ Rate This Target]               │  ← Action button
└─────────────────────────────────────┘
```

### Dean View (Existing)
```
┌─────────────────────────────────────┐
│ Target 1                [RATED]     │
│                                      │
│ Faculty Self-Rating:                 │
│ Q: 5  E: 5  T: 5  Avg: 5.00        │
│                                      │
│ Secretary Rating:                    │
│ Q: 5  E: 5  T: 5  Avg: 5.00        │  ← Shows secretary's rating
│                                      │
│ [✓ Approve] [✏️ Override] [← Return]│  ← Dean actions
└─────────────────────────────────────┘
```

### Faculty View (Existing)
```
┌─────────────────────────────────────┐
│ Description                          │
│ ┌─────────────────────────────────┐ │
│ │ Submit IPCR targets...          │ │  ← Editable TextInput
│ └─────────────────────────────────┘ │
│                                      │
│ Ratings                              │
│ Q1: [5▼] E2: [5▼] T3: [5▼]         │  ← Rating inputs
│                                      │
│ A4 - Average: 5.00                  │  ← Auto-calculated
└─────────────────────────────────────┘
```

## Status Flow

```
Faculty                Secretary              Dean
   │                      │                    │
   │ Submit Target        │                    │
   ├─────────────────────>│                    │
   │ status: SUBMITTED    │                    │
   │                      │                    │
   │                      │ Rate Target        │
   │                      ├───────────────────>│
   │                      │ status: RATED      │
   │                      │                    │
   │                      │                    │ Approve
   │<─────────────────────┴────────────────────┤
   │           status: APPROVED                │
   │                                           │
```

## Rating Scale Reference

| Rating | Description      | Meaning                           |
|--------|------------------|-----------------------------------|
| 5      | Outstanding      | Exceptional performance           |
| 4      | Very Satisfactory| Exceeds expectations              |
| 3      | Satisfactory     | Meets expectations                |
| 2      | Unsatisfactory   | Below expectations                |
| 1      | Poor             | Significantly below expectations  |

## Common Actions

### Rate a Target
1. Click "Rate This Target" button
2. Enter Q, E, T ratings (1-5)
3. Review computed average
4. Click "Rate & Forward to Dean"

### Mark Target Incomplete
1. Click "Rate This Target" button
2. Enter note explaining why incomplete
3. Click "Mark Incomplete"
4. Target returns to faculty with note

### View Documents
- Documents are listed with icons
- Click to preview/download (future enhancement)

## Tips for Secretaries

1. **Review Faculty Self-Rating**: Use it as a reference point
2. **Check Documents**: Verify evidence supports the rating
3. **Be Consistent**: Apply same standards across all faculty
4. **Provide Clear Notes**: If marking incomplete, explain what's needed
5. **Use Average Calculation**: Modal shows real-time average as you type

## Troubleshooting

### "Rating Queue is empty"
- Click "Fix Target Statuses" button in Compliance tab
- This migrates old submitted IPCRs to new status system

### "Can't see Rate button"
- Verify target status is SUBMITTED or ENDORSED
- Check you're logged in as Secretary role

### "Rating not saving"
- Ensure all three ratings (Q, E, T) are entered
- Verify ratings are between 1 and 5
- Check network connection

## Future Enhancements

1. **Document Preview**: Click to view PDF/DOCX in modal
2. **Bulk Rating**: Rate multiple targets at once
3. **Rating History**: See previous ratings and changes
4. **Comparison View**: Side-by-side self vs secretary rating
5. **Rating Guidelines**: Built-in rubric/criteria display
6. **Export Reports**: Generate rating summary reports
