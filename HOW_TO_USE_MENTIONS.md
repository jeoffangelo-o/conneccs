# How to Use Role-Based Tagging (Mentions) in ConneCCS

## What is Role-Based Tagging?

Role-based tagging allows you to mention specific roles in messages. When you tag a role, all users with that role will see the message highlighted, making it easy to notify specific groups.

## Available Role Tags

You can mention these roles in any message:

| Tag | Who Sees It | Use Case |
|-----|-------------|----------|
| `@dean` | Dean's Office | Important decisions, approvals |
| `@faculty` | All Faculty Members | General announcements, reminders |
| `@program_chair` | All Program Chairs | Program-specific matters |
| `@research_coordinator` | Research Coordinators | Research-related updates |

## How to Tag a Role

### Method 1: Type @ Symbol

1. **Start typing your message**
2. **Type `@` symbol**
3. **Start typing the role name** (e.g., `@fac...`)
4. **Autocomplete suggestions appear**
5. **Click a suggestion or continue typing**
6. **Press Space to continue your message**

**Example:**
```
@faculty Please submit your IPCR by Friday.
```

### Method 2: Manual Typing

Just type `@` followed by the role name directly:

```
@dean Can you approve this request?
@program_chair Meeting at 2pm today
@research_coordinator New research guidelines attached
```

## What Happens When You Tag?

### For the Sender:
- Message sends normally
- Tag appears in blue/highlighted color
- Message is saved with mention metadata

### For Tagged Users:
- Message appears with **colored left border**
- Message is **highlighted** in the chat
- Easy to spot important messages directed at them

### For Other Users:
- Message appears normally
- Can still see the message
- No special highlighting

## Examples

### Example 1: Notify All Faculty
```
@faculty Reminder: Faculty meeting tomorrow at 10 AM in Conference Room A.
```
**Result:** All faculty members see this message highlighted.

### Example 2: Multiple Tags
```
@dean @program_chair Budget proposal needs review by end of week.
```
**Result:** Both Dean and Program Chairs see this highlighted.

### Example 3: Tag in Middle of Message
```
Hey everyone, @faculty please check your email for the updated schedule.
```
**Result:** Works anywhere in the message!

## Visual Indicators

### Tagged Message Appearance:
```
┌─────────────────────────────────────────────┐
│ ┃ [Avatar] Dean's Office  DEAN  10:30 AM   │
│ ┃ @faculty Please submit your reports      │
│ ┃ by end of week.                           │
└─────────────────────────────────────────────┘
  ↑
  Blue border indicates you're mentioned
```

### Regular Message:
```
┌─────────────────────────────────────────────┐
│   [Avatar] Dean's Office  DEAN  10:30 AM   │
│   Meeting scheduled for tomorrow.           │
└─────────────────────────────────────────────┘
```

## Testing Role-Based Tagging

### Step 1: Login as Dean
1. Go to `http://localhost:3000/auth/login`
2. Use: `dean@ccs.edu` / `password123`
3. Go to Messages

### Step 2: Send a Tagged Message
1. Click on `#general` channel
2. Type in the message box:
   ```
   @faculty Hello everyone! This is a test mention.
   ```
3. Press Enter or click Send

### Step 3: See the Result
- The message appears with `@faculty` highlighted in blue
- Message is saved with mention metadata

### Step 4: Login as Faculty (Different Browser/Incognito)
1. Open incognito window or different browser
2. Login as: `faculty@ccs.edu` / `password123`
3. Go to Messages → #general
4. You'll see the message with a **blue left border** (highlighted)

## Autocomplete Feature

When you type `@`, an autocomplete dropdown appears:

```
┌─────────────────────────┐
│ @dean                   │
│ @faculty                │
│ @program_chair          │
│ @research_coordinator   │
└─────────────────────────┘
```

**To use:**
- Type `@` to show all options
- Type `@fac` to filter to "faculty"
- Click an option or press Enter
- Continue typing your message

## Channel-Specific Tagging

Tags work in all channels, but consider the audience:

### #general Channel
- `@faculty` - Reaches all faculty
- `@dean` - For dean's attention
- `@program_chair` - For program chairs

### #ipcr-updates Channel
- `@faculty` - IPCR reminders
- `@program_chair` - Review requests

### #research Channel
- `@research_coordinator` - Research matters
- `@faculty` - Research opportunities

### #admin-only Channel
- `@dean` - Administrative decisions
- `@program_chair` - Program coordination

## Best Practices

### ✅ DO:
- Use tags for important announcements
- Tag specific roles relevant to the message
- Use tags to get attention for urgent matters
- Combine tags when multiple roles need to see it

### ❌ DON'T:
- Don't overuse tags (causes notification fatigue)
- Don't tag roles not relevant to the message
- Don't use tags for casual conversation
- Don't tag everyone for minor updates

## Examples by Use Case

### Deadline Reminder
```
@faculty Reminder: IPCR submissions due this Friday, March 22nd.
```

### Meeting Announcement
```
@program_chair Department heads meeting tomorrow at 2 PM. Please confirm attendance.
```

### Urgent Request
```
@dean Urgent: Need approval for budget reallocation by EOD.
```

### Research Opportunity
```
@faculty @research_coordinator New research grant opportunity available. Details in attached file.
```

### General Announcement
```
@faculty Campus will be closed next Monday for maintenance.
```

## Technical Details

### How It Works Behind the Scenes:

1. **Message Sent:**
   ```javascript
   {
     message: "@faculty Please submit reports",
     mentions: ["faculty"]  // Extracted automatically
   }
   ```

2. **Message Displayed:**
   - System checks if current user's role is in `mentions` array
   - If yes, adds `mentioned` class to message
   - CSS applies blue border and highlighting

3. **Autocomplete:**
   - Triggered by `@` character
   - Filters available roles
   - Inserts selected role into message

### Mention Detection Regex:
```javascript
const mentionRegex = /@(\w+)/g;
// Matches: @faculty, @dean, @program_chair, etc.
```

## Troubleshooting

### Tags Not Highlighting?
1. **Hard refresh** the page (Ctrl+Shift+R)
2. Check you're logged in with correct role
3. Verify the tag matches exactly (e.g., `@faculty` not `@Faculty`)

### Autocomplete Not Showing?
1. Make sure you typed `@` symbol
2. Check browser console for JavaScript errors
3. Refresh the page

### Message Not Sending?
1. Check you're in a channel you have access to
2. Verify you're logged in
3. Check network connection

## Advanced Usage

### Tag Multiple Roles:
```
@dean @program_chair @research_coordinator All coordinators meeting at 3 PM.
```

### Tag at Start, Middle, or End:
```
@faculty This is at the start
This is in the @faculty middle
This is at the end @faculty
```

### Combine with File Sharing:
```
@faculty New guidelines document attached. Please review by Friday.
[Attached: Guidelines.pdf]
```

## Summary

Role-based tagging is a powerful feature that helps you:
- ✅ Notify specific groups efficiently
- ✅ Highlight important messages
- ✅ Organize communication by role
- ✅ Reduce notification noise
- ✅ Ensure important messages are seen

**Start using tags today to improve your team communication!**

---

**Quick Reference:**
- `@dean` - Dean's Office
- `@faculty` - All Faculty
- `@program_chair` - Program Chairs
- `@research_coordinator` - Research Coordinators
