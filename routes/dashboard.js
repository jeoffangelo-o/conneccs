const express = require('express');
const router = express.Router();
const faculty = require('../data/faculty.json');
const reports = require('../data/reports.json');
const ipcr    = require('../data/ipcr.json');
const announcements = require('../data/announcements.json');

router.get('/', (req, res) => {
  const submitted  = reports.filter(r => r.status === 'Submitted').length;
  const notSubmitted = reports.filter(r => r.status === 'Not Submitted').length;
  const overdue    = reports.filter(r => r.status === 'Overdue').length;
  const activeFaculty = faculty.filter(f => f.status === 'Active').length;
  const pendingIpcr = ipcr.filter(i => i.status === 'For Review' || i.status === 'Pending Entry').length;
  const pinned = announcements.filter(a => a.pinned);
  const recentReports = reports.slice(0, 5);

  res.render('pages/dashboard', {
    title: 'Dashboard – ConneCCS',
    activePage: 'dashboard',
    stats: { submitted, notSubmitted, overdue, activeFaculty, pendingIpcr, totalReports: reports.length },
    pinned,
    recentReports,
    faculty,
    ipcr
  });
});

module.exports = router;
