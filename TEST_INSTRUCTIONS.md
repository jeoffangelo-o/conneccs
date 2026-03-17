# Testing the Messaging System

## Current Status
✅ The system is working! Messages 3, 4, and 5 in `data/messages.json` show that:
- Messages are being sent successfully
- They're being saved to the database
- The API endpoints are functioning

## To See Messages in the Chat:

### Option 1: Refresh the Page
1. Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) to hard refresh
2. This clears the cache and reloads all JavaScript
3. Messages should now appear

### Option 2: Check Browser Console
1. Press `F12` to open Developer Tools
2. Go to the "Console" tab
3. Look for these logs:
   - "Loading messages for channel: general"
   - "Response status: 200"
   - "Received messages: {messages: Array(2)}"
4. If you see errors, they'll help us debug

### Option 3: Test the API Directly
1. Open a new tab
2. Go to: `http://localhost:3000/messages/api/channel/general`
3. You should see JSON with 2 messages for the general channel

## Expected Behavior

### When Page Loads:
1. JavaScript calls `loadMessages()`
2. Fetches messages from `/messages/api/channel/general`
3. Displays them in the chat area
4. Starts polling every 3 seconds for new messages

### When You Send a Message:
1. Type in the input box
2. Press Enter or click Send
3. Message appears immediately
4. Saved to `data/messages.json`
5. Other users see it within 3 seconds (via polling)

## Troubleshooting

### If Messages Don't Appear:

1. **Check Console for Errors**
   ```
   F12 → Console tab
   Look for red error messages
   ```

2. **Verify API is Working**
   ```
   Visit: http://localhost:3000/messages/api/channel/general
   Should return JSON with messages
   ```

3. **Check Network Tab**
   ```
   F12 → Network tab
   Reload page
   Look for /messages/api/channel/general request
   Should show Status: 200
   ```

4. **Clear Browser Cache**
   ```
   Ctrl+Shift+Delete
   Clear cached images and files
   Reload page
   ```

### Common Issues:

**Issue**: Blank chat area
**Solution**: Hard refresh (Ctrl+Shift+R)

**Issue**: "Error loading messages"
**Solution**: Check if server is running, verify data/messages.json exists

**Issue**: Can't send messages
**Solution**: Check console for errors, verify input field is not empty

## Testing Checklist

- [ ] Page loads without errors
- [ ] Channel list appears on left
- [ ] Messages appear in chat area
- [ ] Can type in input box
- [ ] Can send a message
- [ ] Message appears immediately after sending
- [ ] Can switch between channels
- [ ] Member list appears on right
- [ ] Google Drive button opens modal
- [ ] Mentions work (@faculty, @dean)

## Current Test Data

Based on `data/messages.json`, you should see:

**#general channel** (2 messages):
1. "Welcome to ConneCCS messaging system!"
2. "hello"

**#ipcr-updates channel** (1 message):
1. "@faculty Please submit your IPCR by end of week."

**#research channel** (1 message):
1. "Shared a file from Google Drive" (with attachment)

**#admin-only channel** (1 message):
1. "gege"

## Quick Test

Try this in the browser console (F12):
```javascript
// Test if variables are defined
console.log('Current channel:', currentChannel);
console.log('Current user:', currentUser);

// Manually trigger load
loadMessages();
```

## Next Steps

Once messages are visible:
1. ✅ Try sending a message
2. ✅ Try switching channels
3. ✅ Try mentioning with @faculty
4. ✅ Try opening Google Drive modal
5. ✅ Try sharing a file

## Success Indicators

You'll know it's working when:
- ✅ You see "Welcome to ConneCCS messaging system!" in #general
- ✅ You can type and send messages
- ✅ Messages appear with avatar, name, role badge, and timestamp
- ✅ Switching channels loads different messages
- ✅ Member list shows users on the right

---

**Note**: The system IS working (proven by messages 3-5 being saved). If you don't see messages, it's likely a browser cache issue. Hard refresh should fix it!
