(function () {
    "use strict";

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var controls = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var activeIndex = 0;
        var timer = null;

        function show(index) {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === activeIndex);
            });
            controls.forEach(function (control) {
                control.classList.toggle("is-active", Number(control.getAttribute("data-hero-dot")) === activeIndex);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(activeIndex + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        controls.forEach(function (control) {
            control.addEventListener("click", function () {
                show(Number(control.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        start();
    }

    function getQueryValue(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || "";
    }

    function initFilters() {
        var root = document.querySelector("[data-filter-root]");
        if (!root) {
            return;
        }
        var searchInput = root.querySelector("[data-filter-search]");
        var categorySelect = root.querySelector("[data-filter-category]");
        var yearSelect = root.querySelector("[data-filter-year]");
        var typeSelect = root.querySelector("[data-filter-type]");
        var countBox = root.querySelector("[data-filter-count]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var emptyState = document.querySelector("[data-empty-state]");

        if (searchInput) {
            searchInput.value = getQueryValue("q");
        }

        function apply() {
            var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
            var category = categorySelect ? categorySelect.value : "";
            var year = yearSelect ? yearSelect.value : "";
            var type = typeSelect ? typeSelect.value : "";
            var visibleCount = 0;

            cards.forEach(function (card) {
                var text = card.getAttribute("data-search") || "";
                var matchesQuery = !query || text.indexOf(query) !== -1;
                var matchesCategory = !category || card.getAttribute("data-category") === category;
                var matchesYear = !year || card.getAttribute("data-year") === year;
                var matchesType = !type || card.getAttribute("data-type") === type;
                var visible = matchesQuery && matchesCategory && matchesYear && matchesType;
                card.style.display = visible ? "" : "none";
                if (visible) {
                    visibleCount += 1;
                }
            });

            if (countBox) {
                countBox.textContent = "找到 " + visibleCount + " 部作品";
            }
            if (emptyState) {
                emptyState.classList.toggle("is-visible", visibleCount === 0);
            }
        }

        [searchInput, categorySelect, yearSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
        root.addEventListener("submit", function (event) {
            event.preventDefault();
            apply();
        });
        apply();
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector(".player-cover");
            var stream = player.getAttribute("data-stream");
            if (!video || !button || !stream) {
                return;
            }

            function mount() {
                if (video.getAttribute("data-ready") === "1") {
                    return;
                }
                video.setAttribute("data-ready", "1");
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    video.hlsInstance = hls;
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    return;
                }
                video.src = stream;
            }

            function play() {
                mount();
                player.classList.add("is-playing");
                var result = video.play();
                if (result && typeof result.catch === "function") {
                    result.catch(function () {});
                }
            }

            button.addEventListener("click", play);
            video.addEventListener("play", function () {
                player.classList.add("is-playing");
            });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });
})();
