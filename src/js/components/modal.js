// Modal Component
export function initializeModals() {
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Close modal on overlay click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });
}

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus management
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (firstFocusable) {
        firstFocusable.focus();
    }

    // Trap focus
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Return focus to trigger element
    const trigger = document.querySelector(`[data-modal="${modalId}"]`);
    if (trigger) {
        trigger.focus();
    }
}

export function closeAllModals() {
    const activeModals = document.querySelectorAll('.modal.active');
    activeModals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Utility functions for common modals
export function showConfirmModal(message, onConfirm, onCancel = null) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;

    modal.querySelector('.modal-message').textContent = message;

    const confirmBtn = modal.querySelector('.confirm-btn');
    const cancelBtn = modal.querySelector('.cancel-btn');

    const handleConfirm = () => {
        onConfirm();
        closeModal('confirm-modal');
        cleanup();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        closeModal('confirm-modal');
        cleanup();
    };

    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);

    openModal('confirm-modal');
}

export function showAlertModal(message, type = 'info') {
    const modal = document.getElementById('alert-modal');
    if (!modal) return;

    const messageEl = modal.querySelector('.modal-message');
    messageEl.textContent = message;
    messageEl.className = `modal-message alert-${type}`;

    const closeBtn = modal.querySelector('.close-btn');
    const handleClose = () => {
        closeModal('alert-modal');
        closeBtn.removeEventListener('click', handleClose);
    };

    closeBtn.addEventListener('click', handleClose);

    openModal('alert-modal');
}