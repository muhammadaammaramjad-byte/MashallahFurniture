// Pagination Component
export function createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return null;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';

    const pages = generatePageNumbers(currentPage, totalPages);

    pagination.innerHTML = `
        <button class="pagination-btn prev" ${currentPage === 1 ? 'disabled' : ''}>
            <span class="pagination-icon">‹</span>
            Previous
        </button>
        <div class="pagination-numbers">
            ${pages.map(page => `
                <button class="pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}"
                        data-page="${page}">
                    ${page}
                </button>
            `).join('')}
        </div>
        <button class="pagination-btn next" ${currentPage === totalPages ? 'disabled' : ''}>
            Next
            <span class="pagination-icon">›</span>
        </button>
    `;

    // Add event listeners
    pagination.addEventListener('click', (e) => {
        const btn = e.target.closest('.pagination-btn');
        if (!btn || btn.disabled || btn.classList.contains('active')) return;

        const page = btn.dataset.page;
        if (page) {
            onPageChange(parseInt(page));
        } else if (btn.classList.contains('prev') && currentPage > 1) {
            onPageChange(currentPage - 1);
        } else if (btn.classList.contains('next') && currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    });

    return pagination;
}

function generatePageNumbers(currentPage, totalPages) {
    const pages = [];
    const delta = 2; // Number of pages to show on each side of current page

    // Always show first page
    if (1 < currentPage - delta) {
        pages.push(1);
        if (2 < currentPage - delta) {
            pages.push('...');
        }
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
        pages.push(i);
    }

    // Always show last page
    if (totalPages > currentPage + delta) {
        if (totalPages - 1 > currentPage + delta) {
            pages.push('...');
        }
        pages.push(totalPages);
    }

    return pages;
}

// Infinite scroll pagination
export function createInfiniteScrollLoader(onLoadMore) {
    const loader = document.createElement('div');
    loader.className = 'infinite-scroll-loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>Loading more...</p>
    `;

    let isLoading = false;
    let hasMore = true;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && hasMore) {
                loadMore();
            }
        });
    });

    observer.observe(loader);

    function loadMore() {
        isLoading = true;
        loader.classList.add('loading');

        onLoadMore().then(result => {
            isLoading = false;
            loader.classList.remove('loading');

            if (!result.hasMore) {
                hasMore = false;
                loader.style.display = 'none';
            }
        }).catch(error => {
            console.error('Error loading more items:', error);
            isLoading = false;
            loader.classList.remove('loading');
        });
    }

    return loader;
}