/* Shared behaviour for all pages: hover styling + sticky-nav colour shift.
   The original design stored hover styles in a `style-hover` attribute and a
   framework applied them. We reproduce that generically here so the markup
   stays declarative and JSON-rendered cards get the same effect. */
(function () {
  'use strict';

  // ── style-hover: apply the attribute's declarations on hover ──
  function applyDecls(el, decls) {
    decls.split(';').forEach(function (d) {
      var i = d.indexOf(':');
      if (i === -1) return;
      var prop = d.slice(0, i).trim();
      var val = d.slice(i + 1).trim();
      if (prop) el.style.setProperty(prop, val);
    });
  }

  function bindHover(el) {
    if (el.__mtlHover) return;           // avoid double-binding
    el.__mtlHover = true;
    var hover = el.getAttribute('style-hover');
    el.addEventListener('mouseenter', function () {
      el.__mtlOrig = el.style.cssText;   // snapshot inline styles
      applyDecls(el, hover);
    });
    el.addEventListener('mouseleave', function () {
      if (el.__mtlOrig !== undefined) el.style.cssText = el.__mtlOrig;
    });
  }

  // Call after injecting new markup so dynamic cards get hover too.
  function initHover(root) {
    (root || document).querySelectorAll('[style-hover]').forEach(bindHover);
  }

  // ── Sticky nav: shift colours once the page is scrolled ──
  function initNav() {
    var nav = document.getElementById('mainNav');
    if (!nav) return;
    var logo = document.getElementById('navLogo');
    var links = document.querySelectorAll('.mtl-nl');
    // Pages without a dark hero opt into a permanently-solid nav.
    var alwaysSolid = document.body.classList.contains('nav-solid');

    function paint() {
      var scrolled = alwaysSolid || window.scrollY > 60;
      nav.style.background = scrolled ? '#f9f7f2' : 'transparent';
      nav.style.boxShadow = scrolled ? '0 1px 24px rgba(41,70,117,0.08)' : 'none';
      nav.style.padding = scrolled ? '16px 5%' : '28px 5%';
      if (logo) logo.style.color = scrolled ? '#294675' : '#f9f7f2';
      links.forEach(function (l) {
        l.style.color = scrolled ? 'rgba(41,70,117,0.62)' : 'rgba(249,247,242,0.65)';
      });
    }
    paint();
    window.addEventListener('scroll', paint, { passive: true });
  }

  window.MTL = window.MTL || {};
  window.MTL.initHover = initHover;

  document.addEventListener('DOMContentLoaded', function () {
    initHover(document);
    initNav();
  });
})();
