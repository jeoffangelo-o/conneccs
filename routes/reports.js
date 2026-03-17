const express = require('express');
const router = express.Router();
const reports = require('../data/reports.json');
const faculty = require('../data/faculty.json');

router.get('/', (req, res) => {
  const { status, type } = req.query;
  let filtered = [...reports];
  if (status) filtered = filtered.filter(r => r.status === status);
  if (type)   filtered = filtered.filter(r => r.reportType === type);

  const types = [...new Set(reports.map(r => r.reportType))];
  res.render('pages/reports', {
    title: 'Reports – ConneCCS',
    activePage: 'reports',
    reports: filtered,
    faculty,
    types,
    filterStatus: status || '',
    filterType: type || ''
  });
});

router.get('/new', (req, res) => {
  res.render('pages/report-form', {
    title: 'Submit Report – ConneCCS',
    activePage: 'reports',
    faculty,
    report: null
  });
});

router.post('/new', (req, res) => {
  // Simulate submission
  res.redirect('/reports?submitted=1');
});

module.exports = router;
