# OPCR Upload - Year Selector Feature ✅

## Feature Added

Added a year selector to the OPCR Upload screen, allowing secretaries to choose which academic year the OPCR document is for.

## Changes Made

### 1. **New State Variables**
```typescript
const [selectedYear, setSelectedYear] = useState(2026);
const availableYears = [2024, 2025, 2026, 2027, 2028];
```

### 2. **Year Selection UI**
Added a new section at the top of the screen with:
- Section title: "Select Academic Year"
- Description explaining the purpose
- Grid of year cards (2024-2028)
- Visual feedback for selected year
- Checkmark icon on selected year

### 3. **Year Card Design**
Each year card features:
- Large year number (24px, bold)
- Border highlighting when selected
- Background color change when selected
- Checkmark icon in top-right corner
- Responsive grid layout

### 4. **Dynamic Sample Data**
Updated `loadSampleData()` to use selected year:
- All periods now use `${selectedYear}`
- File name includes year: `OPCR_CCS_${selectedYear}_Sample.xlsx`
- Alert message shows selected year

### 5. **Save with Year**
Updated `handleSaveTargets()` to:
- Save year to AsyncStorage: `uploaded_opcr_year`
- Include year in success message
- Store year metadata with OPCR data

## Visual Design

### Year Selector Layout
```
┌─────────────────────────────────────────┐
│ Select Academic Year                    │
│ Choose the academic year for this OPCR │
│                                         │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ │ 2024 │ │ 2025 │ │ 2026✓│ │ 2027 │   │
│ └──────┘ └──────┘ └──────┘ └──────┘   │
│                    ┌──────┐             │
│                    │ 2028 │             │
│                    └──────┘             │
└─────────────────────────────────────────┘
```

### Color Coding
- **Unselected**: Gray border, light background
- **Selected**: Accent border, accent-tinted background
- **Checkmark**: Accent color icon

### Responsive Grid
- Cards wrap on smaller screens
- Minimum width: 100px per card
- Gap between cards: 12px
- Flex layout for even distribution

## User Flow

### Step 1: Select Year
1. Secretary opens Upload OPCR screen
2. Sees year selector at top
3. Default year: 2026
4. Clicks desired year card
5. Card highlights with checkmark

### Step 2: Upload/Load Data
1. Click upload area or "Load Sample Data"
2. File name includes selected year
3. All extracted targets use selected year

### Step 3: Review Data
1. All target periods show selected year
2. Summary shows year in context
3. File info displays year

### Step 4: Save
1. Click "Save to System"
2. Confirmation includes year
3. Year saved to AsyncStorage
4. Faculty IPCRs will use this year

## Sample Data with Year

### Before:
```typescript
period: 'Jan-Dec 2026',
```

### After:
```typescript
period: `Jan-Dec ${selectedYear}`,
```

### Result:
- 2024 → "Jan-Dec 2024"
- 2025 → "Jan-Dec 2025"
- 2026 → "Jan-Dec 2026"
- 2027 → "Jan-Dec 2027"
- 2028 → "Jan-Dec 2028"

## Storage Structure

### AsyncStorage Keys
```typescript
'uploaded_opcr_targets' → Major functions array
'uploaded_opcr_year' → Selected year string
```

### Example:
```json
{
  "uploaded_opcr_targets": [...],
  "uploaded_opcr_year": "2026"
}
```

## Benefits

### 1. **Multi-Year Support**
- Can upload OPCRs for different years
- Historical data management
- Future planning capability

### 2. **Clear Context**
- Users know which year they're working on
- Prevents confusion
- Better organization

### 3. **Accurate Data**
- Targets tagged with correct year
- IPCRs generated for correct period
- Proper timeline tracking

### 4. **Flexibility**
- Can prepare future OPCRs
- Can update past OPCRs
- Can manage multiple years

## Testing

### Test Year Selection
1. Login as secretary
2. Navigate to Upload OPCR
3. See year selector with 2026 selected
4. Click different years
5. Verify visual feedback (border, background, checkmark)

### Test Sample Data
1. Select year 2025
2. Click "Load Sample Data"
3. Verify alert says "for 2025"
4. Check file name: "OPCR_CCS_2025_Sample.xlsx"
5. Review target cards - all periods show 2025

### Test Save
1. Select year 2027
2. Load sample data
3. Click "Save to System"
4. Verify message includes "for 2027"
5. Check AsyncStorage for year value

### Test Different Years
1. Try each year (2024-2028)
2. Verify all work correctly
3. Check data consistency
4. Verify year persists

## Styles Added

```typescript
yearGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
},
yearCard: {
  flex: 1,
  minWidth: 100,
  backgroundColor: colors.bg2,
  borderWidth: 2,
  borderColor: colors.border,
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
  position: 'relative',
},
yearCardActive: {
  borderColor: colors.accent,
  backgroundColor: `${colors.accent}15`,
},
yearText: {
  fontSize: 24,
  fontWeight: '700',
  color: colors.text2,
},
yearTextActive: {
  color: colors.accent,
},
yearCheckmark: {
  position: 'absolute',
  top: 8,
  right: 8,
},
```

## Files Modified
- `src/screens/SecretaryOPCRUploadScreen.tsx`

## Compilation Status
✅ No TypeScript errors
✅ No syntax errors
✅ File compiles successfully

## Future Enhancements

### 1. **Year Range Validation**
- Prevent selecting years too far in past
- Warn about future years
- Suggest current/next year

### 2. **Year-Based Filtering**
- View OPCRs by year
- Compare years
- Year-over-year analysis

### 3. **Auto-Year Detection**
- Detect year from filename
- Parse year from Excel content
- Suggest year based on current date

### 4. **Multiple Year Upload**
- Upload OPCRs for multiple years
- Batch processing
- Year comparison tools

## Notes
- Default year: 2026 (current planning year)
- Available years: 2024-2028 (5-year range)
- Year stored separately from targets
- Year used in all target periods
- Year included in success messages
- Year persists in AsyncStorage
