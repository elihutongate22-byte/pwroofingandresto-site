/* Prowest site tracking: Google Ads conversions for Call and Text taps, plus GA4 page analytics. */
(function () {
  var ADS_ID = 'AW-17670231661';
  var CALL_LABEL = 'AW-17670231661/mVLhCKOHhKsdEO2s6elB';
  var TEXT_LABEL = 'AW-17670231661/8eEdCKaHhKsdEO2s6elB';
  var GA4_ID = ''; // filled in once the GA4 property exists

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', ADS_ID);
  if (GA4_ID) { gtag('config', GA4_ID); }

  function fire(label, kind) {
    gtag('event', 'conversion', { send_to: label });
    if (GA4_ID) { gtag('event', kind === 'call' ? 'click_to_call' : 'click_to_text', { link_url: kind }); }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) { fire(CALL_LABEL, 'call'); }
    else if (href.indexOf('sms:') === 0) { fire(TEXT_LABEL, 'text'); }
  }, true);
})();
