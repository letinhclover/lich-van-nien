// ============================================================
// Lịch Vạn Niên AI — Embeddable Widget
// Cách dùng:
//   <div data-lich-widget data-theme="auto" data-size="standard"></div>
//   <script src="https://lichvannien.io.vn/widget.js" async></script>
// ============================================================
(function () {
  'use strict';

  var BASE    = 'https://lichvannien.io.vn';
  var PREFIX  = 'lvn-';

  function getVNDate() {
    try {
      return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
    } catch (e) {
      var d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    }
  }

  function injectStyles() {
    if (document.getElementById('lvn-widget-styles')) return;
    var style = document.createElement('style');
    style.id  = 'lvn-widget-styles';
    style.textContent = [
      '.' + PREFIX + 'widget { font-family: system-ui, sans-serif; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; background: #fff; }',
      '.' + PREFIX + 'widget.dark { background: #1a1a2e; border-color: #374151; color: #f3f4f6; }',
      '.' + PREFIX + 'header { background: #C0392B; color: white; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; }',
      '.' + PREFIX + 'header a { color: rgba(255,255,255,0.85); font-size: 11px; text-decoration: none; }',
      '.' + PREFIX + 'body { padding: 14px; }',
      '.' + PREFIX + 'date-solar { font-size: 28px; font-weight: 900; line-height: 1; color: #1a0a08; }',
      '.' + PREFIX + 'widget.dark .' + PREFIX + 'date-solar { color: #f3f4f6; }',
      '.' + PREFIX + 'date-lunar { font-size: 12px; color: #6b7280; margin-top: 4px; }',
      '.' + PREFIX + 'badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-top: 8px; }',
      '.' + PREFIX + 'badge.tot { background: rgba(22,163,74,0.1); color: #16a34a; }',
      '.' + PREFIX + 'badge.xau { background: rgba(192,57,43,0.1); color: #C0392B; }',
      '.' + PREFIX + 'badge.binh { background: rgba(217,119,6,0.1); color: #d97706; }',
      '.' + PREFIX + 'hours { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 4px; }',
      '.' + PREFIX + 'hour { font-size: 10px; padding: 2px 7px; border-radius: 6px; background: rgba(29,158,117,0.1); color: #16a34a; }',
      '.' + PREFIX + 'footer { padding: 8px 14px; border-top: 1px solid #e5e7eb; text-align: center; }',
      '.' + PREFIX + 'footer a { font-size: 10px; color: #9ca3af; text-decoration: none; }',
      '.' + PREFIX + 'mini { padding: 10px 12px; display: flex; align-items: center; gap: 10px; }',
      '.' + PREFIX + 'mini .' + PREFIX + 'date-solar { font-size: 20px; }',
    ].join('\n');
    document.head.appendChild(style);
  }

  function renderMini(data) {
    var ratingClass = data.score >= 4 ? 'tot' : data.score <= 2 ? 'xau' : 'binh';
    var ratingLabel = data.score >= 4 ? 'Ngày Tốt' : data.score <= 2 ? 'Ngày Xấu' : 'Bình Thường';
    return [
      '<div class="' + PREFIX + 'mini">',
        '<div>',
          '<div class="' + PREFIX + 'date-solar">' + data.day + '/' + data.month + '</div>',
          '<div class="' + PREFIX + 'date-lunar">🌙 ' + data.lunarDay + '/' + data.lunarMonth + '</div>',
        '</div>',
        '<span class="' + PREFIX + 'badge ' + ratingClass + '">' + ratingLabel + '</span>',
      '</div>',
    ].join('');
  }

  function renderStandard(data) {
    var ratingClass = data.score >= 4 ? 'tot' : data.score <= 2 ? 'xau' : 'binh';
    var ratingLabel = data.score >= 4 ? 'Ngày Tốt' : data.score <= 2 ? 'Ngày Xấu' : 'Bình Thường';
    var hoursHtml = (data.goodHours || []).slice(0,4).map(function(h) {
      return '<span class="' + PREFIX + 'hour">' + h + '</span>';
    }).join('');
    return [
      '<div class="' + PREFIX + 'header">',
        '<span style="font-size:13px;font-weight:700;">🗓 Lịch Vạn Niên AI</span>',
        '<a href="' + BASE + '/lich/' + data.year + '/' + String(data.month).padStart(2,'0') + '/' + String(data.day).padStart(2,'0') + '" target="_blank">Xem chi tiết →</a>',
      '</div>',
      '<div class="' + PREFIX + 'body">',
        '<div class="' + PREFIX + 'date-solar">' + data.day + '/' + data.month + '/' + data.year + '</div>',
        '<div class="' + PREFIX + 'date-lunar">🌙 ' + data.lunarDay + ' tháng ' + data.lunarMonth + ' · ' + data.canChi + '</div>',
        '<span class="' + PREFIX + 'badge ' + ratingClass + '">' + ratingLabel + ' (' + data.score + '/5)</span>',
        hoursHtml ? '<div class="' + PREFIX + 'hours">⏰ Hoàng Đạo: ' + hoursHtml + '</div>' : '',
      '</div>',
      '<div class="' + PREFIX + 'footer">',
        '<a href="' + BASE + '" target="_blank">lichvannien.io.vn</a>',
      '</div>',
    ].join('');
  }

  function renderFallback(container) {
    container.innerHTML = '<div class="' + PREFIX + 'footer" style="padding:12px;"><a href="' + BASE + '" target="_blank">📅 Lịch Vạn Niên AI</a></div>';
  }

  function initWidget(container) {
    var size  = container.getAttribute('data-size') || 'standard';
    var theme = container.getAttribute('data-theme') || 'auto';
    var today = getVNDate();
    var date  = container.getAttribute('data-date') || today;

    container.className = PREFIX + 'widget';
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
      container.classList.add('dark');
    }

    fetch(BASE + '/api/v1/day?date=' + date)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        container.innerHTML = size === 'mini' ? renderMini(data) : renderStandard(data);
      })
      .catch(function() { renderFallback(container); });
  }

  function init() {
    injectStyles();
    var containers = document.querySelectorAll('[data-lich-widget]');
    for (var i = 0; i < containers.length; i++) {
      initWidget(containers[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
