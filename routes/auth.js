const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

// Helper to read users
function getUsers() {
  if (!fs.existsSync(usersPath)) {
    return [];
  }
  const data = fs.readFileSync(usersPath, 'utf8');
  return JSON.parse(data);
}

// Helper to save users
function saveUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

// GET /auth/login - Login page
router.get('/login', (req, res) => {
  // If already logged in, redirect to dashboard
  if (req.session && req.session.user) {
    return res.redirect('/');
  }
  
  res.render('pages/login', {
    error: null
  });
});

// POST /auth/login - Handle login
router.post('/login', (req, res) => {
  const { email, password, remember } = req.body;
  
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  // Simple password check (in production, use bcrypt)
  if (!user || user.password !== password) {
    return res.render('pages/login', {
      error: 'Invalid email or password'
    });
  }
  
  // Create session
  req.session = req.session || {};
  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  
  if (remember) {
    req.session.cookie = { maxAge: 30 * 24 * 60 * 60 * 1000 }; // 30 days
  }
  
  res.redirect('/');
});

// GET /auth/register - Register page
router.get('/register', (req, res) => {
  res.render('pages/register', {
    error: null
  });
});

// POST /auth/register - Handle registration
router.post('/register', (req, res) => {
  const { name, email, role, password, confirmPassword } = req.body;
  
  // Validate email domain
  if (!email.endsWith('@cspc.edu.ph')) {
    return res.render('pages/register', {
      error: 'Email must be a valid CSPC email address (@cspc.edu.ph)'
    });
  }
  
  // Validation
  if (password !== confirmPassword) {
    return res.render('pages/register', {
      error: 'Passwords do not match'
    });
  }
  
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return res.render('pages/register', {
      error: 'Email already registered'
    });
  }
  
  // Create new user
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    role,
    password, // In production, hash this with bcrypt
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Auto-login after registration
  req.session = req.session || {};
  req.session.user = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };
  
  res.redirect('/');
});

// GET /auth/logout - Logout
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.user = null;
  }
  res.redirect('/auth/login');
});

// GET /auth/forgot-password - Forgot password page
router.get('/forgot-password', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Forgot Password - ConneCCS</title>
      <link rel="stylesheet" href="/css/style.css" />
    </head>
    <body class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-body">
            <h2>Forgot Password</h2>
            <p>Password reset functionality will be implemented soon.</p>
            <a href="/auth/login" class="btn btn-primary">Back to Login</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
