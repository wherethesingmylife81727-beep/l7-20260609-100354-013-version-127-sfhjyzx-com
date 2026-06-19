(function () {
  const params = new URLSearchParams(window.location.search);
  const query = (params.get('q') || '').trim();
  const input = document.getElementById('searchInput');
  const summary = document.getElementById('searchSummary');
  const results = document.getElementById('searchResults');

  if (input) {
    input.value = query;
  }

  if (!query || !Array.isArray(window.SEARCH_INDEX)) {
    return;
  }

  const normalized = query.toLowerCase();
  const matched = window.SEARCH_INDEX.filter(function (item) {
    const text = [
      item.title,
      item.category,
      item.region,
      item.type,
      item.year,
      item.genre,
      item.oneLine,
      (item.tags || []).join(' ')
    ].join(' ').toLowerCase();

    return text.indexOf(normalized) !== -1;
  }).slice(0, 120);

  if (summary) {
    summary.textContent = matched.length ? '搜索结果' : '没有找到相关影片';
  }

  if (!results) {
    return;
  }

  if (!matched.length) {
    results.innerHTML = '<div class="empty-state">换一个关键词再试试，也可以从分类或排行榜继续浏览。</div>';
    return;
  }

  results.innerHTML = matched.map(function (item) {
    const tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<a class="movie-card" href="' + escapeHtml(item.url) + '">',
      '  <div class="poster-wrap">',
      '    <img src="./' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '    <span class="year-badge">' + escapeHtml(item.year) + '</span>',
      '  </div>',
      '  <div class="movie-body">',
      '    <span class="movie-chip">' + escapeHtml(item.category) + '</span>',
      '    <h3>' + escapeHtml(item.title) + '</h3>',
      '    <p>' + escapeHtml(item.oneLine) + '</p>',
      '    <div class="movie-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</a>'
    ].join('');
  }).join('');

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
