const express = require('express');
const router = express.Router();
const announcements = require('../data/announcements.json');

router.get('/', (req, res) => {
  res.render('pages/announcements', {
    title: 'Announcements – ConneCCS',
    activePage: 'announcements',
    announcements
  });
});

router.get('/new', (req, res) => {
  res.render('pages/announcement-form', {
    title: 'New Announcement – ConneCCS',
    activePage: 'announcements'
  });
});

router.post('/new', (req, res) => {
  res.redirect('/announcements?posted=1');
});

module.exports = router;
