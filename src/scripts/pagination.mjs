/**
 * Shared pagination logic for mix pages
 * @param {Object} options - Configuration options
 * @param {string} options.gridId - ID of the grid container
 * @param {string} options.itemSelector - CSS selector for items
 * @param {number} options.itemsPerPage - Items per page
 * @param {string} options.filterParam - URL parameter name for filtering (optional)
 * @param {string} options.filterDataset - Dataset key to read filter values from (optional)
 * @param {boolean} options.scrollToTop - Whether to scroll to top on page change
 * @param {Function} options.onPageChange - Callback after page changes
 */
export function initPagination(options) {
  const {
    gridId,
    itemSelector = '.item',
    itemsPerPage = 12,
    filterParam = null,
    filterDataset = null,
    scrollToTop = true,
    onPageChange = null
  } = options;

  const params = new URLSearchParams(window.location.search);
  const filterValue = filterParam ? params.get(filterParam) : null;
  let currentPage = parseInt(params.get('page')) || 1;

  const grid = document.getElementById(gridId);
  if (!grid) return;

  const allItems = Array.from(grid.querySelectorAll(itemSelector));
  
  // Filter items if filter param is provided
  const filteredItems = filterValue && filterDataset
    ? allItems.filter(item => {
        const itemFilterValue = item.dataset[filterDataset];
        try {
          const filters = JSON.parse(itemFilterValue || '[]');
          return filters.includes(filterValue);
        } catch {
          return itemFilterValue === filterValue;
        }
      })
    : allItems;

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  currentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageInfo = document.getElementById('pageInfo');
  const pageNumbers = document.getElementById('pageNumbers');

  function showPage(page) {
    currentPage = page;

    // Hide all items first
    allItems.forEach(item => item.style.display = 'none');
    
    // Show filtered items for current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    filteredItems.forEach((item, idx) => {
      if (idx >= startIndex && idx < endIndex) {
        item.style.display = 'block';
      }
    });

    if (pageInfo) {
      pageInfo.textContent = `Page ${page} of ${totalPages}`;
    }

    if (prevBtn) prevBtn.disabled = page === 1;
    if (nextBtn) nextBtn.disabled = page === totalPages || totalPages === 0;

    // Update URL
    const url = new URL(window.location);
    if (filterValue) {
      url.searchParams.set(filterParam, filterValue);
    } else {
      url.searchParams.delete(filterParam);
    }
    url.searchParams.set('page', page);
    window.history.replaceState({}, '', url);

    // Scroll to top
    if (scrollToTop) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    renderPageNumbers();

    if (onPageChange) {
      onPageChange(page, filteredItems.length);
    }
  }

  function renderPageNumbers() {
    if (!pageNumbers) return;
    
    if (!totalPages || totalPages <= 1) {
      pageNumbers.innerHTML = '';
      return;
    }
    
    pageNumbers.innerHTML = '';

    addPageButton(1, currentPage === 1);

    if (currentPage > 3) {
      const ellipsis = createEllipsis();
      pageNumbers.appendChild(ellipsis);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      addPageButton(i, i === currentPage);
    }

    if (currentPage < totalPages - 2) {
      const ellipsis = createEllipsis();
      pageNumbers.appendChild(ellipsis);
    }

    if (totalPages > 1) {
      addPageButton(totalPages, currentPage === totalPages);
    }
  }

  function createEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'px-2 text-[var(--color-text-muted)]';
    ellipsis.textContent = '...';
    return ellipsis;
  }

  function addPageButton(page, isActive) {
    const btn = document.createElement('button');
    btn.className = `w-10 h-10 rounded-lg font-semibold transition-colors ${
      isActive 
        ? 'bg-[var(--color-primary)] text-white' 
        : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)]'
    }`;
    btn.textContent = page;
    btn.addEventListener('click', () => showPage(page));
    pageNumbers.appendChild(btn);
  }

  // Bind prev/next buttons
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
  if (filteredItems.length === 0) {
    if (pageInfo) pageInfo.textContent = 'Page 1 of 1';
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
  } else {
    showPage(currentPage);
  }

  return { showPage, currentPage, totalPages, filteredItems };
}

/**
 * Highlight active filter buttons
 * @param {string} filterParam - URL parameter name for filtering
 * @param {string} containerSelector - CSS selector for filter buttons container
 */
export function initFilterButtons(filterParam, containerSelector = '.filter-btn') {
  const params = new URLSearchParams(window.location.search);
  const activeFilter = params.get(filterParam);

  document.querySelectorAll(containerSelector).forEach(btn => {
    const href = btn.getAttribute('href');
    if (activeFilter && href && href.includes(filterParam + '=' + activeFilter)) {
      btn.classList.remove('bg-[var(--color-surface)]', 'border-[var(--color-border)]', 'text-[var(--color-text)]');
      btn.classList.add('bg-orange-500', 'border-orange-500', 'text-white');
    } else if (!activeFilter && href && href.endsWith('archive')) {
      btn.classList.remove('bg-[var(--color-surface)]', 'border-[var(--color-border)]', 'text-[var(--color-text)]');
      btn.classList.add('bg-orange-500', 'border-orange-500', 'text-white');
    }
  });
}