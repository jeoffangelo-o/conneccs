# ConneCCS

**Web-Based Faculty Reporting, IPCR Monitoring, and Workload Management System for the CCS Department**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-ISC-orange)

## Team Epperoni
1. Bañaria, Jeoff Angelo G.
2. Baroso, Jaspher O.
3. Borromeo, Jef Andry A.
4. Ibarreta, John Lloyd B.
5. Villanueva, June M.

## Overview

ConneCCS is a centralized, automated, and role-based web platform that improves faculty communication, reporting, performance evaluation, and workload distribution for the College of Computer Studies (CCS).

### UN Sustainable Development Goals
- **SDG 9** – Industry, Innovation, and Infrastructure
- **SDG 16** – Peace, Justice, and Strong Institutions

### Research Agenda
- **RDA**: Industry 4.0 and Digital Transformation
- **Priority Area**: Information Science

## Key Features

### 0. Authentication System
- **Login/Register**: Secure user authentication
- **Role-Based Access**: Different permissions for Dean, Program Chairs, Research Coordinators, and Faculty
- **Session Management**: Persistent login sessions
- **Logout**: Secure logout functionality
- **Demo Accounts**: Quick login for testing

### 1. Discord-Style Messaging System
- **Channel-Based Communication**: Organized channels (general, ipcr-updates, research, admin-only)
- **Role-Based Access Control**: Users only see channels they have permission to access
- **Real-Time Updates**: AJAX polling for instant message delivery (3-second intervals)
- **Mention/Tagging System**: Tag roles (@faculty, @dean) to notify specific groups
- **Direct Messages**: One-on-one communication between users
- **Member List**: See who's online with status indicators

### 2. Google Drive Integration
- **Cloud-Based Document Management**: Automatic upload to Google Drive
- **File Sharing**: Share Drive files directly in chat channels
- **Metadata Tracking**: Track filename, uploader, timestamp, file type
- **Role-Based File Access**: Restricted access based on user roles
- **Search Functionality**: Find files quickly by name or content

### 3. Automated Faculty Reporting
- Real-time tracking of required reports and academic documents
- Dashboard displaying submission status per faculty
- Timestamped record of uploads for audit transparency

### 4. Integrated IPCR Monitoring
- Digital IPCR entry, review, and automated score computation
- Weighted scoring system based on predefined criteria
- Role-based IPCR validation workflow

### 5. Faculty Workload Balancing
- Track extension, research, and teaching loads per faculty
- Recommendations for equitable task assignment
- Prevent faculty overloading

### 6. Role-Based Access Control
Distinct permissions for:
- **Dean**: Full oversight, approval, and performance summary
- **Research Coordinators**: Report validation and research monitoring
- **Program Chairs**: Submission tracking and IPCR scoring
- **Faculty Members**: Submission of reports, IPCR entries, and documents

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templating, Vanilla JavaScript
- **APIs**: Google Drive API (OAuth2)
- **Real-Time**: AJAX polling (upgradeable to WebSockets)
- **Styling**: Custom CSS with dark theme

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Cloud Platform account (for Drive integration)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd conneccs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google Drive** (Optional but recommended)
   - Follow instructions in `GOOGLE_DRIVE_SETUP.md`
   - Place credentials in `data/google-credentials.json`

4. **Add your logo** (Optional)
   - Place logo image as `public/images/logo.png`
   - See `public/images/README.md` for specifications

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open browser to `http://localhost:3000`
   - You'll be redirected to the login page
   - Use demo account: `dean@ccs.edu` / `password123`
   - Or register a new account

## Project Structure

```
conneccs/
├── app.js                      # Main application entry
├── package.json                # Dependencies and scripts
├── config/
│   └── google-drive.js         # Google Drive API wrapper
├── data/
│   ├── announcements.json      # Announcements data
│   ├── faculty.json            # Faculty information
│   ├── ipcr.json               # IPCR records
│   ├── messages.json           # Chat messages and channels
│   ├── reports.json            # Report submissions
│   └── google-credentials.json # Google OAuth credentials (not in repo)
├── public/
│   ├── css/
│   │   └── style.css           # Application styles
│   └── images/
│       └── logo.png            # Your logo (not in repo)
├── routes/
│   ├── announcements.js        # Announcement routes
│   ├── dashboard.js            # Dashboard routes
│   ├── faculty.js              # Faculty management routes
│   ├── ipcr.js                 # IPCR routes
│   ├── messages.js             # Messaging system routes
│   ├── reports.js              # Report routes
│   └── workload.js             # Workload routes
├── views/
│   ├── pages/                  # Page templates
│   └── partials/               # Reusable components
└── docs/
    ├── DISCORD_MESSAGING_GUIDE.md
    └── GOOGLE_DRIVE_SETUP.md
```

## Usage

### Messaging System

1. **Access Messages**: Click "Messages" in the sidebar
2. **Switch Channels**: Click channel name in left sidebar
3. **Send Message**: Type in input box and press Enter
4. **Mention Users**: Use `@role` (e.g., `@faculty`, `@dean`)
5. **Share Files**: Click Google Drive icon, select file, click "Share to channel"
6. **View Members**: Click members icon in chat header

### Channel Access by Role

| Channel | Dean | Program Chair | Research Coord | Faculty |
|---------|------|---------------|----------------|---------|
| general | ✓ | ✓ | ✓ | ✓ |
| ipcr-updates | ✓ | ✓ | - | ✓ |
| research | ✓ | - | ✓ | ✓ |
| admin-only | ✓ | ✓ | ✓ | - |

### Google Drive Integration

1. **Setup**: Follow `GOOGLE_DRIVE_SETUP.md`
2. **Upload Files**: Click Google Drive icon > Upload File
3. **Share to Channel**: Browse files > Click share icon
4. **Access Files**: Files appear as attachments in messages

## Documentation

- **[Discord Messaging Guide](DISCORD_MESSAGING_GUIDE.md)**: Complete guide to the messaging system
- **[Google Drive Setup](GOOGLE_DRIVE_SETUP.md)**: Step-by-step Drive integration setup
- **[API Documentation](docs/API.md)**: API endpoints and usage (coming soon)

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon for auto-restart on file changes.

### Adding New Channels

Edit `data/messages.json`:

```json
{
  "id": "new-channel",
  "name": "new-channel",
  "description": "Channel description",
  "allowedRoles": ["dean", "faculty"],
  "type": "text"
}
```

### Customizing Roles

Roles are defined in the messaging system. To add new roles:
1. Update channel `allowedRoles` in `data/messages.json`
2. Add role badge styling in `public/css/style.css`
3. Update role mention autocomplete in `views/pages/messages.ejs`

## Security

- **OAuth2**: Secure Google Drive authentication
- **Role-Based Access**: Channel and file access restricted by role
- **Credentials**: Never commit `google-credentials.json` or `google-token.json`
- **Input Validation**: All user inputs are validated server-side
- **Session Management**: Implement proper session handling in production

## Limitations

- System does not include student-related workflows
- File version control and collaborative editing are excluded
- Dependent on Google API and internet connectivity for file handling
- Final administrative approval of IPCR and workload remains with authorized users
- Scope limited to the College of Computer Studies (CCS)

## Software Development Methodology

**Agile Development Methodology**
- Incremental development focusing on reporting, IPCR, and workload modules
- Continuous feedback and testing from faculty and administrators
- Iterative enhancements to match real departmental processes
- Modular sprint-based design for adaptability

## Future Enhancements

- [ ] WebSocket for true real-time messaging
- [ ] Message reactions and threading
- [ ] Advanced file management (version control)
- [ ] Mobile responsive design improvements
- [ ] Email notifications for mentions
- [ ] Analytics dashboard for admin
- [ ] Export reports to PDF
- [ ] Calendar integration for deadlines
- [ ] Two-factor authentication

## Troubleshooting

### Messages not appearing
- Check browser console for errors
- Verify AJAX polling is running
- Refresh the page

### Google Drive not working
- Ensure credentials are configured
- Check OAuth authentication status
- Verify API is enabled in Google Cloud Console

### Can't access certain channels
- Channels are filtered by role
- Contact administrator to adjust permissions

## Support

For issues, questions, or feature requests:
- Create an issue in the repository
- Contact the development team
- Email: [support-email]

## License

ISC License - See LICENSE file for details

## Acknowledgments

- **Advisers**:
  - JOCELYN T. LIPATA, MSIT, PhD - Capstone Project Subject Adviser (CaPSA)
  - JONUEL REY N. COLLE, MIS - Capstone Project Adviser (CaPA)

- **Institution**: College of Computer Studies

---

**Built with ❤️ by Team Epperoni**
