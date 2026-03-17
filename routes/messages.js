const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const messagesPath = path.join(__dirname, '../data/messages.json');
const facultyPath = path.join(__dirname, '../data/faculty.json');

// Helper to read data
function getData() {
  const data = fs.readFileSync(messagesPath, 'utf8');
  return JSON.parse(data);
}

// Helper to save data
function saveData(data) {
  fs.writeFileSync(messagesPath, JSON.stringify(data, null, 2));
}

// Helper to get faculty
function getFaculty() {
  const data = fs.readFileSync(facultyPath, 'utf8');
  return JSON.parse(data);
}

// GET /messages - Main messaging interface
router.get('/', (req, res) => {
  const data = getData();
  const faculty = getFaculty();
  
  // Get current user from session
  const currentUser = req.session.user || {
    id: 'guest',
    name: 'Guest',
    role: 'faculty'
  };
  
  // Get channels accessible to user
  const accessibleChannels = data.channels.filter(ch => 
    ch.allowedRoles.includes(currentUser.role)
  );
  
  const activeChannel = accessibleChannels[0]?.id || 'general';
  const activeChannelName = accessibleChannels[0]?.name || 'general';
  
  res.render('pages/messages', {
    title: 'Messages',
    activePage: 'messages',
    channels: data.channels,
    activeChannel,
    activeChannelName,
    userId: currentUser.id,
    userName: currentUser.name,
    userRole: currentUser.role,
    faculty
  });
});

// API: Get messages for a channel
router.get('/api/channel/:channelId', (req, res) => {
  const data = getData();
  const channelId = req.params.channelId;
  
  // Get current user from session
  const currentUser = req.session.user || { id: 'guest', role: 'faculty' };
  
  // Check if user has access to channel
  const channel = data.channels.find(ch => ch.id === channelId);
  if (!channel || !channel.allowedRoles.includes(currentUser.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Get messages for channel
  const messages = data.messages.filter(msg => msg.channelId === channelId);
  
  res.json({ messages });
});

// API: Get new messages after a certain ID
router.get('/api/channel/:channelId/new', (req, res) => {
  const data = getData();
  const channelId = req.params.channelId;
  const afterId = parseInt(req.query.after) || 0;
  
  const messages = data.messages.filter(msg => 
    msg.channelId === channelId && msg.id > afterId
  );
  
  res.json({ messages });
});

// API: Send a message
router.post('/api/send', (req, res) => {
  const data = getData();
  const { channelId, message } = req.body;
  
  // Get current user from session
  const currentUser = req.session.user || {
    id: 'guest',
    name: 'Guest',
    role: 'faculty'
  };
  
  // Check channel access
  const channel = data.channels.find(ch => ch.id === channelId);
  if (!channel || !channel.allowedRoles.includes(currentUser.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Extract mentions from message
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  while ((match = mentionRegex.exec(message)) !== null) {
    mentions.push(match[1]);
  }
  
  // Create new message
  const newMessage = {
    id: data.messages.length > 0 ? Math.max(...data.messages.map(m => m.id)) + 1 : 1,
    channelId,
    userId: currentUser.id,
    userName: currentUser.name,
    userRole: currentUser.role,
    message,
    timestamp: new Date().toISOString(),
    mentions,
    attachments: []
  };
  
  data.messages.push(newMessage);
  saveData(data);
  
  res.json({ success: true, message: newMessage });
});

// API: Get channel info
router.get('/api/channel-info/:channelId', (req, res) => {
  const data = getData();
  const channel = data.channels.find(ch => ch.id === req.params.channelId);
  
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  res.json(channel);
});

// API: Get Google Drive files (mock for now)
router.get('/api/drive/files', (req, res) => {
  // Mock Google Drive files
  // In production, integrate with Google Drive API
  const mockFiles = [
    {
      id: 'file_1',
      name: 'IPCR_Template_2024.docx',
      size: '45 KB',
      modified: 'Mar 10, 2024',
      url: 'https://drive.google.com/file/d/mock1',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    {
      id: 'file_2',
      name: 'Faculty_Guidelines.pdf',
      size: '1.2 MB',
      modified: 'Mar 8, 2024',
      url: 'https://drive.google.com/file/d/mock2',
      mimeType: 'application/pdf'
    },
    {
      id: 'file_3',
      name: 'Research_Proposal_Format.docx',
      size: '78 KB',
      modified: 'Mar 5, 2024',
      url: 'https://drive.google.com/file/d/mock3',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  ];
  
  res.json({ files: mockFiles });
});

// API: Share file to channel
router.post('/api/share-file', (req, res) => {
  const data = getData();
  const { channelId, fileId } = req.body;
  
  // Simulate current user
  const currentUser = {
    id: 'dean',
    name: "Dean's Office",
    role: 'dean'
  };
  
  // Mock file info (in production, get from Google Drive API)
  const fileInfo = {
    id: fileId,
    name: 'IPCR_Template_2024.docx',
    url: 'https://drive.google.com/file/d/mock1'
  };
  
  // Create message with attachment
  const newMessage = {
    id: data.messages.length > 0 ? Math.max(...data.messages.map(m => m.id)) + 1 : 1,
    channelId,
    userId: currentUser.id,
    userName: currentUser.name,
    userRole: currentUser.role,
    message: `Shared a file from Google Drive`,
    timestamp: new Date().toISOString(),
    mentions: [],
    attachments: [fileInfo]
  };
  
  data.messages.push(newMessage);
  saveData(data);
  
  res.json({ success: true, message: newMessage });
});

module.exports = router;
