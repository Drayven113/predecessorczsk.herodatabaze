/* =========================================================================
   Predecessor CZ/SK – databáze hrdinů (aplikace)
   Bez knihoven a bez buildu: stačí nahrát na GitHub Pages.
   Animace: FLIP přeskupení mřížky, 3D náklon dlaždic, letící portrét do
   detailu, posuvné podtržení záložek, plynulé přepočty čísel.
   ========================================================================= */
(function () {
  'use strict';

  const HEROES = window.HEROES || [];
  const ETERNALS = window.ETERNALS || [];
  const EGROUPS = window.ETERNAL_GROUPS || {};
  const QUIZ = window.QUIZ || { general: [], lanes: {} };

  /* ---------- konstanty ---------- */
  const CF = 'https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/';
  const LANES = [
    { id: 'Carry', cz: 'Carry', icon: CF + 'carry_icon_85dc3e0332.webp', color: 'var(--lane-carry)' },
    { id: 'Support', cz: 'Support', icon: CF + 'support_icon_eb8b7dbeca.webp', color: 'var(--lane-support)' },
    { id: 'Midlane', cz: 'Mid', icon: CF + 'midlane_icon_19aa638396.webp', color: 'var(--lane-mid)' },
    { id: 'Offlane', cz: 'Offlane', icon: CF + 'offlane_icon_dd9ede2d21.webp', color: 'var(--lane-off)' },
    { id: 'Jungle', cz: 'Jungle', icon: CF + 'jungle_icon_561be6210c.webp', color: 'var(--lane-jungle)' },
  ];
  const LANE = Object.fromEntries(LANES.map(l => [l.id, l]));
  const CLASS_DESC = {
    Fighter: 'Bojovník do první linie – vydrží i rozdává.', Bruiser: 'Odolný rváč, který se léčí z boje.',
    Assassin: 'Rychle zabije osamělý cíl a zmizí.', Mage: 'Kouzelník s velkým poškozením z abilities.',
    Tank: 'Zahajuje souboje a pohlcuje poškození.', Warden: 'Ochránce – tank a support v jednom.',
    Catcher: 'Support, který chytá a znehybňuje nepřátele.', Enchanter: 'Support, který léčí, štítuje a posiluje spojence.',
    Support: 'Podpora týmu.', Sharpshooter: 'Střelec – poškození ze základních útoků na dálku.',
    Executioner: 'Střelec, který kombinuje útoky se silnými abilities.', Marksman: 'Netradiční střelec s více postoji.',
  };
  const DIFF = { 1: 'Beginner', 2: 'Advanced', 3: 'Expert' };
  const SLOT = { P: 'Passive', LMB: 'Basic Attack', RMB: 'Alternate', Q: 'Primary', E: 'Secondary', R: 'Ultimate' };
  const RANGE_CZ = { Melee: 'Melee', Ranged: 'Ranged', Hybrid: 'Melee / Ranged' };
  const AMBER_ICON = 'https://predecessor.wiki.gg/images/thumb/Icon_Amber.png/15px-Icon_Amber.png?5d41ad';
  const PLAT_ICON = 'https://predecessor.wiki.gg/images/thumb/Icon_Platinum.png/15px-Icon_Platinum.png?6ab824';
  const NEW_ORDER = { '1.17': 3, '1.16': 2, '1.15': 1 };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const byId = Object.fromEntries(HEROES.map(h => [h.id, h]));
  const byName = Object.fromEntries(HEROES.map(h => [h.n, h]));
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = (n, d = 0) => Number(n).toLocaleString('cs-CZ', { minimumFractionDigits: 0, maximumFractionDigits: d });
  const raf = () => new Promise(r => requestAnimationFrame(r));
  const EASE = 'cubic-bezier(.22,.9,.24,1)';

  /* ---------- plynulé přepočítání čísla ---------- */
  function tween(el, to, { d = 0, dur = 450, suffix = '' } = {}) {
    const from = parseFloat(el.dataset.v || '0');
    el.dataset.v = to;
    if (RM || from === to) { el.textContent = fmt(to, d) + suffix; return; }
    const t0 = performance.now();
    cancelAnimationFrame(el._raf);
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (to - from) * e, d) + suffix;
      if (k < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  /* ---------- obrázky s náhradními zdroji ---------- */
  function portrait(h, alt) {
    if (h.iconZoom) { // výřez z velkého renderu (Valmont)
      return `<span class="pimg pbg" role="img" aria-label="${esc(alt == null ? h.n : alt)}" style="background-image:url('${esc(h.icon)}');--bgs:auto ${h.iconZoom * 100}%;--ip:${h.iconPos || '50% 20%'}"></span>`;
    }
    const fb = (h.iconFallbacks || []).join('|');
    return `<img class="pimg" src="${esc(h.icon)}" data-fb="${esc(fb)}" data-initials="${esc(initials(h.n))}" alt="${esc(alt == null ? h.n : alt)}" loading="lazy" decoding="async">`;
  }
  function initials(n) { return n.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase(); }
  document.addEventListener('error', e => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    const list = (img.dataset.fb || '').split('|').filter(Boolean);
    if (list.length) { img.dataset.fb = list.slice(1).join('|'); img.src = list[0]; return; }
    if (img.dataset.hide === '1') { img.remove(); return; }
    if (img.dataset.initials != null) {
      const d = document.createElement('div');
      d.className = img.className + ' pimg-fallback';
      d.textContent = img.dataset.initials;
      d.setAttribute('role', 'img'); d.setAttribute('aria-label', img.alt);
      img.replaceWith(d);
    }
  }, true);

  const laneIcon = (id, extra = '') => `<img class="lane-ico ${extra}" src="${LANE[id].icon}" alt="" loading="lazy">`;
  const laneTag = (id, flex, title) => `<span class="lane-tag${flex ? ' flex' : ''}" style="--lc:${LANE[id].color}"${title ? ` title="${esc(title)}"` : ''}>${laneIcon(id)}${LANE[id].cz}</span>`;
  const diffBars = d => `<span class="diff" data-d="${d}" title="Obtížnost: ${DIFF[d]}" aria-label="Obtížnost: ${DIFF[d]}"><i></i><i></i><i></i></span>`;
  const flexRoles = h => h.flex.map(f => f.r);
  const playsLane = (h, lane, withFlex) => h.roles.includes(lane) || (withFlex && flexRoles(h).includes(lane));

  /* ---------- titulky rozsekané na písmena ---------- */
  $$('.reveal-title').forEach(t => {
    const txt = t.textContent; t.setAttribute('aria-label', txt);
    t.innerHTML = [...txt].map((c, k) => `<span class="ch" aria-hidden="true" style="--k:${k}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
  });

  /* =====================================================================
     NAVIGACE
     ===================================================================== */
  const tabsInk = $('.tabs-ink');
  function moveInk(ink, btn) {
    if (!ink || !btn) return;
    const p = btn.parentElement.getBoundingClientRect(), r = btn.getBoundingClientRect();
    ink.style.width = (r.width - 20) + 'px';
    ink.style.transform = `translateX(${r.left - p.left + 10 + btn.parentElement.scrollLeft}px)`;
  }
  function showView(v, push = true) {
    const cur = $('.view.on');
    $$('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.view === v));
    moveInk(tabsInk, $(`.tabs button[data-view="${v}"]`));
    const next = $('#view-' + v);
    if (cur !== next) {
      $$('.view').forEach(s => s.classList.remove('on', 'entering'));
      next.classList.add('on');
      if (!RM) { void next.offsetWidth; next.classList.add('entering'); }
    }
    if (push && location.hash !== '#' + v) history.replaceState(null, '', '#' + v);
    if (v === 'compare') renderCompare(true);
    if (v === 'eternals') observeEternals();
    if (cur !== next) window.scrollTo({ top: 0, behavior: 'auto' });
  }
  $$('.tabs button').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));
  $('.brand').addEventListener('click', e => { e.preventDefault(); showView('heroes'); });
  window.addEventListener('resize', () => { moveInk(tabsInk, $('.tabs button.on')); moveInk($('.hm-ink'), $('.hm-tabs [aria-selected="true"]')); });

  function route() {
    const h = location.hash.slice(1);
    if (h.startsWith('hero/')) { const hero = byId[h.slice(5)]; if (hero) { showView('heroes', false); openHero(hero, false); } return; }
    if (h.startsWith('eternal/')) { const e = ETERNALS.find(x => x.id === h.slice(8)); if (e) { showView('eternals', false); openEternal(e, false); } return; }
    if (['heroes', 'eternals', 'quiz', 'compare'].includes(h)) showView(h, false);
  }

  /* =====================================================================
     HRDINOVÉ – filtry a mřížka
     ===================================================================== */
  const state = { lane: '', q: '', flex: false, cls: '', diff: '', range: '', sort: 'name' };
  tween($('#hero-total'), HEROES.length, { dur: 900 });

  const laneBar = $('#lane-bar');
  laneBar.innerHTML = `<button class="lane-btn" data-lane="" aria-pressed="true">Všechny lajny</button>` +
    LANES.map(l => `<button class="lane-btn" data-lane="${l.id}" aria-pressed="false" style="--lc:${l.color}">${laneIcon(l.id)}${l.cz} <span class="n" data-count="${l.id}">0</span></button>`).join('');
  laneBar.addEventListener('click', e => { const b = e.target.closest('.lane-btn'); if (b) { state.lane = b.dataset.lane; renderGrid(); } });
  const usedClasses = [...new Set(HEROES.map(h => h.cls))].sort();
  $('#f-class').insertAdjacentHTML('beforeend', usedClasses.map(c => `<option value="${c}">${c}</option>`).join(''));

  let qTimer;
  $('#q').addEventListener('input', e => { state.q = e.target.value; clearTimeout(qTimer); qTimer = setTimeout(renderGrid, 120); });
  $('#flex-toggle').addEventListener('change', e => { state.flex = e.target.checked; renderGrid(); });
  $('#f-class').addEventListener('change', e => { state.cls = e.target.value; renderGrid(); });
  $('#f-diff').addEventListener('change', e => { state.diff = e.target.value; renderGrid(); });
  $('#f-range').addEventListener('change', e => { state.range = e.target.value; renderGrid(); });
  $('#f-sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
  $('#reset-filters').addEventListener('click', () => {
    Object.assign(state, { lane: '', q: '', cls: '', diff: '', range: '' });
    $('#q').value = ''; $('#f-class').value = ''; $('#f-diff').value = ''; $('#f-range').value = '';
    renderGrid();
  });

  function matchesQuery(h, q) {
    if (!q) return true;
    const n = norm(q);
    return norm(h.n).includes(n) || norm(h.cls).includes(n) || h.ab.some(a => norm(a[1]).includes(n));
  }
  function filtered() {
    const list = HEROES.filter(h =>
      (!state.lane || playsLane(h, state.lane, state.flex)) &&
      (!state.cls || h.cls === state.cls) &&
      (!state.diff || String(h.diff) === state.diff) &&
      (!state.range || h.range === state.range || h.range === 'Hybrid') &&
      matchesQuery(h, state.q));
    const s = state.sort;
    return list.sort((a, b) => {
      if (s === 'diff') return a.diff - b.diff || a.n.localeCompare(b.n);
      if (s === 'new') return (NEW_ORDER[b.patch] || 0) - (NEW_ORDER[a.patch] || 0) || a.n.localeCompare(b.n);
      if (s === 'price') return (a.amber ?? 99999) - (b.amber ?? 99999) || a.n.localeCompare(b.n);
      return a.n.localeCompare(b.n, 'cs');
    });
  }

  // dlaždice se vytvoří jednou a pak se jen přeskupují (FLIP)
  const tiles = new Map();
  function makeTile(h) {
    const li = document.createElement('li');
    li.className = 'tile-wrap'; li.dataset.id = h.id;
    li.innerHTML = `<button class="tile" data-hero="${h.id}" aria-label="${esc(h.n)}, ${esc(h.cls)}, ${esc(DIFF[h.diff])}">
        <div class="art">${portrait(h, '')}</div>
        <span class="shine"></span>
        <div class="badges"></div>
        ${diffBars(h.diff)}
        <h3 class="name">${esc(h.n)}</h3>
        <div class="meta"></div>
        <span class="bar"></span>
      </button>`;
    tiles.set(h.id, li);
    return li;
  }
  function updateTile(li, h) {
    const viaFlex = state.lane && !h.roles.includes(state.lane);
    $('.badges', li).innerHTML = (h.isNew ? '<span class="badge new">Nový</span>' : '') + (h.free ? '<span class="badge free">Free</span>' : '') + (viaFlex ? '<span class="badge flexb">Flex</span>' : '');
    $('.meta', li).innerHTML = `<span class="cls">${esc(h.cls)}</span>` + h.roles.map(r => laneIcon(r)).join('') + (state.flex ? h.flex.map(f => laneIcon(f.r, 'flex')).join('') : '');
  }

  let firstRender = true;
  function renderGrid() {
    const list = filtered();
    const grid = $('#hero-grid');
    const gridRect = grid.getBoundingClientRect();
    const before = new Map();
    [...grid.children].forEach(li => before.set(li.dataset.id, li.getBoundingClientRect()));
    const keep = new Set(list.map(h => h.id));

    // odcházející dlaždice: duch, který zmizí na místě
    if (!firstRender && !RM) {
      [...grid.children].forEach(li => {
        if (keep.has(li.dataset.id)) return;
        const r = before.get(li.dataset.id);
        if (r.bottom < 0 || r.top > innerHeight) return;
        const ghost = li.cloneNode(true);
        Object.assign(ghost.style, { position: 'absolute', left: (r.left - gridRect.left) + 'px', top: (r.top - gridRect.top) + 'px', width: r.width + 'px', height: r.height + 'px', margin: 0, pointerEvents: 'none', zIndex: 0 });
        ghost.classList.add('ghost');
        grid.appendChild(ghost);
        ghost.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.86)' }], { duration: 260, easing: 'ease-in', fill: 'forwards' }).onfinish = () => ghost.remove();
      });
    }
    $$('.tile-wrap:not(.ghost)', grid).forEach(li => { if (!keep.has(li.dataset.id)) li.remove(); });

    const frag = document.createDocumentFragment();
    list.forEach(h => { const li = tiles.get(h.id) || makeTile(h); updateTile(li, h); frag.appendChild(li); });
    grid.insertBefore(frag, grid.querySelector('.ghost'));

    if (firstRender) {
      list.forEach((h, i) => tiles.get(h.id).style.setProperty('--i', Math.min(i, 40)));
      if (!RM) grid.classList.add('enter');
      setTimeout(() => grid.classList.remove('enter'), 2200);
    } else if (!RM) {
      grid.classList.remove('enter');
      let n = 0;
      list.forEach(h => {
        const li = tiles.get(h.id), old = before.get(h.id), now = li.getBoundingClientRect();
        if (now.bottom < -200 || now.top > innerHeight + 200) return;
        if (old) {
          const dx = old.left - now.left, dy = old.top - now.top;
          if (dx || dy) li.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 520, easing: EASE });
        } else {
          li.animate([{ opacity: 0, transform: 'translateY(16px) scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 60 + Math.min(n++, 14) * 22, easing: EASE, fill: 'backwards' });
        }
      });
    }
    firstRender = false;

    $('#hero-empty').hidden = list.length > 0;
    const laneTxt = state.lane ? ` na lajně ${LANE[state.lane].cz}${state.flex ? ' (včetně flexu)' : ''}` : '';
    $('#result-count').innerHTML = `Zobrazeno <b data-v="0" id="rc-n">${list.length}</b> z ${HEROES.length} hrdinů${laneTxt}`;
    const any = state.lane || state.q || state.cls || state.diff || state.range;
    $('#reset-filters').hidden = !any;
    toggleStarter(!any);
    $$('.lane-btn', laneBar).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lane === state.lane)));
    LANES.forEach(l => { const el = $(`[data-count="${l.id}"]`); if (el) tween(el, HEROES.filter(h => playsLane(h, l.id, state.flex)).length, { dur: 380 }); });
  }

  // začátečníci – při filtrování se plynule sbalí
  const strip = $('#starter-strip');
  function toggleStarter(show) {
    if (show === !strip.hidden) return;
    if (RM) { strip.hidden = !show; return; }
    if (show) {
      strip.hidden = false;
      strip.animate([{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: EASE });
    } else {
      strip.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 180, easing: 'ease-in' }).onfinish = () => { strip.hidden = true; };
    }
  }
  function renderStarters() {
    $('#starter-lanes').innerHTML = LANES.map(l => {
      const hs = HEROES.filter(h => h.starter && h.roles.includes(l.id)).sort((a, b) => (b.free - a.free) || a.n.localeCompare(b.n));
      return `<div class="starter-lane" style="--lc:${l.color}"><h3>${laneIcon(l.id)}${l.cz}</h3><ul>${hs.map(h =>
        `<li><button class="mini" data-hero="${h.id}">${portrait(h, '')}${esc(h.n)}${h.free ? ' <em>Free</em>' : ''}</button></li>`).join('')}</ul></div>`;
    }).join('');
  }
  $('#starter-lanes').addEventListener('click', e => { const t = e.target.closest('[data-hero]'); if (t) openHero(byId[t.dataset.hero], true, t.querySelector('.pimg')); });

  // klik + 3D náklon dlaždic
  const grid = $('#hero-grid');
  grid.addEventListener('click', e => { const t = e.target.closest('[data-hero]'); if (t) openHero(byId[t.dataset.hero], true, t.querySelector('.art .pimg')); });
  if (!RM && matchMedia('(hover: hover)').matches) {
    grid.addEventListener('pointermove', e => {
      const t = e.target.closest('.tile'); if (!t) return;
      const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.classList.add('tilting');
      t.style.setProperty('--ry', ((x - .5) * 10).toFixed(2) + 'deg');
      t.style.setProperty('--rx', ((.5 - y) * 10).toFixed(2) + 'deg');
      t.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      t.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
    grid.addEventListener('pointerout', e => {
      const t = e.target.closest('.tile'); if (!t || t.contains(e.relatedTarget)) return;
      t.classList.remove('tilting'); t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg');
    });
  }
  // stín pod filtry, když se přilepí
  const filters = $('#filters');
  window.addEventListener('scroll', () => filters.classList.toggle('stuck', filters.getBoundingClientRect().top <= 65 && scrollY > 200), { passive: true });

  /* =====================================================================
     MODÁLNÍ OKNA
     ===================================================================== */
  let lastFocus = null;
  function openOverlay(el) {
    lastFocus = document.activeElement;
    el.hidden = false; el.classList.remove('closing');
    document.body.classList.add('lock');
    requestAnimationFrame(() => { el.classList.add('show'); $('.sheet', el).focus({ preventScroll: true }); });
  }
  function closeOverlay(el, restoreHash = true) {
    if (el.hidden) return;
    el.classList.add('closing'); el.classList.remove('show');
    const done = () => { el.hidden = true; el.classList.remove('closing'); if (!$$('.overlay').some(o => !o.hidden)) document.body.classList.remove('lock'); };
    RM ? done() : setTimeout(done, 320);
    if (restoreHash) history.replaceState(null, '', '#' + $('.view.on').id.replace('view-', ''));
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $$('.overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o || e.target.closest('[data-close]')) closeOverlay(o); }));
  document.addEventListener('keydown', e => {
    const open = $$('.overlay').find(o => !o.hidden);
    if (!open) return;
    if (e.key === 'Escape') closeOverlay(open);
    if (open.id === 'hero-modal' && !e.target.matches('input, select')) {
      if (e.key === 'ArrowRight') stepHero(1);
      if (e.key === 'ArrowLeft') stepHero(-1);
    }
    if (e.key === 'Tab') {
      const f = $$('button, [href], input, select, [tabindex]:not([tabindex="-1"])', open).filter(x => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- detail hrdiny ---------- */
  const TABS = ['overview', 'abilities', 'stats', 'lore'];
  let current = null, currentTab = 'overview', heroLevel = 1, navList = HEROES;

  // portrét přiletí z dlaždice na své místo v detailu
  function flyPortrait(srcEl) {
    if (RM || !srcEl) return;
    const sheet = $('.hero-sheet'), dest = $('#hm-portrait');
    const from = srcEl.getBoundingClientRect();
    if (!from.width) return;
    sheet.style.transition = 'none'; sheet.style.transform = 'none';
    const to = dest.getBoundingClientRect();
    sheet.style.transform = ''; void sheet.offsetWidth; sheet.style.transition = '';
    const clone = srcEl.cloneNode(true);
    clone.classList.add('fly'); clone.removeAttribute('loading');
    Object.assign(clone.style, { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px' });
    clone.style.transformOrigin = '0 0';
    document.body.appendChild(clone);
    dest.style.opacity = '0';
    const sx = to.width / from.width, sy = to.height / from.height;
    clone.animate([
      { transform: 'translate(0,0) scale(1,1)', borderRadius: '12px' },
      { transform: `translate(${to.left - from.left}px,${to.top - from.top}px) scale(${sx},${sy})`, borderRadius: (12 / sx) + 'px' },
    ], { duration: 560, easing: EASE, fill: 'forwards' }).onfinish = () => { dest.style.opacity = ''; clone.remove(); };
  }

  function openHero(h, push = true, srcEl = null) {
    if (!h) return;
    const modal = $('#hero-modal');
    const f = filtered();
    navList = $('#view-heroes').classList.contains('on') && f.includes(h) ? f : HEROES.slice().sort((a, b) => a.n.localeCompare(b.n, 'cs'));
    current = h; currentTab = 'overview';
    const wasHidden = modal.hidden;
    fillHero(0);
    if (wasHidden) { openOverlay(modal); flyPortrait(srcEl); }
    requestAnimationFrame(() => moveInk($('.hm-ink'), $('.hm-tabs [aria-selected="true"]')));
    if (push) history.replaceState(null, '', '#hero/' + h.id);
  }
  function stepHero(d) {
    const i = navList.indexOf(current);
    current = navList[(i + d + navList.length) % navList.length];
    fillHero(d);
    history.replaceState(null, '', '#hero/' + current.id);
  }
  $('#hm-prev').addEventListener('click', () => stepHero(-1));
  $('#hm-next').addEventListener('click', () => stepHero(1));

  function fillHero(dir) {
    const h = current;
    const head = $('#hm-head');
    head.classList.toggle('cutout', !!h.cutout);
    const ban = $('#hm-banner');
    ban.className = 'hm-banner' + (h.banner ? '' : ' blur');
    ban.style.backgroundImage = `url("${h.banner || h.icon}")`;
    ban.style.setProperty('--bs', h.bannerSize || (h.cutout ? 'auto 138%' : 'cover'));
    ban.style.setProperty('--bp', h.bannerPos || (h.cutout ? '84% 16%' : 'center 25%'));
    if (dir && !RM) { void ban.offsetWidth; ban.classList.add('swap'); }
    $('#hm-portrait').innerHTML = portrait(h, 'Portrét: ' + h.n);
    $('#hm-name').textContent = h.n;
    const price = h.amber === 0 ? '<span>Free pro všechny</span>' :
      h.amber ? `<span class="price"><img src="${AMBER_ICON}" alt="Amber">${fmt(h.amber)}</span><span class="price plat"><img src="${PLAT_ICON}" alt="Platinum">${fmt(h.plat)}</span>` : '<span>Cena: zatím neuvedena</span>';
    $('#hm-sub').innerHTML = `<span class="cls" title="${esc(CLASS_DESC[h.cls] || '')}">${esc(h.cls)}</span>${diffBars(h.diff)}<span>${DIFF[h.diff]}</span><span>${RANGE_CZ[h.range] || h.range}</span>${price}${h.isNew ? '<span class="badge new">Nový v patchi ' + h.patch + '</span>' : ''}`;
    $('#hm-roles').innerHTML = h.roles.map(r => laneTag(r)).join('') + h.flex.map(f => laneTag(f.r, true, f.src)).join('');
    // restart animace textu v hlavičce
    const idt = $('.hm-idtext'); idt.style.animation = 'none'; [...idt.children].forEach(c => { c.style.animation = 'none'; void c.offsetWidth; c.style.animation = ''; });
    $$('.hm-tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.hm === currentTab)));
    moveInk($('.hm-ink'), $('.hm-tabs [aria-selected="true"]'));
    renderHeroPane(dir < 0 ? -1 : 1);
    $('#hero-modal').scrollTop = 0;
  }
  $$('.hm-tabs button').forEach(b => b.addEventListener('click', () => {
    const dir = TABS.indexOf(b.dataset.hm) >= TABS.indexOf(currentTab) ? 1 : -1;
    currentTab = b.dataset.hm;
    $$('.hm-tabs button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    moveInk($('.hm-ink'), b);
    renderHeroPane(dir);
  }));

  function statAt(h, lvl) {
    const s = h.stats, k = lvl - 1;
    return {
      hp: s.hp + s.hpG * k, mp: s.mp + s.mpG * k, pp: s.pp + s.ppG * k, as: s.as + s.asG * k,
      pa: s.pa + s.paG * k, ma: s.ma + s.maG * k, hpr: s.hpr + s.hprG * k, mpr: s.mpr + s.mprG * k,
      ms: s.ms, rng: s.rng, bat: s.bat,
    };
  }
  // maximum v rosteru na levelu 18 – pro proužek pod každým statem
  const MAX18 = {};
  HEROES.forEach(h => { const v = statAt(h, 18); for (const k in v) MAX18[k] = Math.max(MAX18[k] || 0, v[k]); });
  const STAT_ROWS = [
    ['hp', 'Health', 0, 'hpG'], ['mp', 'Mana', 0, 'mpG'], ['pp', 'Physical Power', 1, 'ppG'], ['as', 'Attack Speed', 1, 'asG', ' %'],
    ['pa', 'Physical Armor', 1, 'paG'], ['ma', 'Magical Armor', 1, 'maG'], ['hpr', 'Health Regen', 2, 'hprG', '/s'], ['mpr', 'Mana Regen', 2, 'mprG', '/s'],
    ['ms', 'Movement Speed', 0], ['rng', 'Attack Range', 0], ['bat', 'Base Attack Time', 2, null, ' s'],
  ];
  function resLabel(h, key) {
    if (h.res === 'Mana') return null;
    if (key === 'mp') return h.res === 'Energie' ? 'Energy' : h.res;
    if (key === 'mpr') return h.res === 'Energie' ? 'Energy Regen' : h.res + ' regen';
    return null;
  }

  function renderHeroPane(dir = 1) {
    const h = current, body = $('#hm-body');
    const cls = 'hm-pane' + (dir < 0 ? ' from-left' : '');
    let html = '';
    if (currentTab === 'overview') {
      const r = h.rating;
      const rows = [['Basic Attack', r.basic], ['Durability', r.durability], ['Ability Power', r.ability], ['Mobility', r.mobility]];
      const flexList = h.flex.length ? `<div class="flex-note"><h4>Flex – hraje se i mimo oficiální role</h4><ul>${h.flex.map(f => `<li><b>${LANE[f.r].cz}</b> <span class="src">– ${esc(f.src)}</span></li>`).join('')}</ul></div>` : '';
      html = `<div class="${cls}">
        <p class="hm-desc">${esc(h.desc)}</p>
        <div class="two">
          <div>
            <h3 class="block-h">Silné stránky</h3>
            <div class="rating">${rows.map(([l, v], row) => `<div class="rating-row"><span>${l}</span><div class="track" role="img" aria-label="${l}: ${v} z 10">${Array.from({ length: 10 }, (_, n) => `<i class="${n < v ? 'on' : ''}" style="--n:${n};--row:${row}"></i>`).join('')}</div><b>${v}</b></div>`).join('')}</div>
            ${flexList}
          </div>
          <div>
            <h3 class="block-h">Základní údaje</h3>
            <dl class="facts stagger">
              <div style="--s:0"><dt>Třída</dt><dd>${esc(h.cls)}</dd></div>
              <div style="--s:1"><dt>Role</dt><dd>${h.roles.map(x => LANE[x].cz).join(', ')}</dd></div>
              <div style="--s:2"><dt>Útok</dt><dd>${RANGE_CZ[h.range] || h.range}</dd></div>
              <div style="--s:3"><dt>Resource</dt><dd>${esc(h.res === 'Energie' ? 'Energy' : h.res)}</dd></div>
              <div style="--s:4"><dt>Obtížnost</dt><dd>${DIFF[h.diff]}</dd></div>
              <div style="--s:5"><dt>Health na levelu 1 / 18</dt><dd>${fmt(h.stats.hp)} / ${fmt(statAt(h, 18).hp)}</dd></div>
            </dl>
            ${h.clsNote ? `<p style="color:var(--dim);font-size:13px;margin-top:10px">${esc(h.clsNote)}</p>` : ''}
          </div>
        </div>
        <h3 class="block-h" style="margin-top:28px">Augmenty</h3>
        <div class="aug-list stagger">${h.aug.map((a, i) => `<div class="aug" style="--s:${i + 2}"><b>${esc(a[0])}</b><p>${esc(a[1])}</p></div>`).join('')}</div>
      </div>`;
    } else if (currentTab === 'abilities') {
      html = `<div class="${cls} abilities stagger">${h.ab.map((a, i) => {
        const [k, name, cd, cost, d] = a;
        const img = a.icon ? `<img src="${esc(a.icon)}" alt="" loading="lazy" data-hide="1" onerror="this.parentNode.classList.add('noimg')">` : '';
        return `<article class="ab${k === 'R' ? ' ult' : ''}" style="--s:${i}">
          <div class="keycap${a.icon ? '' : ' noimg'}">${img}<span class="k">${k}</span></div>
          <div>
            <div class="ab-top"><h3 class="ab-name">${esc(name)}</h3><span class="ab-slot">${SLOT[k]}</span>
              <span class="ab-cost">${cd ? `<span title="Cooldown"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>${esc(cd)}</span>` : ''}${cost ? `<span title="Cost"><svg viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>${esc(cost)}</span>` : ''}</span></div>
            <p>${esc(d)}</p>
          </div></article>`;
      }).join('')}</div>`;
    } else if (currentTab === 'stats') {
      html = `<div class="${cls}">
        <div class="stats-top"><label class="lvl">Level <output id="lvl-out">${heroLevel}</output><input type="range" id="lvl" min="1" max="18" value="${heroLevel}" aria-label="Level hrdiny"></label>
        <p>Základní hodnoty bez itemů, malým písmem růst za level. Proužek ukazuje, kde hrdina stojí oproti nejvyšší hodnotě v rosteru na levelu 18.</p></div>
        <div class="stat-grid stagger" id="stat-grid"></div>
        <p style="margin-top:22px"><button class="btn ghost" id="to-compare">Porovnat s jiným hrdinou</button></p>
      </div>`;
    } else {
      html = `<div class="${cls}"><p class="lore">${esc(h.lore)}</p></div>`;
    }
    body.innerHTML = html;
    if (currentTab === 'stats') {
      const rows = STAT_ROWS.filter(([k]) => !((k === 'mp' || k === 'mpr') && h.stats.mp === 0 && h.res !== 'Energie'));
      $('#stat-grid').innerHTML = rows.map(([k, l, d, g, u], i) => {
        const label = resLabel(h, k) || l;
        const growth = g && h.stats[g] ? `<small>+${fmt(h.stats[g], 2)}/lvl</small>` : '';
        return `<div class="stat" data-k="${k}" style="--s:${i}"><span>${label}</span><b><i data-v="0">0</i>${u || ''}${growth}</b></div>`;
      }).join('');
      const r = $('#lvl'), out = $('#lvl-out');
      const paint = first => {
        heroLevel = +r.value; out.textContent = heroLevel;
        if (!first && !RM) { out.classList.remove('bump'); void out.offsetWidth; out.classList.add('bump'); }
        r.style.setProperty('--p', ((heroLevel - 1) / 17 * 100) + '%');
        const v = statAt(h, heroLevel);
        rows.forEach(([k, , d]) => {
          const row = $(`.stat[data-k="${k}"]`);
          tween($('i', row), v[k], { d, dur: first ? 700 : 280 });
          const max = k === 'bat' ? null : MAX18[k];
          row.style.setProperty('--fill', max ? Math.min(100, v[k] / max * 100) + '%' : '0%');
        });
      };
      r.addEventListener('input', () => paint(false));
      requestAnimationFrame(() => paint(true));
      $('#to-compare').addEventListener('click', () => { cmp.a = h.id; closeOverlay($('#hero-modal'), false); showView('compare'); });
    }
  }

  /* =====================================================================
     ETERNALOVÉ
     ===================================================================== */
  function renderEternals() {
    const groups = [...new Set(ETERNALS.map(e => e.group))];
    $('#eternal-groups').innerHTML = groups.map(g => {
      const gi = EGROUPS[g] || {};
      return `<section class="eg${RM ? '' : ' reveal'}"><div class="eg-head"><h2>${esc(gi.cz || g)}</h2><span class="en">${g}</span><p>${esc(gi.desc || '')}</p></div>
        <div class="eg-grid">${ETERNALS.filter(e => e.group === g).map((e, i) => `
          <button class="ecard" data-eternal="${e.id}" style="--i:${i}">
            <div class="eimg"><img src="${esc(e.img)}" data-fb="${esc(e.imgAlt || '')}" data-hide="1" alt="" loading="lazy">${e.isNew ? '<span class="badge new">Nový v 1.16</span>' : ''}</div>
            <div class="ebody"><h3>${esc(e.n)}</h3><p>${esc(e.major)}</p></div>
          </button>`).join('')}</div></section>`;
    }).join('');
  }
  let eio = null;
  function observeEternals() {
    if (RM || !('IntersectionObserver' in window)) { $$('.eg').forEach(s => s.classList.add('in')); return; }
    if (!eio) eio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); eio.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
    $$('.eg:not(.in)').forEach(s => eio.observe(s));
  }
  $('#eternal-groups').addEventListener('click', e => { const t = e.target.closest('[data-eternal]'); if (t) openEternal(ETERNALS.find(x => x.id === t.dataset.eternal)); });

  function openEternal(e, push = true) {
    const gi = EGROUPS[e.group] || {};
    const tier = (t, list) => `<div class="tier"><h3>${t}</h3><ul class="stagger">${list.map((m, i) => `<li style="--s:${i + 3}"><b>${esc(m.n)}</b>${esc(m.d)}</li>`).join('')}</ul></div>`;
    const syn = e.synergy.map(n => byName[n] || byName[n === 'Neon' ? 'N3ON' : n]).filter(Boolean);
    $('#em-body').innerHTML = `
      <div class="em-hero"><img src="${esc(e.img)}" data-fb="${esc(e.imgAlt || '')}" data-hide="1" alt="${esc(e.n)}"></div>
      <div class="em-in">
        <h2 id="em-name">${esc(e.n)}</h2>
        <p class="em-group"><b>${esc(gi.cz || e.group)}</b> (${e.group})${e.isNew ? ' – nový Eternal z patche 1.16' : ''}</p>
        <div class="major"><h3>Major Blessing</h3><p>${esc(e.major)}</p></div>
        <div class="tiers">${tier('Minor Blessing – 1. řada', e.minor1)}${tier('Minor Blessing – 2. řada', e.minor2)}</div>
        <div class="syn"><h3>Typicky sedí na</h3><p>Doporučení, ne pravidlo. Klikni na hrdinu pro detail.</p>
          <ul>${syn.map(h => `<li><button class="mini" data-hero="${h.id}">${portrait(h, '')}${esc(h.n)}</button></li>`).join('')}</ul></div>
        <p style="color:var(--dim);font-size:13.5px;margin-top:18px">Ikra dostává na pasivce Herald bonus podle skupiny Eternala (${esc(gi.cz || e.group)}).</p>
      </div>`;
    const m = $('#eternal-modal');
    if (m.hidden) openOverlay(m);
    if (push) history.replaceState(null, '', '#eternal/' + e.id);
  }
  $('#em-body').addEventListener('click', ev => {
    const t = ev.target.closest('[data-hero]'); if (!t) return;
    closeOverlay($('#eternal-modal'), false);
    showView('heroes', false);
    setTimeout(() => openHero(byId[t.dataset.hero]), RM ? 0 : 330);
  });

  /* =====================================================================
     KVÍZY
     ===================================================================== */
  const qz = { mode: null, lane: null, i: 0, qs: [], profile: null, score: 0, log: [], busy: false };
  function quizStage(id) { $$('.quiz-stage').forEach(s => s.classList.toggle('on', s.id === id)); }
  $$('[data-quiz-home]').forEach(b => b.addEventListener('click', () => quizStage('quiz-home')));
  $$('[data-quiz]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.quiz === 'lane') { quizStage('quiz-lane-pick'); return; }
    startQuiz(b.dataset.quiz);
  }));
  $('#lane-picks').innerHTML = LANES.map((l, i) => `<button class="lane-pick" data-lane="${l.id}" style="--lc:${l.color};--i:${i}"><img src="${l.icon}" alt="">${l.cz}</button>`).join('');
  $('#lane-picks').addEventListener('click', e => { const b = e.target.closest('[data-lane]'); if (b) startQuiz('lane', b.dataset.lane); });
  $('#quiz-again').addEventListener('click', () => startQuiz(qz.mode, qz.lane));

  function startQuiz(mode, lane) {
    Object.assign(qz, { mode, lane: lane || null, i: 0, score: 0, log: [], busy: false, profile: { lane: {}, cls: {}, dim: {}, range: null, diff: null } });
    qz.qs = mode === 'general' ? QUIZ.general : mode === 'lane' ? QUIZ.lanes[lane] : makeTrivia(10);
    quizStage('quiz-run');
    $('#quiz-box').innerHTML = '';
    renderQuestion();
  }
  async function nextQuestion() {
    const pane = $('#quiz-box .q-pane');
    if (pane && !RM) { pane.classList.add('out'); await new Promise(r => setTimeout(r, 260)); }
    qz.i++; renderQuestion();
  }
  function renderQuestion() {
    const total = qz.qs.length;
    $('#quiz-bar').style.width = (qz.i / total * 100) + '%';
    if (qz.i >= total) { finishQuiz(); return; }
    $('#quiz-counter').textContent = `Otázka ${qz.i + 1} z ${total}`;
    const q = qz.qs[qz.i];
    const opts = q.opts.map((o, i) => `<button class="q-opt" data-i="${i}" style="--i:${i}">${o.img || ''}${esc(o.t)}</button>`).join('');
    $('#quiz-box').innerHTML = `<div class="q-pane"><h2 class="q-title">${esc(q.q)}</h2>${q.media || ''}<div class="q-opts">${opts}</div>${qz.mode === 'trivia' ? '<p class="q-feedback" id="q-fb"></p>' : ''}</div>`;
    qz.busy = false;
    const first = $('.q-opt'); if (first) first.focus({ preventScroll: true });
  }
  $('#quiz-box').addEventListener('click', e => {
    const b = e.target.closest('.q-opt'); if (!b || b.disabled || qz.busy) return;
    qz.busy = true;
    const q = qz.qs[qz.i], o = q.opts[+b.dataset.i];
    if (qz.mode === 'trivia') {
      const ok = !!o.ok;
      if (ok) qz.score++;
      qz.log.push({ q: q.q, ok, answer: q.opts.find(x => x.ok).t });
      $$('.q-opt').forEach((x, i) => { x.disabled = true; if (q.opts[i].ok) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      $('#q-fb').textContent = ok ? 'Správně!' : `Správně je ${q.opts.find(x => x.ok).t}.`;
      setTimeout(nextQuestion, ok ? 900 : 1600);
    } else {
      b.classList.add('picked');
      applyAnswer(o.v || {});
      setTimeout(nextQuestion, RM ? 0 : 160);
    }
  });
  function applyAnswer(v) {
    const p = qz.profile;
    for (const k of ['lane', 'cls', 'dim']) if (v[k]) for (const [kk, n] of Object.entries(v[k])) p[k][kk] = (p[k][kk] || 0) + n;
    if (v.range) p.range = v.range;
    if (v.diff) p.diff = v.diff;
  }
  function scoreHero(h) {
    const p = qz.profile; let s = 0; const why = [];
    for (const [l, n] of Object.entries(p.lane)) {
      if (h.roles.includes(l)) s += n * 1.2;
      else if (flexRoles(h).includes(l)) s += n * 0.6;
    }
    const topLane = Object.entries(p.lane).sort((a, b) => b[1] - a[1])[0];
    if (topLane && playsLane(h, topLane[0], true)) why.push(LANE[topLane[0]].cz + (h.roles.includes(topLane[0]) ? '' : ' (flex)'));
    const c = p.cls[h.cls] || 0; s += c * 1.5; if (c >= 2) why.push(h.cls);
    for (const [d, n] of Object.entries(p.dim)) s += n * (h.rating[d] - 5) * 0.35;
    const topDim = Object.entries(p.dim).sort((a, b) => b[1] - a[1])[0];
    const DN = { basic: 'silné útoky', durability: 'odolnost', ability: 'silné abilities', mobility: 'mobilita' };
    if (topDim && h.rating[topDim[0]] >= 7) why.push(DN[topDim[0]]);
    if (p.range) { const ok = h.range === p.range || h.range === 'Hybrid'; s += ok ? 3 : -4; if (ok) why.push(RANGE_CZ[h.range]); }
    if (p.diff) { const dd = Math.abs(h.diff - p.diff); s -= dd * 3; if (!dd) why.push(DIFF[h.diff]); }
    return { h, s, why };
  }
  function finishQuiz() {
    $('#quiz-bar').style.width = '100%';
    const box = $('#quiz-result-box');
    if (qz.mode === 'trivia') {
      const n = qz.qs.length, s = qz.score;
      const verdict = s === n ? 'Perfektní. Znalost veterána.' : s >= 8 ? 'Výborně, hrdiny znáš opravdu dobře.' : s >= 5 ? 'Solidní. Pár hrdinů ještě projdi v databázi.' : 'Začátek je vždycky těžký – projdi databázi a zkus to znovu.';
      box.innerHTML = `<p class="score-big"><span id="score-n" data-v="0">0</span>/${n}</p><h2 class="result-h">${verdict}</h2>
        <ul class="review">${qz.log.map((l, i) => `<li class="${l.ok ? '' : 'bad'}" style="--i:${i}">${esc(l.q)} <b>${esc(l.answer)}</b></li>`).join('')}</ul>`;
      quizStage('quiz-result');
      tween($('#score-n'), s, { dur: 900 });
      return;
    }
    let pool = HEROES;
    if (qz.mode === 'lane') { pool = pool.filter(h => playsLane(h, qz.lane, true)); qz.profile.lane[qz.lane] = (qz.profile.lane[qz.lane] || 0) + 2; }
    const ranked = pool.map(scoreHero).sort((a, b) => b.s - a.s);
    const top = ranked.slice(0, 3), best = ranked[0].s, worst = ranked[ranked.length - 1].s;
    const pct = s => Math.round(55 + (s - worst) / Math.max(1, best - worst) * 43);
    box.innerHTML = `<h2 class="result-h">Tvoji hrdinové${qz.mode === 'lane' ? ' na ' + LANE[qz.lane].cz : ''}</h2>
      <p class="result-sub">Seřazeno podle shody s tvými odpověďmi. Klikni na hrdinu pro detail.</p>
      <div class="result-list">${top.map((r, i) => `
        <button class="result-card${i === 0 ? ' first' : ''}" data-hero="${r.h.id}" style="animation-delay:${i * 130}ms">
          ${portrait(r.h, '')}
          <div><h3>${esc(r.h.n)}</h3><p>${esc(r.h.desc)}</p><div class="why">${[...new Set(r.why)].slice(0, 4).map(w => `<span>${esc(w)}</span>`).join('')}</div></div>
          <div class="match"><b><span data-pct="${pct(r.s)}" data-v="0">0</span> %</b><small>shoda</small></div>
        </button>`).join('')}</div>`;
    quizStage('quiz-result');
    $$('[data-pct]', box).forEach((el, i) => setTimeout(() => tween(el, +el.dataset.pct, { dur: 900 }), 250 + i * 130));
  }
  $('#quiz-result-box').addEventListener('click', e => { const t = e.target.closest('[data-hero]'); if (t) openHero(byId[t.dataset.hero], true, t.querySelector('.pimg')); });

  // znalostní kvíz
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function heroOpts(correct, n = 4, img = false) {
    const others = shuffle(HEROES.filter(h => h !== correct)).slice(0, n - 1);
    return shuffle([correct, ...others]).map(h => ({ t: h.n, ok: h === correct, img: img ? portrait(h, '') : '' }));
  }
  function maskName(text, h) {
    let t = text;
    [h.n, ...h.n.split(/[ &]+/).filter(w => w.length > 2)].forEach(p => { t = t.replace(new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '▇▇▇'); });
    return t;
  }
  function makeTrivia(n) {
    const types = [
      h => ({ q: `Komu patří ultimátka „${h.ab[5][1]}“?`, opts: heroOpts(h, 4, true) }),
      h => ({ q: 'O kom je tento lore?', media: `<p class="q-quote">${esc(maskName(h.lore.split('. ').slice(0, 2).join('. ') + '.', h))}</p>`, opts: heroOpts(h) }),
      h => ({ q: 'Kdo je na portrétu?', media: `<div class="q-media">${portrait(h, 'Hádaný hrdina')}</div>`, opts: heroOpts(h) }),
      h => ({ q: `Čí passive je „${h.ab[0][1]}“?`, opts: heroOpts(h, 4, true) }),
      h => {
        const wrong = shuffle(usedClasses.filter(c => c !== h.cls)).slice(0, 3);
        return { q: `Jakou třídu má ${h.n}?`, media: `<div class="q-media">${portrait(h, h.n)}</div>`, opts: shuffle([h.cls, ...wrong]).map(c => ({ t: c, ok: c === h.cls })) };
      },
      h => ({ q: `Kdo má na Q ability „${h.ab[3][1]}“?`, opts: heroOpts(h, 4, true) }),
    ];
    const picks = shuffle(HEROES).slice(0, n);
    const order = shuffle([...Array(n)].map((_, i) => i % types.length));
    return picks.map((h, i) => types[order[i]](h));
  }

  /* =====================================================================
     POROVNÁNÍ
     ===================================================================== */
  const cmp = { a: 'gideon', b: 'murdock', lvl: 1, built: '' };
  const sorted = HEROES.slice().sort((a, b) => a.n.localeCompare(b.n, 'cs'));
  const opts = sorted.map(h => `<option value="${h.id}">${esc(h.n)}</option>`).join('');
  $('#cmp-a').innerHTML = opts; $('#cmp-b').innerHTML = opts;
  $('#cmp-a').addEventListener('change', e => { cmp.a = e.target.value; renderCompare(); });
  $('#cmp-b').addEventListener('change', e => { cmp.b = e.target.value; renderCompare(); });
  $('#cmp-lvl').addEventListener('input', e => {
    cmp.lvl = +e.target.value;
    const o = $('#cmp-lvl-out'); if (!RM) { o.classList.remove('bump'); void o.offsetWidth; o.classList.add('bump'); }
    renderCompare();
  });
  const CMP_ROWS = [['hp', 'Health', 0, 1], ['mp', 'Mana / Energy', 0, 1], ['pp', 'Physical Power', 1, 1], ['as', 'Attack Speed %', 1, 1], ['pa', 'Physical Armor', 1, 1], ['ma', 'Magical Armor', 1, 1], ['hpr', 'Health Regen', 2, 1], ['ms', 'Movement Speed', 0, 1], ['rng', 'Attack Range', 0, 1], ['bat', 'BAT (méně = rychleji)', 2, -1]];
  function renderCompare(fresh) {
    const A = byId[cmp.a] || sorted[0], B = byId[cmp.b] || sorted[1];
    $('#cmp-a').value = A.id; $('#cmp-b').value = B.id;
    const lv = $('#cmp-lvl'); lv.value = cmp.lvl; lv.style.setProperty('--p', ((cmp.lvl - 1) / 17 * 100) + '%');
    $('#cmp-lvl-out').textContent = cmp.lvl;
    const body = $('#cmp-body');
    const key = A.id + '|' + B.id;
    const head = (h, side) => `<button class="cmp-head${cmp.built ? ' swap' : ''}" data-hero="${h.id}" data-side="${side}">${portrait(h, '')}<div><h3>${esc(h.n)}</h3><p>${esc(h.cls)}, ${h.roles.map(r => LANE[r].cz).join(' / ')}</p></div></button>`;
    if (cmp.built !== key || fresh) {
      const prev = cmp.built ? cmp.built.split('|') : [];
      body.innerHTML = `<div class="cmp-heads">${head(A, 'a')}${head(B, 'b')}</div><div class="cmp-table">${CMP_ROWS.map(([k, l]) => `
        <div class="cmp-row" data-k="${k}">
          <div class="cmp-side a"><span class="v" data-v="0">0</span><span class="bar"><span></span></span></div>
          <div class="lab">${l}</div>
          <div class="cmp-side b"><span class="bar"><span></span></span><span class="v" data-v="0">0</span></div>
        </div>`).join('')}</div>`;
      if (prev[0] === A.id) $('.cmp-head[data-side="a"]').classList.remove('swap');
      if (prev[1] === B.id) $('.cmp-head[data-side="b"]').classList.remove('swap');
      cmp.built = key;
    }
    const va = statAt(A, cmp.lvl), vb = statAt(B, cmp.lvl);
    requestAnimationFrame(() => CMP_ROWS.forEach(([k, , d, dir]) => {
      const row = $(`.cmp-row[data-k="${k}"]`, body);
      const a = va[k], b = vb[k], max = Math.max(a, b) || 1;
      const sa = $('.cmp-side.a', row), sb = $('.cmp-side.b', row);
      sa.classList.toggle('win', dir > 0 ? a > b : a < b);
      sb.classList.toggle('win', dir > 0 ? b > a : b < a);
      $('.bar span', sa).style.width = (a / max * 100) + '%';
      $('.bar span', sb).style.width = (b / max * 100) + '%';
      tween($('.v', sa), a, { d, dur: 500 }); tween($('.v', sb), b, { d, dur: 500 });
    }));
  }
  $('#cmp-body').addEventListener('click', e => { const t = e.target.closest('[data-hero]'); if (t) openHero(byId[t.dataset.hero], true, t.querySelector('.pimg')); });

  /* ---------- start ---------- */
  renderStarters();
  renderGrid();
  renderEternals();
  route();
  requestAnimationFrame(() => moveInk(tabsInk, $('.tabs button.on')));
  if (document.fonts) document.fonts.ready.then(() => moveInk(tabsInk, $('.tabs button.on')));
  window.addEventListener('hashchange', route);
})();
