/* ==========================================================================
   EXTOL AFFILIATES — behaviour + motion
   Motion is a core language (Shaka design language §Motion system):
   split-text heading reveals, scroll-reveal, animated counters, marquee.
   Everything degrades to fully-visible content if JS or the CDN fails.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Safety: content must never be permanently invisible.

     `js-motion` hides everything that is due to be revealed, so anything
     that stops the reveal from running hides the page for good. Two
     separate failures can do that, and each needs its own guard:

       1. GSAP never arrives  — the CDN is gone, the file 404s, a CSP
          blocks it. Caught by checking for `window.gsap`.
       2. GSAP arrives but never gets a frame — requestAnimationFrame is
          starved (backgrounded tab, throttled renderer). The library is
          present and the tweens are queued, but the ticker never advances
          and every element stays at opacity 0. Caught by watching whether
          the ticker's frame count actually moves.
     ------------------------------------------------------------------ */
  function standDown() {
    root.classList.remove('js-motion');

    // Removing the class only un-hides what CSS was hiding. If GSAP already
    // ran its gsap.set() calls before stalling, the elements carry INLINE
    // opacity:0 / transforms, which outrank the class — so they would stay
    // invisible. Clear those too, or the recovery recovers nothing.
    var hidden = document.querySelectorAll(
      '[data-reveal], [data-reveal-child], [data-reveal-now], [data-split], .word, [data-chip], .iso-layer, .iso-layer *'
    );
    Array.prototype.forEach.call(hidden, function (el) {
      if (el.style) {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.willChange = '';
      }
    });
    if (window.gsap) {
      try { window.gsap.set(hidden, { clearProps: 'opacity,transform,willChange' }); } catch (e) {}
    }
  }
  if (reduced) standDown();

  setTimeout(function () {
    if (!window.gsap) { standDown(); return; }           // failure 1

    var seen = window.gsap.ticker.frame;
    setTimeout(function () {                             // failure 2
      // A backgrounded/occluded browser deliberately throttles animation
      // frames. Treating that normal state as a broken ticker permanently
      // disabled the homepage loop before the reader ever brought the tab
      // forward. Only fail open while the document is actually visible.
      if (!document.hidden && window.gsap.ticker.frame <= seen + 1) standDown();
    }, 1200);
  }, 2500);

  /* ==================================================================
     01 · HEADER — stuck state + mobile drawer
     ================================================================== */
  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    // Every page opens on a dark field. The header stays light over it and
    // flips to forest ink once the field has scrolled past.
    var field = document.querySelector('[data-field]');

    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
      if (!field) { header.classList.add('is-past-field'); return; }
      var headerH = header.offsetHeight || 82;
      header.classList.toggle(
        'is-past-field',
        field.getBoundingClientRect().bottom <= headerH
      );
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    // Stagger index for the drawer links
    Array.prototype.forEach.call(nav.querySelectorAll('.nav__link'), function (el, i) {
      el.style.setProperty('--i', i);
    });

    var close = function () {
      document.body.classList.remove('is-nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('is-nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('is-nav-open')) {
        close();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) close();
    });
  }

  /* ==================================================================
     02 · FOOTER YEAR
     ================================================================== */
  function initYear() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ==================================================================
     03 · ZONE TRANSITIONS
     Dissolve the boundary between two differently-coloured sections by
     bleeding the previous zone's colour down into the next one. Runs
     without GSAP — it's pure layout — so the page reads as one travelling
     tone even if the animation library never loads.
     ================================================================== */
  function initZoneFades() {
    var main = document.getElementById('main');
    if (!main) return;

    // the colour a block leaves behind at its bottom edge
    var outgoing = function (el) {
      if (el.classList.contains('hero') || el.classList.contains('page-hero')) return '#25482A';
      if (el.classList.contains('panel--field')) return '#16301E';
      if (el.classList.contains('panel--oat2')) return '#E4DFCE';
      return '#EDE9DC';
    };

    var blocks = Array.prototype.filter.call(main.children, function (el) {
      return el.nodeType === 1 && el.offsetHeight > 0;
    });

    for (var i = 1; i < blocks.length; i++) {
      var prev = outgoing(blocks[i - 1]);
      var here = outgoing(blocks[i]);
      if (prev === here) continue;               // same tone, nothing to dissolve

      var band = document.createElement('span');
      band.className = 'zone-fade';
      band.setAttribute('aria-hidden', 'true');
      band.style.setProperty('--zone-from', prev);
      blocks[i].classList.add('has-zone-fade');
      blocks[i].insertBefore(band, blocks[i].firstChild);
    }
  }

  /* ==================================================================
     04 · MARQUEE — duplicate the track so the loop is seamless
     ================================================================== */
  function initMarquee() {
    Array.prototype.forEach.call(document.querySelectorAll('.marquee'), function (m) {
      var track = m.querySelector('.marquee__track');
      if (!track || track.dataset.cloned) return;
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.dataset.cloned = 'true';
      m.appendChild(clone);
      track.dataset.cloned = 'true';
    });
  }

  /* ==================================================================
     04 · SPLIT TEXT
     Wraps every word in an inline-block span while preserving inner
     markup (e.g. .mark-word). The full string is mirrored onto
     aria-label so assistive tech reads one clean line, not 40 spans.
     ================================================================== */
  function splitInto(node, out) {
    Array.prototype.forEach.call(node.childNodes, function (child) {
      if (child.nodeType === 3) {
        child.textContent.split(/(\s+)/).forEach(function (chunk) {
          if (chunk === '') return;
          if (/^\s+$/.test(chunk)) { out.push(document.createTextNode(chunk)); return; }
          // Each word gets a mask so it is clipped while it travels, rather
          // than ghosting over the copy beneath the heading.
          var mask = document.createElement('span');
          mask.className = 'word-mask';
          var s = document.createElement('span');
          s.className = 'word';
          s.style.willChange = 'transform, opacity';
          s.textContent = chunk;
          mask.appendChild(s);
          out.push(mask);
        });
      } else if (child.nodeType === 1) {
        var shell = child.cloneNode(false);
        var inner = [];
        splitInto(child, inner);
        inner.forEach(function (n) { shell.appendChild(n); });
        out.push(shell);
      }
    });
  }

  function splitElement(el) {
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var out = [];
    splitInto(el, out);
    el.innerHTML = '';
    out.forEach(function (n) { el.appendChild(n); });
    if (label) el.setAttribute('aria-label', label);
    return el.querySelectorAll('.word');
  }

  /* ==================================================================
     05 · MOTION
     ================================================================== */
  function initMotion() {
    if (!window.gsap) { standDown(); return; }
    var gsap = window.gsap;

    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    var hasST = !!window.ScrollTrigger;

    gsap.defaults({ ease: 'power3.out' });

    /* --- Heading reveals ------------------------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-split]'), function (el) {
      var words = splitElement(el);
      if (!words.length) return;

      gsap.set(el, { opacity: 1 });
      var tween = {
        yPercent: 0,
        opacity: 1,
        duration: 0.68,
        stagger: 0.05,
        // release the compositor layers once the reveal is done
        onComplete: function () { gsap.set(words, { clearProps: 'willChange' }); }
      };
      gsap.set(words, { yPercent: 108, opacity: 0 });

      if (el.hasAttribute('data-split-now')) {
        gsap.to(words, Object.assign({ delay: 0.15 }, tween));
      } else if (hasST) {
        gsap.to(words, Object.assign({
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }, tween));
      } else {
        gsap.to(words, tween);
      }
    });

    /* --- Generic scroll-reveal ------------------------------------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
      var kids = el.querySelectorAll('[data-reveal-child]');
      var targets = kids.length ? kids : [el];
      // A [data-split] heading animates its own words — don't also lift the
      // container under it, or the two systems fight on the same pixels.
      if (!kids.length && (el.hasAttribute('data-split') || el.querySelector('[data-split]'))) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      gsap.set(el, { opacity: 1 });
      gsap.set(targets, { y: 22, opacity: 0 });

      var tween = {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: kids.length ? 0.07 : 0
      };

      if (el.hasAttribute('data-reveal-now')) {
        gsap.to(targets, Object.assign({ delay: 0.35 }, tween));
      } else if (hasST) {
        gsap.to(targets, Object.assign({
          scrollTrigger: { trigger: el, start: 'top 86%', once: true }
        }, tween));
      } else {
        gsap.to(targets, tween);
      }
    });

    /* --- Animated counters (proof by numbers) ---------------------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) {
      var end = parseFloat(el.getAttribute('data-count'));
      var dp = (el.getAttribute('data-count').split('.')[1] || '').length;
      var obj = { v: 0 };

      var run = function () {
        gsap.to(obj, {
          v: end,
          duration: 1.2,
          ease: 'power1.out',
          onUpdate: function () { el.textContent = obj.v.toFixed(dp); }
        });
      };

      el.textContent = (0).toFixed(dp);
      if (hasST) {
        window.ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: run });
      } else {
        run();
      }
    });

    /* --- The field motif: layered planes settle into place --------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-motif]'), function (g) {
      var planes = g.querySelectorAll('.plane');
      if (!planes.length) return;
      // Fade the GROUP, never the planes — each plane's own opacity is what
      // builds the depth of the field.
      // Only the hero field earns motion — animating it behind a privacy
      // policy is motion for its own sake. And the per-plane stagger was
      // 2.19s of barely-perceptible movement competing with the H1 reveal,
      // so the group simply fades.
      if (!g.closest('.hero')) { gsap.set(g, { opacity: 1 }); return; }
      gsap.set(g, { opacity: 0 });
      gsap.to(g, { opacity: 1, duration: 0.8, delay: 0.1, ease: 'power2.out' });
    });

    /* --- The isometric stack ---------------------------------------
       The static diagram is always the complete stack. Once it enters the
       viewport, the motion takes over: data is the grounded starting point,
       then logic, agent and surface rise into place. Each plane gets a short
       moment to land before its callout is drawn. The finished stack holds,
       then folds down in reverse before beginning again. */
    Array.prototype.forEach.call(document.querySelectorAll('[data-iso]'), function (svg) {
      var layers = Array.prototype.slice.call(svg.querySelectorAll('.iso-layer'));
      if (!layers.length) return;

      var GAP   = 90;                  // vertical distance between planes
      var ink   = svg.querySelectorAll('.iso-marker, .iso-label, .iso-sub');
      var leads = Array.prototype.slice.call(svg.querySelectorAll('.iso-lead'));
      var lenOf = function (path) { return path.getTotalLength ? path.getTotalLength() : 0; };

      // The resting state, and the state anything unexpected falls back to.
      var settle = function () {
        gsap.set(layers, { y: 0, opacity: 1 });
        gsap.set(ink, { opacity: 1 });
        gsap.set(svg.querySelectorAll('.iso-label, .iso-sub'), { y: 0 });
        leads.forEach(function (path) { gsap.set(path, { strokeDashoffset: 0 }); });
      };
      settle();

      if (!hasST) return;

      var mm = gsap.matchMedia();

      mm.add('(min-width: 700px)', function () {
        leads.forEach(function (path) {
          var len = lenOf(path);
          if (len) gsap.set(path, { strokeDasharray: len });
        });

        var loop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.15 });
        var annotationIn = function (layer, at) {
          var marker = layer.querySelector('.iso-marker');
          var lead = layer.querySelector('.iso-lead');
          var text = layer.querySelectorAll('.iso-label, .iso-sub');
          if (marker) loop.to(marker, { opacity: 1, duration: 0.26, ease: 'power1.out' }, at);
          if (lead && lenOf(lead)) loop.to(lead, {
            strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut'
          }, at + 0.06);
          if (text.length) loop.to(text, {
            opacity: 1, y: 0, duration: 0.38, stagger: 0.07, ease: 'power2.out'
          }, at + 0.22);
        };
        var annotationOut = function (layer, at) {
          var marker = layer.querySelector('.iso-marker');
          var lead = layer.querySelector('.iso-lead');
          var text = layer.querySelectorAll('.iso-label, .iso-sub');
          if (text.length) loop.to(text, {
            opacity: 0, y: -5, duration: 0.22, stagger: { each: 0.04, from: 'end' }, ease: 'power2.in'
          }, at);
          if (lead && lenOf(lead)) loop.to(lead, {
            strokeDashoffset: lenOf(lead), duration: 0.34, ease: 'power2.in'
          }, at + 0.04);
          if (marker) loop.to(marker, { opacity: 0, duration: 0.2, ease: 'power1.in' }, at + 0.08);
        };

        // A set inside the paused timeline avoids leaving a collapsed diagram
        // behind if ScrollTrigger, animation frames or JavaScript fail.
        loop.set(layers, { y: function (i) { return i * GAP; }, opacity: function (i) { return i ? 0 : 1; } });
        loop.set(ink, { opacity: 0 });
        loop.set(svg.querySelectorAll('.iso-label, .iso-sub'), { y: -5 });
        leads.forEach(function (path) { if (lenOf(path)) loop.set(path, { strokeDashoffset: lenOf(path) }); });

        // ── 0.0s: data is the visible foundation; its annotation establishes the system.
        annotationIn(layers[0], 0.22);

        // ── 0.8s: every new plane rises, settles, then receives its callout.
        layers.slice(1).forEach(function (layer, n) {
          var at = 0.82 + n * 1.12;
          loop.to(layer, {
            y: 0, opacity: 1, duration: 0.86, ease: 'power3.out'
          }, at);
          annotationIn(layer, at + 0.54);
        });

        // ── 4.8s: pause on the complete, fully labelled architecture.
        var HOLD = 4.75;
        loop.to({}, { duration: 2.25 }, HOLD);

        // ── 7.0s: fold from the surface down. The labels leave before the planes.
        var FOLD = HOLD + 2.25;
        layers.slice(1).reverse().forEach(function (layer, n) {
          var i = layers.indexOf(layer);
          var at = FOLD + n * 0.72;
          annotationOut(layer, at);
          loop.to(layer, {
            y: i * GAP, opacity: 0, duration: 0.56, ease: 'power2.inOut'
          }, at + 0.2);
        });
        annotationOut(layers[0], FOLD + 2.2);
        loop.to({}, { duration: 1.1 }, FOLD + 2.45);

        var started = false;
        var run = function (on) {
          if (!on) { loop.pause(); return; }
          if (!started) { started = true; loop.restart(); }
          else loop.play();
        };

        // ScrollTrigger is excellent for the page's one-shot reveals, but a
        // looping illustration needs a more dependable visibility signal.
        // In particular, the homepage can restore directly to this section
        // before ScrollTrigger completes its first measurement. A native
        // observer fires for that initial visible state as well as ordinary
        // scrolling, so the loop cannot remain paused on a complete stack.
        var observer;
        if (window.IntersectionObserver) {
          observer = new window.IntersectionObserver(function (entries) {
            entries.forEach(function (entry) { run(entry.isIntersecting); });
          }, { threshold: 0.18 });
          observer.observe(svg);
        } else {
          run(true);
        }

        return function () {
          if (observer) observer.disconnect();
          loop.kill();
          settle();
        };
      });

      // Narrow screens keep the finished diagram — the peel needs the height.
      mm.add('(max-width: 699px)', settle);
    });

    /* --- Callout chips: land once and stay -------------------------
       These used to clear and replay on a loop. A reader who arrives
       during the clear sees an unlabelled diagram, which reads as broken
       rather than as an animation. They arrive in sequence, then hold. */
    Array.prototype.forEach.call(document.querySelectorAll('.diagram'), function (svg) {
      if (svg.hasAttribute('data-record')) return;   // driven by its own scan
      var chips = svg.querySelectorAll('[data-chip]');
      if (!chips.length) return;

      gsap.set(chips, { opacity: 0, y: 10 });

      var tl = gsap.timeline({ paused: true });
      tl.to(chips, { opacity: 1, y: 0, duration: 0.5, stagger: 0.24, ease: 'power2.out' });

      if (hasST) {
        window.ScrollTrigger.create({
          trigger: svg,
          start: 'top 80%',
          once: true,
          onEnter: function () { tl.play(); }
        });
      } else {
        tl.play();
      }
    });

    /* --- Pinned sequence -------------------------------------------
       Discrete stages, not scrub. Scrubbing ties playback to scroll
       velocity, so a trackpad flick renders the whole story in 200ms and
       nothing is legible. Instead each stage plays at an authored speed
       once its threshold is crossed. */
    Array.prototype.forEach.call(document.querySelectorAll('[data-pin]'), function (sec) {
      var svg   = sec.querySelector('[data-record]');
      var rows  = sec.querySelectorAll('.step-row');
      var fill  = sec.querySelector('[data-steps-fill]');
      var chips = svg ? svg.querySelectorAll('[data-chip]') : [];
      var hits  = svg ? svg.querySelectorAll('.rec-hit') : [];
      var scan  = svg ? svg.querySelector('[data-scan]') : null;
      var lines = svg ? svg.querySelectorAll('.lead-line') : [];
      if (!rows.length || !chips.length) return;

      var mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', function () {
        gsap.set(chips, { opacity: 0, x: 12 });
        gsap.set(hits, { opacity: 0 });
        if (scan) gsap.set(scan, { y: 0, opacity: 0 });
        Array.prototype.forEach.call(lines, function (p) {
          var len = p.getTotalLength ? p.getTotalLength() : 0;
          if (len) gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });

        var current = -1;
        var show = function (i) {
          if (i === current) return;
          current = i;
          Array.prototype.forEach.call(rows, function (r, n) {
            r.classList.toggle('is-on', n === i);
          });
          if (fill) gsap.to(fill, { height: ((i + 1) / rows.length * 100) + '%', duration: 0.4, ease: 'power2.out' });
          if (scan) gsap.to(scan, { y: (i + 1) / rows.length * 470, opacity: i < rows.length - 1 ? 0.55 : 0, duration: 0.5, ease: 'none' });
          for (var n = 0; n < chips.length; n++) {
            var on = n <= i;
            gsap.to(chips[n], { opacity: on ? 1 : 0, x: on ? 0 : 12, duration: 0.4, ease: 'power3.out' });
            if (hits[n]) gsap.to(hits[n], { opacity: on ? 0.9 : 0, duration: 0.3 });
            if (lines[n] && lines[n].getTotalLength) {
              gsap.to(lines[n], { strokeDashoffset: on ? 0 : lines[n].getTotalLength(), duration: 0.45, ease: 'power2.out' });
            }
          }
        };

        var st = window.ScrollTrigger.create({
          trigger: sec,
          start: 'top top',
          end: '+=' + (rows.length * window.innerHeight * 0.85),
          pin: sec.querySelector('.pin__inner'),
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: function (self) {
            show(Math.min(rows.length - 1, Math.floor(self.progress * rows.length)));
          }
        });
        show(0);
        return function () { st.kill(); gsap.set([chips, hits, lines], { clearProps: 'all' }); };
      });

      // below the breakpoint (and under reduced motion) there is no pin — show the finished state
      mm.add('(max-width: 1023px)', function () {
        gsap.set(chips, { opacity: 1, x: 0 });
        gsap.set(hits, { opacity: 0.9 });
        if (scan) gsap.set(scan, { opacity: 0 });
        Array.prototype.forEach.call(lines, function (p) { gsap.set(p, { strokeDashoffset: 0 }); });
        Array.prototype.forEach.call(rows, function (r) { r.classList.add('is-on'); });
      });
    });

    /* --- The record: a scan sweeps the page, each field it finds
       lights up and gets attached as a chip. Loops. ----------------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-record]'), function (svg) {
      if (svg.closest('[data-pin]')) return;   // the pinned sequence drives this one
      var scan  = svg.querySelector('[data-scan]');
      var hits  = svg.querySelectorAll('.rec-hit');
      var chips = svg.querySelectorAll('[data-chip]');
      var lines = svg.querySelectorAll('.lead-line');
      if (!hits.length) return;

      var TRAVEL = 470;          // height of the card, in viewBox units
      var SWEEP  = 2.8;          // seconds for one pass

      gsap.set(hits, { opacity: 0 });
      gsap.set(chips, { opacity: 0, x: 14 });
      gsap.set(scan, { y: 0, opacity: 0 });
      Array.prototype.forEach.call(lines, function (p) {
        var len = p.getTotalLength ? p.getTotalLength() : 0;
        if (len) gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      var tl = gsap.timeline({ paused: true });

      tl.to(scan, { opacity: 0.55, duration: 0.2 })
        .to(scan, { y: TRAVEL, duration: SWEEP, ease: 'none' }, 0)
        .to(scan, { opacity: 0, duration: 0.3 }, SWEEP - 0.1);

      // Each field lights up as the scan line reaches it, then its chip flies in.
      Array.prototype.forEach.call(hits, function (hit, i) {
        var at = 0.3 + i * (SWEEP - 0.7) / hits.length;
        tl.to(hit, { opacity: 0.9, duration: 0.25, ease: 'power2.out' }, at)
          .to(lines[i], { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, at + 0.1)
          .to(chips[i], { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }, at + 0.18);
      });

      // The completed record IS the point — it stays on screen. (This used
      // to clear and replay, which left readers looking at an empty card.)

      if (hasST) {
        window.ScrollTrigger.create({
          trigger: svg,
          start: 'top 80%',
          once: true,
          onEnter: function () { tl.play(); }
        });
      } else {
        tl.play();
      }
    });

    /* --- Hero diagram: draw the connecting path -------------------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-draw]'), function (svg) {
      var paths = svg.querySelectorAll('.draw');
      var nodes = svg.querySelectorAll('.node');

      Array.prototype.forEach.call(paths, function (p) {
        var len = p.getTotalLength ? p.getTotalLength() : 0;
        if (!len) return;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(nodes, { scale: 0, transformOrigin: '50% 50%' });

      var tl = gsap.timeline(
        hasST ? { scrollTrigger: { trigger: svg, start: 'top 85%', once: true } } : {}
      );
      tl.to(paths, { strokeDashoffset: 0, duration: 1.5, stagger: 0.12, ease: 'power2.inOut' })
        .to(nodes, { scale: 1, duration: 0.35, stagger: 0.08, ease: 'power2.out' }, 0.35);
    });
  }

  /* ==================================================================
     BOOT
     ================================================================== */
  function boot() {
    initHeader();
    initYear();
    initZoneFades();
    initMarquee();
    if (!reduced) initMotion(); else standDown();

    // Triggers are measured at DOMContentLoaded, before webfont metrics and
    // images have settled. Anything pinned would otherwise fire against stale
    // coordinates, so re-measure once the page has actually finished laying out.
    var remeasure = function () {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };
    window.addEventListener('load', remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
