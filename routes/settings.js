const express = require('express');
const router = express.Router();

// GET /settings - Settings page
router.get('/', (req, res) => {
  const currentUser = req.session.user || {
    id: 'guest',
    name: 'Guest',
    role: 'faculty'
  };

  res.render('pages/settings', {
    title: 'Settings',
    activePage: 'settings',
    userId: currentUser.id,
    userName: currentUser.name,
    userRole: currentUser.role
  });
});

// POST /settings/update - Update user settings
router.post('/update', (req, res) => {
  const currentUser = req.session.user || {
    id: 'guest',
    name: 'Guest',
    role: 'faculty'
  };

  // In a real application, you would save these settings to a database
  // For now, we'll just return success since settings are stored client-side
  
  const settings = req.body;
  
  // Log the settings update (for development)
  console.log(`Settings updated for user ${currentUser.name}:`, settings);
  
  res.json({ 
    success: true, 
    message: 'Settings updated successfully',
    settings: settings
  });
});

// POST /settings/change-password - Change user password
router.post('/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const currentUser = req.session.user || {
    id: 'guest',
    name: 'Guest',
    role: 'faculty'
  };

  // In a real application, you would:
  // 1. Verify the current password
  // 2. Hash the new password
  // 3. Update the database
  
  // For demo purposes, we'll just return success
  console.log(`Password change requested for user ${currentUser.name}`);
  
  res.json({ 
    success: true, 
    message: 'Password changed successfully'
  });
});

// GET /settings/export - Export user data
router.get('/export', (req, res) => {
  const currentUser = req.session.user || {
    id: 'guest',
    name: 'Guest',
    role: 'faculty'
  };

  // Check if user has admin privileges
  if (currentUser.role !== 'dean' && currentUser.role !== 'program_chair') {
    return res.status(403).json({ error: 'Access denied' });
  }

  // In a real application, you would export actual data
  const exportData = {
    exportDate: new Date().toISOString(),
    exportedBy: currentUser.name,
    systemInfo: {
      version: '1.0.0',
      totalUsers: 25,
      totalMessages: 150,
      totalDocuments: 75
    },
    note: 'This is a demo export. In production, this would contain actual system data.'
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="conneccs-export.json"');
  res.json(exportData);
});

module.exports = router;