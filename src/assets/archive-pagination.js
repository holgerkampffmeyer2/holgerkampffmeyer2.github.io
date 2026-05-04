// Archive pagination and filtering logic for mixes-blog-archive.astro
(function() {
  // Get URL parameters once
  const params = new URLSearchParams(window.location.search);
  const useCase = params.get('useCase');
  
  // Filter button active state
  const filter = params.get('useCase');
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const href = btn.getAttribute('href');
    if (filter && href && href.includes('useCase=' + filter)) {
      btn.classList.remove('bg-[var(--color-surface)]', 'border-[var(--color-border)]', 'text-[var(--color-text)]');
      btn.classList.add('bg-orange-500', 'border-orange-500', 'text-white');
    } else if (!filter && href && href.endsWith('/archive')) {
      btn.classList.remove('bg-[var(--color-surface)]', 'border-[var(--color-border)]', 'text-[var(--color-text)]');
      btn.classList.add('bg-orange-500', 'border-orange-500', 'text-white');
    }
  });
  const ITEMS_PER_PAGE = 12;
  let currentPage = parseInt(params.get('page')) || 1;

  const grid = document.getElementById('postsContainer');
  const allItems = grid ? Array.from(grid.querySelectorAll('.post-item')) : [];
  
  // Filter items by useCase
  const filteredItems = useCase 
    ? allItems.filter(item => {
        const useCases = JSON.parse(item.dataset.usecases || '[]');
        return useCases.includes(useCase);
      })
    : allItems;
  
  const filteredTotalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  currentPage = Math.max(1, Math.min(currentPage, filteredTotalPages || 1));

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageInfo = document.getElementById('pageInfo');
  const pageNumbers = document.getElementById('pageNumbers');

  function showPage(page) {
    currentPage = page;

    // Hide all items first
    allItems.forEach(item => item.style.display = 'none');
    
    // Show filtered items for current page
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    filteredItems.forEach((item, idx) => {
      if (idx >= startIndex && idx < endIndex) {
        item.style.display = 'block';
      }
    });

    if (pageInfo) {
      pageInfo.textContent = `Page ${page} of ${filteredTotalPages}`;
    }

    if (prevBtn) prevBtn.disabled = page === 1;
    if (nextBtn) nextBtn.disabled = page === filteredTotalPages || filteredTotalPages === 0;

    const url = new URL(window.location);
    if (useCase) {
      url.searchParams.set('useCase', useCase);
    } else {
      url.searchParams.delete('useCase');
    }
    url.searchParams.set('page', page);
    window.history.replaceState({}, '', url);

    // Scroll to top of grid
    grid?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    renderPageNumbers();
  }

  function renderPageNumbers() {
    if (!pageNumbers) return;
    
    if (!filteredTotalPages || filteredTotalPages <= 1) {
      pageNumbers.innerHTML = '';
      return;
    }
    
    pageNumbers.innerHTML = '';

    addPageButton(1, currentPage === 1);

    if (currentPage > 3) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'px-2 text-[var(--color-text-muted)]';
      ellipsis.textContent = '...';
      pageNumbers.appendChild(ellipsis);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(filteredTotalPages - 1, currentPage + 1); i++) {
      addPageButton(i, i === currentPage);
    }

    if (currentPage < filteredTotalPages - 2) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'px-2 text-[var(--color-text-muted)]';
      ellipsis.textContent = '...';
      pageNumbers.appendChild(ellipsis);
    }

    if (filteredTotalPages > 1) {
      addPageButton(filteredTotalPages, currentPage === filteredTotalPages);
    }
  }

  function addPageButton(page, isActive) {
    const btn = document.createElement('button');
    btn.className = `min-w-[44px] min-h-[44px] rounded-lg font-semibold transition-colors ${
      isActive 
        ? 'bg-[var(--color-primary)] text-white' 
        : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)]'
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
      if (currentPage < filteredTotalPages) showPage(currentPage + 1);
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
})();
