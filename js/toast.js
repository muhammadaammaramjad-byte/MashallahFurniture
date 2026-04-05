/**
 * Toast Notification System
 * Provides elegant, auto-dismissing notifications to replace alert() dialogs
 */

// Toast configuration
const TOAST_CONFIG = {
  duration: 4000, // Auto-dismiss after 4 seconds
  animationDuration: 300, // Animation duration in ms
  types: {
    success: { icon: 'fa-check-circle', color: '#4caf50' },
    error: { icon: 'fa-exclamation-circle', color: '#f44336' },
    warning: { icon: 'fa-exclamation-triangle', color: '#ff9800' },
    info: { icon: 'fa-info-circle', color: '#2196f3' }
  }
};

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (optional)
 */
function showToast(message, type = 'info', duration = TOAST_CONFIG.duration) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.getElementById('toast');

  if (!toastContainer || !toast) {
    console.warn('Toast container not found. Make sure toast.html is included.');
    return;
  }

  // Get toast type configuration
  const config = TOAST_CONFIG.types[type] || TOAST_CONFIG.types.info;

  // Update toast content
  const iconElement = toast.querySelector('.toast-icon');
  const messageElement = toast.querySelector('.toast-message');

  iconElement.className = `fas ${config.icon} toast-icon`;
  messageElement.textContent = message;

  // Apply type-specific styling
  toast.className = `toast toast-${type}`;

  // Show toast with animation
  toastContainer.classList.add('show');

  // Auto-hide after duration
  const hideTimeout = setTimeout(() => {
    hideToast();
  }, duration);

  // Store timeout for manual hiding
  toast._hideTimeout = hideTimeout;
}

/**
 * Hide the current toast notification
 */
function hideToast() {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.getElementById('toast');

  if (toastContainer) {
    toastContainer.classList.remove('show');
  }

  // Clear any pending timeout
  if (toast && toast._hideTimeout) {
    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = null;
  }
}

/**
 * Show a success toast
 * @param {string} message
 * @param {number} duration
 */
function showSuccessToast(message, duration) {
  showToast(message, 'success', duration);
}

/**
 * Show an error toast
 * @param {string} message
 * @param {number} duration
 */
function showErrorToast(message, duration) {
  showToast(message, 'error', duration);
}

/**
 * Show a warning toast
 * @param {string} message
 * @param {number} duration
 */
function showWarningToast(message, duration) {
  showToast(message, 'warning', duration);
}

/**
 * Show an info toast
 * @param {string} message
 * @param {number} duration
 */
function showInfoToast(message, duration) {
  showToast(message, 'info', duration);
}

window.addEventListener('show-toast', (event) => {
  const { message = '', type = 'info', duration } = event.detail || {};
  if (!message) return;
  showToast(message, type, duration);
});

// Export functions for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showToast,
    hideToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast
  };
}