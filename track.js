/* Prowest site tracking: Google Ads conversions for Call and Text taps, plus GA4 page analytics. */
(function () {
  var ADS_ID = 'AW-17670231661';
  var CALL_LABEL = 'AW-17670231661/mVLhCKOHhKsdEO2s6elB';
  var TEXT_LABEL = 'AW-17670231661/8eEdCKaHhKsdEO2s6elB';
  var GA4_ID = ''; // GA4 (G-SQNYXG3CHP) rides on the AW tag via Google tag settings; leave blank to avoid double page views

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', ADS_ID);
  if (GA4_ID) { gtag('config', GA4_ID); }

  // Google forwarding number: ad visitors see a Google number that rings Richard's phone,
  // so Google Ads logs each real call (time and length). Text buttons keep the real number.
  var REAL = '(602) 980-7484';
  gtag('config', 'AW-17670231661/6qoOCMin0K4dEO2s6elB', {
    'phone_conversion_number': REAL,
    'phone_conversion_callback': function (formatted, mobile) {
      var digits = String(mobile || formatted || '').replace(/[^0-9+]/g, '');
      if (!digits || !formatted) return;
      var links = document.querySelectorAll('a[href^="tel:"]');
      for (var i = 0; i < links.length; i++) { links[i].setAttribute('href', 'tel:' + digits); }
      var walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n;
      while ((n = walk.nextNode())) {
        if (n.nodeValue.indexOf(REAL) !== -1 && !(n.parentNode.closest && n.parentNode.closest('.contact-label'))) { n.nodeValue = n.nodeValue.split(REAL).join(formatted); }
      }
    }
  });

  function fire(label, kind) {
    gtag('event', 'conversion', { send_to: label });
    gtag('event', kind === 'call' ? 'click_to_call' : 'click_to_text', { method: kind });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) { fire(CALL_LABEL, 'call'); }
    else if (href.indexOf('sms:') === 0) { fire(TEXT_LABEL, 'text'); }
  }, true);

  // Scroll checkpoints: fire once each at 25, 50 and 75 percent of the page.
  var marks = [25, 50, 75], sent = {};
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var pct = (window.scrollY / h) * 100;
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (pct >= m && !sent[m]) { sent[m] = true; gtag('event', 'scroll_depth', { percent: m }); }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Section views: fire once when each main section heading comes on screen.
  var names = { 'process-title': 'how_it_works', 'damage-title': 'hail_damage_signs', 'report-title': 'dont_wait', 'areas-title': 'areas_served', 'contact-title': 'call_box' };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { gtag('event', 'section_view', { section: names[en.target.id] }); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    Object.keys(names).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
