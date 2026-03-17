const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Re-enabled for form parsing

const messagesPath = path.join(__dirname, '../data/messages.json');
const facultyPath = path.join(__dirname, '../data/faculty.json');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/messages');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, documents, and archives are allowed.'));
    }
  }
});

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

// API: Send a message (with file upload support and Google Drive integration)
router.post('/api/send', upload.array('files', 5), async (req, res) => {
  try {
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
    while ((match = mentionRegex.exec(message || '')) !== null) {
      mentions.push(match[1]);
    }
    
    // Process uploaded files
    const attachments = [];
    if (req.files && req.files.length > 0) {
      const { isGoogleDriveConfigured, uploadFile: uploadToGoogleDrive } = require('../config/google-drive');
      
      console.log(`\n📎 Processing ${req.files.length} file(s) for message...`);
      console.log(`🔧 Google Drive configured: ${isGoogleDriveConfigured()}`);
      
      for (const file of req.files) {
        let fileUrl = `/messages/file/${file.filename}`; // Default local URL
        let isCloudStored = false;
        
        // Try to upload to Google Drive if configured
        if (isGoogleDriveConfigured()) {
          try {
            console.log(`\n📤 Uploading ${file.originalname} to Google Drive...`);
            const driveFile = await uploadToGoogleDrive({
              name: file.originalname,
              path: file.path,
              mimeType: file.mimetype,
              folderId: null // Upload to root, or specify a folder ID
            });
            
            fileUrl = driveFile.webViewLink; // Use Google Drive URL
            isCloudStored = true;
            console.log(`✅ Successfully uploaded ${file.originalname} to Google Drive`);
            console.log(`🔗 Google Drive URL: ${fileUrl}`);
            
            // Delete local file after successful upload
            try {
              fs.unlinkSync(file.path);
              console.log(`🗑️  Deleted local file: ${file.path}`);
            } catch (deleteError) {
              console.warn(`⚠️  Could not delete local file: ${deleteError.message}`);
            }
            
          } catch (driveError) {
            console.error(`❌ Failed to upload ${file.originalname} to Google Drive:`, driveError.message);
            console.log(`📁 Falling back to local storage for ${file.originalname}`);
            // Keep using local URL as fallback
          }
        } else {
          console.log(`📁 Google Drive not configured, storing ${file.originalname} locally`);
        }
        
        attachments.push({
          id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          name: file.originalname,
          url: fileUrl,
          size: formatFileSize(file.size),
          type: file.mimetype,
          isCloudStored: isCloudStored,
          localPath: isCloudStored ? null : file.filename // Keep local filename for fallback
        });
        
        console.log(`📋 Attachment processed: ${file.originalname} (${isCloudStored ? 'Google Drive' : 'Local'})`);
      }
      
      console.log(`✅ All ${req.files.length} file(s) processed successfully\n`);
    }
    
    // Create new message
    const newMessage = {
      id: data.messages.length > 0 ? Math.max(...data.messages.map(m => m.id)) + 1 : 1,
      channelId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      message: message || '',
      timestamp: new Date().toISOString(),
      mentions,
      attachments
    };
    
    data.messages.push(newMessage);
    saveData(data);
    
    res.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
});

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// API: Get channel info
router.get('/api/channel-info/:channelId', (req, res) => {
  const data = getData();
  const channel = data.channels.find(ch => ch.id === req.params.channelId);
  
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  res.json(channel);
});

// API: Get Google Drive files (with error handling)
router.get('/api/drive/files', (req, res) => {
  try {
    const { isGoogleDriveConfigured } = require('../config/google-drive');
    
    if (!isGoogleDriveConfigured()) {
      // Return mock files when Google Drive is not configured
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
      
      return res.json({ files: mockFiles, configured: false });
    }
    
    // TODO: Implement real Google Drive integration when configured
    res.json({ files: [], configured: true });
    
  } catch (error) {
    console.error('Google Drive API error:', error);
    res.status(500).json({ error: 'Google Drive service unavailable' });
  }
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

// API: Serve uploaded files with proper headers for preview
router.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../public/uploads/messages', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Set headers to allow embedding and cross-origin access
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Determine content type
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
  };
  
  const contentType = contentTypes[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  
  // For documents, set content-disposition to inline to allow preview
  if (ext === '.pdf' || ext.includes('doc') || ext.includes('xls') || ext.includes('ppt')) {
    res.setHeader('Content-Disposition', 'inline');
  }
  
  res.sendFile(filePath);
});

// API: Get file info (for both local and cloud files)
router.get('/api/file-info/:messageId/:attachmentId', (req, res) => {
  const data = getData();
  const messageId = parseInt(req.params.messageId);
  const attachmentId = req.params.attachmentId;
  
  const message = data.messages.find(m => m.id === messageId);
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }
  
  const attachment = message.attachments.find(a => a.id === attachmentId);
  if (!attachment) {
    return res.status(404).json({ error: 'Attachment not found' });
  }
  
  res.json({
    name: attachment.name,
    size: attachment.size,
    type: attachment.type,
    url: attachment.url,
    isCloudStored: attachment.isCloudStored || false,
    localPath: attachment.localPath || null
  });
});

// API: Edit a message
router.put('/api/edit', (req, res) => {
  try {
    const data = getData();
    const { messageId, newText, channelId } = req.body;
    
    // Get current user from session
    const currentUser = req.session.user || {
      id: 'guest',
      name: 'Guest',
      role: 'faculty'
    };
    
    // Find the message
    const messageIndex = data.messages.findIndex(m => m.id === parseInt(messageId));
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const message = data.messages[messageIndex];
    
    // Check if user owns the message
    if (message.userId !== currentUser.id) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }
    
    // Update the message
    data.messages[messageIndex].message = newText;
    data.messages[messageIndex].edited = true;
    data.messages[messageIndex].editedAt = new Date().toISOString();
    
    // Extract new mentions
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(newText)) !== null) {
      mentions.push(match[1]);
    }
    data.messages[messageIndex].mentions = mentions;
    
    saveData(data);
    
    res.json({ success: true, message: data.messages[messageIndex] });
  } catch (error) {
    console.error('Error editing message:', error);
    res.status(500).json({ error: 'Failed to edit message' });
  }
});

// API: Delete a message
router.delete('/api/delete', (req, res) => {
  try {
    const data = getData();
    const { messageId, channelId } = req.body;
    
    // Get current user from session
    const currentUser = req.session.user || {
      id: 'guest',
      name: 'Guest',
      role: 'faculty'
    };
    
    // Find the message
    const messageIndex = data.messages.findIndex(m => m.id === parseInt(messageId));
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const message = data.messages[messageIndex];
    
    // Check if user owns the message or has admin privileges
    if (message.userId !== currentUser.id && !['dean', 'program_chair'].includes(currentUser.role)) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }
    
    // Mark as deleted instead of removing completely
    data.messages[messageIndex].deleted = true;
    data.messages[messageIndex].deletedAt = new Date().toISOString();
    data.messages[messageIndex].deletedBy = currentUser.id;
    
    saveData(data);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// API: Add reaction to message
router.post('/api/reaction', (req, res) => {
  try {
    const data = getData();
    const { messageId, emoji, channelId } = req.body;
    
    // Get current user from session
    const currentUser = req.session.user || {
      id: 'guest',
      name: 'Guest',
      role: 'faculty'
    };
    
    // Find the message
    const messageIndex = data.messages.findIndex(m => m.id === parseInt(messageId));
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Initialize reactions if not exists
    if (!data.messages[messageIndex].reactions) {
      data.messages[messageIndex].reactions = [];
    }
    
    // Find existing reaction
    let reactionIndex = data.messages[messageIndex].reactions.findIndex(r => r.emoji === emoji);
    
    if (reactionIndex === -1) {
      // Create new reaction
      data.messages[messageIndex].reactions.push({
        emoji: emoji,
        users: [currentUser.id],
        count: 1
      });
    } else {
      // Add user to existing reaction
      const reaction = data.messages[messageIndex].reactions[reactionIndex];
      if (!reaction.users.includes(currentUser.id)) {
        reaction.users.push(currentUser.id);
        reaction.count = reaction.users.length;
      }
    }
    
    saveData(data);
    
    res.json({ 
      success: true, 
      reactions: data.messages[messageIndex].reactions 
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// API: Toggle reaction on message
router.post('/api/reaction/toggle', (req, res) => {
  try {
    const data = getData();
    const { messageId, emoji, channelId } = req.body;
    
    // Get current user from session
    const currentUser = req.session.user || {
      id: 'guest',
      name: 'Guest',
      role: 'faculty'
    };
    
    // Find the message
    const messageIndex = data.messages.findIndex(m => m.id === parseInt(messageId));
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Initialize reactions if not exists
    if (!data.messages[messageIndex].reactions) {
      data.messages[messageIndex].reactions = [];
    }
    
    // Find existing reaction
    let reactionIndex = data.messages[messageIndex].reactions.findIndex(r => r.emoji === emoji);
    
    if (reactionIndex === -1) {
      // Create new reaction
      data.messages[messageIndex].reactions.push({
        emoji: emoji,
        users: [currentUser.id],
        count: 1
      });
    } else {
      // Toggle user in existing reaction
      const reaction = data.messages[messageIndex].reactions[reactionIndex];
      const userIndex = reaction.users.indexOf(currentUser.id);
      
      if (userIndex === -1) {
        // Add user
        reaction.users.push(currentUser.id);
      } else {
        // Remove user
        reaction.users.splice(userIndex, 1);
      }
      
      reaction.count = reaction.users.length;
      
      // Remove reaction if no users left
      if (reaction.count === 0) {
        data.messages[messageIndex].reactions.splice(reactionIndex, 1);
      }
    }
    
    saveData(data);
    
    res.json({ 
      success: true, 
      reactions: data.messages[messageIndex].reactions 
    });
  } catch (error) {
    console.error('Error toggling reaction:', error);
    res.status(500).json({ error: 'Failed to toggle reaction' });
  }
});

module.exports = router;
