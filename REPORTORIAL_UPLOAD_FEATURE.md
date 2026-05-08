# Reportorial Requirements Upload Feature

## Overview
Implemented automatic timeliness rating and self-quality rating system for reportorial requirement submissions in the folder view.

## Features Implemented

### 1. **Automatic Timeliness Rating**
- Calculated automatically based on submission date vs deadline
- Uses the `calculateTimelinessRating()` utility function
- Rating scale:
  - **5** - Submitted 2+ days early
  - **4** - Submitted 1 day early
  - **3** - Submitted on time
  - **3** - Submitted late
  - **1** - Not completed

### 2. **Self Quality Rating**
- Faculty members rate their own work quality (1-5 scale)
- Interactive button interface for easy selection
- Required field before submission
- Visual feedback with active state highlighting

### 3. **Accomplishments Description**
- Required text area for describing what was accomplished
- Multi-line input for detailed descriptions
- Validates that field is not empty before allowing submission

### 4. **File Upload Options**
- **Document Upload**: PDF, DOC, DOCX files
- **Image Upload**: JPG, PNG files
- Uses native pickers:
  - `expo-document-picker` for documents
  - `expo-image-picker` for images
- Displays file name and size after selection

### 5. **Submission Display**
- Shows all faculty submissions in a list
- Each submission displays:
  - File name and icon
  - Uploader name and timestamp
  - File size
  - Status badge (pending, approved, rejected)
  - Quality rating (Q: X/5)
  - Timeliness rating (T: X/5)
  - Accomplishments preview (truncated to 2 lines)

## User Flow

### Faculty Submission Process:
1. Navigate to Reportorial Requirements
2. Click on a requirement card to open folder view
3. Click "Upload" button in top-right
4. **Upload Modal Opens:**
   - Choose Document (PDF, DOC, DOCX) OR Choose Image (JPG, PNG)
   - File name and size displayed after selection
   - Enter accomplishments/description (required)
   - Select self quality rating 1-5 (required)
   - **Automatic timeliness rating calculated and displayed**
   - Info box shows: "Automatic Timeliness Rating: X - [description]"
   - Info box shows deadline reference
5. Click "Submit" button (disabled until file + accomplishments provided)
6. Document added to list with "pending" status

### Secretary Review Process:
1. Login as secretary
2. Navigate to Reportorial Requirements (filtered to their assignments)
3. Click on requirement to see all faculty submissions
4. View each submission with ratings and accomplishments
5. Can approve/reject submissions (future enhancement)

## Technical Implementation

### File: `ReportorialFolderScreen.tsx`

#### State Management
```typescript
const [selectedFile, setSelectedFile] = useState<any>(null);
const [qualityRating, setQualityRating] = useState<number>(5);
const [accomplishments, setAccomplishments] = useState<string>('');
const [calculatedTimelinessRating, setCalculatedTimelinessRating] = useState<number>(5);
```

#### Document Type
```typescript
type Document = {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  status: 'pending' | 'approved' | 'rejected';
  qualityRating?: number;
  timelinessRating?: number;
  accomplishments?: string;
};
```

#### File Selection Handlers
```typescript
const handleFileSelect = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'application/msword', ...],
    copyToCacheDirectory: true,
  });
  
  if (!result.canceled) {
    setSelectedFile(file);
    // Calculate automatic timeliness
    const timelinessRating = calculateTimelinessRating(requirement.deadline, new Date());
    setCalculatedTimelinessRating(timelinessRating);
  }
};

const handleImageSelect = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 1,
  });
  
  if (!result.canceled) {
    setSelectedFile(image);
    // Calculate automatic timeliness
    const timelinessRating = calculateTimelinessRating(requirement.deadline, new Date());
    setCalculatedTimelinessRating(timelinessRating);
  }
};
```

#### Upload Handler
```typescript
const handleUpload = () => {
  if (!selectedFile || !accomplishments.trim()) return;

  const newDoc: Document = {
    id: String(Date.now()),
    name: selectedFile.name,
    uploadedBy: user?.name || 'Unknown',
    uploadedAt: new Date().toLocaleString(),
    size: selectedFile.size,
    status: 'pending',
    qualityRating: qualityRating,
    timelinessRating: calculatedTimelinessRating,
    accomplishments: accomplishments,
  };

  setDocuments([newDoc, ...documents]);
  // Reset form
  setSelectedFile(null);
  setQualityRating(5);
  setAccomplishments('');
  setCalculatedTimelinessRating(5);
  setShowUploadModal(false);
};
```

#### Timeliness Label Helper
```typescript
const getTimelinessLabel = (rating: number) => {
  switch (rating) {
    case 5: return '5 - Submitted 2+ days early';
    case 4: return '4 - Submitted 1 day early';
    case 3: return '3 - Submitted on time';
    case 2: return '2 - Submitted late';
    case 1: return '1 - Not completed';
    default: return 'N/A';
  }
};
```

## UI Components

### Upload Modal Structure
```
┌─────────────────────────────────────┐
│ Upload Document              [X]    │
├─────────────────────────────────────┤
│ [📄 Choose Document (PDF...)]       │
│ [🖼️ Choose Image (JPG, PNG)]        │
│                                     │
│ Accomplishments / Description *     │
│ ┌─────────────────────────────────┐ │
│ │ [Text area for description]     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Self Quality Rating *               │
│ Rate the quality of your work (1-5) │
│ [1] [2] [3] [4] [5]                │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ℹ️ Automatic Timeliness Rating:  │ │
│ │ 5 - Submitted 2+ days early     │ │
│ │ Based on: May 2026              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ • Accepted formats: PDF, DOC...     │
│ • Maximum file size: 10 MB          │
│ • Timeliness rating is automatic    │
│ • Files reviewed by [STAFF]         │
│                                     │
│ [Cancel]              [📤 Submit]   │
└─────────────────────────────────────┘
```

### Document Card Display
```
┌─────────────────────────────────────────┐
│ [📄] Letter_of_Intent_Juan.pdf          │
│      Uploaded by Prof. Juan Dela Cruz   │
│      2026-04-15 10:30 AM • 2.4 MB       │
│      [Q: 5/5] [T: 5/5]                  │
│      "Submitted complete letter with..." │
│                              [✅ Approved]│
└─────────────────────────────────────────┘
```

## Validation Rules

1. **File Selection**: At least one file (document OR image) must be selected
2. **Accomplishments**: Cannot be empty or whitespace-only
3. **Quality Rating**: Defaults to 5, can be changed to 1-5
4. **Timeliness Rating**: Automatically calculated, cannot be manually changed
5. **Submit Button**: Disabled until file + accomplishments are provided

## Integration with IPCR

The reportorial requirements system is connected to IPCR Major Function #6 (Laboratory Compliance and Academic Reportorial Requirements). When a requirement is submitted:

1. Document is added to the folder with ratings
2. IPCR target for that requirement can be updated
3. Quality and Timeliness ratings contribute to IPCR scoring
4. Secretary reviews and approves/rejects submissions

## Future Enhancements

1. **File Preview**: View PDF/image before submitting
2. **Edit Submission**: Allow faculty to update their submission
3. **Bulk Upload**: Upload multiple files at once
4. **Secretary Actions**: Approve/reject with comments
5. **Notification System**: Alert faculty when submission is reviewed
6. **Analytics Dashboard**: Track submission rates and timeliness
7. **Export Reports**: Generate reports for each requirement
8. **File Storage**: Integrate with actual cloud storage (Google Drive, AWS S3)
9. **Version History**: Track multiple submissions for same requirement
10. **Deadline Reminders**: Automatic notifications before deadlines

## Testing Checklist

- [x] Document picker opens and selects files
- [x] Image picker opens and selects images
- [x] File name and size displayed after selection
- [x] Accomplishments text area accepts input
- [x] Quality rating buttons work (1-5)
- [x] Timeliness rating calculated automatically
- [x] Timeliness label displays correctly
- [x] Submit button disabled without file/accomplishments
- [x] Submit button enabled with valid inputs
- [x] Document added to list after submission
- [x] Ratings displayed in document card
- [x] Accomplishments preview shown (truncated)
- [x] Modal closes after submission
- [x] Form resets after submission
- [x] No TypeScript errors

## Dependencies

- `expo-document-picker`: For selecting PDF, DOC, DOCX files
- `expo-image-picker`: For selecting JPG, PNG images
- `../../utils/timeliness`: For automatic timeliness calculation
- `../components/SvgIcon`: For UI icons (upload, image, document, info, etc.)
