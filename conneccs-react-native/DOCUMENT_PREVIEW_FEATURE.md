# Document Preview Feature Implementation

## Summary
Added complete document preview functionality to the secretary rating interface, allowing secretaries to view and open documents before rating targets.

## Changes Made

### 1. IPCRDetailScreen.tsx - Document Preview

#### New Imports
- Added `Linking` and `Platform` from React Native for document opening functionality

#### New State Variables
```typescript
const [documentPreviewVisible, setDocumentPreviewVisible] = useState(false);
const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
```

#### New Handler Functions

**handlePreviewDocument(fileUrl)**
- Opens the document preview modal
- Sets the selected document URL

**handleDownloadDocument(fileUrl)**
- Opens document in new tab (web)
- Uses Linking API to open document (mobile)
- Handles errors gracefully

**getFileIcon(fileName)**
- Returns appropriate icon based on file extension
- Supports: PDF, DOC/DOCX, XLS/XLSX, images (JPG, PNG, GIF)
- Returns 'document' icon as default

#### Updated Secretary Interface

**Documents List (Main View)**
- Documents are now **clickable TouchableOpacity** components
- Each document shows:
  - File type icon (PDF, DOC, image, etc.)
  - File name
  - Eye icon (preview indicator)
- Styled as cards with hover effect
- Click to open preview modal

**Documents in Rating Modal**
- Added documents section at top of rating modal
- Shows count: "📎 2 Document(s) - Click to preview"
- Lists all documents with icons
- Clickable to open preview modal
- Allows secretary to review documents while rating

#### New Document Preview Modal

Complete modal with:
- **Header**: "Document Preview" title with close button (X icon)
- **Body**: 
  - Large file type icon (48px)
  - Document filename
  - Instruction text: "Click 'Open Document' to view the file in a new window"
- **Actions**:
  - "Open Document" button (opens file in new tab/window)
- **Footer**: "Close" button

### 2. SvgIcon.js - New Icons

Added missing icons:
- `close` - X icon for closing modals
- `edit` - Pencil icon for editing
- `arrowForward` - Right arrow icon

Existing icons used:
- `image` - For image files
- `document` - For PDF, DOC, XLS files
- `eye` - For preview indicator

### 3. New Styles Added

```typescript
// Document Item Styles (clickable)
documentItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  paddingVertical: 8,
  paddingHorizontal: 12,
  backgroundColor: colors.bg,
  borderRadius: 6,
  marginBottom: 6,
  borderWidth: 1,
  borderColor: colors.border,
}

// Modal Documents Section
modalDocumentsSection: {
  marginTop: 12,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: colors.border,
}

modalDocumentsLabel: {
  fontSize: 12,
  fontWeight: '600',
  color: colors.text2,
  marginBottom: 8,
}

modalDocumentItem: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  paddingVertical: 6,
  paddingHorizontal: 8,
  backgroundColor: colors.bg,
  borderRadius: 4,
  marginBottom: 4,
}

// Document Preview Modal
previewModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
}

previewModalContent: {
  backgroundColor: colors.bg2,
  borderRadius: 12,
  padding: 24,
  width: '100%',
  maxWidth: 500,
}

documentPreviewCard: {
  backgroundColor: colors.bg3,
  borderRadius: 8,
  padding: 24,
  alignItems: 'center',
}

openDocButton: {
  backgroundColor: colors.accent,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 12,
  borderRadius: 6,
  gap: 8,
}
```

## User Workflow

### From Main Secretary Interface

1. Secretary views target with documents
2. Sees clickable document list with icons
3. Clicks on a document
4. Preview modal opens showing:
   - Document name
   - File type icon
   - "Open Document" button
5. Clicks "Open Document"
6. Document opens in new tab/window
7. Secretary reviews document
8. Closes preview modal
9. Continues rating

### From Rating Modal

1. Secretary clicks "Rate This Target"
2. Rating modal opens
3. Sees documents section at top:
   - "📎 2 Document(s) - Click to preview"
   - List of documents with icons
4. Clicks on a document to preview
5. Preview modal opens (same as above)
6. Reviews document
7. Closes preview modal
8. Returns to rating modal
9. Enters ratings based on document review

## Visual Flow

```
┌─────────────────────────────────────────┐
│ Secretary Rating Interface              │
│                                         │
│ Documents: 2 file(s)                   │
│ ┌─────────────────────────────────┐   │
│ │ 📄 evidence1.pdf            👁  │ ← Click
│ └─────────────────────────────────┘   │
│ ┌─────────────────────────────────┐   │
│ │ 📄 evidence2.docx           👁  │   │
│ └─────────────────────────────────┘   │
│                                         │
│ [⭐ Rate This Target]                  │
└─────────────────────────────────────────┘
                  │
                  │ Click document
                  ▼
┌─────────────────────────────────────────┐
│ Document Preview                    ✕   │
│                                         │
│         📄                              │
│    evidence1.pdf                        │
│                                         │
│ Click "Open Document" to view the      │
│ file in a new window                   │
│                                         │
│ [👁 Open Document]                     │
│                                         │
│ [Close]                                 │
└─────────────────────────────────────────┘
                  │
                  │ Click "Open Document"
                  ▼
┌─────────────────────────────────────────┐
│ New Browser Tab/Window                  │
│                                         │
│ [PDF/Document Viewer]                   │
│                                         │
│ evidence1.pdf content displayed         │
└─────────────────────────────────────────┘
```

## File Type Icons

| Extension | Icon | Description |
|-----------|------|-------------|
| .pdf | 📄 document | PDF files |
| .doc, .docx | 📄 document | Word documents |
| .xls, .xlsx | 📄 document | Excel spreadsheets |
| .jpg, .jpeg, .png, .gif | 🖼️ image | Image files |
| Other | 📄 document | Default document icon |

## Platform Support

### Web (Browser)
- Uses `window.open(fileUrl, '_blank')`
- Opens document in new browser tab
- Works with all file types supported by browser
- PDF files open in browser's PDF viewer
- Office files may download or open in Office Online

### Mobile (iOS/Android)
- Uses React Native `Linking.openURL(fileUrl)`
- Opens document in appropriate app
- PDF opens in system PDF viewer
- Office files open in Office apps if installed
- Images open in photo viewer

## Benefits

### For Secretaries
1. **Review Before Rating**: Can view documents before entering ratings
2. **Easy Access**: One-click document preview
3. **Context Switching**: Can preview documents without leaving rating modal
4. **Visual Feedback**: Clear icons show file types
5. **Multiple Documents**: Can review all documents for a target

### For System
1. **Better Ratings**: Secretaries make informed decisions
2. **Audit Trail**: Documents are easily accessible
3. **User Experience**: Smooth, intuitive workflow
4. **Cross-Platform**: Works on web and mobile

## Future Enhancements

1. **Inline Preview**: Show PDF/images directly in modal (no new tab)
2. **Document Annotations**: Allow secretaries to add notes on documents
3. **Zoom Controls**: For image documents
4. **Download Button**: Explicit download option
5. **Document History**: Track which documents were viewed
6. **Thumbnail Preview**: Show small preview before opening
7. **Multiple Document Viewer**: Navigate between documents without closing modal
8. **Document Comparison**: Side-by-side view of multiple documents

## Testing Checklist

- [x] Documents show in secretary interface
- [x] Documents are clickable
- [x] Preview modal opens on click
- [x] File type icons display correctly
- [x] "Open Document" button works
- [x] Documents open in new tab (web)
- [x] Modal closes properly
- [x] Documents show in rating modal
- [x] Can preview documents while rating
- [x] Multiple documents all work
- [x] Error handling for invalid URLs
- [x] Works with different file types

## Files Modified

1. `src/screens/IPCRDetailScreen.tsx` - Added document preview functionality
2. `src/components/SvgIcon.js` - Added close, edit, arrowForward icons

## Notes

- Document URLs are currently stored as strings in `target.movFileUrls` array
- Actual file hosting/storage is handled separately
- Preview modal is lightweight and fast
- Works with any valid URL (local or remote)
- Graceful error handling for invalid URLs or unsupported file types
