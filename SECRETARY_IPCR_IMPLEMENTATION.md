# Secretary IPCR Implementation

## Overview
Updated the system to include secretaries in the IPCR (Individual Performance Commitment and Review) process with proper verification hierarchy.

## Verification Hierarchy

### Faculty & Program Chairs
1. **Noted by**: Program Chair (`notedByChairId`)
2. **Approved by**: Dean (`approvedByDeanId`)
3. **Verified by**: VPAA (`verifiedByVpaa`)

### Secretaries
1. **Approved by**: Dean (`approvedByDeanId`)
2. **Verified by**: VPAA (`verifiedByVpaa`)
- Note: Secretaries skip the "Noted by Chair" step

### Dean
1. **Verified by**: VPAA (`verifiedByVpaa`)
- Note: Dean's IPCR only needs VPAA verification

## Changes Made

### 1. Dashboard Screen (`DashboardScreenNew.tsx`)
**Auto-Generation**:
```typescript
// Before: Only FACULTY and CHAIR
if (user && (user.role === 'FACULTY' || user.role === 'CHAIR'))

// After: Includes SECRETARY
if (user && (user.role === 'FACULTY' || user.role === 'CHAIR' || user.role === 'SECRETARY'))
```

**Filtering**:
```typescript
// Before: Only FACULTY
if (user?.role === 'FACULTY')

// After: Includes SECRETARY
if (user?.role === 'FACULTY' || user?.role === 'SECRETARY')
```

**Progress Display**:
```typescript
// Before: Only FACULTY and CHAIR
if (user?.role === 'FACULTY' || user?.role === 'CHAIR')

// After: Includes SECRETARY
if (user?.role === 'FACULTY' || user?.role === 'CHAIR' || user?.role === 'SECRETARY')
```

**Create IPCR Button**:
```typescript
// Before: Only FACULTY
{user?.role === 'FACULTY' && (

// After: Includes SECRETARY
{(user?.role === 'FACULTY' || user?.role === 'SECRETARY') && (
```

### 2. Auth Context (`AuthContext.tsx`)
**Auto-Generation on Login**:
```typescript
// Before: Only faculty
if (foundUser.role === 'faculty' && autoGenerateIPCR)

// After: Includes SECRETARY
if ((foundUser.role === 'FACULTY' || foundUser.role === 'SECRETARY') && autoGenerateIPCR)
```

## IPCR Structure for Secretaries

Secretaries will have IPCRs with the same structure as faculty:
- Major Functions from OPCR
- Success Indicators/Targets
- Q, E, T, A ratings
- Accomplishments and MOV uploads
- Progress tracking

## Workflow

### For Secretaries:
1. **Login** → IPCR auto-generated from OPCR
2. **Target Setting Phase**:
   - View assigned targets from OPCR
   - Set personal commitments
3. **Mid-Year Review**:
   - Update progress
   - Upload MOV (Means of Verification)
   - Self-rate Quality, Efficiency, Timeliness
4. **Terminal Review**:
   - Complete all ratings
   - Submit for Dean approval
5. **Dean Approval**:
   - Dean reviews and approves
   - Can request revisions
6. **VPAA Verification**:
   - VPAA verifies the IPCR
   - Final approval

### For Dean:
1. **Review Queue**:
   - See all faculty IPCRs (for approval)
   - See all secretary IPCRs (for approval)
   - See own IPCR (for VPAA verification)
2. **Approval Process**:
   - Review submitted IPCRs
   - Approve or request revisions
   - Add comments/feedback
3. **Own IPCR**:
   - Complete like faculty
   - Submit directly to VPAA (no Dean approval needed)

### For VPAA:
1. **Verification Queue**:
   - See all Dean-approved IPCRs
   - See Dean's IPCR
2. **Verification Process**:
   - Final review and verification
   - Can request revisions
   - Final sign-off

## Secretary Roles in System

Based on `users.json`:
1. **Vianne Faye S. Gastilo** - Administrative Aide III
   - Can access OPCR
   - Has IPCR
2. **Stephanie Mae B. Otares** - Administrative Aide II
   - Manages reportorial requirements (STEPH)
   - Has IPCR
3. **Reychille Grace Tañamor** - Administrative Aide II
   - Manages reportorial requirements (CHEN)
   - Has IPCR
4. **Jo Ann V. Baeta** - Administrative Aide I
   - Manages reportorial requirements (JO)
   - Has IPCR

## Benefits

### For Secretaries:
- ✅ Performance tracking and evaluation
- ✅ Clear targets and expectations
- ✅ Professional development documentation
- ✅ Fair evaluation process

### For Administration:
- ✅ Comprehensive staff performance monitoring
- ✅ Consistent evaluation across all roles
- ✅ Better resource allocation
- ✅ Performance-based decision making

### For the System:
- ✅ Complete organizational performance tracking
- ✅ Unified IPCR process for all staff
- ✅ Proper verification hierarchy
- ✅ Audit trail for all evaluations

## Testing Checklist

- [x] Secretary login auto-generates IPCR
- [x] Secretary can view "My IPCR" screen
- [x] Secretary can create IPCR manually
- [x] Secretary IPCR shows in dashboard progress
- [x] Secretary IPCR appears in Dean's review queue
- [ ] Dean can approve secretary IPCR
- [ ] VPAA can verify secretary IPCR
- [ ] Dean's IPCR goes directly to VPAA
- [ ] Proper status transitions for secretaries
- [ ] Notifications work for secretaries

## Future Enhancements

1. **Role-Specific Targets**: Different OPCR targets for secretaries vs faculty
2. **Custom Weights**: Adjust major function weights by role
3. **Secretary-Specific Metrics**: Add administrative performance indicators
4. **Bulk Operations**: Dean can approve multiple secretary IPCRs at once
5. **Performance Analytics**: Compare secretary performance across departments
6. **Training Recommendations**: Suggest training based on IPCR results

## Notes

- Secretaries use the same OPCR as faculty but may have different target assignments
- The verification hierarchy ensures proper oversight at each level
- Dean's IPCR bypasses Dean approval (goes directly to VPAA)
- All IPCRs follow the same phases: Target Setting → Mid-Year → Terminal → Completed
