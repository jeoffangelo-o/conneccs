const express = require('express');
const router = express.Router();
const faculty = require('../data/faculty.json');
const reports = require('../data/reports.json');
const ipcr    = require('../data/ipcr.json');

router.get('/', (req, res) => {
  res.render('pages/faculty', {
    title: 'Faculty Directory – ConneCCS',
    activePage: 'faculty',
    faculty
  });
});

router.get('/:id', (req, res) => {
  const member = faculty.find(f => f.id === parseInt(req.params.id));
  if (!member) return res.redirect('/faculty');
  const memberReports = reports.filter(r => r.facultyId === member.id);
  const memberIpcr    = ipcr.filter(i => i.facultyId === member.id);
  res.render('pages/faculty-detail', {
    title: `${member.name} – ConneCCS`,
    activePage: 'faculty',
    member,
    memberReports,
    memberIpcr
  });
});

module.exports = router;
