// EmailJS Service for Contact Form
import emailjs from '@emailjs/browser';

// Initialize EmailJS
export const initEmailJS = () => {
    emailjs.init('6Lfc76csAAAAADEPPeVFFDSpO_qSCeqWms1VLXvy'); // Public Key
};

// Send Contact Form Email
export const sendContactEmail = async (formData) => {
    const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        phone: formData.phone || 'Not provided',
        subject: formData.subject || 'Website Inquiry',
        to_email: 'muhammad.aammar.amjad@gmail.com'
    };

    try {
        const response = await emailjs.send(
            'service_4ev67uc',      // Service ID
            'template_fs6qnhp',     // Template ID
            templateParams
        );
        console.log('✅ Email sent successfully!', response);
        return { success: true, response };
    } catch (error) {
        console.error('❌ Email send failed:', error);
        return { success: false, error };
    }
};

// Show Toast Notification
export const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <span class="toast-icon"></span>
        <span class="toast-text">${message}</span>
    `;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
};
