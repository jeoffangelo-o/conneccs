# IPCR Multi-Select Update ✅

## Summary
Updated Step 2 of Create IPCR to allow multiple selections of major functions and success indicators using checkboxes. Users can now select multiple targets at once, and the system will create individual IPCR targets for each selected indicator.

---

## Changes Made

### 1. **Changed from Single to Multiple Selection**
- ❌ Before: Select ONE major function and ONE indicator
- ✅ After: Select MULTIPLE major functions and MULTIPLE indicators

### 2. **Added Checkbox UI**
- Visual checkboxes with check icons
- Selection counter (e.g., "Major Functions (2 selected)")
- Active state highlighting

### 3. **Dynamic Indicator Display**
- Indicators only show after selecting major functions
- Indicators grouped by their parent major function
- Shows which major function each indicator belongs to

### 4. **Multiple Target Creation**
- Creates one IPCR target for each selected indicator
- Groups targets by major function
- All targets share the same description and measures

---

## Visual Changes

### Before (Single Selection):
```
┌────────────────────────────────────┐
│ Select OPCR Parent Target          │
│                                    │
│ Major Function:                    │
│ ○ Core Function                    │
│ ● Support Function (selected)      │
│                                    │
│ Success Indicator:                 │
│ ○ SI-001                           │
│ ● SI-002 (selected)                │
└────────────────────────────────────┘
```

### After (Multiple Selection):
```
┌────────────────────────────────────┐
│ Select OPCR Parent Targets         │
│                                    │
│ Major Functions (2 selected)       │
│ ☑ Core Function                    │
│ ☑ Support Function                 │
│ ☐ Strategic Function               │
│                                    │
│ Success Indicators (3 selected)    │
│ ☑ SI-001 - Description             │
│   from Core Function               │
│ ☑ SI-002 - Description             │
│   from Support Function            │
│ ☑ SI-003 - Description             │
│   from Support Function            │
└────────────────────────────────────┘
```

---

## Technical Implementation

### State Changes
```typescript
// Before
const [selectedMajorFunction, setSelectedMajorFunction] = useState('');
const [selectedIndicator, setSelectedIndicator] = useState('');

// After
const [selectedMajorFunctions, setSelectedMajorFunctions] = useState<string[]>([]);
const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
```

### Toggle Functions
```typescript
const toggleMajorFunction = (mfId: string) => {
  setSelectedMajorFunctions(prev => {
    if (prev.includes(mfId)) {
      return prev.filter(id => id !== mfId);
    } else {
      return [...prev, mfId];
    }
  });
};

const toggleIndicator = (indicatorId: string) => {
  setSelectedIndicators(prev => {
    if (prev.includes(indicatorId)) {
      return prev.filter(id => id !== indicatorId);
    } else {
      return [...prev, indicatorId];
    }
  });
};
```

### Get Available Indicators
```typescript
const getAvailableIndicators = () => {
  const indicators: any[] = [];
  selectedMajorFunctions.forEach(mfId => {
    const mf = opcr.majorFunctions.find(m => m.id === mfId);
    if (mf) {
      mf.successIndicators.forEach(si => {
        indicators.push({ 
          ...si, 
          majorFunctionId: mfId, 
          majorFunctionTitle: mf.title 
        });
      });
    }
  });
  return indicators;
};
```

### Multiple Target Creation
```typescript
const handleSubmit = () => {
  const majorFunctionsMap: { [key: string]: IPCRMajorFunction } = {};

  selectedIndicators.forEach(indicatorId => {
    // Find parent major function
    // Create target for this indicator
    // Group by major function
  });

  // Convert map to array
  const majorFunctions = Object.values(majorFunctionsMap);

  // Create IPCR with multiple targets
  const newIPCR: IPCR = {
    // ...
    majorFunctions: majorFunctions,
  };
};
```

---

## New Styles Added

```typescript
checkboxCard: {
  backgroundColor: colors.bg2,
  borderWidth: 2,
  borderColor: colors.border,
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
},
checkboxCardActive: {
  borderColor: colors.accent,
  backgroundColor: `${colors.accent}10`,
},
checkboxRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 12,
},
checkbox: {
  width: 24,
  height: 24,
  borderRadius: 6,
  borderWidth: 2,
  borderColor: colors.border,
  backgroundColor: colors.bg3,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 2,
},
checkboxChecked: {
  backgroundColor: colors.accent,
  borderColor: colors.accent,
},
checkboxContent: {
  flex: 1,
},
indicatorMF: {
  fontSize: 11,
  color: colors.text3,
  marginTop: 4,
  fontStyle: 'italic',
},
```

---

## User Flow

### Step 1: Select Period
- Choose Jan-Jun 2026, Jul-Dec 2026, or Jan-Dec 2027

### Step 2: Select Targets (NEW!)
1. **Select Major Functions**:
   - Click checkboxes to select one or more major functions
   - Counter shows how many are selected
   - Can select/deselect at any time

2. **Select Indicators**:
   - Indicators appear after selecting major functions
   - Shows all indicators from selected major functions
   - Each indicator shows which major function it belongs to
   - Click checkboxes to select one or more indicators

### Step 3: Enter Target Details
- Enter description (applies to ALL selected indicators)
- Enter measures (applies to ALL selected indicators)

### Step 4: Review & Submit
- Shows count of major functions selected
- Shows count of indicators selected
- Shows total targets to be created
- Displays description and measures

---

## Validation

### Step 2 Validation:
```typescript
if (selectedMajorFunctions.length === 0) {
  alert('Please select at least one major function');
  return;
}
if (selectedIndicators.length === 0) {
  alert('Please select at least one success indicator');
  return;
}
```

### Success Message:
```typescript
alert(`IPCR created successfully with ${selectedIndicators.length} target(s)!`);
```

---

## Benefits

### 1. **Efficiency**
- Create multiple targets in one go
- No need to repeat the process for each target
- Saves time for faculty members

### 2. **Flexibility**
- Select targets from different major functions
- Mix and match indicators as needed
- Easy to add or remove selections

### 3. **Better UX**
- Visual feedback with checkboxes
- Clear selection counters
- Shows relationship between indicators and major functions

### 4. **Consistency**
- All targets share the same description and measures
- Ensures consistency across related targets
- Easier to manage related goals

---

## Example Scenario

**Faculty wants to create targets for:**
- Core Function → SI-001, SI-002
- Support Function → SI-003

**Old Way (3 separate processes):**
1. Create IPCR for SI-001
2. Create IPCR for SI-002
3. Create IPCR for SI-003

**New Way (1 process):**
1. Select Core Function and Support Function
2. Select SI-001, SI-002, SI-003
3. Enter description and measures once
4. Submit → Creates 3 targets automatically

---

## Testing Instructions

### To Test:
1. Navigate to "Create New IPCR"
2. Select a period (Step 1)
3. Click "Next"
4. **Step 2 - Test Multi-Select**:
   - Click multiple major function checkboxes
   - Verify indicators appear
   - Click multiple indicator checkboxes
   - Verify counters update
   - Uncheck some selections
   - Verify they are removed
5. Click "Next"
6. Enter description and measures (Step 3)
7. Click "Next"
8. **Step 4 - Verify Review**:
   - Check major functions count
   - Check indicators count
   - Check total targets count
9. Click "Submit IPCR"
10. Verify success message shows correct count
11. Check My IPCR screen to see all targets created

### Expected Results:
- ✅ Can select multiple major functions
- ✅ Can select multiple indicators
- ✅ Counters show correct numbers
- ✅ Checkboxes toggle correctly
- ✅ Indicators show parent major function
- ✅ Review shows correct counts
- ✅ All targets are created successfully
- ✅ Success message shows correct count

---

## Files Modified

1. **CreateIPCRScreen.tsx**
   - Changed state from single to array
   - Added toggle functions
   - Added getAvailableIndicators function
   - Updated validation logic
   - Updated handleSubmit to create multiple targets
   - Replaced Step 2 UI with checkbox interface
   - Updated Step 4 review to show counts
   - Added 8 new checkbox styles

---

## Status: COMPLETE ✅

All changes have been implemented and verified:
- ✅ Multiple selection with checkboxes
- ✅ Dynamic indicator display
- ✅ Selection counters
- ✅ Multiple target creation
- ✅ Updated validation
- ✅ Updated review screen
- ✅ All styles added
- ✅ No TypeScript errors
- ✅ Ready for testing

**Last Updated**: May 9, 2026
