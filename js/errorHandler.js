// js/errorHandler.js
class ErrorHandler {
  constructor() {
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    window.addEventListener('error', (e) => {
      this.logError(e.error, 'global');
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.logError(e.reason, 'promise');
    });
  }

  async logError(error, type) {
    // Send to your monitoring service
    console.error(`[${type}]`, error);

    // Show user-friendly message
    this.showUserError(error);

    // Log to analytics
    if (window.gtag) {
      window.gtag('event', 'error', {
        error_type: type,
        error_message: error.message
      });
    }
  }

  showUserError(error) {
    const toast = document.querySelector('.toast');
    if (toast) {
      toast.show('Something went wrong. Please try again.', 'error');
    }
  }
}

export const errorHandler = new ErrorHandler();