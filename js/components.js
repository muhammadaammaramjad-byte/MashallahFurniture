export async function includeHTML() {
  const elements = document.querySelectorAll('[data-include]');
  for (const el of elements) {
    const file = el.getAttribute('data-include');
    if (!file) continue;
    try {
      const response = await fetch(file);
      if (response.ok) {
        el.innerHTML = await response.text();
      } else {
        console.warn('Component not found:', file);
      }
    } catch (error) {
      console.error('Error loading component:', file, error);
    }
  }
}

window.includeHTML = includeHTML;

// Auto-run on page load
document.addEventListener('DOMContentLoaded', includeHTML);
