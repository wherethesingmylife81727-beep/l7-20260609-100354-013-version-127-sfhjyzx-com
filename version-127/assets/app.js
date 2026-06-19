(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-menu');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  document.querySelectorAll('.filter-scope').forEach(function (scope) {
    const input = scope.querySelector('.filter-input');
    const select = scope.querySelector('.filter-select');
    const cards = Array.from(scope.querySelectorAll('[data-search]'));

    function applyFilter() {
      const keyword = input ? input.value.trim().toLowerCase() : '';
      const type = select ? select.value.trim() : '';

      cards.forEach(function (card) {
        const text = (card.getAttribute('data-search') || '').toLowerCase();
        const cardType = card.getAttribute('data-type') || '';
        const matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        const matchedType = !type || cardType === type;
        card.classList.toggle('is-hidden-card', !(matchedKeyword && matchedType));
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (select) {
      select.addEventListener('change', applyFilter);
    }
  });
})();
