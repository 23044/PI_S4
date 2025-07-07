/**
 * Main application script
 * Handles shared functionality across pages
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile navigation toggle
  initMobileNav();
  
  // Handle logout functionality
  initLogout();
});



/**
 * Initializes mobile navigation
 */
function initMobileNav() {
  const openSidebarBtn = document.getElementById('open-sidebar');
  const closeSidebarBtn = document.getElementById('close-sidebar');
  const sidebar = document.querySelector('.sidebar');
  
  if (openSidebarBtn && sidebar) {
    openSidebarBtn.addEventListener('click', function() {
      sidebar.classList.add('active');
    });
  }
  
  if (closeSidebarBtn && sidebar) {
    closeSidebarBtn.addEventListener('click', function() {
      sidebar.classList.remove('active');
    });
  }
  
  // Close sidebar when clicking outside of it (on mobile)
  document.addEventListener('click', function(event) {
    if (sidebar && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(event.target) && 
        event.target !== openSidebarBtn) {
      sidebar.classList.remove('active');
    }
  });
}

/**
 * Initializes logout functionality
 */
function initLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // For demo purposes, show a confirmation dialog
      if (confirm('Are you sure you want to log out?')) {
        // Clear stored session data
         const user = JSON.parse(localStorage.getItem('doctolearn_user'));
        if(user.role == "doctorant"){
        localStorage.removeItem('doctolearn_user');
        localStorage.removeItem('doctolearn_token');
        localStorage.removeItem('these');
        localStorage.removeItem('doctorant');
        }
        localStorage.removeItem('doctolearn_user');
        
        // Redirect to login page
        window.location.href = '../pages/login.html';
      }
    });
  }
}

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // Add styles for toast container
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '1rem';
    toastContainer.style.right = '1rem';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '0.5rem';
    toastContainer.style.maxWidth = '300px';
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Add styles for toast
  toast.style.backgroundColor = type === 'success' ? '#10B981' : 
                               type === 'error' ? '#EF4444' : '#3B82F6';
  toast.style.color = 'white';
  toast.style.padding = '0.75rem 1rem';
  toast.style.borderRadius = '0.375rem';
  toast.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
  toast.style.marginBottom = '0.5rem';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease';
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Animate toast
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, duration);
}

/**
 * Stores data in localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
function storeData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing data:', error);
  }
}

/**
 * Retrieves data from localStorage
 * @param {string} key - Storage key
 * @returns {any} - Retrieved data
 */
function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}

/**
 * Formats a date string to a readable format
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}