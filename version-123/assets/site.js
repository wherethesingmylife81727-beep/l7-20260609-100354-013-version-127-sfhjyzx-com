(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-menu]');
        if (menuButton && menu) {
            menuButton.addEventListener('click', function () {
                menu.classList.toggle('open');
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        if (slides.length > 1) {
            var current = 0;
            var show = function (index) {
                current = index % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('active', i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('active', i === current);
                });
            };
            dots.forEach(function (dot, index) {
                dot.addEventListener('click', function () {
                    show(index);
                });
            });
            window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
            var pageQuery = new URLSearchParams(window.location.search).get('q') || '';
            var input = scope.querySelector('[data-filter-input]');
            var year = scope.querySelector('[data-filter-year]');
            var region = scope.querySelector('[data-filter-region]');
            var type = scope.querySelector('[data-filter-type]');
            var reset = scope.querySelector('[data-filter-reset]');
            var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
            if (input && pageQuery) {
                input.value = pageQuery;
            }
            var normalize = function (value) {
                return String(value || '').toLowerCase().trim();
            };
            var apply = function () {
                var q = normalize(input ? input.value : '');
                var y = year ? year.value : '';
                var r = region ? region.value : '';
                var t = type ? type.value : '';
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.category,
                        card.dataset.tags,
                        card.dataset.year
                    ].join(' '));
                    var ok = true;
                    if (q && haystack.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (y && card.dataset.year !== y) {
                        ok = false;
                    }
                    if (r && card.dataset.region !== r) {
                        ok = false;
                    }
                    if (t && card.dataset.type !== t) {
                        ok = false;
                    }
                    card.classList.toggle('is-hidden', !ok);
                });
            };
            [input, year, region, type].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });
            if (reset) {
                reset.addEventListener('click', function () {
                    if (input) input.value = '';
                    if (year) year.value = '';
                    if (region) region.value = '';
                    if (type) type.value = '';
                    apply();
                });
            }
            apply();
        });

        document.querySelectorAll('.player-shell').forEach(function (shell) {
            var video = shell.querySelector('video');
            var button = shell.querySelector('.play-overlay');
            var stream = shell.getAttribute('data-stream');
            var hls;
            var initialized = false;
            var start = function () {
                if (!video || !stream) return;
                if (!initialized) {
                    initialized = true;
                    if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = stream;
                    } else if (window.Hls && window.Hls.isSupported()) {
                        hls = new window.Hls({ enableWorker: true });
                        hls.loadSource(stream);
                        hls.attachMedia(video);
                    } else {
                        video.src = stream;
                    }
                }
                shell.classList.add('is-playing');
                var playPromise = video.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(function () {});
                }
            };
            if (button) {
                button.addEventListener('click', start);
            }
            shell.addEventListener('click', function (event) {
                if (event.target === shell) {
                    start();
                }
            });
            if (video) {
                video.addEventListener('click', function () {
                    if (video.paused) {
                        start();
                    }
                });
                video.addEventListener('play', function () {
                    shell.classList.add('is-playing');
                });
            }
        });
    });
})();
