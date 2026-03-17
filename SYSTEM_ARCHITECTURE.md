# ConneCCS System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Dashboard  │  │   Messaging  │  │  Google Drive│         │
│  │      UI      │  │   Interface  │  │    Modal     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                    AJAX Polling (3s)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS SERVER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    ROUTE HANDLERS                         │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐   │  │
│  │  │Dashboard│ │Messages │ │  IPCR   │ │   Faculty    │   │  │
│  │  │ Routes  │ │ Routes  │ │ Routes  │ │   Routes     │   │  │
│  │  └─────────┘ └─────────┘ └─────────┘ └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────┴────────────────────────────────┐ │
│  │              MIDDLEWARE & LOGIC                           │ │
│  │  • Role-Based Access Control                              │ │
│  │  • Message Validation                                     │ │
│  │  • Mention Extraction                                     │ │
│  │  • File Metadata Tracking                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────┬───────────────────────┘
                         │                │
                         ▼                ▼
        ┌────────────────────┐  ┌──────────────────────┐
        │   JSON DATA STORE  │  │  GOOGLE DRIVE API    │
        │  ┌──────────────┐  │  │  ┌────────────────┐  │
        │  │ messages.json│  │  │  │  OAuth2 Auth   │  │
        │  │ faculty.json │  │  │  │  File Upload   │  │
        │  │ ipcr.json    │  │  │  │  File List     │  │
        │  │ reports.json │  │  │  │  File Share    │  │
        │  └──────────────┘  │  │  └────────────────┘  │
        └────────────────────┘  └──────────────────────┘
```

## Messaging System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER SENDS MESSAGE                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Client validates│
                    │ input not empty │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ POST /api/send  │
                    │ {channelId,     │
                    │  message}       │
                    └────────┬────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │         SERVER PROCESSING              │
        │  1. Verify user role                   │
        │  2. Check channel access               │
        │  3. Extract mentions (@role)           │
        │  4. Create message object              │
        │  5. Save to messages.json              │
        │  6. Return new message                 │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │     CLIENT RECEIVES RESPONSE           │
        │  • Append message to chat              │
        │  • Clear input field                   │
        │  • Scroll to bottom                    │
        └────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │    OTHER USERS (via polling)           │
        │  • Poll every 3 seconds                │
        │  • GET /api/channel/:id/new            │
        │  • Receive new messages                │
        │  • Display in chat                     │
        └────────────────────────────────────────┘
```

## Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REQUEST                            │
│                  GET /api/channel/general                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Extract user    │
                    │ role from       │
                    │ session/token   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Load channel    │
                    │ configuration   │
                    │ from JSON       │
                    └────────┬────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │  Check: user.role in                   │
        │  channel.allowedRoles?                 │
        └────────┬───────────────────────┬────────┘
                 │                       │
            YES  │                       │  NO
                 ▼                       ▼
        ┌─────────────────┐    ┌─────────────────┐
        │ Return messages │    │ Return 403      │
        │ for channel     │    │ Access Denied   │
        └─────────────────┘    └─────────────────┘
```

## Google Drive Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              USER CLICKS GOOGLE DRIVE ICON                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Open Drive      │
                    │ Modal           │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ GET /api/drive/ │
                    │ files           │
                    └────────┬────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │      GOOGLE DRIVE API                  │
        │  1. Check OAuth token                  │
        │  2. Call Drive API                     │
        │  3. List files                         │
        │  4. Return file metadata               │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │     DISPLAY FILES IN MODAL             │
        │  • File name                           │
        │  • File size                           │
        │  • Modified date                       │
        │  • Share button                        │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │   USER CLICKS "SHARE TO CHANNEL"       │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │  POST /api/share-file                  │
        │  {channelId, fileId}                   │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │  CREATE MESSAGE WITH ATTACHMENT        │
        │  • Message: "Shared a file"            │
        │  • Attachments: [{name, url, id}]      │
        └────────────────┬───────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │  FILE LINK APPEARS IN CHAT             │
        │  Users can click to open in Drive      │
        └────────────────────────────────────────┘
```

## Data Models

### Channel Model
```javascript
{
  id: "general",
  name: "general",
  description: "General discussions",
  allowedRoles: ["dean", "faculty", "program_chair"],
  type: "text"
}
```

### Message Model
```javascript
{
  id: 1,
  channelId: "general",
  userId: "dean",
  userName: "Dean's Office",
  userRole: "dean",
  message: "@faculty Please submit reports",
  timestamp: "2024-03-15T10:30:00",
  mentions: ["faculty"],
  attachments: [
    {
      id: "file_1",
      name: "Report_Template.docx",
      url: "https://drive.google.com/..."
    }
  ]
}
```

### User Model (Simulated)
```javascript
{
  id: "dean",
  name: "Dean's Office",
  role: "dean",
  email: "dean@university.edu",
  status: "online"
}
```

## Component Hierarchy

```
App
├── Sidebar
│   ├── Logo
│   ├── Navigation Menu
│   │   ├── Dashboard
│   │   ├── Reports
│   │   ├── IPCR
│   │   ├── Workload
│   │   ├── Faculty
│   │   ├── Announcements
│   │   └── Messages ← NEW
│   └── User Panel
│
├── Main Content
│   └── Messages Page
│       ├── Channel Sidebar
│       │   ├── Channel List
│       │   │   ├── #general
│       │   │   ├── #ipcr-updates
│       │   │   ├── #research
│       │   │   └── #admin-only
│       │   └── User Status Panel
│       │
│       ├── Chat Container
│       │   ├── Chat Header
│       │   │   ├── Channel Name
│       │   │   └── Action Buttons
│       │   │       ├── Members Toggle
│       │   │       └── Google Drive
│       │   │
│       │   ├── Message List
│       │   │   └── Message Items
│       │   │       ├── Avatar
│       │   │       ├── Username
│       │   │       ├── Role Badge
│       │   │       ├── Timestamp
│       │   │       ├── Message Text
│       │   │       └── Attachments
│       │   │
│       │   └── Input Container
│       │       ├── Attach Button
│       │       ├── Text Input
│       │       ├── Send Button
│       │       └── Mention Suggestions
│       │
│       └── Member Sidebar
│           └── Member List
│               ├── Dean Section
│               ├── Program Chairs
│               └── Faculty
│
└── Modals
    └── Google Drive Modal
        ├── Toolbar
        │   ├── Upload Button
        │   └── Search Input
        └── File List
            └── File Items
                ├── Icon
                ├── Name & Metadata
                └── Actions
                    ├── Share
                    └── Open
```

## Technology Stack Details

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Template Engine: EJS                                     │  │
│  │  JavaScript: Vanilla JS (ES6+)                            │  │
│  │  CSS: Custom (Dark Theme)                                 │  │
│  │  AJAX: Fetch API                                          │  │
│  │  Real-time: Polling (3s interval)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Runtime: Node.js (v18+)                                  │  │
│  │  Framework: Express.js (v5)                               │  │
│  │  Template: EJS (v5)                                       │  │
│  │  APIs: Google Drive API (googleapis)                      │  │
│  │  File Upload: Multer                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Format: JSON Files                                       │  │
│  │  Files:                                                   │  │
│  │    • messages.json (channels & messages)                  │  │
│  │    • faculty.json (faculty data)                          │  │
│  │    • ipcr.json (IPCR records)                             │  │
│  │    • reports.json (report submissions)                    │  │
│  │  Cloud: Google Drive (documents)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL APIS                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Google Drive API v3                                      │  │
│  │    • OAuth2 Authentication                                │  │
│  │    • File Management                                      │  │
│  │    • Permission Control                                   │  │
│  │    • Metadata Tracking                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Layer 1: Authentication (To be implemented)              │  │
│  │    • User login/logout                                    │  │
│  │    • Session management                                   │  │
│  │    • JWT tokens                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Layer 2: Authorization (Implemented)                     │  │
│  │    • Role-based access control                            │  │
│  │    • Channel permissions                                  │  │
│  │    • File access control                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Layer 3: Data Validation (Implemented)                   │  │
│  │    • Input sanitization                                   │  │
│  │    • Message validation                                   │  │
│  │    • File type checking                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Layer 4: External API Security (Implemented)             │  │
│  │    • OAuth2 for Google Drive                              │  │
│  │    • Secure token storage                                 │  │
│  │    • API key protection                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Recommended)

```
                        ┌─────────────┐
                        │   USERS     │
                        └──────┬──────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   HTTPS     │
                        │   (SSL)     │
                        └──────┬──────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   NGINX     │
                        │ (Reverse    │
                        │  Proxy)     │
                        └──────┬──────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │   PM2 Process    │
                    │   Manager        │
                    └────────┬─────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
         ┌──────────┐ ┌──────────┐ ┌──────────┐
         │ Node.js  │ │ Node.js  │ │ Node.js  │
         │ Instance │ │ Instance │ │ Instance │
         │    1     │ │    2     │ │    3     │
         └────┬─────┘ └────┬─────┘ └────┬─────┘
              │            │            │
              └────────────┼────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌─────────────┐          ┌─────────────┐
       │  MongoDB/   │          │   Google    │
       │  PostgreSQL │          │   Drive     │
       │  (Database) │          │    API      │
       └─────────────┘          └─────────────┘
```

---

**This architecture supports the ConneCCS requirements for:**
- ✅ Centralized communication
- ✅ Role-based access control
- ✅ Real-time updates
- ✅ Cloud-based document management
- ✅ Scalability and maintainability
