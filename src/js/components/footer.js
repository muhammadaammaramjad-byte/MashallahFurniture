// Footer Component
export function initializeFooter() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    // Newsletter signup
    const newsletterForm = footer.querySelector('.newsletter-form');
    newsletterForm?.addEventListener('submit', handleNewsletterSignup);

    // Social media links
    const socialLinks = footer.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', handleSocialLink);
    });

    // Back to top button
    const backToTopBtn = footer.querySelector('.back-to-top');
    backToTopBtn?.addEventListener('click', scrollToTop);
}

function handleNewsletterSignup(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;

    if (email) {
        // Here you would typically send the email to your backend
        console.log('Newsletter signup:', email);

        // Show success message
        showToast('Thank you for subscribing!', 'success');

        // Clear form
        e.target.reset();
    }
}

function handleSocialLink(e) {
    e.preventDefault();
    const url = e.currentTarget.href;

    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Toast notification (assuming you have a toast system)
function showToast(message, type = 'info') {
    // This would integrate with your toast component
    console.log(`${type}: ${message}`);
}