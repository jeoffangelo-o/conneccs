// Authentication middleware

// Simple session storage (in production, use express-session with a store)
const sessions = new Map();

// Middleware to parse session
function sessionMiddleware(req, res, next) {
  const sessionId = req.headers.cookie?.match(/sessionId=([^;]+)/)?.[1];
  
  if (sessionId && sessions.has(sessionId)) {
    req.session = sessions.get(sessionId);
  } else {
    const newSessionId = `session_${Date.now()}_${Math.random()}`;
    req.session = { id: newSessionId };
    sessions.set(newSessionId, req.session);
    res.setHeader('Set-Cookie', `sessionId=${newSessionId}; Path=/; HttpOnly; Max-Age=86400`);
  }
  
  next();
}

// Middleware to require authentication
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// Middleware to require specific role
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect('/auth/login');
    }
    
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).send('Access denied');
    }
    
    next();
  };
}

// Middleware to add user to res.locals for templates
function addUserToLocals(req, res, next) {
  res.locals.currentUser = req.session?.user || null;
  next();
}

module.exports = {
  sessionMiddleware,
  requireAuth,
  requireRole,
  addUserToLocals
};
