(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var searchInput = document.querySelector("[data-search-input]");
  var searchCards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
  var searchEmpty = document.querySelector("[data-search-empty]");

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function applySearch() {
    if (!searchInput || !searchCards.length) {
      return;
    }

    var keyword = normalize(searchInput.value);
    var visibleCount = 0;

    searchCards.forEach(function (card) {
      var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-meta"));
      var visible = !keyword || haystack.indexOf(keyword) !== -1;
      card.classList.toggle("search-hidden", !visible);

      if (visible) {
        visibleCount += 1;
      }
    });

    if (searchEmpty) {
      searchEmpty.classList.toggle("show", visibleCount === 0);
    }
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    searchInput.value = query;
    searchInput.addEventListener("input", applySearch);
    applySearch();
  }
})();
