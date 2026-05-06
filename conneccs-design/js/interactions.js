// ConneCCS Design - Interactive Elements Handler
// This file handles button clicks and form submissions for the mockup

document.addEventListener('DOMContentLoaded', function() {
  
  // Handle all form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get the submit button text to determine action
      const submitBtn = form.querySelector('button[type="submit"]');
      const action = submitBtn ? submitBtn.textContent.trim() : 'Submit';
      
      // Show success message
      showNotification(`${action} successful!`, 'success');
      
      // Redirect based on form context
      setTimeout(() => {
        if (action.includes('Sign In')) {
          window.location.href = 'dashboard.html';
        } else if (action.includes('Create Account')) {
          window.location.href = 'index.html';
        } else if (action.includes('Submit Report')) {
          window.location.href = 'reports.html';
        } else if (action.includes('Submit IPCR')) {
          window.location.href = 'ipcr.html';
        } else if (action.includes('Publish Announcement')) {
          window.location.href = 'announcements.html';
        } else if (action.includes('Create Folder')) {
          window.location.href = 'documents.html';
        }
      }, 1000);
    });
  });
  
  // Handle "Save as Draft" buttons
  const draftButtons = document.querySelectorAll('button[type="button"]');
  draftButtons.forEach(btn => {
    if (btn.textContent.includes('Save as Draft')) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Draft saved successfully!', 'info');
      });
    }
  });
  
  // Handle Approve buttons
  const approveButtons = document.querySelectorAll('.btn-primary');
  approveButtons.forEach(btn => {
    if (btn.textContent.includes('Approve')) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('IPCR approved successfully!', 'success');
        setTimeout(() => {
          btn.textContent = 'Approved ✓';
          btn.disabled = true;
          btn.style.opacity = '0.6';
        }, 500);
      });
    }
  });
  
  // Handle role filter buttons on faculty page
  const roleFilters = document.querySelectorAll('.role-filter');
  roleFilters.forEach(btn => {
    btn.addEventListener('click', function() {
      roleFilters.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      showNotification(`Filtered by: ${this.textContent}`, 'info');
    });
  });
  
  // Handle download links only
  const downloadLinks = document.querySelectorAll('a');
  downloadLinks.forEach(link => {
    if (link.textContent.trim() === 'Download') {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Download started...', 'success');
      });
    }
  });
  
  // Handle menu buttons (three dots) - only for buttons, not links
  const menuButtons = document.querySelectorAll('button.btn-icon');
  menuButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Menu options coming soon...', 'info');
    });
  });
  
  // Notification system
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.custom-notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 24px;
      background: ${type === 'success' ? 'var(--green)' : type === 'info' ? 'var(--accent)' : 'var(--red)'};
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // Add animation styles
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
});
