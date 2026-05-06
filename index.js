// 0885studio — site behaviors
// Note: scripts on this site are loaded with `defer`, so the DOM is parsed
// before this runs. We still guard against missing document.body just in case.

(function () {
    'use strict';

    // ---------------------------------------------------------------------
    // Existing protective behaviors
    // ---------------------------------------------------------------------

    // Disabilita il tasto destro del mouse
    window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);

    // Disabilita la selezione del testo
    if (document.body) {
        document.body.style.webkitUserSelect = 'none';
        document.body.style.userSelect = 'none';
    }

    // Sovrascrivi window.open per evitare l'apertura di nuove finestre
    window.open = function () {
        return null;
    };

    // ---------------------------------------------------------------------
    // Interactive layer: scroll reveal + parallax
    // Disabled automatically when the user prefers reduced motion.
    // ---------------------------------------------------------------------

    var prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setupReveal() {
        // Pick the visual blocks worth animating: every figure-like image/video
        // container, hero image, and the major prose blocks.
        var selectors = [
            'main .img.home',
            'main .img-fluid.start',
            'main .container-fluid > .row > .img',
            'main article > header',
            'main article > section',
            'main article > .container-fluid'
        ];
        var nodes = document.querySelectorAll(selectors.join(','));
        if (!nodes.length) return;

        // Tag them so the CSS hides them while we wait for the observer.
        Array.prototype.forEach.call(nodes, function (el) {
            el.setAttribute('data-reveal', '');
        });

        // Reveal a stagger row (used on the homepage tile rows).
        var rows = document.querySelectorAll('main .row.g-1');
        Array.prototype.forEach.call(rows, function (row) {
            // Only stagger rows that hold image tiles.
            if (row.querySelector(':scope > .img, :scope > .img.home')) {
                row.setAttribute('data-reveal-stagger', '');
            }
        });

        if (!('IntersectionObserver' in window)) {
            // Old browsers: just show everything.
            Array.prototype.forEach.call(
                document.querySelectorAll('[data-reveal], [data-reveal-stagger]'),
                function (el) { el.classList.add('is-revealed'); }
            );
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.06
        });

        Array.prototype.forEach.call(
            document.querySelectorAll('[data-reveal], [data-reveal-stagger]'),
            function (el) { observer.observe(el); }
        );
    }

    function setupParallax() {
        if (prefersReducedMotion) return;

        // Wrap every hero image (.img-fluid.start) so its inner <img> can
        // translate within an overflow-hidden host.
        var heroes = document.querySelectorAll('main .img-fluid.start');
        Array.prototype.forEach.call(heroes, function (hero) {
            hero.classList.add('parallax-host');
        });

        // Also parallax the homepage tiles' inner images for a subtle depth feel.
        var tiles = document.querySelectorAll('main .img.home');
        Array.prototype.forEach.call(tiles, function (tile) {
            tile.classList.add('parallax-host');
        });

        var hosts = document.querySelectorAll('.parallax-host');
        if (!hosts.length) return;

        var ticking = false;
        var viewportH = window.innerHeight || document.documentElement.clientHeight;

        function update() {
            ticking = false;
            for (var i = 0; i < hosts.length; i++) {
                var host = hosts[i];
                var rect = host.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > viewportH) continue;

                // -1 .. 1 across the visible journey of the host
                var progress = ((rect.top + rect.height / 2) - viewportH / 2) / (viewportH / 2);
                if (progress > 1) progress = 1;
                if (progress < -1) progress = -1;

                var speed = parseFloat(host.dataset.parallaxSpeed || '14'); // px range
                var translateY = -progress * speed;

                // Homepage tiles wrap their <img> inside an <a>. Look anywhere inside the host.
                var media = host.querySelector('img, video');
                if (media) {
                    media.style.transform = 'scale(1.08) translate3d(0, ' + translateY.toFixed(1) + 'px, 0)';
                }
            }
        }

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', function () {
            viewportH = window.innerHeight || document.documentElement.clientHeight;
            onScroll();
        }, { passive: true });

        update();
    }

    // Kick off after layout is settled.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setupReveal();
            setupParallax();
        });
    } else {
        setupReveal();
        setupParallax();
    }
})();
