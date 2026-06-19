(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = './search.html';
            }
        });
    });

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;

        function showSlide(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === activeIndex);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === activeIndex);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5600);
        }
    }

    var filterInput = document.querySelector('[data-list-filter]');
    var cardList = document.querySelector('[data-card-list]');
    var searchInput = document.querySelector('[data-search-input]');
    var searchSummary = document.getElementById('searchSummary');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function cardText(card) {
        return normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-year'),
            card.getAttribute('data-category'),
            card.getAttribute('data-region'),
            card.textContent
        ].join(' '));
    }

    function applyFilter() {
        if (!filterInput || !cardList) {
            return;
        }

        var keyword = normalize(filterInput.value);
        var cards = Array.prototype.slice.call(cardList.children);
        var count = 0;

        cards.forEach(function (card) {
            var matched = !keyword || cardText(card).indexOf(keyword) !== -1;
            card.classList.toggle('is-filtered-out', !matched);
            if (matched) {
                count += 1;
            }
        });

        if (searchSummary) {
            searchSummary.textContent = keyword ? '搜索关键词：' + filterInput.value + '，匹配 ' + count + ' 部影片' : '输入影片名称、题材、年份或地区，快速定位可观看内容。';
        }
    }

    if (filterInput) {
        filterInput.addEventListener('input', applyFilter);
    }

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (query) {
            searchInput.value = query;
            applyFilter();
        }
    }

    var sortSelect = document.querySelector('[data-sort-select]');
    if (sortSelect && cardList) {
        sortSelect.addEventListener('change', function () {
            var cards = Array.prototype.slice.call(cardList.children);
            var mode = sortSelect.value;

            cards.sort(function (a, b) {
                var yearA = Number(a.getAttribute('data-year')) || 0;
                var yearB = Number(b.getAttribute('data-year')) || 0;
                var titleA = a.getAttribute('data-title') || '';
                var titleB = b.getAttribute('data-title') || '';

                if (mode === 'year-asc') {
                    return yearA - yearB || titleA.localeCompare(titleB, 'zh-Hans-CN');
                }

                if (mode === 'title-asc') {
                    return titleA.localeCompare(titleB, 'zh-Hans-CN');
                }

                return yearB - yearA || titleA.localeCompare(titleB, 'zh-Hans-CN');
            });

            cards.forEach(function (card) {
                cardList.appendChild(card);
            });

            applyFilter();
        });
    }
})();
