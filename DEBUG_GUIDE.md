# Debug Guide for ConneCCS Messaging

## Quick Diagnosis

### Step 1: Check if Server is Running
```bash
# You should see this in terminal:
✅  ConneCCS running at http://localhost:3000
```

### Step 2: Test API Endpoints

Open these URLs in your browser:

1. **Test Channel API**
   ```
   http://localhost:3000/messages/api/channel/general
   ```
   **Expected**: JSON with messages array
   ```json
   {
     "messages": [
       {
         "id": 1,
         "channelId": "general",
         "userName": "Dean's Office",
         ...
       }
     ]
   }
   ```

2. **Test Channel Info**
   ```
   http://localhost:3000/messages/api/channel-info/general
   ```
   **Expected**: Channel details
   ```json
   {
     "id": "general",
     "name": "general",
     "description": "General announcements and discussions",
     ...
   }
   ```

### Step 3: Check Browser Console

1. Open the messaging page: `http://localhost:3000/messages`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for these logs:

**✅ Good logs (system working):**
```
Loading messages for channel: general
Response status: 200
Received messages: {messages: Array(2)}
```

**❌ Bad logs (system has issues):**
```
Error loading messages: ...
Failed to fetch
404 Not Found
```

### Step 4: Check Network Tab

1. In Developer Tools, go to **Network** tab
2. Refresh the page (F5)
3. Look for these requests:

**Should see:**
- `messages` (Status: 200) - Main page load
- `general` (Status: 200) - API call for messages
- `style.css` (Status: 200) - Styles loaded

**If you see 404 or 500 errors**, there's a routing issue.

## Common Issues & Solutions

### Issue 1: Blank Chat Area (No Messages)

**Symptoms:**
- Chat area is empty
- No loading spinner
- No error messages

**Solutions:**

1. **Hard Refresh**
   ```
   Windows/Linux: Ctrl + Shift + R
   Mac: Cmd + Shift + R
   ```

2. **Clear Cache**
   ```
   Ctrl + Shift + Delete
   → Clear cached images and files
   → Reload page
   ```

3. **Check Console**
   ```
   F12 → Console
   Look for JavaScript errors
   ```

4. **Verify Data File**
   ```bash
   # Check if file exists and has messages
   cat data/messages.json
   ```

### Issue 2: "Error loading messages"

**Symptoms:**
- Red error message in chat
- Console shows fetch errors

**Solutions:**

1. **Check Server is Running**
   ```bash
   npm start
   # Should show: ✅  ConneCCS running at http://localhost:3000
   ```

2. **Verify Route is Registered**
   Check `app.js` has:
   ```javascript
   const messagesRouter = require('./routes/messages');
   app.use('/messages', messagesRouter);
   ```

3. **Test API Directly**
   ```
   http://localhost:3000/messages/api/channel/general
   ```

4. **Check File Permissions**
   ```bash
   # Ensure data/messages.json is readable
   ls -la data/messages.json
   ```

### Issue 3: Can't Send Messages

**Symptoms:**
- Typing works but send button doesn't work
- No error message
- Message doesn't appear

**Solutions:**

1. **Check Console for Errors**
   ```
   F12 → Console
   Look for "Error sending message"
   ```

2. **Verify Form Submission**
   ```javascript
   // In console, test manually:
   sendMessage({preventDefault: () => {}});
   ```

3. **Check Input Field**
   ```javascript
   // In console:
   document.getElementById('messageInput').value = 'test';
   ```

4. **Test API with curl**
   ```bash
   curl -X POST http://localhost:3000/messages/api/send \
     -H "Content-Type: application/json" \
     -d '{"channelId":"general","message":"test"}'
   ```

### Issue 4: Messages Not Updating in Real-Time

**Symptoms:**
- Can send messages
- Messages appear for sender
- Other users don't see new messages

**Solutions:**

1. **Check Polling is Running**
   ```javascript
   // In console:
   console.log('Last message ID:', lastMessageId);
   ```

2. **Verify Polling Interval**
   ```javascript
   // Should poll every 3 seconds
   // Check console for polling errors
   ```

3. **Test New Messages API**
   ```
   http://localhost:3000/messages/api/channel/general/new?after=0
   ```

### Issue 5: Google Drive Modal Won't Open

**Symptoms:**
- Click Drive button
- Nothing happens
- No modal appears

**Solutions:**

1. **Check Console for Errors**
   ```
   F12 → Console
   Look for JavaScript errors
   ```

2. **Verify Modal Exists**
   ```javascript
   // In console:
   document.getElementById('driveModal');
   // Should return the modal element
   ```

3. **Test Function Manually**
   ```javascript
   // In console:
   openGoogleDrive();
   ```

## Debug Commands

### In Browser Console (F12):

```javascript
// Check current state
console.log('Channel:', currentChannel);
console.log('User:', currentUser);
console.log('Last Message ID:', lastMessageId);

// Manually load messages
loadMessages();

// Manually poll for new messages
pollMessages();

// Test message sending
document.getElementById('messageInput').value = 'Debug test';
sendMessage({preventDefault: () => {}});

// Check if elements exist
console.log('Chat container:', document.getElementById('chatMessages'));
console.log('Input field:', document.getElementById('messageInput'));
console.log('Drive modal:', document.getElementById('driveModal'));
```

### In Terminal:

```bash
# Check if server is running
ps aux | grep node

# View server logs
# (should show in terminal where you ran npm start)

# Test API endpoints
curl http://localhost:3000/messages/api/channel/general

# Check file contents
cat data/messages.json | jq .

# Restart server
# Ctrl+C to stop, then:
npm start
```

## Verification Checklist

Run through this checklist to verify everything works:

- [ ] Server starts without errors
- [ ] Can access http://localhost:3000/messages
- [ ] Page loads without console errors
- [ ] Channel list appears on left
- [ ] Chat area shows messages or loading spinner
- [ ] Can type in message input
- [ ] Can send a message
- [ ] Message appears in chat immediately
- [ ] Can switch between channels
- [ ] Different channels show different messages
- [ ] Member list appears on right
- [ ] Can toggle member list
- [ ] Google Drive button opens modal
- [ ] Can close Drive modal
- [ ] Mentions work (@faculty shows autocomplete)
- [ ] Messages update automatically (within 3 seconds)

## Still Having Issues?

### Collect Debug Information:

1. **Browser Console Output**
   ```
   F12 → Console → Right-click → Save as...
   ```

2. **Network Tab**
   ```
   F12 → Network → Export HAR
   ```

3. **Server Logs**
   ```
   Copy terminal output where npm start is running
   ```

4. **Data Files**
   ```bash
   cat data/messages.json
   cat data/faculty.json
   ```

5. **Package Versions**
   ```bash
   node --version
   npm --version
   cat package.json
   ```

### Reset to Clean State:

If all else fails, reset the messages:

```bash
# Backup current messages
cp data/messages.json data/messages.backup.json

# Reset to initial state
cat > data/messages.json << 'EOF'
{
  "channels": [
    {
      "id": "general",
      "name": "general",
      "description": "General announcements and discussions",
      "allowedRoles": ["dean", "program_chair", "research_coordinator", "faculty"],
      "type": "text"
    }
  ],
  "messages": [
    {
      "id": 1,
      "channelId": "general",
      "userId": "dean",
      "userName": "Dean's Office",
      "userRole": "dean",
      "message": "Welcome to ConneCCS!",
      "timestamp": "2024-03-15T09:00:00",
      "mentions": [],
      "attachments": []
    }
  ]
}
EOF

# Restart server
npm start
```

## Success Indicators

You'll know everything is working when:

✅ Console shows: "Received messages: {messages: Array(X)}"
✅ Chat area displays messages with avatars and timestamps
✅ Can send messages and they appear immediately
✅ Switching channels loads different messages
✅ Member list shows users with online status
✅ No red errors in console
✅ Network tab shows all requests with Status 200

---

**Remember**: The system IS working (proven by messages being saved to JSON). Most issues are browser cache related. Always try a hard refresh first!
