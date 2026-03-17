const express = require('express');
const router = express.Router();
const faculty = require('../data/faculty.json');

router.get('/', (req, res) => {
  const workloadData = faculty.map(f => ({
    ...f,
    totalLoad: f.teachingLoad + f.researchLoad + f.extensionLoad,
    overloaded: (f.teachingLoad + f.researchLoad + f.extensionLoad) > 24
  }));

  res.render('pages/workload', {
    title: 'Workload Management – ConneCCS',
    activePage: 'workload',
    workload: workloadData
  });
});

module.exports = router;
