# Secretary Access Control Implementation

## Overview
Implemented role-based access control for secretaries to manage reportorial requirements and OPCR access.

## Changes Made

### 1. Updated UserRole Type Definition
**File**: `conneccs-react-native/types/index.ts`
- Added `'SECRETARY'` to the `UserRole` type
- Now supports: `'ADMIN' | 'DEAN' | 'CHAIR' | 'FACULTY' | 'SECRETARY'`

### 2. Reportorial Requirements Access Control
**File**: `conneccs-react-native/src/screens/ReportorialRequirementsScreen.tsx`

#### Secretary-to-Staff Code Mapping
Created mapping function to identify which secretary is logged in:
- **Jo Ann V. Baeta** → Staff Code: `JO`
- **Stephanie Mae B. Otares** → Staff Code: `STEPH`
- **Reychille Grace Tañamor** → Staff Code: `CHEN`
- **Vianne Faye S. Gastilo** → Staff Code: `VIANNE`

#### Filtering Logic
- Secretaries only see requirements assigned to their staff code
- Admin and Dean roles can see all requirements
- Non-secretary roles see all requirements (for backward compatibility)

#### Secretary Assignments
**Jo Ann V. Baeta (JO):**
- Letter of Intent
- Permit to Teach
- Workload Schedule of Faculty
- Class Monitoring Checklist
- List of Top Ten
- Delinquency Report
- Dean's & President List
- Make Up Class Request
- Leave Form

**Stephanie Mae B. Otares (STEPH):**
- Approved Syllabus
- Approved TOS w/ Test Question & Key to Correction
- Approved Rubric of Assessment w/ Attached Problem/Sample Output
- Approved Class Record

**Reychille Grace Tañamor (CHEN):**
- Computation of Midterm Grades
- List of Dropped Student
- Class Observation
- SIAS Grade Sheet

### 3. OPCR Access Control
**File**: `conneccs-react-native/src/screens/OPCRScreen.tsx`

#### Access Rules
- **Admin and Dean**: Full access to OPCR
- **Vianne Faye S. Gastilo (Administrative Aide III)**: Only secretary with OPCR access
- **Other Secretaries**: Access denied with informative message
- **Faculty**: No access (not applicable)

#### Access Denied Screen
When unauthorized users try to access OPCR, they see:
- Alert icon with orange color
- "Access Restricted" heading
- Clear message explaining only Vianne can access OPCR
- Maintains navigation and topbar for consistency

### 4. Folder Navigation
**File**: `conneccs-react-native/src/screens/ReportorialFolderScreen.tsx`
- Already implemented (no changes needed)
- Shows all faculty submissions for a requirement
- Displays document status (pending, approved, rejected)
- Upload functionality for faculty members
- Secretary can review and manage submissions

## User Experience

### For Secretaries (Jo Ann, Stephanie, Reychille)
1. Login with secretary credentials
2. Navigate to "Reportorial Requirements"
3. See only requirements assigned to them
4. Click on a requirement card to open folder view
5. View all faculty submissions for that requirement
6. Cannot access OPCR screen (access denied message)

### For Vianne Faye S. Gastilo
1. Login with secretary credentials
2. Navigate to "Reportorial Requirements"
3. See requirements assigned to her (if any)
4. **Can access OPCR screen** (unique privilege)
5. View and manage office-wide performance data

### For Faculty
1. Login with faculty credentials
2. Navigate to "Reportorial Requirements"
3. See all requirements (for submission purposes)
4. Click to open folder and upload documents
5. View submission status and ratings

### For Admin/Dean
1. Full access to all screens
2. Can view all reportorial requirements
3. Can access OPCR screen
4. Can manage all submissions

## Technical Details

### Secretary Detection
```typescript
const getSecretaryStaffCode = (userName: string): string | null => {
  if (userName.includes('Jo Ann') || userName.includes('Baeta')) return 'JO';
  if (userName.includes('Stephanie') || userName.includes('Otares')) return 'STEPH';
  if (userName.includes('Reychille') || userName.includes('Tañamor')) return 'CHEN';
  if (userName.includes('Vianne') || userName.includes('Gastilo')) return 'VIANNE';
  return null;
};
```

### OPCR Access Check
```typescript
const canAccessOPCR = () => {
  if (!user) return false;
  
  // Allow admin and dean to access
  if (user.role === 'ADMIN' || user.role === 'DEAN') return true;
  
  // Only Vianne Faye S. Gastilo can access OPCR among secretaries
  if (user.role === 'SECRETARY') {
    return user.name.includes('Vianne') || user.name.includes('Gastilo');
  }
  
  return false;
};
```

### Requirement Filtering
```typescript
const filterRequirementsBySecretary = (reqs: Requirement[]) => {
  // If not a secretary or staff code not found, show all (for admin/dean)
  if (!user || user.role !== 'SECRETARY' || !userStaffCode) {
    return reqs;
  }
  
  // Filter to show only requirements assigned to this secretary
  return reqs.filter(req => req.staff === userStaffCode);
};
```

## Testing Checklist

- [x] Secretary login shows only assigned requirements
- [x] Jo Ann sees JO-assigned requirements
- [x] Stephanie sees STEPH-assigned requirements
- [x] Reychille sees CHEN-assigned requirements
- [x] Vianne can access OPCR screen
- [x] Other secretaries see access denied on OPCR
- [x] Admin/Dean can access everything
- [x] Faculty can see all requirements for submission
- [x] Folder navigation works correctly
- [x] No TypeScript errors or warnings

## Future Enhancements

1. **Dynamic Assignment**: Allow admin to reassign requirements to different secretaries
2. **Submission Tracking**: Add analytics for each secretary's workload
3. **Notification System**: Alert secretaries when new submissions arrive
4. **Bulk Actions**: Allow secretaries to approve/reject multiple submissions
5. **Export Reports**: Generate reports for each secretary's managed requirements
