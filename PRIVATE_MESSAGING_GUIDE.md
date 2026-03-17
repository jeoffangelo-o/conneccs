# Private Role-Based Messaging Guide

## 🔒 New Feature: Private Messages

Messages with role mentions are now **PRIVATE** - only tagged users and the sender can see them!

## How It Works

### Public Messages (No Mentions)
**Type:**
```
Hello everyone! Meeting at 2 PM.
```

**Who sees it:** Everyone in the channel

---

### Private Messages (With Mentions)
**Type:**
```
@faculty Please submit your reports by Friday.
```

**Who sees it:** 
- ✅ All faculty members
- ✅ You (the sender)
- ❌ Dean (not tagged)
- ❌ Program chairs (not tagged)
- ❌ Research coordinators (not tagged)

## 🎯 Improved Autocomplete

### How to Use:

1. **Type `@` in the message box**
2. **Autocomplete dropdown appears instantly**
3. **Shows all available roles with icons:**
   ```
   ┌─────────────────────────────────┐
   │ [D] @dean          Dean         │
   │ [F] @faculty       Faculty      │
   │ [P] @program_chair Program Chair│
   │ [R] @research_...  Research...  │
   └─────────────────────────────────┘
   ```

4. **Navigate with keyboard:**
   - ↓ Arrow Down - Move to next role
   - ↑ Arrow Up - Move to previous role
   - Enter - Select highlighted role
   - Esc - Close dropdown

5. **Or click with mouse** to select

6. **Role is inserted automatically** with a space after it

### Example Flow:

1. Type: `@`
2. Dropdown shows all 4 roles
3. Type: `f` → Filters to `@faculty`
4. Press Enter or click
5. Result: `@faculty ` (with space, ready to continue)

## 📝 Examples

### Example 1: Private to Faculty Only
```
@faculty IPCR deadline extended to next Monday.
```
**Visible to:** Faculty members only + you

### Example 2: Private to Multiple Roles
```
@dean @program_chair Budget meeting tomorrow at 10 AM.
```
**Visible to:** Dean + Program Chairs + you

### Example 3: Public Message
```
Campus closed next Monday for maintenance.
```
**Visible to:** Everyone in the channel

## 🎨 Visual Indicators

### For Tagged Users:
```
┌──────────────────────────────────────────┐
│ ┃ [Avatar] Dean's Office  DEAN  PRIVATE │ ← Orange badge
│ ┃ @faculty Please submit reports        │ ← Blue border
└──────────────────────────────────────────┘
```

### For Sender:
```
┌──────────────────────────────────────────┐
│   [Avatar] You  DEAN  PRIVATE            │ ← Orange badge
│   @faculty Please submit reports         │ ← Normal (your message)
└──────────────────────────────────────────┘
```

### For Non-Tagged Users:
**Message is completely hidden** - they don't see it at all!

## 🔑 Privacy Rules

| Message Type | Who Can See |
|--------------|-------------|
| No mentions | Everyone in channel |
| `@faculty` | Faculty + Sender |
| `@dean` | Dean + Sender |
| `@program_chair` | Program Chairs + Sender |
| `@research_coordinator` | Research Coordinators + Sender |
| `@dean @faculty` | Dean + Faculty + Sender |

## 💡 Use Cases

### 1. Confidential Announcements
```
@dean Urgent: Budget approval needed for new equipment.
```
Only Dean sees this.

### 2. Role-Specific Instructions
```
@program_chair Please review program curriculum by Friday.
```
Only Program Chairs see this.

### 3. Faculty-Only Updates
```
@faculty New teaching guidelines attached. Please review.
```
Only Faculty members see this.

### 4. Multi-Role Coordination
```
@dean @program_chair @research_coordinator Leadership meeting at 3 PM.
```
Only these three roles see this.

## ⚡ Quick Test

### Test Private Messaging:

1. **Login as Dean:** `dean@ccs.edu` / `password123`
2. **Go to Messages → #general**
3. **Type:** `@faculty This is a private test`
4. **Send the message**
5. **You see it** (because you're the sender)

6. **Open incognito window**
7. **Login as Program Chair:** `chair@ccs.edu` / `password123`
8. **Go to Messages → #general**
9. **You DON'T see the message** (not tagged!)

10. **Open another incognito window**
11. **Login as Faculty:** `faculty@ccs.edu` / `password123`
12. **Go to Messages → #general**
13. **You see the message with blue border** (you're tagged!)

## 🎯 Autocomplete Features

### Smart Filtering
- Type `@d` → Shows only "dean"
- Type `@f` → Shows only "faculty"
- Type `@p` → Shows only "program_chair"
- Type `@r` → Shows only "research_coordinator"

### Visual Design
- **Role Icon:** Colored circle with first letter
- **Role Tag:** `@role` in blue
- **Role Label:** Full name in gray
- **Hover Effect:** Background changes
- **Keyboard Selection:** Highlighted in blue

### Keyboard Shortcuts
- `@` - Open autocomplete
- `↓` - Next role
- `↑` - Previous role
- `Enter` - Select role
- `Esc` - Close autocomplete
- `Tab` - Select first role

## 🚀 Best Practices

### ✅ DO:
- Use mentions for sensitive information
- Tag specific roles for targeted communication
- Use public messages for general announcements
- Combine multiple tags when needed

### ❌ DON'T:
- Don't use mentions for public information
- Don't tag roles unnecessarily
- Don't forget to tag if message is private
- Don't assume everyone sees your message

## 🔍 How to Know if Message is Private

Look for the **orange "PRIVATE" badge** next to the timestamp:

```
Dean's Office  DEAN  10:30 AM  PRIVATE
```

If you see this badge, the message is only visible to tagged roles.

## 📊 Summary

| Feature | Description |
|---------|-------------|
| **Private Messages** | Only tagged users + sender can see |
| **Autocomplete** | Type `@` to see role suggestions |
| **Keyboard Nav** | Use arrows and Enter to select |
| **Visual Indicators** | Orange "PRIVATE" badge on messages |
| **Smart Filtering** | Type to filter role suggestions |
| **Multiple Tags** | Tag multiple roles in one message |

---

**Start using private role-based messaging today for better communication security!** 🎉
