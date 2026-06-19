document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-search-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const input = form.querySelector("input[name='q']");
      const query = input ? input.value.trim() : "";
      if (query) {
        window.location.href = "./search.html?q=" + encodeURIComponent(query);
      }
    });
  });

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll("[data-slide-dot]"));
    let activeIndex = 0;

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }
  }

  const cardList = document.querySelector("[data-card-list]");
  const localSearch = document.querySelector("[data-local-search]");
  const yearSelect = document.querySelector("[data-filter-year]");
  const regionSelect = document.querySelector("[data-filter-region]");

  function filterCards() {
    if (!cardList) {
      return;
    }

    const query = localSearch ? localSearch.value.trim().toLowerCase() : "";
    const year = yearSelect ? yearSelect.value : "";
    const region = regionSelect ? regionSelect.value : "";
    const cards = Array.from(cardList.querySelectorAll(".movie-card"));

    cards.forEach(function (card) {
      const text = [
        card.dataset.title || "",
        card.dataset.region || "",
        card.dataset.genre || "",
        card.dataset.category || "",
        card.dataset.year || ""
      ].join(" ").toLowerCase();
      const queryMatch = !query || text.indexOf(query) !== -1;
      const yearMatch = !year || card.dataset.year === year;
      const regionMatch = !region || card.dataset.region === region;
      card.classList.toggle("is-hidden", !(queryMatch && yearMatch && regionMatch));
    });
  }

  if (localSearch) {
    localSearch.addEventListener("input", filterCards);
  }
  if (yearSelect) {
    yearSelect.addEventListener("change", filterCards);
  }
  if (regionSelect) {
    regionSelect.addEventListener("change", filterCards);
  }

  const searchForm = document.querySelector("[data-search-page-form]");
  const searchResults = document.getElementById("searchResults");
  const searchStatus = document.getElementById("searchStatus");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderResult(movie) {
    const tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return [
      "<article class=\"movie-card\">",
      "  <a class=\"poster-frame\" href=\"" + escapeHtml(movie.link) + "\" style=\"background-image: linear-gradient(180deg, rgba(2, 6, 23, 0.04), rgba(2, 6, 23, 0.74)), url('" + escapeHtml(movie.cover) + "');\">",
      "    <span class=\"poster-year\">" + escapeHtml(movie.year) + "</span>",
      "    <span class=\"poster-play\">播放</span>",
      "  </a>",
      "  <div class=\"movie-card-body\">",
      "    <a class=\"movie-title\" href=\"" + escapeHtml(movie.link) + "\">" + escapeHtml(movie.title) + "</a>",
      "    <div class=\"movie-meta\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>",
      "    <p>" + escapeHtml(movie.oneLine) + "</p>",
      "    <div class=\"tag-row\">" + tags + "</div>",
      "  </div>",
      "</article>"
    ].join("\n");
  }

  function runSearch(query) {
    if (!searchResults || typeof SITE_MOVIES === "undefined") {
      return;
    }

    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) {
      searchResults.innerHTML = "";
      if (searchStatus) {
        searchStatus.textContent = "请输入关键词进行搜索";
      }
      return;
    }

    const matches = SITE_MOVIES.filter(function (movie) {
      const haystack = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.category,
        (movie.tags || []).join(" "),
        movie.oneLine
      ].join(" ").toLowerCase();
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    }).sort(function (a, b) {
      return b.score - a.score;
    }).slice(0, 120);

    searchResults.innerHTML = matches.map(renderResult).join("\n");
    if (searchStatus) {
      searchStatus.textContent = matches.length ? "搜索结果" : "未找到相关影片";
    }
  }

  if (searchForm && searchResults) {
    const input = searchForm.querySelector("input[name='q']");
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";

    if (input) {
      input.value = initialQuery;
    }
    runSearch(initialQuery);

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const query = input ? input.value.trim() : "";
      const target = query ? "./search.html?q=" + encodeURIComponent(query) : "./search.html";
      window.history.replaceState(null, "", target);
      runSearch(query);
    });
  }
});
