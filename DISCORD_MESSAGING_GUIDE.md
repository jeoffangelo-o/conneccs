# ConneCCS Discord-Style Messaging System

## Overview
The ConneCCS messaging system is designed like Discord with channels, role-based access, real-time updates, and integrated Google Drive functionality.

## Key Features

### 1. Channel-Based Communication
- **Text Channels**: Organized by topic (general, ipcr-updates, research, admin-only)
- **Role-Based Access**: Users only see channels they have permission to access
- **Direct Messages**: One-on-one communication between users

### 2. Role-Based Permissions

#### Roles:
- **Dean**: Full access to all channels
- **Program Chair**: Access to general, IPCR, and admin channels
- **Research Coordinator**: Access to general, research, and admin channels
- **Faculty**: Access to general, IPCR, and research channels

#### Channel Access Matrix:
| Channel | Dean | Program Chair | Research Coord | Faculty |
|---------|------|---------------|----------------|---------|
| general | ✓ | ✓ | ✓ | ✓ |
| ipcr-updates | ✓ | ✓ | - | ✓ |
| research | ✓ | - | ✓ | ✓ |
| admin-only | ✓ | ✓ | ✓ | - |

### 3. Mentions/Tagging System

#### How to Mention:
- **Role Mention**: `@faculty` - Notifies all faculty members
- **User Mention**: `@dean` - Notifies specific user
- **Multiple Mentions**: `@faculty @program_chair` - Notifies multiple roles

#### Mention Behavior:
- Mentioned users see highlighted messages
- Messages with mentions appear with a colored border
- Only mentioned users receive notifications for that message

#### Available Role Tags:
- `@dean` - Dean's Office
- `@faculty` - All faculty members
- `@program_chair` - Program chairs
- `@research_coordinator` - Research coordinators

### 4. Real-Time Updates (AJAX Polling)

The system uses AJAX polling to simulate real-time messaging:
- **Poll Interval**: Every 3 seconds
- **New Message Detection**: Checks for messages after last received ID
- **Auto-Scroll**: Automatically scrolls to new messages
- **No Page Refresh**: Messages appear without reloading

#### How It Works:
```javascript
// Polls for new messages every 3 seconds
setInterval(pollMessages, 3000);

// Fetches only new messages
fetch(`/api/channel/${channelId}/new?after=${lastMessageId}`)
```

### 5. Google Drive Integration

#### Features:
- **File Browser**: View all files in Google Drive
- **Upload**: Upload files directly to Drive
- **Share to Channel**: Share Drive files in messages
- **Search**: Search files by name
- **Metadata Tracking**: Track uploader, timestamp, file type

#### Usage:
1. Click the Google Drive icon in chat header
2. Browse available files
3. Click "Share to channel" to post file link in chat
4. Files appear as attachments in messages

## User Interface

### Layout:
```
┌─────────────┬──────────────────────┬─────────────┐
│   Channel   │    Chat Messages     │   Members   │
│   Sidebar   │                      │   Sidebar   │
│             │                      │             │
│  #general   │  Message 1           │  DEAN       │
│  #ipcr      │  Message 2           │  • Dean     │
│  #research  │  Message 3           │             │
│             │                      │  FACULTY    │
│             │  [Input Box]         │  • Dr. A    │
│             │                      │  • Dr. B    │
└─────────────┴──────────────────────┴─────────────┘
```

### Components:

#### Channel Sidebar (Left):
- Channel list with icons
- Active channel highlighted
- Direct messages section
- User panel at bottom (shows online status)

#### Chat Area (Center):
- Channel name header
- Scrollable message list
- Message input with attach and send buttons
- Mention autocomplete

#### Member Sidebar (Right):
- Members grouped by role
- Online/offline status indicators
- Toggle visibility with button

## Message Features

### Message Structure:
```
┌─────────────────────────────────────┐
│ [Avatar] Dean's Office  DEAN  10:30 │
│          @faculty Please submit     │
│          your IPCR by Friday.       │
│                                     │
│          📎 IPCR_Template.docx      │
└─────────────────────────────────────┘
```

### Message Elements:
- **Avatar**: User's profile picture/initial
- **Username**: Display name
- **Role Badge**: Color-coded role indicator
- **Timestamp**: Relative time (e.g., "10m ago")
- **Message Text**: Supports mentions and line breaks
- **Attachments**: Files from Google Drive

### Message Types:
1. **Regular Message**: Standard text message
2. **Mentioned Message**: Highlighted with colored border
3. **File Share**: Message with Drive attachment
4. **System Message**: Automated notifications

## API Endpoints

### Message APIs:
- `GET /messages/api/channel/:channelId` - Get all messages in channel
- `GET /messages/api/channel/:channelId/new?after=:id` - Get new messages
- `POST /messages/api/send` - Send a message
- `GET /messages/api/channel-info/:channelId` - Get channel information

### Google Drive APIs:
- `GET /messages/api/drive/files` - List Drive files
- `POST /messages/api/share-file` - Share file to channel

## Usage Examples

### Sending a Message:
1. Type message in input box
2. Use `@role` to mention users
3. Press Enter or click Send button
4. Message appears immediately

### Mentioning Users:
```
@faculty Please review the new guidelines
@program_chair Can you approve this?
@dean FYI - submitted all reports
```

### Sharing Files:
1. Click Google Drive icon
2. Find file in list
3. Click "Share to channel" button
4. File link appears in chat

### Switching Channels:
1. Click channel name in sidebar
2. Messages load automatically
3. Input placeholder updates

## Best Practices

### For Administrators:
- Use `@faculty` for department-wide announcements
- Share important documents via Google Drive
- Use admin-only channel for sensitive discussions
- Pin important messages (future feature)

### For Faculty:
- Check mentions regularly
- Use appropriate channels for topics
- Upload documents to Drive before sharing
- Keep messages professional and concise

## Technical Implementation

### Real-Time Simulation:
```javascript
// Client-side polling
function pollMessages() {
  fetch(`/api/channel/${currentChannel}/new?after=${lastMessageId}`)
    .then(res => res.json())
    .then(data => {
      data.messages.forEach(msg => appendMessage(msg));
    });
}
```

### Role-Based Filtering:
```javascript
// Server-side access control
const channel = channels.find(ch => ch.id === channelId);
if (!channel.allowedRoles.includes(userRole)) {
  return res.status(403).json({ error: 'Access denied' });
}
```

### Mention Detection:
```javascript
// Extract mentions from message
const mentionRegex = /@(\w+)/g;
const mentions = [];
let match;
while ((match = mentionRegex.exec(message)) !== null) {
  mentions.push(match[1]);
}
```

## Future Enhancements

### Planned Features:
- [ ] WebSocket for true real-time updates
- [ ] Message reactions (emoji)
- [ ] Message editing and deletion
- [ ] Thread replies
- [ ] File upload from local computer
- [ ] Voice channels
- [ ] Message search
- [ ] Notification preferences
- [ ] Message pinning
- [ ] User presence (typing indicators)

## Troubleshooting

### Messages not appearing:
- Check if you have access to the channel
- Verify AJAX polling is running (check browser console)
- Refresh the page

### Can't see certain channels:
- Channels are filtered by role
- Contact admin to adjust permissions

### Google Drive not loading:
- Ensure Google Drive is configured
- Check authentication status
- Verify API credentials

## Support

For technical issues or feature requests, contact the development team or system administrator.
