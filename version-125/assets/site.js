(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (slides.length && dots.length) {
      var active = 0;
      var show = function (index) {
        active = index % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === active);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === active);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
        });
      });
      setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    var panel = document.querySelector("[data-filter-panel]");
    if (panel) {
      var input = panel.querySelector("[data-filter-keyword]");
      var year = panel.querySelector("[data-filter-year]");
      var reset = panel.querySelector("[data-filter-reset]");
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-title]"));
      var apply = function () {
        var q = input ? input.value.trim().toLowerCase() : "";
        var y = year ? year.value : "";
        cards.forEach(function (card) {
          var text = [card.dataset.title, card.dataset.genre, card.dataset.region, card.dataset.category, card.dataset.year].join(" ").toLowerCase();
          var ok = (!q || text.indexOf(q) !== -1) && (!y || card.dataset.year === y);
          card.style.display = ok ? "" : "none";
        });
      };
      if (input) input.addEventListener("input", apply);
      if (year) year.addEventListener("change", apply);
      if (reset) reset.addEventListener("click", function () {
        if (input) input.value = "";
        if (year) year.value = "";
        apply();
      });
    }

    var resultBox = document.querySelector("[data-search-results]");
    if (resultBox && window.SEARCH_INDEX) {
      var params = new URLSearchParams(location.search);
      var q = (params.get("q") || "").trim().toLowerCase();
      var title = document.querySelector("[data-search-title]");
      if (title && q) {
        title.textContent = "搜索：" + params.get("q");
      }
      if (!q) {
        resultBox.innerHTML = '<div class="search-empty">请输入影片名称、类型、年份或地区进行搜索。</div>';
        return;
      }
      var items = window.SEARCH_INDEX.filter(function (item) {
        return [item.title, item.year, item.category, item.genre, item.region].join(" ").toLowerCase().indexOf(q) !== -1;
      }).slice(0, 80);
      if (!items.length) {
        resultBox.innerHTML = '<div class="search-empty">没有找到匹配影片，可换一个关键词继续搜索。</div>';
        return;
      }
      resultBox.innerHTML = items.map(function (item) {
        return '<article class="movie-card compact-card">' +
          '<a class="poster" href="movie/' + item.file + '"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '"><span class="poster-badge">' + item.year + '</span></a>' +
          '<div class="card-body"><a class="card-title" href="movie/' + item.file + '">' + escapeHtml(item.title) + '</a>' +
          '<p>' + escapeHtml(item.line) + '</p><div class="card-meta"><a href="category/' + item.categorySlug + '.html">' + escapeHtml(item.category) + '</a><span>' + escapeHtml(item.region) + '</span></div></div>' +
          '</article>';
      }).join("");
    }
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {"&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;"}[char];
    });
  }
})();
