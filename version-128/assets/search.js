(function () {
  var form = document.getElementById('search-page-form');
  var input = document.getElementById('search-input');
  var category = document.getElementById('filter-category');
  var type = document.getElementById('filter-type');
  var results = document.getElementById('search-results');
  var title = document.getElementById('search-title');
  var note = document.getElementById('search-note');
  if (!form || !input || !results || !window.SEARCH_MOVIES) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  input.value = params.get('q') || '';

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function card(movie) {
    var tags = (movie.tags && movie.tags.length ? movie.tags : [movie.type]).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a class="poster-link" href="' + movie.url + '" aria-label="' + escapeHtml(movie.title) + '">' +
      '<img class="poster" src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<div class="movie-card-meta">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + '</div>' +
      '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.line) + '</p>' +
      '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  function match(movie, q, c, t) {
    var haystack = [movie.title, movie.region, movie.type, movie.category, movie.genre, movie.line].concat(movie.tags || []).join(' ').toLowerCase();
    var okQuery = !q || haystack.indexOf(q) !== -1;
    var okCategory = !c || movie.category === c;
    var okType = !t || movie.type.indexOf(t) !== -1 || movie.genre.indexOf(t) !== -1;
    return okQuery && okCategory && okType;
  }

  function render() {
    var q = input.value.trim().toLowerCase();
    var c = category.value;
    var t = type.value;
    var matched = window.SEARCH_MOVIES.filter(function (movie) {
      return match(movie, q, c, t);
    }).slice(0, 120);
    if (title) {
      title.textContent = q || c || t ? '筛选结果' : '推荐浏览';
    }
    if (note) {
      note.textContent = q || c || t ? '可继续调整关键词和筛选项' : '可通过关键词和筛选项定位片库内容';
    }
    if (!matched.length) {
      results.innerHTML = '<div class="empty-state">暂无匹配内容，可尝试更换关键词。</div>';
      return;
    }
    results.innerHTML = matched.map(card).join('');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    render();
    var q = input.value.trim();
    var next = q ? './search.html?q=' + encodeURIComponent(q) : './search.html';
    window.history.replaceState(null, '', next);
  });
  [input, category, type].forEach(function (el) {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  render();
})();
