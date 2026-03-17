const express = require('express');
const router = express.Router();
const ipcr    = require('../data/ipcr.json');
const faculty = require('../data/faculty.json');

router.get('/', (req, res) => {
  res.render('pages/ipcr', {
    title: 'IPCR Monitoring – ConneCCS',
    activePage: 'ipcr',
    ipcr,
    faculty
  });
});

router.get('/new', (req, res) => {
  res.render('pages/ipcr-form', {
    title: 'New IPCR Entry – ConneCCS',
    activePage: 'ipcr',
    faculty,
    entry: null
  });
});

router.post('/new', (req, res) => {
  res.redirect('/ipcr?saved=1');
});

router.get('/:id', (req, res) => {
  const entry = ipcr.find(i => i.id === parseInt(req.params.id));
  if (!entry) return res.redirect('/ipcr');
  res.render('pages/ipcr-detail', {
    title: `IPCR – ${entry.facultyName}`,
    activePage: 'ipcr',
    entry
  });
});

module.exports = router;
