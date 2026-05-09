# ConneCCS System Test Plan

## Test Case Documentation
**System**: ConneCCS - Faculty IPCR/OPCR Monitoring System  
**Version**: 1.0.0  
**Last Updated**: May 9, 2026  
**Test Environment**: Development (React Native + Expo Web)

---

## Test Case Format

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|

---

## 1. User Authentication Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **Login Validation** | Enter valid username and password (e.g., faculty@ccs.edu / password123) | User successfully logs into the system and is redirected to role-specific dashboard |
| **Invalid Login Attempt** | Enter incorrect username or password | System displays error message "Invalid credentials" and remains on login page |
| **Role-Based Dashboard Redirect** | Log in as Faculty, Secretary, Dean, Chair, or Coordinator | User is redirected to the appropriate dashboard based on their role |
| **Session Persistence** | Log in and close the browser/app, then reopen | User remains logged in (session persists via AsyncStorage) |
| **Logout Validation** | Click the logout button from any screen | User is successfully logged out, session is cleared, and redirected to login page |
| **Empty Credentials Submission** | Submit login form with empty username or password fields | System displays validation error "Username and password are required" |
| **Remember Me Functionality** | Check "Remember Me" option during login | Credentials are saved and auto-filled on next visit |

---

## 2. User and Role Management

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **Role-Based Interface Visibility (Faculty)** | Log in as Faculty member (e.g., Benosa) | Dashboard shows: My IPCR, OPCR Targets, Calendar, Messages, Profile. No admin features visible. |
| **Role-Based Interface Visibility (Secretary)** | Log in as Secretary (e.g., Prades) | Dashboard shows: Review Queue, OPCR Upload, Compliance Dashboard, Faculty List, Reportorial Requirements |
| **Role-Based Interface Visibility (Dean)** | Log in as Dean (e.g., Onesa) | Dashboard shows: Dean Review Queue, OPCR Consolidation, College Analytics, Final Approval Queue |
| **Role-Based Interface Visibility (Chair)** | Log in as Program Chair (e.g., Colle) | Dashboard shows: My IPCR, Department OPCR, Faculty Monitoring, Chair-specific targets |
| **Role-Based Interface Visibility (Coordinator)** | Log in as Research/Extension Coordinator | Dashboard shows: Coordinator Queue (KRA2/KRA3 targets), Endorsement Queue, Specialized ratings |
| **Access Restriction Enforcement** | Faculty user attempts to access Secretary OPCR Upload screen via direct URL | System denies access and displays "Access denied. Secretary role required." |
| **Multi-Role User Handling** | Log in as user with Chair role (also has faculty responsibilities) | User sees combined interface with both Chair and Faculty features |

---

## 3. IPCR (Individual Performance Commitment and Review) Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View My IPCR** | Faculty member navigates to "My IPCR" screen | System displays current IPCR with all major functions, targets, and current ratings |
| **Auto-Generate IPCR from OPCR** | Faculty logs in for the first time after OPCR upload | System automatically generates IPCR with targets assigned to that faculty member |
| **Regenerate IPCR** | Faculty clicks "Regenerate IPCR" button and confirms | System deletes old IPCR and creates new one with latest OPCR targets |
| **Add Target Accomplishment** | Faculty clicks "Add Accomplishment" on a target, enters data, and saves | Accomplishment is saved; target status changes to "SUBMITTED" |
| **Edit Target Accomplishment** | Faculty edits an existing accomplishment before secretary review | Updated accomplishment is saved; target remains in "SUBMITTED" status |
| **Submit Target for Review** | Faculty completes accomplishment and clicks "Submit for Review" | Target status changes to "PENDING_SECRETARY"; appears in Secretary's queue |
| **View Target Status** | Faculty checks status of submitted target | System displays current status: DRAFT, SUBMITTED, PENDING_SECRETARY, RATED, APPROVED, RETURNED |
| **Upload Supporting Document** | Faculty uploads PDF evidence for a target accomplishment | Document is saved to system; file name and size displayed in target details |
| **View IPCR Rating Summary** | Faculty views their IPCR after ratings are complete | System displays: Strategic (45%), Core (45%), Support (10%) ratings and Final Rating |
| **Calculate Final Rating** | System computes final rating after all targets are rated | Final rating = (Strategic × 0.45) + (Core × 0.45) + (Support × 0.10); Adjectival rating displayed |
| **View Rating History** | Faculty accesses past IPCR records | Historical IPCRs displayed in chronological order with final ratings |
| **Filter Targets by Category** | Faculty filters targets by Strategic, Core, or Support | Only targets matching selected category are displayed |
| **Filter Targets by Status** | Faculty filters targets by Completed or Not Completed | Only targets matching selected status are displayed |
| **Search Target** | Faculty searches for specific target using keyword | System displays targets matching the search query |
| **Expand/Collapse Major Functions** | Faculty clicks on major function header | Section expands to show all targets or collapses to hide them |
| **View Target Details** | Faculty clicks on a specific target | Modal/screen displays full target details: description, measures, timeline, ratings, documents |

---

## 4. Secretary Review and Rating Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View Secretary Queue** | Secretary navigates to Review Queue screen | System displays all targets with status "PENDING_SECRETARY" grouped by faculty |
| **Rate Target (Q, E, T)** | Secretary enters ratings for Quality, Efficiency, Timeliness and saves | Ratings are saved; target status changes to "PENDING_COORDINATOR" or "PENDING_DEAN" based on KRA type |
| **Secretary Cannot Rate Own IPCR** | Secretary attempts to rate their own IPCR target | System prevents rating; displays message "You cannot rate your own IPCR" |
| **Secretary Cannot Rate Dean IPCR** | Secretary attempts to rate Dean's IPCR target | System prevents rating; displays message "Secretary cannot rate Dean's IPCR" |
| **Return Target to Faculty** | Secretary clicks "Return" button, enters reason, and submits | Target status changes to "RETURNED"; faculty receives notification with reason |
| **View Faculty Accomplishment** | Secretary clicks on target to view details | System displays accomplishment text, uploaded documents, and target information |
| **Filter Queue by Faculty** | Secretary filters queue by specific faculty member | Only targets from selected faculty are displayed |
| **Filter Queue by KRA Type** | Secretary filters by KRA1, KRA2, KRA3, Strategic, Support | Only targets matching selected KRA type are displayed |
| **Search Queue** | Secretary searches queue using faculty name or target keyword | System displays matching targets |
| **View Compliance Dashboard** | Secretary accesses compliance overview | Dashboard shows: Total Faculty, Submitted Count, Pending Count, Overdue Count, Submission Rate |
| **View Faculty Submission Status** | Secretary views list of all faculty with submission progress | System displays each faculty with: Total Targets, Submitted, Pending, Overdue, Status |

---

## 5. Coordinator Review and Endorsement Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View Coordinator Queue (Research)** | Research Coordinator accesses Coordinator Queue | System displays only KRA2 (Research) targets pending coordinator review |
| **View Coordinator Queue (Extension)** | Extension Coordinator accesses Coordinator Queue | System displays only KRA3 (Extension) targets pending coordinator review |
| **Endorse Target** | Coordinator reviews target and clicks "Endorse" | Target status changes to "ENDORSED"; moves to Dean's queue |
| **Return Target to Faculty** | Coordinator clicks "Return", enters feedback, and submits | Target status changes to "RETURNED"; faculty receives notification |
| **View Target Documents** | Coordinator opens target to review supporting documents | System displays all uploaded documents with preview/download options |
| **Filter by Endorsement Status** | Coordinator filters by Pending, Endorsed, or Returned | Only targets matching selected status are displayed |
| **Coordinator Cannot Review Non-KRA Targets** | Coordinator attempts to access KRA1 or Strategic targets | System restricts access; only shows KRA2/KRA3 based on coordinator type |

---

## 6. Dean Final Approval Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View Dean Queue** | Dean navigates to Review Queue | System displays all targets with status "PENDING_DEAN" or "ENDORSED" |
| **Approve Target** | Dean reviews target and clicks "Approve" | Target status changes to "APPROVED"; final rating is locked |
| **Override Rating** | Dean changes secretary/coordinator rating and approves | Target status changes to "APPROVED_OVERRIDE"; new rating is saved |
| **Return Target to Faculty** | Dean clicks "Return", enters reason, and submits | Target status changes to "RETURNED"; faculty receives notification |
| **View OPCR Consolidation** | Dean accesses OPCR Consolidation screen | System displays: Total Faculty, Approved Count, Pending Count, Average College Rating, Rating Distribution |
| **View Rating Distribution** | Dean views rating distribution chart | System displays breakdown: Outstanding, Very Satisfactory, Satisfactory, Unsatisfactory, Poor |
| **Submit OPCR Certification** | Dean clicks "Submit Certification to IPDU" after all approvals | System marks OPCR as consolidated; displays confirmation message |
| **Export OPCR Report** | Dean clicks "Export Report" button | System generates downloadable OPCR report (future: PDF/Excel format) |
| **View Faculty IPCR Details** | Dean clicks on specific faculty in consolidation list | System displays that faculty's complete IPCR with all ratings |

---

## 7. OPCR (Office Performance Commitment and Review) Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View OPCR Targets** | Any user navigates to OPCR screen | System displays current year's OPCR with all departmental targets organized by KRA |
| **Upload OPCR (Secretary)** | Secretary accesses "Upload OPCR" screen, selects year, and uploads file | System parses file and extracts targets (or loads sample data) |
| **Load Sample OPCR Data** | Secretary clicks "Load Sample Data" button | System loads 4 sample targets (Strategic, Core, Support) for selected year |
| **Review Extracted Targets** | Secretary reviews extracted targets before saving | System displays: Target ID, KRA, Function, Indicator, Target Value, Weight, Accountable Faculty |
| **Save OPCR Targets** | Secretary clicks "Save to System" after reviewing | System saves targets; auto-generates IPCRs for all accountable faculty members |
| **View OPCR by Year** | User selects different year from dropdown | System displays OPCR targets for selected year |
| **View Target Accountability** | User clicks on OPCR target to see details | System displays list of faculty members accountable for that target |
| **View Faculty Summary** | User views faculty summary section in OPCR | System displays each faculty with their assigned target count and completion status |
| **Filter OPCR by KRA** | User filters OPCR targets by KRA type | Only targets matching selected KRA are displayed |
| **Search OPCR Targets** | User searches OPCR using keyword | System displays targets matching search query |

---

## 8. Reportorial Requirements Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View Reportorial Requirements** | Faculty navigates to Reportorial Requirements screen | System displays all active requirements with submission status and deadlines |
| **Submit Report** | Faculty clicks "Submit" on requirement, uploads document, and saves | Document is uploaded; submission status changes to "Submitted"; timestamp recorded |
| **View Submission Status** | Faculty checks status of submitted report | System displays "Submitted" with submission date and uploaded file name |
| **Update Submitted Report** | Faculty re-uploads document for already submitted requirement | New document replaces previous one; submission timestamp is updated |
| **Delete Submitted Report** | Faculty clicks "Delete" on their submission | Submission is removed; status changes back to "Not Submitted" |
| **View Requirement Details** | Faculty clicks on requirement to view details | System displays: Title, Description, Deadline, Required Documents, Submission Status |
| **Filter by Submission Status** | Faculty filters by "Submitted" or "Not Submitted" | Only requirements matching selected filter are displayed |
| **View Overdue Requirements** | Faculty views requirements past deadline | Overdue requirements are highlighted in red with "OVERDUE" badge |
| **Secretary View All Submissions** | Secretary accesses reportorial folder for a requirement | System displays: Total Faculty, Submitted Count, Not Submitted Count, Submission Rate, List of all faculty |
| **Secretary Rate Submission** | Secretary opens faculty submission and assigns rating | Rating is saved; submission marked as "Rated" |
| **Secretary View Compliance Report** | Secretary views requirement compliance dashboard | System displays submission statistics and faculty-wise breakdown |
| **Generate Not Submitted Report** | Secretary clicks "Generate Report" for non-submitters | System generates list of faculty who haven't submitted |
| **Send Reminder** | Secretary clicks "Send Reminder" for requirement | System sends notification to all faculty who haven't submitted |

---

## 9. Messaging and Communication Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View Message Channels** | User navigates to Messages screen | System displays list of available channels based on user's role |
| **Access General Channel** | User opens "General" channel | System displays all messages in chronological order |
| **Post Message** | User types message and clicks "Send" | Message is posted immediately; visible to all channel members |
| **View Channel Members** | User clicks "View Members" in channel | System displays list of all users with access to that channel |
| **Role-Based Channel Access** | Faculty attempts to access "Dean's Office" channel | System restricts access; channel not visible in faculty's channel list |
| **Search Messages** | User searches for keyword in channel | System displays only messages containing the keyword |
| **Real-Time Message Update** | User A posts message while User B is viewing channel | User B sees new message appear without manual refresh |
| **View Unread Message Count** | User has unread messages in a channel | System displays unread count badge on channel icon |
| **Mark Channel as Read** | User opens channel with unread messages | Unread count clears; messages marked as read |

---

## 10. Notifications Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View Notifications** | User clicks notification bell icon | System displays list of all notifications with read/unread status |
| **Receive Target Returned Notification** | Secretary returns target to faculty | Faculty receives notification: "Target returned: [reason]" |
| **Receive Target Approved Notification** | Dean approves faculty target | Faculty receives notification: "Target approved by Dean" |
| **Receive Deadline Reminder** | System deadline is 3 days away | All faculty receive notification: "IPCR deadline in 3 days" |
| **Mark Notification as Read** | User clicks on notification | Notification is marked as read; unread count decreases |
| **Clear All Notifications** | User clicks "Clear All" button | All notifications are marked as read |
| **View Unread Count** | User has unread notifications | System displays unread count badge on notification bell |
| **Navigate from Notification** | User clicks notification about returned target | System navigates to IPCR Detail screen for that specific target |

---

## 11. Calendar and Deadline Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View Calendar** | User navigates to Calendar screen | System displays current month with deadline markers |
| **View Deadline Details** | User clicks on deadline date | System displays: Deadline name, Date, Days remaining, Description |
| **View Next Deadline** | User checks dashboard | System displays next upcoming deadline with countdown (e.g., "7 days until Mid-Year IPCR Deadline") |
| **Deadline Calculation (Mid-Year)** | System calculates days until July 10 | System displays accurate countdown to July 10 deadline |
| **Deadline Calculation (Year-End)** | System calculates days until January 10 | System displays accurate countdown to January 10 deadline |
| **Overdue Deadline Display** | Current date is past deadline | System displays "OVERDUE" status in red |

---

## 12. Profile and Settings Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **View Profile** | User navigates to Profile screen | System displays: Name, Email, Role, Department, Profile Picture |
| **Update Profile Information** | User edits name or email and saves | Updated information is saved and displayed |
| **Change Password** | User enters current password, new password, and confirms | Password is updated; user can log in with new password |
| **Toggle Dark Mode** | User clicks dark mode toggle | System switches to dark theme; preference is saved |
| **Toggle Light Mode** | User clicks light mode toggle | System switches to light theme; preference is saved |
| **Theme Persistence** | User enables dark mode, logs out, and logs back in | Dark mode preference is retained |
| **View System Information** | User views About section in profile | System displays: App version, Build number, Last updated date |

---

## 13. Dashboard and Analytics Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **Faculty Dashboard View** | Faculty logs in and views dashboard | System displays: My IPCR progress, Returned targets count, Deadline countdown, Quick actions |
| **Secretary Dashboard View** | Secretary logs in and views dashboard | System displays: Queue count, Total faculty, Submitted count, Overdue count, Compliance stats |
| **Dean Dashboard View** | Dean logs in and views dashboard | System displays: Queue count, Average rating, Approved count, Total faculty, Rating distribution |
| **Chair Dashboard View** | Chair logs in and views dashboard | System displays: My IPCR, Department targets, Faculty monitoring, Chair-specific stats |
| **Coordinator Dashboard View** | Coordinator logs in and views dashboard | System displays: Queue count, Endorsed count, Pending count, KRA-specific targets |
| **View IPCR Progress Bar** | Faculty views their IPCR progress | System displays progress bar: X% complete (based on approved targets / total targets) |
| **View Submission Compliance Chart** | Secretary views compliance dashboard | System displays chart showing submitted vs. not submitted breakdown |
| **View Rating Distribution Chart** | Dean views rating distribution | System displays bar chart with Outstanding, Very Satisfactory, Satisfactory, Unsatisfactory, Poor counts |
| **Quick Action: Create IPCR** | Faculty clicks "Create New IPCR" button | System navigates to Create IPCR screen |
| **Quick Action: Upload OPCR** | Secretary clicks "Upload OPCR" button | System navigates to OPCR Upload screen |

---

## 14. Input Validation Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **Empty Required Field** | User submits form with empty required field | System displays validation error: "This field is required" |
| **Invalid Email Format** | User enters invalid email (e.g., "test@") | System displays validation error: "Please enter a valid email address" |
| **Invalid Rating Value** | Secretary enters rating outside 1-5 range | System displays validation error: "Rating must be between 1 and 5" |
| **Invalid Date Format** | User enters invalid date | System displays validation error: "Please enter a valid date" |
| **File Size Limit** | User uploads file larger than 10MB | System displays validation error: "File size must be less than 10MB" |
| **Invalid File Type** | User uploads non-PDF file where PDF is required | System displays validation error: "Only PDF files are allowed" |
| **Minimum Length Validation** | User enters password shorter than 6 characters | System displays validation error: "Password must be at least 6 characters" |
| **Numeric Input Validation** | User enters letters in numeric field | System displays validation error: "Please enter a valid number" |

---

## 15. Security Module

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **Unauthorized Access Attempt (URL)** | Faculty user manually navigates to /secretary-opcr-upload | System denies access; displays "Access denied. Secretary role required." |
| **Unauthorized Access Attempt (API)** | Faculty user attempts to call Dean-only API endpoint | System returns 403 Forbidden error |
| **Session Timeout** | User remains idle for extended period (30+ minutes) | System automatically logs out user and redirects to login page |
| **Cross-Role Data Access** | Faculty A attempts to view Faculty B's IPCR via modified request | System denies access; returns "Access denied" or shows only own data |
| **SQL Injection Prevention** | User enters SQL command in search field (e.g., "'; DROP TABLE users;--") | System sanitizes input; no database modification occurs |
| **XSS Prevention** | User enters script tag in text field (e.g., "<script>alert('XSS')</script>") | System sanitizes input; script is not executed |
| **CSRF Token Validation** | User attempts to submit form without valid CSRF token | System rejects request; displays "Invalid request" |
| **Password Hashing** | Admin views user data in database | Passwords are stored as hashed values, not plain text |
| **Secure Session Storage** | User logs in; session data is stored | Session data is encrypted and stored securely in AsyncStorage |
| **Rate Limiting** | User attempts multiple rapid login attempts | System temporarily blocks user after 5 failed attempts |
| **Sensitive Data Exposure** | User triggers server error | System displays generic error message; no stack trace or database details revealed |
| **File Upload Security** | User uploads file with malicious content | System validates file type and scans for malicious content before storage |

---

## 16. Performance and Load Testing

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **Page Load Time** | User navigates to Dashboard screen | Page loads within 2 seconds |
| **IPCR List Rendering** | User views IPCR with 50+ targets | List renders smoothly without lag |
| **Search Performance** | User searches large dataset (100+ records) | Results display within 1 second |
| **Concurrent User Load** | 50 users access system simultaneously | System remains responsive; no crashes or slowdowns |
| **Large File Upload** | User uploads 8MB PDF document | Upload completes successfully within 10 seconds |
| **Database Query Performance** | System retrieves IPCR data for 100 faculty members | Query completes within 3 seconds |
| **API Response Time** | Frontend calls backend API endpoint | Response received within 500ms |

---

## 17. Data Integrity and Business Rules

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **IPCR Rating Calculation** | System calculates final rating with Strategic=4.5, Core=4.0, Support=3.5 | Final Rating = (4.5×0.45) + (4.0×0.45) + (3.5×0.10) = 4.175 |
| **Adjectival Rating Assignment** | Final rating is 4.175 | System displays "Very Satisfactory" (3.500-4.499 range) |
| **Target Weight Distribution** | System validates OPCR target weights | Strategic + Core + Support = 100% (45% + 45% + 10%) |
| **Duplicate IPCR Prevention** | System attempts to generate IPCR for faculty who already has one | System prevents duplicate; displays message or updates existing IPCR |
| **Cascade Delete Prevention** | Admin attempts to delete user with existing IPCR records | System prevents deletion; displays "Cannot delete user with existing records" |
| **Status Workflow Enforcement** | Faculty attempts to skip from DRAFT to APPROVED | System enforces workflow: DRAFT → SUBMITTED → PENDING_SECRETARY → PENDING_DEAN → APPROVED |
| **Deadline Enforcement** | Faculty attempts to submit target after deadline | System allows submission but marks as "Late" with timestamp |
| **Rating Dimension Validation** | Secretary rates target that requires Q, E, T | System enforces all three ratings must be provided before saving |
| **Coordinator Routing Logic** | Target with KRA2 is submitted | System routes to Research Coordinator queue, not Extension Coordinator |
| **Dean IPCR Special Handling** | Secretary attempts to rate Dean's IPCR | System prevents rating; Dean's IPCR follows different approval workflow |

---

## 18. Error Handling and Edge Cases

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **Network Connection Lost** | User loses internet connection during form submission | System displays "Network error. Please check your connection and try again." |
| **Server Unavailable** | Backend server is down | System displays "Server unavailable. Please try again later." |
| **Empty Dataset Display** | Faculty with no assigned OPCR targets views IPCR | System displays "No targets assigned. Please contact your administrator." |
| **Null Value Handling** | System encounters null rating value | System displays "N/A" or "Not Rated" instead of crashing |
| **Date Parsing Error** | System encounters invalid date format in data | System displays "Invalid date" and logs error without crashing |
| **File Not Found** | User attempts to view deleted document | System displays "Document not found" with option to re-upload |
| **Concurrent Edit Conflict** | Two users edit same record simultaneously | System detects conflict; displays "This record was modified by another user. Please refresh." |
| **Browser Compatibility** | User accesses system on older browser | System displays compatibility warning or gracefully degrades features |

---

## 19. Accessibility and Usability

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **Responsive Design (Mobile)** | User accesses system on mobile device (375px width) | UI adapts to mobile screen; all features remain accessible |
| **Responsive Design (Tablet)** | User accesses system on tablet (768px width) | UI adapts to tablet screen; navigation remains intuitive |
| **Responsive Design (Desktop)** | User accesses system on desktop (1920px width) | UI utilizes full screen; multi-column layout displayed |
| **Keyboard Navigation** | User navigates using Tab key | Focus moves logically through interactive elements |
| **Screen Reader Compatibility** | User with screen reader accesses system | All content is readable; proper ARIA labels are present |
| **Color Contrast** | User with visual impairment views interface | Text has sufficient contrast ratio (WCAG AA compliant) |
| **Touch Target Size** | User taps buttons on mobile device | All interactive elements are at least 44×44px (iOS) or 48×48px (Android) |
| **Error Message Clarity** | User encounters validation error | Error message is clear, specific, and provides guidance on how to fix |

---

## 20. Backup and Recovery

| TEST NAME | TEST DESCRIPTION | EXPECTED OUTPUT |
|-----------|------------------|-----------------|
| **Data Persistence** | User enters data, closes app, and reopens | Data is retained and displayed correctly |
| **Session Recovery** | App crashes during form entry | User can resume from last saved state upon restart |
| **Offline Data Access** | User loses connection while viewing IPCR | Previously loaded data remains accessible in read-only mode |
| **Auto-Save Functionality** | User types in form field and waits 5 seconds | System auto-saves draft without manual save action |
| **Data Export** | Admin exports all IPCR data | System generates complete data export in JSON/CSV format |

---

## Test Execution Summary Template

### Test Execution Record

| Test Date | Tester Name | Module Tested | Pass Rate | Failed Tests | Notes |
|-----------|-------------|---------------|-----------|--------------|-------|
| YYYY-MM-DD | Name | Module Name | X/Y (XX%) | Test IDs | Comments |

### Defect Log Template

| Defect ID | Test Case | Severity | Description | Status | Assigned To | Resolution Date |
|-----------|-----------|----------|-------------|--------|-------------|-----------------|
| DEF-001 | Login-002 | High | Login fails with special characters | Open | Dev Team | - |

### Test Status Legend

- ✅ **PASS**: Test executed successfully; expected output achieved
- ❌ **FAIL**: Test failed; actual output differs from expected
- ⚠️ **BLOCKED**: Test cannot be executed due to dependency
- ⏸️ **SKIPPED**: Test intentionally skipped
- 🔄 **RETEST**: Test needs to be re-executed after fix

---

## Notes for Testers

1. **Test Environment**: Use development environment with sample data
2. **Test Data**: Use provided test accounts (faculty@ccs.edu, secretary@ccs.edu, dean@ccs.edu)
3. **Browser Support**: Test on Chrome, Firefox, Safari, Edge
4. **Mobile Testing**: Test on iOS (Safari) and Android (Chrome)
5. **Regression Testing**: Re-run all tests after major updates
6. **Documentation**: Record all defects with screenshots and steps to reproduce

---

**Document Version**: 1.0  
**Prepared By**: QA Team  
**Approved By**: Project Manager  
**Next Review Date**: June 9, 2026
