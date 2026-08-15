(function () {
  'use strict';

  var partials = ['nav', 'hero', 'experience', 'skills', 'projects', 'achievements', 'education', 'certificates', 'volunteering', 'footer'];
  var remaining = partials.length;

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
  }

  function bindNav() {
    var themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    }

    var header = document.querySelector('.nav');
    var navToggle = document.querySelector('.nav__toggle');
    var navLinks = document.querySelector('.nav__links');

    function closeNav() {
      if (!header) return;
      header.classList.remove('nav--open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }
      if (navToggle && document.activeElement && document.activeElement.closest('.nav__links')) {
        navToggle.focus();
      }
    }

    if (navToggle && header) {
      navToggle.addEventListener('click', function () {
        var open = header.classList.toggle('nav--open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    if (navLinks) {
      navLinks.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeNav();
      });
    }

    document.addEventListener('click', function (e) {
      if (header && header.classList.contains('nav--open') && !e.target.closest('.nav')) {
        closeNav();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  function bindReveal() {
    var revealObserver;
    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var siblings = Array.prototype.slice.call(el.parentElement.children);
            var index = siblings.indexOf(el);
            el.style.transitionDelay = (index % 4) * 80 + 'ms';
            el.classList.add('is-visible');
            revealObserver.unobserve(el);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  function bindScrollspy() {
    if (!('IntersectionObserver' in window)) return;
    var links = document.querySelectorAll('.nav__links a');
    var linkMap = {};
    links.forEach(function (link) {
      var hash = link.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        linkMap[hash.slice(1)] = link;
      }
    });

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            link.classList.remove('is-active');
          });
          var link = linkMap[entry.target.id];
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Object.keys(linkMap).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spyObserver.observe(section);
    });
  }

  function init() {
    bindNav();
    bindReveal();
    bindScrollspy();
  }

  partials.forEach(function (name) {
    var host = document.getElementById('partial-' + name);
    if (!host) {
      remaining -= 1;
      return;
    }
    fetch('sections/' + name + '.html')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        host.innerHTML = html;
      })
      .catch(function () {
        host.innerHTML = '<p class="body-md text-secondary">Section could not be loaded.</p>';
      })
      .then(function () {
        remaining -= 1;
        if (remaining === 0) init();
      });
  });
})();
