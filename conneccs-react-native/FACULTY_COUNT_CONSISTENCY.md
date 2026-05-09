# Faculty Count Consistency Fix

## Problem
The system was inconsistently calculating the number of faculty members across different screens and contexts:

1. **DeanOPCRConsolidationScreen**: Used `ipcrs.length` (only counts faculty with IPCRs)
2. **DashboardScreenNew (Dean view)**: Used `ipcrs.length` (only counts faculty with IPCRs)
3. **DataContext.getComplianceDashboard()**: Used manual filter `u.role === 'FACULTY' || u.role === 'COORDINATOR' || u.role === 'CHAIR'`
4. **ReportorialContext**: Used manual filter `u.role === 'FACULTY' || u.role === 'CHAIR' || u.role === 'COORDINATOR'`
5. **ReportorialFolderScreen**: Used manual filter `u.role === 'FACULTY' || u.role === 'CHAIR' || u.role === 'COORDINATOR'`

This caused discrepancies where:
- Faculty without IPCRs were not counted in some views
- Different screens showed different total faculty counts
- Inconsistent role filtering (some included COORDINATOR, some didn't)

## Solution
Created centralized utility functions in `utils/businessRules.ts`:

```typescript
/**
 * Get all faculty users (FACULTY, CHAIR, COORDINATOR roles)
 * This is the single source of truth for determining who counts as "faculty"
 */
export function getFacultyUsers(users: User[]): User[] {
  return users.filter(
    (u: User) => u.role === 'FACULTY' || u.role === 'CHAIR' || u.role === 'COORDINATOR'
  );
}

/**
 * Get total faculty count from users array
 */
export function getTotalFacultyCount(users: User[]): number {
  return getFacultyUsers(users).length;
}
```

## Changes Made

### 1. utils/businessRules.ts
- ✅ Added `getFacultyUsers()` function
- ✅ Added `getTotalFacultyCount()` function

### 2. context/DataContext.tsx
- ✅ Imported `getFacultyUsers`
- ✅ Updated `getComplianceDashboard()` to use `getFacultyUsers(usersData)`

### 3. context/ReportorialContext.tsx
- ✅ Imported `getFacultyUsers`
- ✅ Updated 3 locations to use `getFacultyUsers(usersData)`:
  - `sendReminder()` function
  - `generateNotSubmittedReport()` function
  - `generateSummaryReport()` function

### 4. src/screens/ReportorialFolderScreen.tsx
- ✅ Imported `getFacultyUsers`
- ✅ Updated faculty list calculation to use `getFacultyUsers(usersData)`

### 5. src/screens/DeanOPCRConsolidationScreen.tsx
- ✅ Imported `getTotalFacultyCount` and `usersData`
- ✅ Changed from `const totalFaculty = ipcrs.length` to `const totalFaculty = getTotalFacultyCount(usersData)`
- ✅ Added comment explaining the change

### 6. src/screens/DashboardScreenNew.tsx
- ✅ Imported `getTotalFacultyCount`
- ✅ Updated Dean dashboard data to use `getTotalFacultyCount(usersData)` instead of `ipcrs.length`

## Benefits

1. **Single Source of Truth**: All faculty counting now uses the same utility function
2. **Consistent Role Definition**: Faculty = FACULTY + CHAIR + COORDINATOR (uniform across system)
3. **Accurate Counts**: Counts all faculty members, not just those with IPCRs
4. **Maintainable**: If the definition of "faculty" changes, update one place
5. **Type-Safe**: Uses proper TypeScript types

## Testing Recommendations

1. **Dean OPCR Consolidation Screen**: Verify "Total Faculty" count matches actual faculty in users.json
2. **Dashboard (Dean View)**: Verify faculty count is consistent with OPCR Consolidation
3. **Reportorial Folder Screen**: Verify submission rates calculate correctly
4. **Secretary Dashboard**: Verify compliance data shows correct total faculty count

## Expected Behavior

All screens should now show the same total faculty count based on users with roles:
- FACULTY
- CHAIR  
- COORDINATOR

This count should remain consistent regardless of:
- How many IPCRs have been created
- How many IPCRs are approved
- Which screen is being viewed
