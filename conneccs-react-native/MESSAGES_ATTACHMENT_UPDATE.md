# Messages Screen - Camera/File Picker Feature ✅

## Task Summary
Added camera and file picker functionality to the Messages screen's + button, matching the implementation from MyIPCRScreen.

## Changes Made

### 1. **New Imports**
- ✅ Added `Modal` and `Alert` from react-native
- ✅ Added `YStack`, `XStack`, `Text as TamaguiText` from tamagui
- ✅ Added `* as DocumentPicker` from expo-document-picker
- ✅ Added `* as ImagePicker` from expo-image-picker

### 2. **New State**
- ✅ Added `showAttachmentChoice` state to control modal visibility

### 3. **New Handler Functions**

#### `handleAttachmentPress()`
- Shows custom modal on web
- Shows native Alert dialog on mobile
- Triggered when + button is pressed

#### `handleTakePhoto()`
- **Web**: Uses HTML file input with camera capture
- **Mobile**: Requests camera permissions and launches camera
- Sends image message with photo

#### `handleChooseFile()`
- **Web**: Uses HTML file input for any file type
- **Mobile**: Uses DocumentPicker for file selection
- Supports images, PDFs, and Office documents
- Sends message with file attachment

#### `sendImageMessage(fileName, imageUrl)`
- Creates message with image indicator (📷 emoji)
- Saves to channel messages

#### `sendFileMessage(fileName, fileSize)`
- Creates message with file attachment
- Shows file name and size
- Saves to channel messages

### 4. **Updated + Button**
- ✅ Added `onPress={handleAttachmentPress}` to the + button
- Button now opens attachment choice modal

### 5. **Attachment Choice Modal**
- ✅ Beautiful modal matching MyIPCRScreen design
- ✅ Two options:
  - **Take Photo**: Camera icon, accent background
  - **Choose from Files**: Document icon, secondary background
- ✅ Cancel button at bottom
- ✅ Close button (X) in header
- ✅ Click outside to dismiss
- ✅ Theme-aware colors
- ✅ Responsive design

## Features

### Platform Support
- **Web**: Uses HTML file inputs with proper accept types
- **Mobile**: Uses native ImagePicker and DocumentPicker
- **Permissions**: Automatically requests camera permissions on mobile

### File Types Supported
- **Images**: All image formats (jpg, png, etc.)
- **Documents**: PDF, DOC, DOCX, XLS, XLSX
- **Camera**: Live photo capture

### User Experience
- Modal shows on web for better UX
- Native dialog on mobile for platform consistency
- Visual feedback with icons and descriptions
- File size automatically calculated and displayed
- Messages saved to AsyncStorage

## Testing Instructions

1. **Login to Messages Screen**
   - Use any quick login (e.g., Faculty Bagaporo)
   - Navigate to Messages

2. **Test + Button**
   - Click the + button in the message input area
   - Modal should appear with two options

3. **Test Take Photo**
   - Click "Take Photo" option
   - On web: File picker with camera option
   - On mobile: Camera app launches
   - Photo should be sent as message

4. **Test Choose from Files**
   - Click "Choose from Files" option
   - File picker opens
   - Select an image or document
   - File should be sent as attachment message

5. **Test Cancel**
   - Click Cancel button or X button
   - Modal should close
   - Click outside modal - should also close

## Visual Design

The modal matches the MyIPCRScreen design:
- **Take Photo**: Accent color background with camera icon
- **Choose from Files**: Secondary background with document icon
- **Icons**: Circular backgrounds with proper contrast
- **Typography**: Clear hierarchy with titles and descriptions
- **Spacing**: Consistent padding and gaps
- **Theme**: Fully theme-aware (light/dark mode)

## Files Modified
- `src/screens/MessagesScreen.tsx`

## Compilation Status
✅ No TypeScript errors
✅ No syntax errors
✅ File compiles successfully

## Next Steps
- Test on both web and mobile platforms
- Verify camera permissions work on mobile
- Test file uploads with different file types
- Verify messages persist in AsyncStorage
- Test theme switching with modal open
