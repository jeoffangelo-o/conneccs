# Rating Requirements System - Flow Diagram

## 📊 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. OPCR EXCEL FILE                           │
│                                                                 │
│  Column 8 (Q³) | Column 9 (E²) | Column 10 (T³)               │
│  ─────────────────────────────────────────────                 │
│      x         |      x        |       x        → All 3        │
│      x         |               |       x        → Q + T        │
│      x         |               |                → Q only       │
│               |      x        |       x        → E + T        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              2. SECRETARY UPLOADS OPCR                          │
│                                                                 │
│  SecretaryOPCRUploadScreen.tsx                                 │
│  • Reads Excel file                                            │
│  • Parses Q³, E², T³ columns                                   │
│  • Detects "x" marks                                           │
│  • Creates requiredRatings array                               │
│                                                                 │
│  Example Output:                                               │
│  Target 1: requiredRatings = ['Q', 'E', 'T']                  │
│  Target 2: requiredRatings = ['Q', 'T']                       │
│  Target 3: requiredRatings = ['Q']                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              3. SYSTEM STORES REQUIREMENTS                      │
│                                                                 │
│  DataContext / AsyncStorage                                    │
│  • Saves OPCR with requiredRatings                            │
│  • Available for IPCR generation                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              4. FACULTY GENERATES IPCR                          │
│                                                                 │
│  generateIPCRForFaculty()                                      │
│  • Creates IPCR from OPCR targets                              │
│  • Copies requiredRatings to each target                       │
│  • Faculty sees their personalized IPCR                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              5. FACULTY RATES TARGETS                           │
│                                                                 │
│  MyIPCRScreen.tsx                                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Target: "Submit PPMP on time"                           │  │
│  │ ℹ️ This target requires: Quality, Efficiency, Timeliness│  │
│  │                                                          │  │
│  │ Quality (Q) - Required:     [5]                         │  │
│  │ Efficiency (E) - Required:  [4]                         │  │
│  │ Timeliness (T) - Required:  [5]                         │  │
│  │                                                          │  │
│  │ Average: (5+4+5)/3 = 4.67                               │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Target: "Ensure 100% submission"                        │  │
│  │ ℹ️ This target requires: Quality and Timeliness         │  │
│  │                                                          │  │
│  │ Quality (Q) - Required:     [5]                         │  │
│  │ Timeliness (T) - Required:  [4]                         │  │
│  │                                                          │  │
│  │ Average: (5+4)/2 = 4.5                                  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Target: "Submit midyear report"                         │  │
│  │ ℹ️ This target requires: Quality                        │  │
│  │                                                          │  │
│  │ Quality (Q) - Required:     [4]                         │  │
│  │                                                          │  │
│  │ Average: 4.0                                            │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              6. CALCULATION FUNCTIONS                           │
│                                                                 │
│  calculations.ts                                               │
│                                                                 │
│  calculateA4WithRequired(target, 'self')                       │
│  • Reads target.requiredRatings                                │
│  • Collects only required rating values                        │
│  • Calculates: sum / count of required ratings                 │
│                                                                 │
│  Example:                                                      │
│  requiredRatings = ['Q', 'T']                                 │
│  selfRatingQ = 5, selfRatingT = 4                             │
│  Average = (5 + 4) / 2 = 4.5                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              7. VALIDATION                                      │
│                                                                 │
│  validateRequiredRatings(target, 'self')                       │
│  • Checks if all required ratings are provided                 │
│  • Returns array of missing ratings                            │
│                                                                 │
│  Example:                                                      │
│  requiredRatings = ['Q', 'T']                                 │
│  selfRatingQ = 5, selfRatingT = null                          │
│  Returns: ['Timeliness (T)']                                  │
│                                                                 │
│  UI shows: "Missing Required Ratings: Timeliness (T)"         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              8. FINAL RATING CALCULATION                        │
│                                                                 │
│  calculateFinalRating(ipcr)                                    │
│  • Aggregates all target averages                              │
│  • Calculates weighted average by category                     │
│  • Strategic × 45% + Core × 45% + Support × 10%               │
│  • Returns final IPCR rating                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Example

### Scenario: Target Requires Q and T Only

```
Step 1: OPCR Excel
┌──────────────────────────────────────┐
│ Q³ | E² | T³                         │
│ x  |    | x   → Requires Q and T    │
└──────────────────────────────────────┘

Step 2: Parsing
┌──────────────────────────────────────┐
│ parseExcelFile()                     │
│ • Reads column 8: "x" → Q required  │
│ • Reads column 9: ""  → E not req.  │
│ • Reads column 10: "x" → T required │
│ • Creates: ['Q', 'T']                │
└──────────────────────────────────────┘

Step 3: Storage
┌──────────────────────────────────────┐
│ {                                    │
│   id: "target-1",                    │
│   description: "...",                │
│   requiredRatings: ['Q', 'T']       │
│ }                                    │
└──────────────────────────────────────┘

Step 4: UI Display
┌──────────────────────────────────────┐
│ ℹ️ This target requires:             │
│    Quality and Timeliness            │
│                                      │
│ Quality (Q):    [___]  ← Shown      │
│ Timeliness (T): [___]  ← Shown      │
│                         ← E hidden   │
└──────────────────────────────────────┘

Step 5: Faculty Input
┌──────────────────────────────────────┐
│ Quality (Q):    [5]                  │
│ Timeliness (T): [4]                  │
└──────────────────────────────────────┘

Step 6: Calculation
┌──────────────────────────────────────┐
│ calculateA4WithRequired()            │
│ • requiredRatings = ['Q', 'T']      │
│ • ratings = [5, 4]                   │
│ • sum = 9                            │
│ • count = 2                          │
│ • average = 9 / 2 = 4.5             │
└──────────────────────────────────────┘

Step 7: Result
┌──────────────────────────────────────┐
│ Target Average: 4.5                  │
│ ✓ Correct! (not 4.67 or 3.0)       │
└──────────────────────────────────────┘
```

## 🎯 Key Decision Points

```
┌─────────────────────────────────────────────────────────────┐
│                    DECISION TREE                            │
└─────────────────────────────────────────────────────────────┘

Does target have requiredRatings?
├─ YES → Use requiredRatings array
│   │
│   ├─ Contains 'Q'? → Show Q field, validate Q, include in avg
│   ├─ Contains 'E'? → Show E field, validate E, include in avg
│   └─ Contains 'T'? → Show T field, validate T, include in avg
│
└─ NO → Default to ['Q', 'E', 'T']
    └─ Show all three fields, validate all, include all in avg
```

## 📊 Comparison: Before vs After

### Before (Incorrect)

```
OPCR Excel:
Q³=x, E²=, T³=x  (Only Q and T required)
         ↓
System assumes: ['Q', 'E', 'T']  ❌ Wrong!
         ↓
UI shows: [Q] [E] [T]  ❌ Shows E unnecessarily
         ↓
Faculty enters: Q=5, E=3, T=4
         ↓
Average: (5+3+4)/3 = 4.0  ❌ Wrong! Includes E
```

### After (Correct)

```
OPCR Excel:
Q³=x, E²=, T³=x  (Only Q and T required)
         ↓
System parses: ['Q', 'T']  ✓ Correct!
         ↓
UI shows: [Q] [T]  ✓ E is hidden
         ↓
Faculty enters: Q=5, T=4
         ↓
Average: (5+4)/2 = 4.5  ✓ Correct! Only Q and T
```

## 🔍 Code Path

```
User Action: Faculty clicks "Save Rating"
                    ↓
handleSaveRating() in MyIPCRScreen.tsx
                    ↓
1. Get requiredRatings from target
   const requiredRatings = target.requiredRatings || ['Q', 'E', 'T']
                    ↓
2. Validate required ratings
   const missing = validateRequiredRatings(target, 'self')
   if (missing.length > 0) → Show error
                    ↓
3. Calculate average using only required ratings
   const ratings = []
   if (requiredRatings.includes('Q') && q1) ratings.push(q1)
   if (requiredRatings.includes('E') && e2) ratings.push(e2)
   if (requiredRatings.includes('T') && t3) ratings.push(t3)
   const avg = sum(ratings) / ratings.length
                    ↓
4. Save to IPCR
   target.selfRatingQ = q1
   target.selfRatingE = e2
   target.selfRatingT = t3
   target.selfRatingAvg = avg
                    ↓
5. Update state and storage
   updateIPCR(updatedIPCR)
                    ↓
Success! ✓
```

---

**Created:** May 8, 2026  
**Purpose:** Visual guide to rating requirements system flow
