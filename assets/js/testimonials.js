/* Testimonials page: render every testimonial from the JSON file. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('testimonials-grid');
    if (!grid) return;
    fetch('data/testimonials.json')
      .then(function (r) { return r.json(); })
      .then(function (list) {
        MTL.renderTestimonials(grid, list);
        var count = document.getElementById('testimonials-count');
        if (count) count.textContent = list.length + ' stories and counting';
      })
      .catch(function () {
        grid.innerHTML = '<p class="mtl-loading">Testimonials are temporarily unavailable.</p>';
      });
  });
})();
