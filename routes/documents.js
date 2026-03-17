const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load documents data
function loadDocuments() {
  const data = fs.readFileSync(path.join(__dirname, '../data/documents.json'), 'utf8');
  return JSON.parse(data);
}

// Documents list page
router.get('/', (req, res) => {
  const data = loadDocuments();
  const userRole = req.session.user.role;
  
  // Filter folders based on user role
  const folders = data.folders.filter(f => f.allowedRoles.includes(userRole));
  
  // Calculate stats
  const totalFiles = data.files.length;
  const submittedFiles = data.files.filter(f => f.status === 'submitted').length;
  const approvedFiles = data.files.filter(f => f.status === 'approved').length;
  const pendingFolders = folders.filter(f => {
    const deadline = new Date(f.deadline);
    return deadline > new Date() && f.status === 'active';
  }).length;
  
  res.render('pages/documents', {
    title: 'Documents – ConneCCS',
    activePage: 'documents',
    folders: folders,
    stats: {
      totalFiles,
      submittedFiles,
      approvedFiles,
      pendingFolders
    },
    currentUser: req.session.user
  });
});

// Folder detail page
router.get('/folder/:id', (req, res) => {
  const data = loadDocuments();
  const folderId = parseInt(req.params.id);
  const folder = data.folders.find(f => f.id === folderId);
  
  if (!folder) {
    return res.redirect('/documents');
  }
  
  // Get files in this folder
  const files = data.files.filter(f => f.folderId === folderId);
  
  // Check if deadline is approaching (within 7 days)
  const deadline = new Date(folder.deadline);
  const today = new Date();
  const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  const isApproaching = daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isPastDeadline = daysUntilDeadline < 0;
  
  res.render('pages/folder-detail', {
    title: `${folder.name} – Documents`,
    activePage: 'documents',
    folder: folder,
    files: files,
    daysUntilDeadline: daysUntilDeadline,
    isApproaching: isApproaching,
    isPastDeadline: isPastDeadline,
    currentUser: req.session.user
  });
});

// Upload file (placeholder)
router.post('/upload', (req, res) => {
  // In a real implementation, handle file upload here
  res.json({ success: true, message: 'File uploaded successfully' });
});

module.exports = router;
