/* Card builders shared by the homepage and the testimonials page.
   Kept framework-free: each function returns an HTML string, and callers
   inject it then call MTL.initHover() so hover effects attach. */
(function () {
  'use strict';
  window.MTL = window.MTL || {};

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  MTL.esc = esc;

  /* ── Testimonials ── */
  MTL.testimonialCard = function (t) {
    var accent = esc(t.accent || '#ffc44f');
    return '' +
      '<div style="background:#fff;border-radius:3px;padding:36px;border-left:3px solid ' + accent + ';box-shadow:0 2px 20px rgba(41,70,117,0.05);">' +
        '<p style="font-family:\'Cormorant Garamond\',serif;font-size:48px;font-weight:300;color:' + accent + ';line-height:0.7;margin-bottom:18px;">&ldquo;</p>' +
        '<p style="font-family:\'Cormorant Garamond\',serif;font-size:19px;font-style:italic;line-height:1.68;color:#294675;margin-bottom:28px;">' + esc(t.quote).replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>') + '</p>' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
          '<div style="width:22px;height:1px;background:' + accent + ';flex-shrink:0;"></div>' +
          '<div>' +
            '<p style="font-size:13px;font-weight:500;color:#294675;">' + esc(t.name) + '</p>' +
            '<p style="font-size:11px;color:rgba(41,70,117,0.48);margin-top:2px;">' + esc(t.location) + '</p>' +
          '</div>' +
        '</div>' +
      '</div>';
  };

  MTL.renderTestimonials = function (container, list) {
    if (!container) return;
    container.innerHTML = list.map(MTL.testimonialCard).join('');
    MTL.initHover(container);
  };

  /* ── Events ── */
  var MONTHS = ['January','February','March','April','May','June','July',
                'August','September','October','November','December'];

  function parseDate(s) {
    if (!s) return null;
    var p = String(s).split('-');
    if (p.length < 3) return null;
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  // "September 20–21, 2025" / "September 30 – October 1, 2025" / "September 20, 2025"
  function formatRange(start, end) {
    var s = parseDate(start), e = parseDate(end) || s;
    if (!s) return '';
    if (!e || s.getTime() === e.getTime()) {
      return MONTHS[s.getMonth()] + ' ' + s.getDate() + ', ' + s.getFullYear();
    }
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
      return MONTHS[s.getMonth()] + ' ' + s.getDate() + '–' + e.getDate() + ', ' + e.getFullYear();
    }
    return MONTHS[s.getMonth()] + ' ' + s.getDate() + ' – ' +
           MONTHS[e.getMonth()] + ' ' + e.getDate() + ', ' + e.getFullYear();
  }
  MTL.formatEventDate = formatRange;

  function icon(name, color, op) {
    var c = 'stroke="' + color + '" stroke-width="1.1" opacity="' + op + '"';
    if (name === 'calendar') {
      return '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="11" rx="1.5" ' + c + '></rect><path d="M4.5 1v3M10.5 1v3M1 7h13" ' + c + ' stroke-linecap="round"></path></svg>';
    }
    if (name === 'pin') {
      return '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="6.5" r="2.5" ' + c + '></circle><path d="M7.5 1C5 1 3 3 3 5.5c0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5C12 3 10 1 7.5 1z" ' + c + '></path></svg>';
    }
    // clock
    return '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6" ' + c + '></circle><path d="M7.5 4v3.5l2.5 1.5" ' + c + ' stroke-linecap="round"></path></svg>';
  }

  function infoRow(iconHtml, text, textColor, mb) {
    return '<div style="display:flex;gap:10px;align-items:center;margin-bottom:' + mb + ';">' +
      iconHtml + '<p style="font-size:14px;color:' + textColor + ';">' + esc(text) + '</p></div>';
  }

  MTL.eventCard = function (ev) {
    var dark = ev.theme === 'dark';
    var accent = esc(ev.accent || '#ffc44f');
    var wrapBg = dark ? '#294675' : '#fff';
    var titleColor = dark ? '#f9f7f2' : '#294675';
    var locColor = dark ? 'rgba(249,247,242,0.45)' : 'rgba(41,70,117,0.5)';
    var iconColor = dark ? '#f9f7f2' : '#294675';
    var iconOp = dark ? '0.55' : '0.45';
    var bodyColor = dark ? 'rgba(249,247,242,0.82)' : '#294675';
    var venueColor = dark ? 'rgba(249,247,242,0.82)' : 'rgba(41,70,117,0.6)';
    var shadowHover = dark
      ? 'box-shadow:0 10px 40px rgba(41,70,117,0.2);transform:translateY(-4px);'
      : 'box-shadow:0 10px 40px rgba(41,70,117,0.09);transform:translateY(-4px);';

    var rows;
    if (ev.recurring) {
      rows = infoRow(icon('calendar', iconColor, iconOp), ev.schedule || 'Recurring', bodyColor, '10px') +
             infoRow(icon('clock', iconColor, iconOp), ev.time || '', bodyColor, '36px');
    } else {
      rows = infoRow(icon('calendar', iconColor, iconOp), formatRange(ev.startDate, ev.endDate), bodyColor, '10px') +
             infoRow(icon('pin', iconColor, iconOp), ev.venue || 'Venue details upon registration', venueColor, '36px');
    }

    var cta = dark
      ? '<a href="#newsletter" style="display:block;text-align:center;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#294675;background:#ffc44f;padding:14px;border-radius:100px;font-weight:500;transition:background 0.2s;" style-hover="background:#ffe08a;">Register Interest</a>'
      : '<a href="#newsletter" style="display:block;text-align:center;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#294675;border:1px solid rgba(41,70,117,0.22);padding:14px;border-radius:100px;transition:all 0.2s;" style-hover="background:#294675;color:#f9f7f2;border-color:#294675;">Register Interest</a>';

    return '' +
      '<div style="border:1px solid rgba(41,70,117,0.11);border-radius:3px;padding:40px;background:' + wrapBg + ';transition:box-shadow 0.25s,transform 0.25s;" style-hover="' + shadowHover + '">' +
        '<p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:' + accent + ';margin-bottom:18px;font-weight:500;">' + esc(ev.badge || 'In-Person') + '</p>' +
        '<h3 style="font-family:\'Cormorant Garamond\',serif;font-size:36px;font-weight:400;color:' + titleColor + ';margin-bottom:6px;line-height:1.15;">' + esc(ev.title) + '</h3>' +
        '<p style="font-size:13px;color:' + locColor + ';margin-bottom:28px;letter-spacing:0.04em;">' + esc(ev.location || '') + '</p>' +
        rows +
        cta +
      '</div>';
  };

  MTL.eventPill = function (ev) {
    var label = esc(ev.title) + (ev.count ? ' ×' + esc(ev.count) : '');
    return '<span style="font-size:13px;color:rgba(41,70,117,0.58);padding:7px 16px;border:1px solid rgba(41,70,117,0.1);border-radius:100px;">' + label + '</span>';
  };

  // Split events into upcoming (cards) and past (pills) by date.
  MTL.partitionEvents = function (list) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var upcoming = [], past = [];
    list.forEach(function (ev) {
      if (ev.recurring) { upcoming.push(ev); return; }
      var end = parseDate(ev.endDate || ev.startDate);
      if (end && end.getTime() >= today.getTime()) upcoming.push(ev);
      else past.push(ev);
    });
    // Upcoming: dated events first (soonest first), recurring last.
    upcoming.sort(function (a, b) {
      if (a.recurring && !b.recurring) return 1;
      if (b.recurring && !a.recurring) return -1;
      var da = parseDate(a.startDate || a.endDate), db = parseDate(b.startDate || b.endDate);
      return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
    });
    // Past: most recent first (undated historic events keep their file order at the end).
    past.sort(function (a, b) {
      var da = parseDate(a.endDate || a.startDate), db = parseDate(b.endDate || b.startDate);
      if (da && db) return db.getTime() - da.getTime();
      if (da && !db) return -1;
      if (db && !da) return 1;
      return 0;
    });
    return { upcoming: upcoming, past: past };
  };
})();
