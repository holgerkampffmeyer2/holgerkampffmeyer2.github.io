(function () {
  'use strict';

  var DEBOUNCE_MS = 300;
  var MAX_RESULTS = 15;
  var SNIPPET_PAD = 30;

  var searchData = [];
  var overlay = null;
  var input = null;
  var selectedIndex = -1;
  var debounceTimer = null;
  var currentQuery = '';

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function extractSnippet(text, matchIdx, matchLen) {
    if (!text) return '';
    var start = Math.max(0, matchIdx - SNIPPET_PAD);
    var end = Math.min(text.length, matchIdx + matchLen + SNIPPET_PAD);
    var prefix = start > 0 ? '...' : '';
    var suffix = end < text.length ? '...' : '';
    var before = escapeHtml(text.substring(start, matchIdx));
    var matched = '<mark>' + escapeHtml(text.substring(matchIdx, matchIdx + matchLen)) + '</mark>';
    var after = escapeHtml(text.substring(matchIdx + matchLen, end));
    return prefix + before + matched + after + suffix;
  }

  function findBestMatch(item, query) {
    var q = query.toLowerCase();

    for (var ti = 0; ti < (item.tracklist || []).length; ti++) {
      var track = item.tracklist[ti];
      var idx = track.toLowerCase().indexOf(q);
      if (idx !== -1) {
        return { type: 'tracklist', snippet: extractSnippet(track, idx, q.length), label: 'Tracklist' };
      }
    }

    var titleIdx = item.title.toLowerCase().indexOf(q);
    if (titleIdx !== -1) {
      return { type: 'title', snippet: extractSnippet(item.title, titleIdx, q.length), label: 'Title' };
    }

    var desc = item.description || '';
    var descIdx = desc.toLowerCase().indexOf(q);
    if (descIdx !== -1) {
      return { type: 'description', snippet: extractSnippet(desc, descIdx, q.length), label: 'Description' };
    }

    for (var tagI = 0; tagI < (item.tags || []).length; tagI++) {
      var tag = item.tags[tagI];
      if (tag.toLowerCase().indexOf(q) !== -1) {
        return { type: 'tag', snippet: '<mark>' + escapeHtml(tag) + '</mark>', label: 'Tag' };
      }
    }

    return null;
  }

  function fireChangeEvent(query, slugs) {
    var evt = new CustomEvent('mixsearch:change', {
      detail: { query: query, slugs: slugs }
    });
    document.dispatchEvent(evt);
  }

  function hideOverlay() {
    if (overlay) overlay.style.display = 'none';
    selectedIndex = -1;
  }

  function renderOverlay(results, query) {
    if (!overlay) return;
    overlay.innerHTML = '';

    if (results.length === 0) {
      overlay.innerHTML = '<div class="mix-search-empty">No mixes found for "' + escapeHtml(query) + '"</div>';
      overlay.style.display = 'block';
      return;
    }

    var list = document.createElement('div');
    results.forEach(function (item, i) {
      var el = document.createElement('a');
      el.className = 'mix-search-item';
      var safeSlug = encodeURIComponent(String(item.slug || '').replace(/[^a-zA-Z0-9_-]/g, ''));
      var safeHref = '/dj/mixes/' + safeSlug;
      el.href = safeHref;
      el.setAttribute('data-index', i);

      var snippetHtml = '';
      if (item.match.type !== 'title') {
        snippetHtml = '<span class="mix-search-snippet-label">' + item.match.label + ':</span> ' + item.match.snippet;
      } else {
        snippetHtml = item.match.snippet;
      }

      el.innerHTML =
        '<img src="' + escapeHtml(item.picture) + '" alt="" loading="lazy" width="48" height="48">' +
        '<div class="mix-search-item-text">' +
          '<div class="mix-search-item-title">' + escapeHtml(item.title) + '</div>' +
          '<div class="mix-search-snippet">' + snippetHtml + '</div>' +
        '</div>';

      el.addEventListener('mousedown', function (e) {
        e.preventDefault();
        window.location.href = safeHref;
      });

      list.appendChild(el);
    });

    overlay.appendChild(list);
    overlay.style.display = 'block';
    selectedIndex = -1;
  }

  function showResults(query) {
    currentQuery = query;
    var q = query.toLowerCase();
    var results = [];

    for (var si = 0; si < searchData.length; si++) {
      if (results.length >= MAX_RESULTS) break;
      var item = searchData[si];
      var match = findBestMatch(item, q);
      if (match) {
        results.push({ slug: item.slug, title: item.title, picture: item.picture, description: item.description, tags: item.tags, tracklist: item.tracklist, match: match });
      }
    }

    renderOverlay(results, query);
    var slugs = results.map(function (r) { return r.slug; });
    fireChangeEvent(query, slugs);
  }

  function onInput() {
    clearTimeout(debounceTimer);
    var val = input.value.trim();
    if (val.length < 2) {
      hideOverlay();
      fireChangeEvent('', []);
      return;
    }
    debounceTimer = setTimeout(function () {
      showResults(val);
    }, DEBOUNCE_MS);
  }

  function onKeydown(e) {
    var items = overlay ? overlay.querySelectorAll('.mix-search-item') : [];
    if (e.key === 'Escape') {
      hideOverlay();
      input.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      updateSelection(items);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection(items);
      return;
    }
    if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
      e.preventDefault();
      window.location.href = items[selectedIndex].href;
      return;
    }
  }

  function updateSelection(items) {
    items.forEach(function (el, i) {
      el.classList.toggle('mix-search-item-active', i === selectedIndex);
    });
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  function onDocumentClick(e) {
    if (overlay && overlay.style.display !== 'none') {
      if (!input.contains(e.target) && !overlay.contains(e.target)) {
        hideOverlay();
      }
    }
  }

  function onFocus() {
    var val = input.value.trim();
    if (val.length >= 2) {
      showResults(val);
    }
  }

  function init() {
    var script = document.getElementById('mixSearchData');
    input = document.querySelector('[data-mix-search]');
    if (!script || !input) return;

    try {
      searchData = JSON.parse(script.textContent);
    } catch (e) {
      return;
    }

    overlay = document.createElement('div');
    overlay.className = 'mix-search-overlay';
    overlay.style.display = 'none';
    var wrapper = input.parentElement;
    wrapper.style.position = 'relative';
    wrapper.appendChild(overlay);

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKeydown);
    input.addEventListener('focus', onFocus);
    document.addEventListener('click', onDocumentClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
