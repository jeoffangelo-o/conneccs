const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
const { sessionMiddleware, requireAuth, addUserToLocals } = require('./middleware/auth');
app.use(sessionMiddleware);
app.use(addUserToLocals);

// Global request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── View Engine ─────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Routes ──────────────────────────────────────────────────────────────────
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const reportsRouter   = require('./routes/reports');
const ipcrRouter      = require('./routes/ipcr');
const workloadRouter  = require('./routes/workload');
const facultyRouter   = require('./routes/faculty');
const announcementsRouter = require('./routes/announcements');
const messagesRouter  = require('./routes/messages');

// Public routes (no auth required)
app.use('/auth', authRouter);

// Protected routes (auth required)
app.use('/', requireAuth, dashboardRouter);
app.use('/reports', requireAuth, reportsRouter);
app.use('/ipcr', requireAuth, ipcrRouter);
app.use('/workload', requireAuth, workloadRouter);
app.use('/faculty', requireAuth, facultyRouter);
app.use('/announcements', requireAuth, announcementsRouter);
app.use('/messages', requireAuth, messagesRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('pages/404', { title: '404 – Page Not Found', activePage: '' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(500).render('pages/error', { title: 'Server Error', error: err, activePage: '' });
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  ConneCCS running at http://localhost:${PORT}`);
});

module.exports = app;
