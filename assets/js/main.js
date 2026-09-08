/* Homepage behaviour: FAQ accordion, newsletter form, and JSON-driven
   testimonials (first two) + events (auto-sorted into upcoming / past). */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initFaq();
    initNewsletter();
    loadTestimonials();
    loadEvents();
  });

  /* ── FAQ accordion (single item open at a time) ── */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var ans = item.querySelector('.faq-answer');
      var ind = item.querySelector('.faq-ind');
      if (!btn || !ans) return;
      btn.addEventListener('click', function () {
        var willOpen = ans.classList.contains('mtl-hidden');
        // close all
        items.forEach(function (other) {
          other.querySelector('.faq-answer').classList.add('mtl-hidden');
          var oi = other.querySelector('.faq-ind');
          if (oi) oi.textContent = '+';
        });
        if (willOpen) {
          ans.classList.remove('mtl-hidden');
          if (ind) ind.textContent = '−'; // minus sign
        }
      });
    });
  }

  /* ── Newsletter (client-side only, mirrors original behaviour) ── */
  function initNewsletter() {
    var form = document.getElementById('newsletterForm');
    var success = document.getElementById('newsletterSuccess');
    var input = document.getElementById('newsletterEmail');
    var error = document.getElementById('newsletterError');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = input ? input.value : '';
      if (!val || val.indexOf('@') === -1) {
        if (error) error.classList.remove('mtl-hidden');
        return;
      }
      if (error) error.classList.add('mtl-hidden');
      form.classList.add('mtl-hidden');
      var note = document.getElementById('newsletterFinePrint');
      if (note) note.classList.add('mtl-hidden');
      if (success) success.classList.remove('mtl-hidden');
    });
    if (input && error) {
      input.addEventListener('input', function () { error.classList.add('mtl-hidden'); });
    }
  }

  /* ── Testimonials: show the first two on the homepage ── */
  function loadTestimonials() {
    var grid = document.getElementById('testimonials-grid');
    if (!grid) return;
    fetch('data/testimonials.json')
      .then(function (r) { return r.json(); })
      .then(function (list) {
        MTL.renderTestimonials(grid, list.slice(0, 2));
      })
      .catch(function () {
        grid.innerHTML = '<p class="mtl-loading">Testimonials are temporarily unavailable.</p>';
      });
  }

  /* ── Events: partition by date into upcoming cards + past pills ── */
  function loadEvents() {
    var upWrap = document.getElementById('events-upcoming');
    var pastWrap = document.getElementById('events-past');
    var pastSection = document.getElementById('events-past-section');
    if (!upWrap) return;
    fetch('data/events.json')
      .then(function (r) { return r.json(); })
      .then(function (list) {
        var parts = MTL.partitionEvents(list);
        upWrap.innerHTML = parts.upcoming.length
          ? parts.upcoming.map(MTL.eventCard).join('')
          : '<p class="mtl-loading">New events are being scheduled — subscribe below to hear first.</p>';
        if (pastWrap && parts.past.length) {
          pastWrap.innerHTML = parts.past.map(MTL.eventPill).join('');
          if (pastSection) pastSection.classList.remove('mtl-hidden');
        }
        MTL.initHover(upWrap);
      })
      .catch(function () {
        upWrap.innerHTML = '<p class="mtl-loading">Events are temporarily unavailable.</p>';
      });
  }
})();
