/* global document, window */
(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var useCase = params.get('useCase');

  // Filter button active state
  var filter = params.get('useCase');
  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    var href = btn.getAttribute('href');
    if (filter && href && href.indexOf('useCase=' + filter) !== -1) {
      btn.classList.remove('bg-[var(--color-surface)]', 'border-[var(--color-border)]', 'text-[var(--color-text)]');
      btn.classList.add('bg-orange-500', 'border-orange-500', 'text-white');
    } else if (!filter && href && href.indexOf('/archive') !== -1) {
      btn.classList.remove('bg-[var(--color-surface)]', 'border-[var(--color-border)]', 'text-[var(--color-text)]');
      btn.classList.add('bg-orange-500', 'border-orange-500', 'text-white');
    }
  });

  var ITEMS_PER_PAGE = 12;
  var currentPage = parseInt(params.get('page')) || 1;

  var grid = document.getElementById('postsContainer');
  var allItems = grid ? Array.from(grid.querySelectorAll('.post-item')) : [];
  var searchSlugs = null; // null = no search, [] = no matches, ['slug1',...] = matches

  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var pageInfo = document.getElementById('pageInfo');
  var pageNumbers = document.getElementById('pageNumbers');

  var noResultsMsg = null;

  function computeFilteredItems() {
    var byUseCase = useCase
      ? allItems.filter(function (item) {
          var uc = JSON.parse(item.dataset.usecases || '[]');
          return uc.indexOf(useCase) !== -1;
        })
      : allItems;

    if (searchSlugs === null) {
      return byUseCase;
    }
    return byUseCase.filter(function (item) {
      return searchSlugs.indexOf(item.dataset.slug) !== -1;
    });
  }

  function getFilteredTotalPages(filteredItems) {
    return Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  }

  function showNoResults(query) {
    allItems.forEach(function (item) { item.style.display = 'none'; });
    var noResults = document.getElementById('noSearchResults');
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.id = 'noSearchResults';
      noResults.className = 'text-center py-16 text-[var(--color-text-muted)]';
      noResults.innerHTML = 'No mixes found for "<strong class="text-[var(--color-primary)]"></strong>".<br>Try a different search term.';
      if (grid) grid.appendChild(noResults);
    }
    noResults.style.display = 'block';
    noResults.querySelector('strong').textContent = query;
    if (pageInfo) pageInfo.textContent = 'No results';
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
    pageNumbers.innerHTML = '';
  }

  function hideNoResults() {
    var noResults = document.getElementById('noSearchResults');
    if (noResults) noResults.style.display = 'none';
  }

  function showPage(page, filteredItems, filteredTotalPages) {
    currentPage = page;

    allItems.forEach(function (item) { item.style.display = 'none'; });
    hideNoResults();

    var startIndex = (page - 1) * ITEMS_PER_PAGE;
    var endIndex = startIndex + ITEMS_PER_PAGE;

    filteredItems.forEach(function (item, idx) {
      if (idx >= startIndex && idx < endIndex) {
        item.style.display = 'block';
      }
    });

    if (pageInfo) {
      pageInfo.textContent = 'Page ' + page + ' of ' + filteredTotalPages;
    }
    if (prevBtn) prevBtn.disabled = page === 1;
    if (nextBtn) nextBtn.disabled = page === filteredTotalPages || filteredTotalPages === 0;

    var url = new URL(window.location);
    if (useCase) {
      url.searchParams.set('useCase', useCase);
    } else {
      url.searchParams.delete('useCase');
    }
    url.searchParams.set('page', page);
    window.history.replaceState({}, '', url);

    
    renderPageNumbers(filteredTotalPages);
  }

  function renderPageNumbers(filteredTotalPages) {
    if (!pageNumbers) return;
    pageNumbers.innerHTML = '';

    if (!filteredTotalPages || filteredTotalPages <= 1) return;

    addPageButton(1, currentPage === 1);

    if (currentPage > 3) {
      var ellipsis = document.createElement('span');
      ellipsis.className = 'px-2 text-[var(--color-text-muted)]';
      ellipsis.textContent = '...';
      pageNumbers.appendChild(ellipsis);
    }

    for (var i = Math.max(2, currentPage - 1); i <= Math.min(filteredTotalPages - 1, currentPage + 1); i++) {
      addPageButton(i, i === currentPage);
    }

    if (currentPage < filteredTotalPages - 2) {
      var ellipsis2 = document.createElement('span');
      ellipsis2.className = 'px-2 text-[var(--color-text-muted)]';
      ellipsis2.textContent = '...';
      pageNumbers.appendChild(ellipsis2);
    }

    if (filteredTotalPages > 1) {
      addPageButton(filteredTotalPages, currentPage === filteredTotalPages);
    }
  }

  function addPageButton(page, isActive) {
    var btn = document.createElement('button');
    btn.className = 'min-w-[44px] min-h-[44px] rounded-lg font-semibold transition-colors ' +
      (isActive
        ? 'bg-[var(--color-primary)] text-white'
        : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)]');
    btn.textContent = page;
    btn.addEventListener('click', function () {
      var items = computeFilteredItems();
      var total = getFilteredTotalPages(items);
      showPage(page, items, total);
    });
    pageNumbers.appendChild(btn);
  }

  function onSearchChange(e) {
    searchSlugs = e.detail.slugs.length > 0 ? e.detail.slugs : null;
    currentPage = 1;
    var items = computeFilteredItems();
    var total = getFilteredTotalPages(items);

    if (e.detail.query && items.length === 0) {
      showNoResults(e.detail.query);
    } else if (items.length === 0) {
      if (pageInfo) pageInfo.textContent = 'Page 1 of 1';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      hideNoResults();
    } else {
      showPage(1, items, total);
    }
  }

  document.addEventListener('mixsearch:change', onSearchChange);

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (currentPage > 1) {
        var items = computeFilteredItems();
        var total = getFilteredTotalPages(items);
        showPage(currentPage - 1, items, total);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      var items = computeFilteredItems();
      var total = getFilteredTotalPages(items);
      if (currentPage < total) {
        showPage(currentPage + 1, items, total);
      }
    });
  }

  // Initial render
  var initialItems = computeFilteredItems();
  var initialTotal = getFilteredTotalPages(initialItems);
  currentPage = Math.max(1, Math.min(currentPage, initialTotal || 1));

  if (initialItems.length === 0 && !useCase) {
    if (pageInfo) pageInfo.textContent = 'Page 1 of 1';
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
  } else {
    showPage(currentPage, initialItems, initialTotal);
  }
})();
