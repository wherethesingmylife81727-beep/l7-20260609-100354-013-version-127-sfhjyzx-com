(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-site-search]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[name='q']");
      var value = input ? input.value.trim() : "";
      var target = "./search.html";

      if (value) {
        target += "?q=" + encodeURIComponent(value);
      }

      window.location.href = target;
    });
  });

  var filterInput = document.querySelector("[data-page-filter]");
  var filterButtons = document.querySelectorAll("[data-filter-year]");
  var cards = document.querySelectorAll("[data-search]");
  var emptyState = document.querySelector("[data-empty-state]");
  var urlQuery = new URLSearchParams(window.location.search).get("q") || "";

  if (filterInput && urlQuery) {
    filterInput.value = urlQuery;
  }

  function currentYearFilter() {
    var active = document.querySelector("[data-filter-year].is-active");
    return active ? active.getAttribute("data-filter-year") : "all";
  }

  function applyFilter() {
    if (!cards.length) {
      return;
    }

    var text = filterInput ? filterInput.value.trim().toLowerCase() : "";
    var year = currentYearFilter();
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = (card.getAttribute("data-search") || "").toLowerCase();
      var cardYear = card.getAttribute("data-year") || "";
      var matchText = !text || haystack.indexOf(text) !== -1;
      var matchYear = year === "all" || cardYear === year;

      if (matchText && matchYear) {
        card.classList.remove("hidden-by-filter");
        visible += 1;
      } else {
        card.classList.add("hidden-by-filter");
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("is-visible", visible === 0);
    }
  }

  if (filterInput) {
    filterInput.addEventListener("input", applyFilter);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (item) {
        item.classList.remove("is-active");
      });

      button.classList.add("is-active");
      applyFilter();
    });
  });

  applyFilter();
})();
