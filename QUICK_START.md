# ConneCCS Quick Start Guide

Get ConneCCS up and running in 5 minutes!

## Prerequisites
- Node.js installed (v18+)
- Terminal/Command Prompt access

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm start
```

### 3. Open in Browser
Navigate to: `http://localhost:3000`

That's it! The basic system is now running.

## First Steps

### Explore the Dashboard
- Click through the navigation menu
- View faculty, reports, IPCR, and workload sections

### Try the Messaging System
1. Click "Messages" in the sidebar
2. You'll see channels like #general, #ipcr-updates, #research
3. Click a channel to view messages
4. Type a message and press Enter to send
5. Try mentioning: `@faculty Hello everyone!`

### Test Features
- **Reports**: View and manage faculty reports
- **IPCR**: Monitor performance evaluations
- **Workload**: Check faculty workload distribution
- **Faculty**: Browse faculty directory
- **Announcements**: View department announcements

## Optional: Add Your Logo

1. Create or find your logo image (PNG format)
2. Save it as `public/images/logo.png`
3. Refresh the page - your logo appears in the sidebar!

## Optional: Setup Google Drive

For full document management features:

1. Follow the detailed guide: `GOOGLE_DRIVE_SETUP.md`
2. Get Google Cloud credentials
3. Place credentials in `data/google-credentials.json`
4. Restart the application

## Default User Roles

The system simulates these roles:
- **Dean**: Full access to all features
- **Program Chair**: Access to program management
- **Research Coordinator**: Access to research features
- **Faculty**: Access to personal reports and IPCR

## Messaging Features to Try

### Send a Message
```
Type in the input box and press Enter
```

### Mention Users
```
@faculty Please submit your reports
@dean FYI - completed all tasks
```

### Switch Channels
```
Click different channels in the left sidebar
```

### View Members
```
Click the members icon in the chat header
```

### Share Files (requires Google Drive setup)
```
Click the Google Drive icon
Select a file
Click "Share to channel"
```

## Customization

### Change Colors
Edit `public/css/style.css` and modify the CSS variables:
```css
:root {
  --accent: #4f7cff;  /* Primary color */
  --bg: #0d0f14;      /* Background */
  --text: #e8ecf4;    /* Text color */
}
```

### Add Channels
Edit `data/messages.json` and add a new channel:
```json
{
  "id": "my-channel",
  "name": "my-channel",
  "description": "My custom channel",
  "allowedRoles": ["dean", "faculty"],
  "type": "text"
}
```

### Modify Faculty Data
Edit `data/faculty.json` to add/remove faculty members

## Development Mode

For auto-restart on file changes:
```bash
npm run dev
```

## Troubleshooting

### Port Already in Use
Change the port in `app.js`:
```javascript
const PORT = process.env.PORT || 3001; // Changed from 3000
```

### Messages Not Appearing
- Check browser console (F12) for errors
- Ensure JavaScript is enabled
- Try refreshing the page

### Styling Issues
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check if `public/css/style.css` exists

## Next Steps

1. **Read Full Documentation**: Check `README.md` for complete features
2. **Setup Google Drive**: Follow `GOOGLE_DRIVE_SETUP.md` for cloud storage
3. **Learn Messaging**: Read `DISCORD_MESSAGING_GUIDE.md` for advanced features
4. **Customize**: Modify data files to match your department

## Getting Help

- Check documentation files in the project root
- Review code comments in source files
- Contact the development team

## Production Deployment

For production use:
1. Set up proper authentication/session management
2. Configure environment variables
3. Use a process manager (PM2)
4. Set up HTTPS
5. Configure database instead of JSON files
6. Implement proper logging

---

**Enjoy using ConneCCS!** 🚀
