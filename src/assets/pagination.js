// Pagination logic for mixes-all.astro
function initPagination() {
  const grid = document.getElementById('mixesGrid');
  if (!grid) return;
  
  const totalPages = parseInt(grid.dataset.totalPages) || 1;
  const itemsPerPage = parseInt(grid.dataset.itemsPerPage) || 6;
  
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get('page')) || 1;
  currentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  const items = grid.querySelectorAll('.mix-item');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageDisplay = document.getElementById('currentPageDisplay');
  const pageNumbers = document.getElementById('pageNumbers');
  
  function showPage(page) {
    currentPage = page;
    
    items.forEach((item, index) => {
      const itemPage = Math.floor(index / itemsPerPage) + 1;
      if (itemPage === page) {
        item.style.display = 'block';
        const iframe = item.querySelector('iframe');
        if (iframe) {
          iframe.setAttribute('loading', 'lazy');
        }
      } else {
        item.style.display = 'none';
      }
    });
    
    if (pageDisplay) pageDisplay.textContent = page;
    
    if (prevBtn) prevBtn.disabled = page === 1;
    if (nextBtn) nextBtn.disabled = page === totalPages;
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.replaceState({}, '', url);
    
    renderPageNumbers();
  }
  
  function renderPageNumbers() {
    if (!pageNumbers) return;
    pageNumbers.innerHTML = '';
    
    // Always show first page
    addPageButton(1, currentPage === 1);
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'px-2 text-[var(--color-text-muted)]';
      ellipsis.textContent = '...';
      pageNumbers.appendChild(ellipsis);
    }
    
    // Show pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      addPageButton(i, i === currentPage);
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'px-2 text-[var(--color-text-muted)]';
      ellipsis.textContent = '...';
      pageNumbers.appendChild(ellipsis);
    }
    
    // Always show last page if more than 1
    if (totalPages > 1) {
      addPageButton(totalPages, currentPage === totalPages);
    }
  }
  
  function addPageButton(page, isActive) {
    const btn = document.createElement('button');
    btn.className = `w-10 h-10 rounded-lg font-semibold transition-colors ${
      isActive 
        ? 'bg-[var(--color-primary)] text-white' 
        : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white'
    }`;
    btn.textContent = page;
    btn.addEventListener('click', () => showPage(page));
    pageNumbers.appendChild(btn);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) showPage(currentPage - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) showPage(currentPage + 1);
    });
  }
  
  // Initial render
  showPage(currentPage);
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPagination);
} else {
  initPagination();
}
