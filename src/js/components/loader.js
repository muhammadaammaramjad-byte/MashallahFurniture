// Loader Component
export function showLoader(message = 'Loading...') {
    let loader = document.querySelector('.global-loader');
    if (!loader) {
        loader = createLoader();
        document.body.appendChild(loader);
    }

    loader.querySelector('.loader-message').textContent = message;
    loader.classList.add('active');
}

export function hideLoader() {
    const loader = document.querySelector('.global-loader');
    if (loader) {
        loader.classList.remove('active');
    }
}

function createLoader() {
    const loader = document.createElement('div');
    loader.className = 'global-loader';
    loader.innerHTML = `
        <div class="loader-overlay"></div>
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p class="loader-message">Loading...</p>
        </div>
    `;

    return loader;
}

// Button loader
export function showButtonLoader(button, message = 'Loading...') {
    const originalText = button.textContent;
    button.disabled = true;
    button.innerHTML = `
        <span class="spinner"></span>
        <span class="loading-text">${message}</span>
    `;

    return () => {
        button.disabled = false;
        button.textContent = originalText;
    };
}

// Inline loader
export function createInlineLoader() {
    const loader = document.createElement('div');
    loader.className = 'inline-loader';
    loader.innerHTML = `
        <div class="inline-spinner"></div>
        <span class="inline-text">Loading...</span>
    `;

    return loader;
}