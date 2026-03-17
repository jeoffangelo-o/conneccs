# ConneCCS Authentication System

## Overview
Complete login, register, and logout functionality has been implemented for ConneCCS.

## Features

### ✅ Login System
- Email and password authentication
- "Remember me" functionality
- Quick login buttons for demo accounts
- Forgot password link (placeholder)

### ✅ Registration System
- Create new accounts
- Role selection (Faculty, Program Chair, Research Coordinator)
- Password confirmation
- Terms of service checkbox
- Auto-login after registration

### ✅ Logout System
- Logout button in sidebar user menu
- Session cleanup
- Redirect to login page

### ✅ Session Management
- Simple session storage
- Session persistence
- User data in all templates via `currentUser`

## Demo Accounts

For testing, use these pre-created accounts:

| Role | Email | Password |
|------|-------|----------|
| Dean | dean@ccs.edu | password123 |
| Program Chair | chair@ccs.edu | password123 |
| Faculty | faculty@ccs.edu | password123 |

## URLs

- **Login**: `http://localhost:3000/auth/login`
- **Register**: `http://localhost:3000/auth/register`
- **Logout**: `http://localhost:3000/auth/logout`

## How It Works

### 1. First Visit
- User visits any page (e.g., `/`)
- Middleware checks for session
- No session found → Redirect to `/auth/login`

### 2. Login
- User enters email and password
- System checks `data/users.json`
- Valid credentials → Create session → Redirect to dashboard
- Invalid credentials → Show error message

### 3. Registration
- User fills registration form
- System validates:
  - Passwords match
  - Email not already registered
- Creates new user in `data/users.json`
- Auto-login → Redirect to dashboard

### 4. Authenticated Access
- All routes except `/auth/*` require authentication
- Middleware checks `req.session.user`
- No user → Redirect to login
- Has user → Allow access

### 5. Logout
- Click user menu (three dots) in sidebar
- Click "Logout"
- Session cleared
- Redirect to login page

## File Structure

```
├── routes/
│   └── auth.js                 # Login, register, logout routes
├── middleware/
│   └── auth.js                 # Authentication middleware
├── views/pages/
│   ├── login.ejs               # Login page
│   └── register.ejs            # Registration page
├── data/
│   └── users.json              # User database
└── public/css/
    └── style.css               # Auth page styles
```

## User Object Structure

```javascript
{
  id: "user_1234567890",
  name: "Dr. Juan Dela Cruz",
  email: "juan.delacruz@university.edu",
  role: "faculty",
  password: "hashed_password",  // In production, use bcrypt
  createdAt: "2024-03-15T10:00:00.000Z"
}
```

## Session Object

```javascript
{
  id: "session_1234567890",
  user: {
    id: "user_1234567890",
    name: "Dr. Juan Dela Cruz",
    email: "juan.delacruz@university.edu",
    role: "faculty"
  }
}
```

## Accessing Current User

### In Routes
```javascript
const currentUser = req.session.user;
console.log(currentUser.name);  // "Dr. Juan Dela Cruz"
console.log(currentUser.role);  // "faculty"
```

### In Templates (EJS)
```html
<% if (currentUser) { %>
  <p>Welcome, <%= currentUser.name %>!</p>
  <p>Role: <%= currentUser.role %></p>
<% } %>
```

## Middleware Functions

### `sessionMiddleware`
- Parses session from cookie
- Creates new session if none exists
- Attaches `req.session` to request

### `requireAuth`
- Checks if user is logged in
- Redirects to login if not authenticated
- Used on all protected routes

### `requireRole(...roles)`
- Checks if user has specific role
- Returns 403 if role doesn't match
- Example: `requireRole('dean', 'program_chair')`

### `addUserToLocals`
- Adds `currentUser` to `res.locals`
- Makes user available in all templates

## Security Notes

### ⚠️ Current Implementation (Development)
- Passwords stored in plain text
- Simple session storage in memory
- No CSRF protection
- No rate limiting

### ✅ Production Requirements
1. **Password Hashing**: Use bcrypt
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Session Store**: Use express-session with Redis/MongoDB
   ```javascript
   const session = require('express-session');
   const RedisStore = require('connect-redis')(session);
   ```

3. **HTTPS**: Always use HTTPS in production

4. **CSRF Protection**: Use csurf middleware

5. **Rate Limiting**: Prevent brute force attacks
   ```javascript
   const rateLimit = require('express-rate-limit');
   ```

6. **Input Validation**: Sanitize all inputs

7. **Environment Variables**: Store secrets in .env

## Customization

### Add New Role
1. Update role options in `register.ejs`
2. Add role to channel permissions in `data/messages.json`
3. Update role badge styles in `style.css`

### Change Session Duration
In `middleware/auth.js`:
```javascript
res.setHeader('Set-Cookie', `sessionId=${newSessionId}; Path=/; HttpOnly; Max-Age=86400`);
// Max-Age in seconds (86400 = 24 hours)
```

### Add Email Verification
1. Generate verification token on registration
2. Send email with verification link
3. Create `/auth/verify/:token` route
4. Mark user as verified in database

### Add Password Reset
1. Create forgot password form
2. Generate reset token
3. Send email with reset link
4. Create `/auth/reset/:token` route
5. Allow password update

## Testing

### Test Login
1. Go to `http://localhost:3000`
2. Should redirect to `/auth/login`
3. Use demo account: dean@ccs.edu / password123
4. Should redirect to dashboard

### Test Registration
1. Go to `http://localhost:3000/auth/register`
2. Fill in form with new details
3. Submit
4. Should auto-login and redirect to dashboard
5. Check `data/users.json` for new user

### Test Logout
1. Login first
2. Click user menu (three dots) in sidebar
3. Click "Logout"
4. Should redirect to login page
5. Try accessing `/` - should redirect to login

### Test Protected Routes
1. Logout
2. Try accessing `/messages` directly
3. Should redirect to `/auth/login`
4. Login
5. Should redirect back to `/messages`

## Troubleshooting

### Can't Login
- Check `data/users.json` exists
- Verify email and password are correct
- Check browser console for errors
- Clear cookies and try again

### Session Not Persisting
- Check cookie is being set (DevTools → Application → Cookies)
- Verify `sessionMiddleware` is registered in app.js
- Check session storage in `middleware/auth.js`

### Redirect Loop
- Ensure `/auth/*` routes don't require authentication
- Check middleware order in app.js
- Verify `requireAuth` is not on auth routes

### User Menu Not Working
- Check JavaScript is loaded
- Verify `toggleUserMenu()` function exists
- Check for console errors

## Next Steps

- [ ] Implement password hashing (bcrypt)
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add session store (Redis/MongoDB)
- [ ] Implement CSRF protection
- [ ] Add rate limiting
- [ ] Add two-factor authentication
- [ ] Implement OAuth (Google, Microsoft)
- [ ] Add user profile page
- [ ] Implement password strength requirements

---

**The authentication system is now fully functional!** Users must login to access the system, and can logout anytime.
