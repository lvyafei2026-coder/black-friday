/* ============================================================
   black-friday — countdown logic
   Rule: Black Friday = Friday after the 4th Thursday of November.
   Auto-rolls to next year once the BF weekend (through Cyber Monday) is over.
   ============================================================ */
(function () {
  'use strict';

  var DAY = 86400000; // ms
  var LIVE_WINDOW_DAYS = 4; // BF Friday 00:00 → Tuesday 00:00 (covers Cyber Monday)

  // 第4个周四 + 1 = 黑色星期五（当年 00:00 本地时区）
  function blackFridayOf(year) {
    var nov1 = new Date(year, 10, 1);
    var firstThursday = 1 + ((4 - nov1.getDay() + 7) % 7);
    var fourthThursday = firstThursday + 21;
    return new Date(year, 10, fourthThursday + 1, 0, 0, 0);
  }

  function thanksgivingOf(year) {
    var nov1 = new Date(year, 10, 1);
    var firstThursday = 1 + ((4 - nov1.getDay() + 7) % 7);
    return new Date(year, 10, firstThursday + 21, 0, 0, 0);
  }

  function cyberMondayOf(year) {
    return new Date(blackFridayOf(year).getTime() + 3 * DAY);
  }

  var now = new Date();
  var targetYear = now.getFullYear();
  var bf = blackFridayOf(targetYear);
  // BF 周末已结束 → 滚到下一年
  if (now.getTime() >= bf.getTime() + LIVE_WINDOW_DAYS * DAY) {
    targetYear += 1;
    bf = blackFridayOf(targetYear);
  }
  var liveEnd = bf.getTime() + LIVE_WINDOW_DAYS * DAY;
  var isLive = now.getTime() >= bf.getTime() && now.getTime() < liveEnd;

  var pad = function (n) { return n < 10 ? '0' + n : String(n); };
  var fmtLong = function (d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };
  var fmtShort = function (d) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  var el = function (id) { return document.getElementById(id); };

  // ── 时效信号 + 目标年同步的静态文案 ──
  var lastUpdated = el('lastUpdated');
  if (lastUpdated) lastUpdated.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  var duDays = el('duDays'); // "How many days until" 长尾段

  // ── H1 日期行 + 精选摘要答案框（跟随目标年份） ──
  var dateLine = el('bfDateLine');
  if (dateLine) dateLine.textContent = fmtLong(bf);

  var qa = el('quickAnswer');
  if (qa) {
    var tg = thanksgivingOf(targetYear);
    qa.innerHTML = '<strong>Black Friday ' + targetYear + ' is ' + fmtLong(bf) + '</strong>' +
      ' — the day after Thanksgiving (' + fmtShort(tg) + '). Most major sales go live online at midnight.';
  }

  // ── 日期表：高亮目标年份行 ──
  var rows = document.querySelectorAll('#dateRows tr[data-year]');
  rows.forEach(function (row) {
    if (Number(row.getAttribute('data-year')) === targetYear) {
      row.classList.add('current');
      var cell = row.querySelector('td:nth-child(2)');
      if (cell && !cell.querySelector('.tag')) {
        var tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = isLive ? 'LIVE' : 'NEXT';
        cell.appendChild(tag);
      }
    }
  });

  // ── 倒计时 / LIVE 状态 ──
  var cdD = el('cd-d'), cdH = el('cd-h'), cdM = el('cd-m'), cdS = el('cd-s');
  var answer = el('cdAnswer');
  var status = el('headerStatus');
  var banner = el('liveBanner');

  function renderLive() {
    [cdD, cdH, cdM, cdS].forEach(function (n) { if (n) n.textContent = '0'; });
    if (answer) answer.innerHTML = 'Deals are <strong>live right now</strong> — most sales run through the weekend into Cyber Monday.';
    if (status) status.textContent = '🔥 BF deals LIVE';
    if (banner) banner.classList.add('show');
    if (duDays) duDays.textContent = '0';
  }

  function renderCountdown() {
    var diff = bf.getTime() - Date.now();
    var days = Math.floor(diff / DAY);
    var hours = Math.floor((diff % DAY) / 3600000);
    var mins = Math.floor((diff % 3600000) / 60000);
    var secs = Math.floor((diff % 60000) / 1000);
    if (cdD) cdD.textContent = days;
    if (cdH) cdH.textContent = pad(hours);
    if (cdM) cdM.textContent = pad(mins);
    if (cdS) cdS.textContent = pad(secs);
    if (answer) {
      answer.innerHTML = 'That&rsquo;s <strong>' + days + ' day' + (days === 1 ? '' : 's') +
        '</strong> from now. Most sales go live online at midnight local time.';
    }
    if (status) status.textContent = '⏳ ' + days + ' days to go';
    if (banner) banner.classList.remove('show');
    if (duDays) duDays.textContent = days;
  }

  function tick() {
    if (Date.now() >= bf.getTime() && Date.now() < liveEnd) renderLive();
    else if (Date.now() < bf.getTime()) renderCountdown();
    else { // 跨过 LIVE 窗口 → 滚年（罕见：页面挂着过周末）
      targetYear += 1;
      bf = blackFridayOf(targetYear);
      renderCountdown();
    }
  }

  tick();
  setInterval(tick, 1000);

  // ── FAQ 折叠 ──
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
