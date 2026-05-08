# Reportorial Requirements - Implementation Plan

## Overview
Implementing comprehensive reportorial requirements management system with:
1. Secretary template upload to folders
2. Designated sections for each requirement
3. Reminder system for non-submitters
4. Report generation (submitted/not submitted)
5. Automatic messaging to channels

## Features to Implement

### 1. **Secretary Template Upload**
- Secretary can upload template files to each requirement folder
- Templates are stored and accessible to all faculty
- Template preview and download functionality
- Version control for templates

### 2. **Folder Management**
- Each requirement has a dedicated folder
- Folder shows:
  - Template file (if uploaded)
  - All faculty submissions
  - Submission status for each faculty member
  - Ratings and feedback

### 3. **Reminder System**
- Button to send reminders to faculty who haven't submitted
- Bulk reminder functionality
- Individual reminder option
- Reminder history tracking

### 4. **Report Generation**
- Generate "Who Submitted" report
- Generate "Who Did Not Submit" report
- Export reports as PDF/Excel
- Summary statistics dashboard

### 5. **Messaging Integration**
- Automatic message to messaging channels
- Notification to non-submitters
- Announcement of new requirements
- Deadline reminders

## Implementation Steps

### Step 1: Update Types (✅ DONE)
- Added `ReportorialRequirement` type
- Added `ReportorialSubmission` type
- Added `ReportorialReminder` type
- Added `ReportorialReport` type
- Added `MessageChannel` and `Message` types

### Step 2: Create Reportorial Context
- Manage reportorial requirements state
- Handle template uploads
- Track submissions
- Generate reports
- Send reminders

### Step 3: Update ReportorialRequirementsScreen
- Add secretary-specific features
- Template upload button
- Reminder button
- Report generation button
- Status overview

### Step 4: Create ReportorialFolderScreen
- Show requirement details
- Display template file
- List all faculty submissions
- Show submission status grid
- Rating interface for secretary

### Step 5: Create Messaging System
- Message channels
- Send/receive messages
- Notification system
- Integration with reportorial reminders

### Step 6: Create Report Generation
- PDF export functionality
- Excel export functionality
- Summary statistics
- Visual charts

## File Structure

```
src/
├── context/
│   └── ReportorialContext.tsx (NEW)
├── screens/
│   ├── ReportorialRequirementsScreen.tsx (UPDATE)
│   ├── ReportorialFolderScreen.tsx (NEW)
│   ├── ReportorialSubmitScreen.tsx (NEW)
│   ├── MessagingScreen.tsx (NEW)
│   └── MessageChannelScreen.tsx (NEW)
├── components/
│   ├── TemplateUploadButton.tsx (NEW)
│   ├── ReminderButton.tsx (NEW)
│   ├── ReportGenerator.tsx (NEW)
│   └── SubmissionStatusGrid.tsx (NEW)
└── utils/
    ├── reportGenerator.ts (NEW)
    └── messageService.ts (NEW)
```

## Next Steps
1. Create ReportorialContext with state management
2. Update ReportorialRequirementsScreen with secretary features
3. Create ReportorialFolderScreen for detailed view
4. Implement messaging system
5. Add report generation functionality
