# Rating Requirements - Remaining Work

## ✅ Completed

1. **SecretaryOPCRUploadScreen.tsx** - Parse Q³, E², T³ columns from Excel
2. **calculations.ts** - New calculation functions
3. **MyIPCRScreen.tsx** - Faculty self-rating with required ratings
4. **Documentation** - Complete guides and specifications

## 🔄 Remaining Screens to Update

The following screens also handle ratings and should be updated to respect `requiredRatings`:

### 1. ReviewQueueScreen.tsx (Secretary Rating Interface)

**Current Behavior:**
- Shows all three rating fields (Q, E, T) for every target
- Validates all three ratings are provided
- Calculates average using all three

**Needed Changes:**
```typescript
// In rating modal, conditionally show only required fields
const requiredRatings = selectedTarget.requiredRatings || ['Q', 'E', 'T'];

{requiredRatings.includes('Q') && (
  <Input label="Quality (Q)" value={qRating} />
)}

{requiredRatings.includes('E') && (
  <Input label="Efficiency (E)" value={eRating} />
)}

{requiredRatings.includes('T') && (
  <Input label="Timeliness (T)" value={tRating} />
)}

// Update validation
const missing = validateRequiredRatings(selectedTarget, 'secretary');
if (missing.length > 0) {
  Alert.alert('Missing Ratings', `Please provide: ${missing.join(', ')}`);
  return;
}

// Update calculation
const avg = calculateA4WithRequired(selectedTarget, 'secretary');
```

**Files to Modify:**
- `src/screens/ReviewQueueScreen.tsx`

**Estimated Time:** 30 minutes

---

### 2. IPCRDetailScreen.tsx (Dean Review Interface)

**Current Behavior:**
- Shows all three rating fields in override modal
- Validates all three ratings
- Calculates average using all three

**Needed Changes:**
```typescript
// In override modal, conditionally show only required fields
const requiredRatings = selectedTarget.requiredRatings || ['Q', 'E', 'T'];

{requiredRatings.includes('Q') && (
  <Input label="Quality (Q)" value={deanQ} />
)}

{requiredRatings.includes('E') && (
  <Input label="Efficiency (E)" value={deanE} />
)}

{requiredRatings.includes('T') && (
  <Input label="Timeliness (T)" value={deanT} />
)}

// Update validation
const missing = validateRequiredRatings(selectedTarget, 'dean');
if (missing.length > 0) {
  Alert.alert('Missing Ratings', `Please provide: ${missing.join(', ')}`);
  return;
}

// Update calculation
const avg = calculateA4WithRequired(selectedTarget, 'dean');
```

**Files to Modify:**
- `src/screens/IPCRDetailScreen.tsx`

**Estimated Time:** 30 minutes

---

### 3. DashboardScreenNew.tsx (Analytics Display)

**Current Behavior:**
- May display Q, E, T ratings in analytics
- May assume all targets have all three ratings

**Needed Changes:**
- Review analytics calculations
- Ensure rating distribution charts handle variable ratings
- Update any hardcoded Q/E/T assumptions

**Files to Modify:**
- `src/screens/DashboardScreenNew.tsx`

**Estimated Time:** 15 minutes (review only, may not need changes)

---

## 🎯 Priority

**High Priority:**
1. ReviewQueueScreen.tsx - Secretary uses this frequently
2. IPCRDetailScreen.tsx - Dean uses this for final approval

**Low Priority:**
3. DashboardScreenNew.tsx - Analytics, less critical

## 📋 Implementation Checklist

For each screen:

- [ ] Import new helper functions from calculations.ts
- [ ] Add conditional rendering for rating input fields
- [ ] Update validation to use `validateRequiredRatings()`
- [ ] Update calculation to use `calculateA4WithRequired()`
- [ ] Add info banner showing required ratings
- [ ] Test with targets requiring different combinations
- [ ] Verify error messages are clear

## 🧪 Testing Scenarios

For each updated screen, test:

1. **All three required** (Q, E, T)
   - All fields should show
   - All must be filled
   - Average = (Q+E+T)/3

2. **Two required** (e.g., Q, T)
   - Only Q and T fields show
   - E field is hidden
   - Average = (Q+T)/2

3. **One required** (e.g., Q)
   - Only Q field shows
   - E and T fields hidden
   - Average = Q

4. **Validation**
   - Try submitting without required ratings
   - Should show clear error message
   - Should list which ratings are missing

## 📝 Code Template

Use this template for updating screens:

```typescript
import { 
  calculateA4WithRequired, 
  getRequiredRatingsDescription, 
  validateRequiredRatings 
} from '../../utils/calculations';

// In your component
const requiredRatings = target.requiredRatings || ['Q', 'E', 'T'];

// Show info banner
<YStack bg="rgba(244,196,48,0.1)" br="$2" p="$2.5" mb="$2">
  <TamaguiText fontSize={11} color="$text2">
    {getRequiredRatingsDescription(requiredRatings)}
  </TamaguiText>
</YStack>

// Conditional input fields
{requiredRatings.includes('Q') && (
  <YStack>
    <TamaguiText>Quality (Q) - Required</TamaguiText>
    <Input value={qValue} onChangeText={setQValue} />
  </YStack>
)}

{requiredRatings.includes('E') && (
  <YStack>
    <TamaguiText>Efficiency (E) - Required</TamaguiText>
    <Input value={eValue} onChangeText={setEValue} />
  </YStack>
)}

{requiredRatings.includes('T') && (
  <YStack>
    <TamaguiText>Timeliness (T) - Required</TamaguiText>
    <Input value={tValue} onChangeText={setTValue} />
  </YStack>
)}

// Validation
const handleSubmit = () => {
  const missing = validateRequiredRatings(target, 'secretary'); // or 'dean'
  if (missing.length > 0) {
    Alert.alert('Missing Ratings', `Please provide: ${missing.join(', ')}`);
    return;
  }
  
  // Calculate average
  const avg = calculateA4WithRequired(target, 'secretary'); // or 'dean'
  
  // Save...
};
```

## 🚀 When to Implement

**Option 1: Implement Now**
- Complete the full rating requirements system
- All screens will be consistent
- Users get full benefit immediately

**Option 2: Implement Later**
- Current implementation (MyIPCRScreen) is functional
- Faculty can rate targets correctly
- Secretary/Dean screens can be updated in next sprint

**Recommendation:** Option 1 - Complete the implementation now while the context is fresh. The remaining work is straightforward and follows the same pattern as MyIPCRScreen.

---

**Created:** May 8, 2026  
**Status:** Pending Implementation  
**Estimated Total Time:** 1-2 hours
