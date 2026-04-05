// Toast Notification Component
let toastContainer = null;

export function showToast(message, type = 'info', duration = 3000) {
    if (!toastContainer) {
        createToastContainer();
    }

    const toast = createToast(message, type);
    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('active'), 10);

    // Auto remove
    if (duration > 0) {
        setTimeout(() => removeToast(toast), duration);
    }

    return toast;
}

export function removeToast(toast) {
    toast.classList.remove('active');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

function createToastContainer() {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
}

function createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = getToastIcon(type);

    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Close notification">
                <span class="close-icon">×</span>
            </button>
        </div>
    `;

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    return toast;
}

function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

// Convenience methods
export function showSuccessToast(message, duration) {
    return showToast(message, 'success', duration);
}

export function showErrorToast(message, duration) {
    return showToast(message, 'error', duration);
}

export function showWarningToast(message, duration) {
    return showToast(message, 'warning', duration);
}

export function showInfoToast(message, duration) {
    return showToast(message, 'info', duration);
}

// Clear all toasts
export function clearAllToasts() {
    if (toastContainer) {
        const toasts = toastContainer.querySelectorAll('.toast');
        toasts.forEach(toast => removeToast(toast));
    }
}