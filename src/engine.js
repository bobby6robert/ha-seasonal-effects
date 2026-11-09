/*
 * Seasonal Effects for Home Assistant – overlay engine
 * Animated seasonal effects drawn on top of Lovelace dashboards:
 * Halloween, Christmas, New Year's Eve, Valentine's Day, Easter, birthdays and name days.
 * The overlay never intercepts taps or clicks (pointer-events: none).
 *
 * Configuration lives in the `custom:seasonal-effects-card` card (set up with its wizard).
 * The engine finds that card in the current dashboard and follows its settings.
 */

const SE_VERSION = '1.2.0';

const SE_TEXT = {
  en: {
    trick: '🎃 Trick or treat!',
    nicholas: '🎅 Happy St. Nicholas Day!',
    xmas: '🎄 Merry Christmas!',
    nye: "🥂 Happy New Year's Eve!",
    ny: '🎆 Happy New Year {y}!',
    valentine: "💘 Happy Valentine's Day!",
    easter: '🐣 Happy Easter!',
    bday: '🎂 Happy birthday, {n}!',
    bdayAny: '🎂 Happy birthday!',
    nameday: '🎉 Happy name day, {n}!',
    namedayShort: '🎉 Name day: {n}!',
    dayoff: '🌞 {t}',
    dayoffAny: '🌞 Day off!',
    weekend: 'Weekend',
    and: ' and ',
    holidays: {},
  },
  pl: {
    trick: '🎃 Cukierek albo psikus!',
    nicholas: '🎅 Mikołajki!',
    xmas: '🎄 Wesołych Świąt!',
    nye: '🥂 Sylwester!',
    ny: '🎆 Szczęśliwego Nowego Roku {y}!',
    valentine: '💘 Szczęśliwych Walentynek!',
    easter: '🐣 Wesołych Świąt Wielkanocnych!',
    bday: '🎂 Wszystkiego najlepszego, {n}!',
    bdayAny: '🎂 Wszystkiego najlepszego!',
    nameday: '🎉 Wszystkiego najlepszego z okazji imienin, {n}!',
    namedayShort: '🎉 Imieniny: {n}!',
    dayoff: '🌞 {t}',
    dayoffAny: '🌞 Dzień wolny!',
    weekend: 'Weekend',
    and: ' i ',
    holidays: {
      '01-01': 'Nowy Rok', '01-06': 'Trzech Króli', easter: 'Wielkanoc', easter1: 'Poniedziałek Wielkanocny',
      '05-01': 'Święto Pracy', '05-03': 'Święto Konstytucji 3 Maja', pentecost: 'Zielone Świątki', corpus: 'Boże Ciało',
      '08-15': 'Wniebowzięcie NMP', '11-01': 'Wszystkich Świętych', '11-11': 'Święto Niepodległości',
      '12-24': 'Wigilia', '12-25': 'Boże Narodzenie', '12-26': 'Drugi dzień Świąt',
    },
  },
};

/** Animated scenes. */
const SE_EFFECTS = ['halloween', 'christmas', 'newyear', 'valentine', 'easter', 'birthday', 'dayoff'];

/** Occasions in priority order (the first active one picks the animation). */
const SE_OCCASIONS = ['birthday_home', 'nameday', 'custom', 'newyear', 'birthday_other', 'christmas', 'easter', 'valentine', 'halloween', 'dayoff'];
const SE_SCENE_OF = {
  birthday_home: 'birthday', nameday: 'birthday', custom: 'valentine', birthday_other: 'birthday', newyear: 'newyear', christmas: 'christmas',
  easter: 'easter', valentine: 'valentine', halloween: 'halloween', dayoff: 'dayoff',
};
/** Optional parts of every scene (each can be switched off per occasion). */
const SE_EXTRAS = {
  halloween: ['moon', 'fog', 'eyes', 'lightning', 'bats', 'pumpkins', 'leaves', 'ghosts', 'spider'],
  christmas: ['snow', 'garland', 'snowbank', 'sleigh', 'star'],
  newyear: ['fireworks', 'countdown', 'midnight'],
  valentine: ['hearts', 'bokeh'],
  easter: ['flowers', 'bunny'],
  birthday: ['balloons', 'confetti'],
  dayoff: ['sun', 'clouds', 'butterflies'],
};

const SE_HELPER_OPTIONS = {
  en: ['Auto', 'Off', 'Halloween', 'Christmas', 'New Year', "Valentine's Day", 'Easter', 'Birthday', 'Day off'],
  pl: ['Automatycznie', 'Wyłączony', 'Halloween', 'Święta', 'Sylwester', 'Walentynki', 'Wielkanoc', 'Urodziny', 'Dzień wolny'],
};

/**
 * Default timing of every occasion. Per device type (tablet / phone):
 *   on – show at all, from/to – time window (HH:MM), duration – seconds of animation once it starts (0 = whole window),
 *   repeat – hours until it starts again (0 = once a day).
 * banner – seconds the greeting stays visible (0 = no banner, -1 = as long as the animation),
 * count / opacity / speed – 0.2…1.5, extras – { part: false } switches off parts of the scene.
 */
function seOccDefaults() {
  const d = (on, from, to, duration, repeat) => ({ on, from, to, duration, repeat });
  const base = (tablet, phone, banner) => ({ on: true, tablet, phone, banner, count: 1, opacity: 1, speed: 1, extras: {} });
  return {
    birthday_home: base(d(true, '06:30', '22:00', 0, 0), d(true, '06:30', '22:00', 120, 3), 20),
    nameday: base(d(true, '06:30', '22:00', 0, 0), d(true, '06:30', '22:00', 120, 3), 20),
    custom: base(d(true, '06:30', '22:00', 0, 0), d(true, '06:30', '22:00', 120, 3), 20),
    birthday_other: base(d(true, '06:30', '10:00', 60, 0), d(true, '06:30', '22:00', 30, 0), 12),
    newyear: base(d(true, '06:30', '22:00', 300, 2), d(true, '06:30', '22:00', 60, 0), 16),
    christmas: base(d(true, '06:30', '22:00', 60, 3), d(true, '06:30', '22:00', 30, 0), 10),
    easter: base(d(true, '06:30', '22:00', 300, 2), d(true, '06:30', '22:00', 60, 0), 16),
    valentine: base(d(true, '06:30', '22:00', 300, 2), d(true, '06:30', '22:00', 60, 0), 16),
    halloween: base(d(true, '06:30', '22:00', 60, 3), d(true, '06:30', '22:00', 30, 0), 10),
    dayoff: Object.assign(base(d(true, '06:30', '08:00', 180, 0), d(false, '06:30', '10:00', 30, 0), 10),
      { chip_from: '06:30', chip_minutes: 90, weekends: false }),
  };
}
const SE_QUIET_DEFAULT = () => ({ on: true, from: '22:00', to: '06:30' });
/** When the seasonal effects run (MM-DD, no year). */
const SE_DATES_DEFAULT = (cfg) => ({
  halloween: { from: '10-25', to: '11-01' },
  christmas: { from: (cfg && /^\d{2}-\d{2}$/.test(cfg.christmas_start || '') ? cfg.christmas_start : '12-06'), to: '01-06' },
  valentine: { from: '02-14', to: '02-14' },
  newyear: { hour: 18 },
  easter: { before: 1, after: 1 },
});
/** Is MM-DD `d` inside from–to (wrapping over New Year when from > to)? */
const seInDates = (d, from, to) => (from <= to ? d >= from && d <= to : d >= from || d <= to);

/** Full settings with defaults filled in (also maps the 1.0 `effects` switches). */
function seSettings(cfg) {
  cfg = cfg || {};
  const def = seOccDefaults();
  const occ = {};
  const src = cfg.occasions || {};
  const old = cfg.effects || {};
  for (const k of SE_OCCASIONS) {
    const s = src[k] || {};
    const o = Object.assign({}, def[k], s);
    o.tablet = Object.assign({}, def[k].tablet, s.tablet || {});
    o.phone = Object.assign({}, def[k].phone, s.phone || {});
    o.extras = Object.assign({}, s.extras || {});
    const scene = SE_SCENE_OF[k];
    if (s.on === undefined && old[scene === 'dayoff' ? 'dayoff' : scene] === false) o.on = false;
    occ[k] = o;
  }
  const dd = SE_DATES_DEFAULT(cfg);
  const dates = {};
  for (const k of Object.keys(dd)) dates[k] = Object.assign({}, dd[k], (cfg.dates || {})[k] || {});
  const custom = (Array.isArray(cfg.custom_occasions) ? cfg.custom_occasions : [])
    .filter((c) => c && c.name && /^\d{2}-\d{2}$/.test(c.date || ''))
    .map((c) => ({ name: String(c.name), date: c.date, effect: SE_EFFECTS.includes(c.effect) ? c.effect : 'valentine', text: c.text ? String(c.text) : '' }));
  return {
    occasions: occ,
    dates,
    custom,
    quiet: Object.assign(SE_QUIET_DEFAULT(), cfg.quiet || {}),
    public_holidays: cfg.public_holidays || (seLangRaw(cfg) === 'pl' ? 'pl' : 'none'),
    exclude_views: Array.isArray(cfg.exclude_views) ? cfg.exclude_views : [],
  };
}

const seNorm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').trim();

/** Maps the state of the control helper (any language) to auto / off / scene key. */
function seModeFromState(state) {
  const s = seNorm(state);
  if (!s || s === 'unknown' || s === 'unavailable') return 'auto';
  if (/^(auto|automatic|automatycznie|automat)/.test(s)) return 'auto';
  if (/^(off|wylaczony|wylaczone|disabled|none|brak)/.test(s)) return 'off';
  if (s.includes('halloween')) return 'halloween';
  if (s.includes('christmas') || s.includes('swieta') || s.includes('narodzenie') || s.includes('xmas')) return 'christmas';
  if (s.includes('new year') || s.includes('sylwester') || s.includes('nowy rok')) return 'newyear';
  if (s.includes('valentine') || s.includes('walentynk')) return 'valentine';
  if (s.includes('easter') || s.includes('wielkanoc')) return 'easter';
  if (s.includes('birthday') || s.includes('urodzin') || s.includes('imienin')) return 'birthday';
  if (s.includes('day off') || s.includes('wolny') || s.includes('holiday')) return 'dayoff';
  return 'auto';
}

function seLangRaw(cfg) {
  const l = (cfg && cfg.language && cfg.language !== 'auto') ? cfg.language : (navigator.language || 'en');
  return String(l).toLowerCase().startsWith('pl') ? 'pl' : 'en';
}
function seLang(cfg, hass) {
  const l = (cfg && cfg.language && cfg.language !== 'auto') ? cfg.language : ((hass && (hass.locale && hass.locale.language || hass.language)) || navigator.language || 'en');
  return String(l).toLowerCase().startsWith('pl') ? 'pl' : 'en';
}

/** Device type for timing: 'tablet' (wall panels, kiosk apps) or 'phone' (phones and computers). Can be overridden per device. */
const SE_DEVICE_KEY = 'seasonal-effects:device';
function seDeviceAuto() { return /HAPanel|Fully|; wv\)|Silk/i.test(navigator.userAgent) ? 'tablet' : 'phone'; }
function seDevice() {
  let v = '';
  try { v = localStorage.getItem(SE_DEVICE_KEY) || ''; } catch (e) { /* storage blocked */ }
  return v === 'tablet' || v === 'phone' ? v : seDeviceAuto();
}

const seMin = (hhmm) => { const m = String(hhmm || '').match(/^(\d{1,2}):(\d{2})/); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };
/** Is the minute of day `t` inside from–to (wrapping past midnight when from > to)? */
function seInWindow(t, from, to) {
  const a = seMin(from), b = seMin(to);
  if (a === null || b === null || a === b) return true;
  return a < b ? (t >= a && t < b) : (t >= a || t < b);
}

(() => {
  if (window.seasonalEffects) return;

  const pad = (n) => String(n).padStart(2, '0');
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (t) => t[Math.floor(Math.random() * t.length)];
  const fmt = (s, o) => String(s).replace(/\{(\w)\}/g, (m, k) => (o[k] !== undefined ? o[k] : m));
  const ymd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());

  let LITE = false;
  let Q = 1;      // number of elements (device × global intensity × occasion count)
  let QBASE = 1;  // device × global intensity
  let SPEED = 1;
  let EX = {};    // switched-off extras of the running scene
  const has = (k) => EX[k] !== false;

  // ===================================================================
  // When which occasion
  // ===================================================================
  function easterDate(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
      g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }

  /** Statutory public holidays (non-working days) – Poland. Returns the holiday key or ''. */
  function publicHoliday(now, mode) {
    if (mode !== 'pl') return '';
    const d = pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    const fixed = ['01-01', '01-06', '05-01', '05-03', '08-15', '11-01', '11-11', '12-25', '12-26'];
    if (now.getFullYear() >= 2025) fixed.push('12-24');
    if (fixed.includes(d)) return d;
    const e = easterDate(now.getFullYear());
    const diff = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - e) / 86400000);
    return diff === 0 ? 'easter' : diff === 1 ? 'easter1' : diff === 49 ? 'pentecost' : diff === 60 ? 'corpus' : '';
  }

  const mmdd = (v) => {
    const s = String(v || '').trim();
    let m = s.match(/^\d{4}-(\d{2})-(\d{2})/); if (m) return m[1] + '-' + m[2];
    m = s.match(/^(\d{2})-(\d{2})$/); if (m) return s;
    m = s.match(/^(\d{1,2})\.(\d{1,2})/); if (m) return pad(m[2]) + '-' + pad(m[1]);
    return '';
  };

  const calCache = { key: '', day: '', t: 0, events: [], busy: false };
  function refreshCalendars(hass, cfg) {
    const ids = [...new Set([].concat(cfg.calendars || [], cfg.dayoff_calendars || []))].filter((e) => hass.states[e]);
    const key = ids.join(',');
    const day = ymd(new Date());
    if (!ids.length) { calCache.events = []; calCache.key = ''; return; }
    if (calCache.busy || (calCache.key === key && calCache.day === day && Date.now() - calCache.t < 30 * 60000)) return;
    calCache.busy = true;
    const d0 = new Date(); d0.setHours(0, 0, 0, 0);
    const d1 = new Date(d0); d1.setDate(d1.getDate() + 1);
    Promise.all(ids.map((id) => hass.callApi('GET', `calendars/${id}?start=${encodeURIComponent(d0.toISOString())}&end=${encodeURIComponent(d1.toISOString())}`)
      .then((r) => (r || []).map((e) => Object.assign({ _cal: id }, e))).catch(() => [])))
      .then((res) => { calCache.events = [].concat(...res); calCache.key = key; calCache.day = day; calCache.t = Date.now(); })
      .finally(() => { calCache.busy = false; setTimeout(check, 0); });
  }
  /** Does a calendar event cover today (all-day events count by date, timed ones by start date)? */
  const eventToday = (e) => {
    const s = e.start && (e.start.date || e.start.dateTime || e.start);
    const en = e.end && (e.end.date || e.end.dateTime || e.end);
    const today = ymd(new Date());
    if (!s) return true;
    const sd = String(s).slice(0, 10), ed = en ? String(en).slice(0, 10) : sd;
    if (String(s).length <= 10) return sd <= today && today < (ed > sd ? ed : sd + 'x');
    return sd === today;
  };

  /** Finds a family member in a text (name or alias, any letter case / diacritics). */
  function familyMatch(family, text) {
    const n = seNorm(text);
    for (const p of family) {
      if (!p || !p.name) continue;
      const keys = [p.name].concat(Array.isArray(p.aliases) ? p.aliases : String(p.aliases || '').split(',')).map(seNorm).filter(Boolean);
      if (keys.some((k) => n === k || new RegExp('(^|\\s)' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)').test(n))) return p.name;
    }
    return '';
  }

  /** All occasions of today: { key: { text, names } }. */
  function occasionsToday(hass, cfg, T, S) {
    const out = {};
    const add = (k, v) => { if (!out[k]) out[k] = { names: [], texts: [] }; if (v.name) out[k].names.push(v.name); if (v.text) out[k].texts.push(v.text); };
    const now = new Date();
    const today = pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    const family = Array.isArray(cfg.family) ? cfg.family : [];

    family.filter((p) => p && p.name && mmdd(p.birthday) === today).forEach((p) => add('birthday_home', { name: p.name }));

    refreshCalendars(hass, cfg);
    const dayoffCals = cfg.dayoff_calendars || [];
    for (const e of calCache.events) {
      if (!eventToday(e)) continue;
      const t = String(e.summary || '');
      if (dayoffCals.includes(e._cal)) {
        if (/wolny|wolne|ferie|przerwa|day off|holiday|vacation|break/i.test(t)) add('dayoff', { text: t });
        if (!(cfg.calendars || []).includes(e._cal)) continue;
      }
      if (/urodzin|birthday|bday/i.test(t)) {
        const who = t.replace(/\s*(urodziny|urodzin\w*|birthday|bday)\s*/i, ' ').replace(/['’]s\b/i, '').replace(/\s+/g, ' ').trim();
        const fam = familyMatch(family, who);
        if (fam) add('birthday_home', { name: fam }); else add('birthday_other', { name: who || '' });
      } else if (/rocznic|(^|\s)(ślub|slub)(u|em|y)?(\s|$)|anniversary|wedding/i.test(t)) add('valentine', { text: '💍 ' + t });
      else if (/imienin|name ?day/i.test(t)) {
        const who = t.replace(/\s*(imieniny|imienin\w*|name ?day)\s*/i, ' ').replace(/\s+/g, ' ').trim();
        const fam = familyMatch(family, who); if (fam) add('nameday', { name: fam });
      }
    }

    family.filter((p) => p && p.name && mmdd(p.nameday) === today).forEach((p) => add('nameday', { name: p.name }));
    const ent = cfg.nameday_entity && hass.states[cfg.nameday_entity];
    if (ent && ent.state && !/^(unknown|unavailable|none|brak)$/i.test(ent.state)) {
      const todayNames = ent.state.split(/[,;]\s*|\s+i\s+|\s+and\s+/).map(seNorm).filter(Boolean);
      for (const p of family) {
        if (!p || !p.name) continue;
        const keys = [p.name].concat(Array.isArray(p.aliases) ? p.aliases : String(p.aliases || '').split(',')).map(seNorm).filter(Boolean);
        if (keys.some((k) => todayNames.includes(k))) add('nameday', { name: p.name });
      }
    }

    const hol = publicHoliday(now, S.public_holidays);
    if (hol) add('dayoff', { text: (T.holidays && T.holidays[hol]) || '' });
    if (S.occasions.dayoff.weekends && (now.getDay() === 0 || now.getDay() === 6) && !out.dayoff) add('dayoff', { text: T.weekend });

    const D = S.dates;
    const nyHour = Math.min(23, Math.max(0, Number(D.newyear.hour) || 0));
    if ((today === '12-31' && now.getHours() >= nyHour) || today === '01-01') add('newyear', { text: today === '01-01' ? fmt(T.ny, { y: now.getFullYear() }) : T.nye });
    if (seInDates(today, D.halloween.from, D.halloween.to)) add('halloween', { text: today === '10-31' ? T.trick : '' });
    if (seInDates(today, D.christmas.from, D.christmas.to)) add('christmas', { text: today === '12-06' ? T.nicholas : (today >= '12-24' && today <= '12-26') ? T.xmas : '' });
    if (seInDates(today, D.valentine.from, D.valentine.to)) add('valentine', { text: today === '02-14' ? T.valentine : '' });
    const e = easterDate(now.getFullYear());
    const from = new Date(e); from.setDate(e.getDate() - Math.max(0, Number(D.easter.before) || 0)); from.setHours(0, 0, 0, 0);
    const to = new Date(e); to.setDate(e.getDate() + Math.max(0, Number(D.easter.after) || 0)); to.setHours(23, 59, 59);
    if (now >= from && now <= to) add('easter', { text: T.easter });
    for (const c of S.custom) if (c.date === today) { add('custom', { text: c.text || ('✨ ' + c.name) }); if (!out.custom.scene) out.custom.scene = c.effect; }

    // texts
    const names = (arr) => [...new Set(arr.filter(Boolean))].join(T.and);
    const many = Object.keys(out).filter((k) => k === 'birthday_home' || k === 'nameday' || k === 'birthday_other').length > 1;
    for (const k of Object.keys(out)) {
      const o = out[k];
      if (k === 'birthday_home' || k === 'birthday_other') o.text = o.names.filter(Boolean).length ? fmt(T.bday, { n: names(o.names) }) : T.bdayAny;
      else if (k === 'nameday') o.text = fmt(many ? T.namedayShort : T.nameday, { n: names(o.names) });
      else if (k === 'dayoff') { const t = [...new Set(o.texts.filter(Boolean))]; o.text = t.length ? fmt(T.dayoff, { t: t.join(' · ') }) : T.dayoffAny; }
      else o.text = [...new Set(o.texts.filter(Boolean))].join(' · ');
    }
    return out;
  }

  function fixedText(effect, T) {
    return {
      halloween: T.trick, christmas: T.xmas, newyear: fmt(T.ny, { y: new Date().getFullYear() + (new Date().getMonth() === 0 ? 0 : 1) }),
      valentine: T.valentine, easter: T.easter, birthday: T.bdayAny, dayoff: T.dayoffAny,
    }[effect] || '';
  }

  // ===================================================================
  // Timing (per device, remembered in this browser)
  // ===================================================================
  const RUN_KEY = 'seasonal-effects:run';
  let endTimer = 0;
  let run = null;
  function loadRun() {
    const day = ymd(new Date());
    if (run && run.day === day) return run;
    try { run = JSON.parse(localStorage.getItem(RUN_KEY) || 'null'); } catch (e) { run = null; }
    if (!run || run.day !== day) run = { day, occ: {} };
    return run;
  }
  function saveRun() { try { localStorage.setItem(RUN_KEY, JSON.stringify(run)); } catch (e) { /* storage blocked */ } }

  const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
  function midnightNY() {
    const d = new Date(); const m = d.getMonth(), day = d.getDate(), t = d.getHours() * 60 + d.getMinutes();
    return (m === 11 && day === 31 && t >= 23 * 60 + 45) || (m === 0 && day === 1 && t < 30);
  }

  /**
   * Is the occasion animating right now on this device? Starts (or restarts) its run when it enters its window.
   * Returns { active, started } – `started` is true on the check that started a new run (used for the banner).
   */
  function timing(key, o, S, dev, now, dry) {
    const ds = o[dev] || {};
    if (key === 'newyear' && o.extras.midnight !== false && midnightNY() && o.on !== false) return { active: true, started: false, midnight: true };
    if (o.on === false || ds.on === false) return { active: false };
    const t = nowMin();
    if (S.quiet.on && seInWindow(t, S.quiet.from, S.quiet.to)) return { active: false };
    if (!seInWindow(t, ds.from, ds.to)) return { active: false };
    const r = loadRun();
    let rec = r.occ[key];
    let started = false;
    if (dry) return { active: !rec || (Number(ds.duration) || 0) <= 0 || now - rec.start < (Number(ds.duration) || 0) * 1000 || ((Number(ds.repeat) || 0) > 0 && now - rec.start >= ds.repeat * 3600e3) };
    const rep = Number(ds.repeat) || 0;
    if (!rec || (rep > 0 && now - rec.start >= rep * 3600e3)) { rec = r.occ[key] = { start: now, banner: false }; started = true; saveRun(); }
    const dur = Number(ds.duration) || 0;
    return { active: dur <= 0 || now - rec.start < dur * 1000, started, rec, dur };
  }

  function excludedView(S) {
    const v = decodeURIComponent(location.pathname.split('/')[2] || '');
    return v && S.exclude_views.includes(v);
  }

  /** Decides the animation and the banner for now. */
  function choose(hass, cfg, dry) {
    if (!cfg || cfg.enabled === false) return null;
    const T = SE_TEXT[seLang(cfg, hass)];
    const S = seSettings(cfg);
    const ent = cfg.entity && hass.states[cfg.entity];
    const mode = ent ? seModeFromState(ent.state) : 'auto';
    if (mode === 'off') return null;
    if (mode !== 'auto') return { effect: mode, text: cfg.banner === false ? '' : fixedText(mode, T), bannerFor: 16, params: { count: 1, opacity: 1, speed: 1, extras: {} }, manual: true };
    if (excludedView(S)) return null;
    const occ = occasionsToday(hass, cfg, T, S);
    const dev = seDevice();
    const now = Date.now();
    const active = [];
    for (const k of SE_OCCASIONS) {
      if (!occ[k]) continue;
      const tm = timing(k, S.occasions[k], S, dev, now, dry);
      if (tm.active) active.push({ key: k, o: S.occasions[k], tm, text: occ[k].text });
    }
    if (!active.length) return null;
    const lead = active[0];
    // banner: shown once when a run starts, with the texts of all occasions animating now
    let text = '', bannerFor = 0;
    if (!dry && cfg.banner !== false && active.some((a) => a.tm.started || (a.tm.rec && !a.tm.rec.banner))) {
      text = [...new Set(active.map((a) => a.text).filter(Boolean))].join('   ');
      for (const a of active) {
        const b = Number(a.o.banner);
        const secs = b < 0 ? (a.tm.dur > 0 ? Math.max(1, a.tm.dur - (now - a.tm.rec.start) / 1000) : 3600 * 24) : b;
        bannerFor = Math.max(bannerFor, secs || 0);
        if (a.tm.rec) a.tm.rec.banner = true;
      }
      saveRun();
      if (!bannerFor) text = '';
    }
    // check again exactly when the shortest running animation should end
    if (!dry) {
      const left = active.map((a) => (a.tm.dur > 0 && a.tm.rec ? a.tm.dur * 1000 - (now - a.tm.rec.start) : Infinity)).reduce((x, y) => Math.min(x, y), Infinity);
      clearTimeout(endTimer);
      if (left < 15000) endTimer = setTimeout(check, Math.max(50, left + 50));
    }
    return { effect: lead.key === 'custom' ? (occ.custom.scene || 'valentine') : SE_SCENE_OF[lead.key], key: lead.key, text, bannerFor, params: { count: lead.o.count, opacity: lead.o.opacity, speed: lead.o.speed, extras: lead.o.extras }, keys: active.map((a) => a.key) };
  }

  /** Should the "day off" chip (used by dashboards) be visible now? */
  function chipVisible(cfg) {
    if (!cfg) return true;
    const o = seSettings(cfg).occasions.dayoff;
    const len = Number(o.chip_minutes);
    if (!(len > 0)) return false;
    if (len >= 1440) return true;
    const a = seMin(o.chip_from); if (a === null) return true;
    const t = nowMin();
    const b = (a + len) % 1440;
    return a < b ? (t >= a && t < b) : (t >= a || t < b);
  }

  // ===================================================================
  // Sprites (drawn once, then only copied – fast)
  // ===================================================================
  const cache = {};
  function sprite(key, w, h, draw) {
    if (cache[key]) return cache[key];
    const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h);
    draw(c.getContext('2d'), c.width, c.height);
    return (cache[key] = c);
  }
  const emoji = (ch, size, glow) => sprite('e' + ch + size + (glow || ''), size * 2, size * 2, (x, w, h) => {
    if (glow) { const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, glow); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
    x.font = size + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, w / 2, h / 2 + size * 0.06);
  });
  const glowDot = (color, r) => sprite('g' + color + r, r * 2, r * 2, (x, w) => {
    const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.18, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, w);
  });
  const flake = (r, blur) => sprite('s' + r + blur, r * 2 + 4, r * 2 + 4, (x, w) => {
    x.translate(w / 2, w / 2); x.strokeStyle = 'rgba(255,255,255,0.95)'; x.lineWidth = Math.max(1, r / 7); x.lineCap = 'round';
    if (blur) { x.filter = 'blur(' + (r / 4) + 'px)'; }
    for (let i = 0; i < 6; i++) {
      x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -r); x.moveTo(0, -r * 0.55); x.lineTo(r * 0.28, -r * 0.8); x.moveTo(0, -r * 0.55); x.lineTo(-r * 0.28, -r * 0.8);
      x.moveTo(0, -r * 0.25); x.lineTo(r * 0.18, -r * 0.42); x.moveTo(0, -r * 0.25); x.lineTo(-r * 0.18, -r * 0.42); x.stroke(); x.rotate(Math.PI / 3);
    }
  });
  const drop = (r) => sprite('k' + r, r * 2, r * 2, (x, w) => {
    const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.5, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, w);
  });
  function bat(s, frame) { // 3 wing frames
    return sprite('b' + s + frame, s * 2.4, s * 1.4, (x, w, h) => {
      x.translate(w / 2, h / 2); x.fillStyle = '#120a1c';
      const k = [-0.9, 0, 0.8][frame];
      for (const side of [1, -1]) {
        x.save(); x.scale(side, 1); x.beginPath(); x.moveTo(s * 0.12, 0);
        x.quadraticCurveTo(s * 0.5, -s * 0.55 * k - s * 0.15, s * 1.15, -s * 0.35 * k);
        x.quadraticCurveTo(s * 0.95, s * 0.05, s * 0.85, s * 0.18); x.quadraticCurveTo(s * 0.7, s * 0.05, s * 0.55, s * 0.22);
        x.quadraticCurveTo(s * 0.4, s * 0.08, s * 0.12, s * 0.2); x.fill(); x.restore();
      }
      x.beginPath(); x.ellipse(0, s * 0.05, s * 0.16, s * 0.26, 0, 0, 7); x.fill();
      x.beginPath(); x.moveTo(-s * 0.12, -s * 0.15); x.lineTo(-s * 0.08, -s * 0.34); x.lineTo(-s * 0.02, -s * 0.18); x.moveTo(s * 0.12, -s * 0.15); x.lineTo(s * 0.08, -s * 0.34); x.lineTo(s * 0.02, -s * 0.18); x.fill();
      x.fillStyle = '#ffb347'; x.beginPath(); x.arc(-s * 0.06, -s * 0.08, s * 0.035, 0, 7); x.arc(s * 0.06, -s * 0.08, s * 0.035, 0, 7); x.fill();
    });
  }
  const balloon = (col, s) => sprite('l' + col + s, s * 1.2, s * 2.6, (x, w) => {
    const cx = w / 2, cy = s * 0.75;
    const g = x.createRadialGradient(cx - s * 0.2, cy - s * 0.25, s * 0.05, cx, cy, s * 0.7); g.addColorStop(0, '#fff'); g.addColorStop(0.15, col); g.addColorStop(1, col);
    x.fillStyle = g; x.beginPath(); x.ellipse(cx, cy, s * 0.5, s * 0.62, 0, 0, 7); x.fill();
    x.beginPath(); x.moveTo(cx - s * 0.08, cy + s * 0.62); x.lineTo(cx + s * 0.08, cy + s * 0.62); x.lineTo(cx, cy + s * 0.55); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 1; x.beginPath(); x.moveTo(cx, cy + s * 0.62);
    x.bezierCurveTo(cx - s * 0.2, cy + s * 1, cx + s * 0.2, cy + s * 1.3, cx, cy + s * 1.8); x.stroke();
  });
  const heart = (col, s) => sprite('h' + col + s, s * 2, s * 2, (x, w) => {
    const g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, col.replace('1)', '.35)')); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, w);
    x.translate(w / 2, w / 2 + s * 0.1); x.fillStyle = col; x.beginPath(); const r = s * 0.5;
    x.moveTo(0, r * 0.9); x.bezierCurveTo(-r * 1.6, -r * 0.3, -r * 0.6, -r * 1.3, 0, -r * 0.45); x.bezierCurveTo(r * 0.6, -r * 1.3, r * 1.6, -r * 0.3, 0, r * 0.9); x.fill();
  });

  // ===================================================================
  // Layers (canvas + a few DOM elements animated with CSS)
  // ===================================================================
  let cv, ctx, W = 0, H = 0, raf = 0, last = 0, scene = null, current = null, layer, banner, bannerTimer = 0, reducedMotion = false;
  const CSS = `
  #se-layer{position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden}
  #se-layer *{pointer-events:none}
  .se-fog{position:absolute;left:-50%;width:200%;bottom:-8%;height:38%;opacity:.55;filter:blur(18px);
    background:radial-gradient(40% 60% at 20% 60%,rgba(190,170,255,.35),transparent 70%),radial-gradient(35% 55% at 55% 70%,rgba(160,200,255,.28),transparent 70%),radial-gradient(40% 60% at 85% 60%,rgba(200,170,255,.32),transparent 70%);
    animation:seFog 38s linear infinite}
  .se-fog.b{bottom:-14%;opacity:.4;animation-duration:55s;animation-direction:reverse}
  @keyframes seFog{from{transform:translateX(0)}to{transform:translateX(25%)}}
  .se-moon{position:absolute;right:4%;top:150px;width:96px;height:96px;border-radius:50%;opacity:.7;
    background:radial-gradient(circle at 38% 35%,#fffbe6 0%,#ffe9a8 45%,#f3c766 100%);
    box-shadow:0 0 40px 12px rgba(255,214,120,.45),0 0 120px 40px rgba(255,170,60,.22);animation:seMoon 9s ease-in-out infinite alternate}
  .se-moon:before{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 65% 60%,rgba(190,150,70,.35) 0 10%,transparent 11%),radial-gradient(circle at 40% 70%,rgba(190,150,70,.25) 0 7%,transparent 8%),radial-gradient(circle at 55% 30%,rgba(190,150,70,.25) 0 6%,transparent 7%)}
  @keyframes seMoon{from{transform:translateY(0)}to{transform:translateY(10px)}}
  .se-eyes{position:absolute;width:26px;height:8px;animation:seEyes 7s infinite}
  .se-eyes:before,.se-eyes:after{content:'';position:absolute;top:0;width:8px;height:8px;border-radius:50%;background:#ffcc33;box-shadow:0 0 10px 3px rgba(255,170,0,.8)}
  .se-eyes:before{left:0}.se-eyes:after{right:0}
  @keyframes seEyes{0%,40%,100%{opacity:0}45%,58%,62%,75%{opacity:1}60%{opacity:0}}
  .se-flash{position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,rgba(220,220,255,.85),rgba(140,120,255,.25) 60%,transparent);opacity:0}
  .se-flash.on{animation:seFlash 1.1s ease-out}
  @keyframes seFlash{0%{opacity:0}5%{opacity:.9}12%{opacity:.1}18%{opacity:.75}100%{opacity:0}}
  .se-glow{position:absolute;inset:0}
  .se-garland{position:absolute;left:0;right:0;top:56px;height:46px}
  .se-bulb{position:absolute;width:10px;height:14px;border-radius:50% 50% 45% 45%;animation:seBlink 1.6s infinite alternate}
  @keyframes seBlink{from{opacity:.35;filter:brightness(.7)}to{opacity:1;filter:brightness(1.35)}}
  .se-snowbank{position:absolute;left:0;right:0;bottom:0;height:0;transition:height 90s linear;
    background:radial-gradient(60px 30px at 10% 100%,#fff 60%,transparent 62%),radial-gradient(90px 34px at 30% 100%,#f4f8ff 60%,transparent 62%),radial-gradient(70px 28px at 52% 100%,#fff 60%,transparent 62%),radial-gradient(100px 36px at 75% 100%,#f4f8ff 60%,transparent 62%),radial-gradient(70px 30px at 95% 100%,#fff 60%,transparent 62%),linear-gradient(to top,#fff 0 35%,transparent 36%);
    filter:drop-shadow(0 -2px 6px rgba(180,220,255,.6));opacity:.92}
  .se-banner{position:fixed;left:50%;top:70px;transform:translate(-50%,-30px) scale(.9);opacity:0;z-index:4;pointer-events:none;
    padding:12px 26px;border-radius:28px;font:800 20px/1.2 Roboto,system-ui,sans-serif;color:#fff;letter-spacing:.2px;white-space:normal;text-align:center;max-width:min(94vw,900px);width:max-content;box-sizing:border-box;
    background:linear-gradient(110deg,#ff5f9e,#ffb347,#ffe066,#7cf3d4,#8ab4ff,#d68aff,#ff5f9e);background-size:300% 100%;
    box-shadow:0 12px 40px rgba(0,0,0,.45),0 0 30px rgba(255,180,90,.45);text-shadow:0 2px 6px rgba(0,0,0,.35);
    transition:opacity .7s, transform .7s cubic-bezier(.2,1.4,.4,1);animation:seRainbow 6s linear infinite}
  .se-banner.on{opacity:1;transform:translate(-50%,0) scale(1)}
  @keyframes seRainbow{to{background-position:300% 0}}
  .se-countdown{position:fixed;left:50%;top:45%;transform:translate(-50%,-50%);z-index:4;pointer-events:none;font:900 22vmin/1 Roboto,system-ui,sans-serif;
    color:#fff;text-shadow:0 0 30px rgba(255,215,100,.9),0 0 80px rgba(255,120,60,.6)}
  .se-sun{position:absolute;right:5%;top:120px;width:120px;height:120px;border-radius:50%;
    background:radial-gradient(circle at 45% 40%,#fffbe0 0%,#ffe27a 45%,#ffb43c 100%);box-shadow:0 0 60px 20px rgba(255,200,80,.45),0 0 160px 60px rgba(255,170,60,.18)}
  .se-rays{position:absolute;right:calc(5% - 90px);top:30px;width:300px;height:300px;border-radius:50%;opacity:.5;
    background:repeating-conic-gradient(from 0deg,rgba(255,225,130,.35) 0deg 6deg,transparent 6deg 22deg);
    -webkit-mask:radial-gradient(circle,transparent 0 30%,#000 32%,transparent 70%);mask:radial-gradient(circle,transparent 0 30%,#000 32%,transparent 70%);animation:seRays 60s linear infinite}
  @keyframes seRays{to{transform:rotate(360deg)}}
  @media (prefers-reduced-motion: reduce){.se-fog,.se-moon,.se-rays{animation:none}}
  `;
  function build() {
    if (cv) return;
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    layer = document.createElement('div'); layer.id = 'se-layer'; document.body.appendChild(layer);
    cv = document.createElement('canvas'); cv.id = 'se-canvas';
    cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2;';
    document.body.appendChild(cv); ctx = cv.getContext('2d');
    banner = document.createElement('div'); banner.className = 'se-banner'; document.body.appendChild(banner);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && scene) startLoop(); });
    resize();
  }
  let dpr = 1;
  function resize() {
    dpr = LITE ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (scene && scene.resize) scene.resize();
  }
  const el = (cls, css) => { const e = document.createElement('div'); e.className = cls; if (css) e.style.cssText = css; layer.appendChild(e); return e; };
  function showBanner(t, secs) {
    banner.dataset.t = t || '';
    clearTimeout(bannerTimer);
    if (!t) { banner.classList.remove('on'); return; }
    banner.textContent = t;
    requestAnimationFrame(() => banner.classList.add('on'));
    const ms = Math.min(24 * 3600, Number(secs) > 0 ? Number(secs) : 16) * 1000;
    bannerTimer = setTimeout(() => { banner.classList.remove('on'); banner.dataset.t = ''; }, ms);
  }

  // ===================================================================
  // SCENES
  // ===================================================================
  const SCENES = {};

  // ---------- HALLOWEEN ----------
  SCENES.halloween = () => {
    el('se-glow', 'background:radial-gradient(130% 70% at 50% -15%,rgba(255,110,20,.28),transparent 60%),radial-gradient(90% 60% at 100% 110%,rgba(120,30,200,.30),transparent 70%),radial-gradient(120% 100% at 50% 50%,transparent 55%,rgba(0,0,0,.45))');
    if (has('moon')) el('se-moon');
    if (has('fog')) { el('se-fog'); el('se-fog b'); }
    if (has('eyes')) for (let i = 0; i < (LITE ? 2 : 4); i++) el('se-eyes', `left:${rand(4, 90)}%;top:${rand(55, 90)}%;animation-delay:${rand(0, 7)}s;transform:scale(${rand(.7, 1.3)})`);
    const flash = el('se-flash');
    let nextFlash = performance.now() + rand(8000, 15000);
    const bats = []; const pumpkins = []; const leaves = []; const ghosts = []; let spider = null, nextSpider = performance.now() + rand(6000, 12000);
    const newBat = (start) => { const s = rand(14, 30); const dir = Math.random() < .5 ? 1 : -1; return { s, x: start ? rand(0, W) : (dir > 0 ? -60 : W + 60), y: rand(H * .08, H * .6), vx: dir * rand(1.4, 3.2) * (s / 22), phase: rand(0, 6), amp: rand(10, 40), t: 0 }; };
    if (has('bats')) for (let i = 0; i < 14 * Q; i++) bats.push(newBat(true));
    if (has('pumpkins')) for (let i = 0; i < 6 * Q; i++) pumpkins.push({ s: rand(26, 46), x: rand(0, W), y: rand(0, H), vy: rand(.15, .45), vx: rand(-.2, .2), phase: rand(0, 6), rot: rand(-.3, .3) });
    if (has('leaves')) for (let i = 0; i < 16 * Q; i++) leaves.push({ ch: pick(['🍂', '🍁', '🍂']), s: rand(16, 28), x: rand(0, W), y: rand(0, H), vy: rand(.6, 1.6), vx: rand(-.6, .6), phase: rand(0, 6), rot: rand(0, 6), vr: rand(-.03, .03) });
    if (has('ghosts')) for (let i = 0; i < 3 * Q; i++) ghosts.push({ x: rand(0, W), y: rand(H * .2, H * .8), vx: rand(-.4, .4), phase: rand(0, 6), s: rand(34, 54) });
    return {
      step(dt, t) {
        ctx.clearRect(0, 0, W, H);
        if (has('lightning') && t > nextFlash) { flash.classList.remove('on'); void flash.offsetWidth; flash.classList.add('on'); nextFlash = t + rand(14000, 30000); }
        for (const d of ghosts) {
          d.phase += 0.012 * dt; d.x += d.vx * dt; if (d.x < -80) d.x = W + 60; if (d.x > W + 80) d.x = -60;
          ctx.globalAlpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(d.phase * 0.7)); const im = emoji('👻', Math.round(d.s), 'rgba(200,220,255,.25)');
          ctx.drawImage(im, d.x - im.width / 2, d.y + Math.sin(d.phase) * 18 - im.height / 2);
        }
        for (const l of leaves) {
          l.phase += 0.02 * dt; l.rot += l.vr * dt; l.x += (l.vx + Math.sin(l.phase) * .8) * dt; l.y += l.vy * dt;
          if (l.y > H + 30) { l.y = -30; l.x = rand(0, W); }
          const im = emoji(l.ch, Math.round(l.s)); ctx.globalAlpha = .85;
          ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.rot); ctx.drawImage(im, -im.width / 2, -im.height / 2); ctx.restore();
        }
        for (const p of pumpkins) {
          p.phase += 0.015 * dt; p.y += p.vy * dt; p.x += (p.vx + Math.sin(p.phase) * .3) * dt;
          if (p.y > H + 60) { p.y = -60; p.x = rand(0, W); }
          const im = emoji('🎃', Math.round(p.s), 'rgba(255,140,0,.55)'); ctx.globalAlpha = .55 + .35 * (0.5 + 0.5 * Math.sin(p.phase * 2));
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot + Math.sin(p.phase) * .15); ctx.drawImage(im, -im.width / 2, -im.height / 2); ctx.restore();
        }
        ctx.globalAlpha = 1;
        for (let i = 0; i < bats.length; i++) {
          const b = bats[i]; b.t += dt; b.phase += 0.05 * dt; b.x += b.vx * dt;
          const y = b.y + Math.sin(b.phase * .5) * b.amp;
          const fr = Math.floor(b.t / 4) % 4; const img = bat(Math.round(b.s), [0, 1, 2, 1][fr]);
          ctx.save(); ctx.translate(b.x, y); if (b.vx < 0) ctx.scale(-1, 1); ctx.drawImage(img, -img.width / 2, -img.height / 2); ctx.restore();
          if (b.x < -80 || b.x > W + 80) bats[i] = newBat(false);
        }
        // spider on a thread
        if (has('spider') && !spider && t > nextSpider) spider = { x: rand(W * .1, W * .9), y: 0, target: rand(H * .2, H * .45), phase: 0, st: 1 };
        if (spider) {
          spider.phase += dt;
          if (spider.st === 1) { spider.y += 2.2 * dt; if (spider.y >= spider.target) { spider.st = 2; spider.wait = t + 3500; } }
          else if (spider.st === 2) { if (t > spider.wait) spider.st = 3; }
          else { spider.y -= 1.6 * dt; if (spider.y < -20) { spider = null; nextSpider = t + rand(15000, 30000); } }
          if (spider) {
            const kx = spider.x + Math.sin(spider.phase * .05) * 6;
            ctx.strokeStyle = 'rgba(230,230,255,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(spider.x, 0); ctx.lineTo(kx, spider.y); ctx.stroke();
            const im = emoji('🕷️', 30); ctx.drawImage(im, kx - im.width / 2, spider.y - 8);
          }
        }
      },
    };
  };

  // ---------- CHRISTMAS ----------
  SCENES.christmas = () => {
    el('se-glow', 'background:radial-gradient(130% 60% at 50% -15%,rgba(120,190,255,.22),transparent 60%),radial-gradient(80% 50% at 0% 110%,rgba(255,80,80,.12),transparent 70%),radial-gradient(80% 50% at 100% 110%,rgba(80,255,150,.10),transparent 70%)');
    const gar = has('garland') ? el('se-garland') : null;
    if (has('snowbank')) { const bank = el('se-snowbank'); setTimeout(() => { bank.style.height = (LITE ? 18 : 30) + 'px'; }, 50); }
    const drawGarland = () => {
      if (!gar) return;
      gar.innerHTML = '';
      const cols = ['#ff4040', '#ffd040', '#40ff80', '#40c0ff', '#ff70ff'];
      const n = Math.ceil(W / 46); const seg = W / n;
      let svg = `<svg width="${W}" height="46" style="position:absolute;left:0;top:0"><path d="`;
      for (let i = 0; i <= n; i++) svg += (i ? ` Q ${(i - .5) * seg} 30 ${i * seg} 6` : 'M 0 6');
      svg += '" stroke="rgba(40,70,40,.9)" stroke-width="2" fill="none"/></svg>';
      gar.insertAdjacentHTML('beforeend', svg);
      for (let i = 0; i < n; i++) {
        const c = cols[i % cols.length]; const x = (i + .5) * seg;
        const b = document.createElement('div'); b.className = 'se-bulb';
        b.style.cssText = `left:${x - 5}px;top:16px;background:${c};box-shadow:0 0 12px 3px ${c};animation-delay:${(i % 7) * .23}s;animation-duration:${1.1 + (i % 4) * .35}s`;
        gar.appendChild(b);
      }
    };
    drawGarland();
    const depth = [ // far (soft), middle, near
      { n: 70 * Q, r: [2, 4], v: [.3, .6], blur: false, a: .45, dot: true },
      { n: 34 * Q, r: [5, 9], v: [.6, 1.1], blur: false, a: .8 },
      { n: 10 * Q, r: [12, 18], v: [1.2, 1.9], blur: true, a: .65 },
    ];
    const p = [];
    if (has('snow')) for (const w of depth) for (let i = 0; i < w.n; i++) p.push({ w, x: rand(0, W), y: rand(0, H), r: Math.round(rand(w.r[0], w.r[1])), vy: rand(w.v[0], w.v[1]), phase: rand(0, 6), rot: rand(0, 6), vr: rand(-.01, .01) });
    let sleigh = null, nextSleigh = performance.now() + rand(5000, 9000); const sparks = [];
    let star = null, nextStar = performance.now() + rand(4000, 9000);
    return {
      resize: drawGarland,
      step(dt, t) {
        ctx.clearRect(0, 0, W, H);
        const wind = Math.sin(t / 5000) * .6;
        for (const s of p) {
          s.phase += .01 * dt; s.rot += s.vr * dt; s.y += s.vy * dt; s.x += (wind * s.vy + Math.sin(s.phase) * .3) * dt;
          if (s.y > H + 20) { s.y = -20; s.x = rand(0, W); } if (s.x > W + 20) s.x = -20; if (s.x < -20) s.x = W + 20;
          ctx.globalAlpha = s.w.a;
          const im = s.w.dot ? drop(s.r * 2) : flake(s.r, s.w.blur);
          if (s.w.dot) ctx.drawImage(im, s.x - im.width / 2, s.y - im.height / 2);
          else { ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot); ctx.drawImage(im, -im.width / 2, -im.height / 2); ctx.restore(); }
        }
        ctx.globalAlpha = 1;
        // shooting star
        if (has('star') && !star && t > nextStar) star = { x: rand(W * .1, W * .7), y: rand(40, H * .3), vx: rand(7, 11), vy: rand(2, 4), z: 1 };
        if (star) {
          star.x += star.vx * dt; star.y += star.vy * dt; star.z -= .012 * dt;
          const g = ctx.createLinearGradient(star.x, star.y, star.x - star.vx * 14, star.y - star.vy * 14);
          g.addColorStop(0, `rgba(255,255,255,${Math.max(0, star.z)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.strokeStyle = g; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(star.x, star.y); ctx.lineTo(star.x - star.vx * 14, star.y - star.vy * 14); ctx.stroke();
          ctx.drawImage(glowDot('rgba(200,230,255,.9)', 14), star.x - 14, star.y - 14);
          if (star.z <= 0 || star.x > W + 50) { star = null; nextStar = t + rand(6000, 14000); }
        }
        // Santa's sleigh
        if (has('sleigh') && !sleigh && t > nextSleigh) { const k = Math.random() < .5 ? 1 : -1; sleigh = { k, x: k > 0 ? -260 : W + 260, y0: rand(H * .12, H * .3), phase: 0 }; }
        if (sleigh) {
          sleigh.x += sleigh.k * 3.2 * dt; sleigh.phase += .03 * dt; const y = sleigh.y0 + Math.sin(sleigh.phase) * 22;
          ctx.save(); ctx.translate(sleigh.x, y); if (sleigh.k < 0) ctx.scale(-1, 1);
          ['🦌', '🦌', '🦌', '🛷'].forEach((ch, i) => { const im = emoji(ch, 34); ctx.drawImage(im, -i * 46 - im.width / 2, Math.sin(sleigh.phase + i * .6) * 4 - im.height / 2); });
          const santa = emoji('🎅', 26); ctx.drawImage(santa, -3 * 46 - santa.width / 2 + 4, -24 - santa.height / 2 + 6);
          ctx.restore();
          const tail = sleigh.x - sleigh.k * 3 * 46;
          for (let i = 0; i < 3 * Q; i++) sparks.push({ x: tail + rand(-6, 6), y: y + rand(-4, 12), vx: -sleigh.k * rand(.2, 1), vy: rand(-.3, .6), z: 1, c: pick(['rgba(255,230,120,.9)', 'rgba(255,255,255,.9)', 'rgba(150,220,255,.9)']) });
          if (sleigh.x < -400 || sleigh.x > W + 400) { sleigh = null; nextSleigh = t + rand(25000, 45000); }
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i]; s.x += s.vx * dt; s.y += s.vy * dt; s.z -= .02 * dt;
          if (s.z <= 0) { sparks.splice(i, 1); continue; }
          ctx.globalAlpha = s.z; ctx.drawImage(glowDot(s.c, 6), s.x - 6, s.y - 6);
        }
        ctx.globalAlpha = 1;
      },
    };
  };

  // ---------- NEW YEAR'S EVE (fireworks with trails) ----------
  SCENES.newyear = () => {
    el('se-glow', 'background:radial-gradient(130% 70% at 50% -10%,rgba(60,90,255,.22),transparent 60%),radial-gradient(120% 100% at 50% 50%,transparent 60%,rgba(0,0,0,.4))');
    const COLS = ['#ff5050', '#ffd24d', '#5dff9a', '#5ac8ff', '#c77dff', '#ffffff', '#ff8fd0'];
    const rockets = [], sparks = []; let next = 0;
    let countdown = null;
    const burst = (r) => {
      const type = pick(['peony', 'peony', 'willow', 'ring', 'crackle', 'heart']);
      const n = Math.round((type === 'ring' ? 60 : 90) * Q); const col = r.c; const col2 = pick(COLS);
      for (let i = 0; i < n; i++) {
        const k = (i / n) * Math.PI * 2; let v;
        if (type === 'ring') v = 3.6;
        else if (type === 'heart') {
          const sx = 16 * Math.pow(Math.sin(k), 3), sy = -(13 * Math.cos(k) - 5 * Math.cos(2 * k) - 2 * Math.cos(3 * k) - Math.cos(4 * k));
          sparks.push({ x: r.x, y: r.y, vx: sx * .24, vy: sy * .24, z: 1, c: '#ff5f9e', g: .02, drag: .985, sz: 7, crackle: false }); continue;
        } else v = rand(1.2, 5);
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(k) * v, vy: Math.sin(k) * v, z: 1, c: i % 3 === 0 ? col2 : col, g: type === 'willow' ? .045 : .03, drag: type === 'willow' ? .992 : .975, sz: type === 'willow' ? 6 : 8, crackle: type === 'crackle', willow: type === 'willow' });
      }
      sparks.push({ x: r.x, y: r.y, vx: 0, vy: 0, z: 1, c: '#ffffff', g: 0, drag: 1, sz: 60, flash: true });
    };
    return {
      step(dt, t) {
        // trails: instead of clearing, fade out the previous frame
        ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = `rgba(0,0,0,${LITE ? .35 : .22})`; ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        const now = new Date();
        const toMidnight = (new Date(now.getFullYear(), 11, 31, 23, 59, 60) - now) / 1000;
        if (has('countdown') && now.getMonth() === 11 && now.getDate() === 31 && toMidnight <= 10 && toMidnight > 0) {
          if (!countdown) { countdown = document.createElement('div'); countdown.className = 'se-countdown'; document.body.appendChild(countdown); }
          countdown.textContent = Math.ceil(toMidnight);
        } else if (countdown) {
          countdown.remove(); countdown = null;
          const T = SE_TEXT[seLang(state.cfg, getHass())]; showBanner(fmt(T.ny, { y: now.getFullYear() }), 30);
        }
        if (has('fireworks') && t > next && rockets.length < (LITE ? 2 : 5)) { rockets.push({ x: rand(W * .12, W * .88), y: H + 10, vx: rand(-.6, .6), vy: -rand(9, 13), target: rand(H * .12, H * .42), c: pick(COLS) }); next = t + rand(350, 1100) / Q; }
        for (let i = rockets.length - 1; i >= 0; i--) {
          const r = rockets[i]; r.x += r.vx * dt; r.y += r.vy * dt; r.vy += .12 * dt;
          ctx.globalAlpha = 1; ctx.drawImage(glowDot('rgba(255,200,120,.9)', 10), r.x - 10, r.y - 10);
          if (Math.random() < .6) sparks.push({ x: r.x, y: r.y + 4, vx: rand(-.3, .3), vy: rand(.5, 1.5), z: .7, c: '#ffc070', g: .02, drag: .96, sz: 4 });
          if (r.y <= r.target || r.vy >= -1) { rockets.splice(i, 1); burst(r); }
        }
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          if (s.flash) { s.z -= .12 * dt; if (s.z <= 0) { sparks.splice(i, 1); continue; } ctx.globalAlpha = s.z * .6; ctx.drawImage(glowDot('rgba(255,255,240,.6)', s.sz), s.x - s.sz, s.y - s.sz); continue; }
          s.x += s.vx * dt; s.y += s.vy * dt; s.vy += s.g * dt; s.vx *= Math.pow(s.drag, dt); s.vy *= Math.pow(s.drag, dt);
          s.z -= (s.willow ? .006 : .011) * dt;
          if (s.z <= 0) { sparks.splice(i, 1); continue; }
          let a = s.z; if (s.crackle && s.z < .5) a *= Math.random() < .5 ? 1 : .1;
          ctx.globalAlpha = a; ctx.drawImage(glowDot(s.c, s.sz), s.x - s.sz, s.y - s.sz);
        }
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      },
      stop() { if (countdown) countdown.remove(); },
    };
  };

  // ---------- VALENTINE'S DAY ----------
  SCENES.valentine = () => {
    el('se-glow', 'background:radial-gradient(120% 70% at 50% 115%,rgba(255,70,140,.28),transparent 60%),radial-gradient(80% 50% at 50% -10%,rgba(255,150,200,.15),transparent 70%)');
    const COLS = ['rgba(255,70,120,1)', 'rgba(255,120,170,1)', 'rgba(255,40,90,1)', 'rgba(255,170,200,1)'];
    const p = []; const bokeh = [];
    if (has('hearts')) for (let i = 0; i < 26 * Q; i++) p.push({ x: rand(0, W), y: rand(0, H), s: Math.round(rand(14, 34)), vy: -rand(.5, 1.3), phase: rand(0, 6), c: pick(COLS) });
    if (has('bokeh')) for (let i = 0; i < 14 * Q; i++) bokeh.push({ x: rand(0, W), y: rand(0, H), r: rand(20, 60), phase: rand(0, 6), v: rand(.002, .006) });
    return {
      step(dt) {
        ctx.clearRect(0, 0, W, H);
        for (const b of bokeh) { b.phase += b.v * dt; ctx.globalAlpha = Math.max(0, .12 + .1 * Math.sin(b.phase)); ctx.drawImage(glowDot('rgba(255,120,180,.6)', Math.round(b.r)), b.x - b.r, b.y - b.r); }
        for (const h of p) {
          h.phase += .03 * dt; h.y += h.vy * dt; h.x += Math.sin(h.phase) * .7 * dt;
          if (h.y < -40) { h.y = H + 40; h.x = rand(0, W); }
          const pulse = 1 + .12 * Math.sin(h.phase * 2.2); const im = heart(h.c, h.s);
          ctx.globalAlpha = .85; ctx.save(); ctx.translate(h.x, h.y); ctx.scale(pulse, pulse); ctx.rotate(Math.sin(h.phase) * .25); ctx.drawImage(im, -im.width / 2, -im.height / 2); ctx.restore();
        }
        ctx.globalAlpha = 1;
      },
    };
  };

  // ---------- EASTER ----------
  SCENES.easter = () => {
    el('se-glow', 'background:radial-gradient(130% 60% at 50% -15%,rgba(255,240,150,.22),transparent 60%),radial-gradient(100% 50% at 50% 115%,rgba(120,255,150,.18),transparent 70%)');
    const p = []; let bunny = null, nextBunny = performance.now() + 3000;
    if (has('flowers')) for (let i = 0; i < 22 * Q; i++) p.push({ ch: pick(['🌸', '🌼', '🌷', '🥚', '🌸', '🍃']), x: rand(0, W), y: rand(0, H), s: Math.round(rand(16, 30)), vy: rand(.4, 1.1), phase: rand(0, 6), rot: rand(0, 6), vr: rand(-.03, .03) });
    return {
      step(dt, t) {
        ctx.clearRect(0, 0, W, H);
        for (const k of p) {
          k.phase += .02 * dt; k.rot += k.vr * dt; k.y += k.vy * dt; k.x += Math.sin(k.phase) * .9 * dt;
          if (k.y > H + 30) { k.y = -30; k.x = rand(0, W); }
          if (k.y < -60) { k.y = H + 30; }
          const im = emoji(k.ch, k.s); ctx.globalAlpha = .85; ctx.save(); ctx.translate(k.x, k.y); ctx.rotate(k.rot); ctx.drawImage(im, -im.width / 2, -im.height / 2); ctx.restore();
        }
        if (has('bunny') && !bunny && t > nextBunny) bunny = { x: -60, phase: 0 };
        if (bunny) {
          bunny.x += 2.6 * dt; bunny.phase += .09 * dt; const hop = Math.abs(Math.sin(bunny.phase)) * 70;
          ctx.globalAlpha = 1; const im = emoji('🐇', 46); ctx.save(); ctx.translate(bunny.x, H - 40 - hop); ctx.scale(-1, 1); ctx.drawImage(im, -im.width / 2, -im.height / 2); ctx.restore();
          if (Math.random() < .3 && p.length < 40) p.push({ ch: '🥚', x: bunny.x, y: H - 50, s: 18, vy: -.5, phase: 0, rot: 0, vr: .05 });
          if (bunny.x > W + 80) { bunny = null; nextBunny = t + rand(15000, 30000); }
        }
        ctx.globalAlpha = 1;
      },
    };
  };

  // ---------- BIRTHDAY / NAME DAY ----------
  SCENES.birthday = () => {
    el('se-glow', 'background:radial-gradient(130% 60% at 50% -15%,rgba(255,200,80,.25),transparent 60%),radial-gradient(90% 60% at 0% 110%,rgba(255,90,170,.18),transparent 70%),radial-gradient(90% 60% at 100% 110%,rgba(90,170,255,.18),transparent 70%)');
    const COLS = ['#ff5f9e', '#ffc24b', '#7cf3d4', '#8ab4ff', '#d68aff', '#ffffff', '#ff7a59'];
    const confetti = []; const balloons = []; let nextVolley = 0;
    const volley = (side) => {
      const x0 = side < 0 ? 0 : W, y0 = H;
      for (let i = 0; i < 110 * Q; i++) {
        const ang = (side < 0 ? -Math.PI / 2 + rand(.15, .75) : -Math.PI / 2 - rand(.15, .75)); const v = rand(9, 19);
        confetti.push({ x: x0, y: y0, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, w: rand(6, 11), h: rand(10, 16), r: rand(0, 6), vr: rand(-.25, .25), c: pick(COLS), round: Math.random() < .25 });
      }
    };
    if (has('balloons')) for (let i = 0; i < 9 * Q; i++) balloons.push({ x: rand(0, W), y: rand(H * .3, H * 1.4), s: Math.round(rand(34, 56)), vy: -rand(.5, 1.1), phase: rand(0, 6), c: pick(['#ff5f9e', '#ffc24b', '#5ac8ff', '#9b6bff', '#5dff9a', '#ff7a59']) });
    return {
      step(dt, t) {
        ctx.clearRect(0, 0, W, H);
        if (has('confetti') && t > nextVolley) { volley(-1); volley(1); nextVolley = t + rand(9000, 14000); }
        for (const b of balloons) {
          b.phase += .02 * dt; b.y += b.vy * dt; b.x += Math.sin(b.phase) * .5 * dt;
          if (b.y < -b.s * 3) { b.y = H + b.s; b.x = rand(0, W); }
          const im = balloon(b.c, b.s); ctx.globalAlpha = .9; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(Math.sin(b.phase) * .08); ctx.drawImage(im, -im.width / 2, -b.s * .75); ctx.restore();
        }
        for (let i = confetti.length - 1; i >= 0; i--) {
          const k = confetti[i]; k.vy += .25 * dt; k.vx *= Math.pow(.985, dt); k.vy *= Math.pow(.985, dt);
          if (k.vy > 2.2) k.vy = 2.2; k.x += (k.vx + Math.sin(k.r) * .6) * dt; k.y += k.vy * dt; k.r += k.vr * dt;
          if (k.y > H + 30) { confetti.splice(i, 1); continue; }
          ctx.globalAlpha = .95; ctx.fillStyle = k.c; ctx.save(); ctx.translate(k.x, k.y); ctx.rotate(k.r);
          if (k.round) { ctx.beginPath(); ctx.arc(0, 0, k.w / 2, 0, 7); ctx.fill(); } else ctx.fillRect(-k.w / 2, -k.h / 2, k.w, k.h * Math.abs(Math.cos(k.r * 1.7)) + 1);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      },
    };
  };

  // ---------- DAY OFF (sun, clouds, butterflies) ----------
  SCENES.dayoff = () => {
    el('se-glow', 'background:radial-gradient(120% 70% at 85% -10%,rgba(255,210,110,.30),transparent 60%),radial-gradient(90% 50% at 10% 115%,rgba(120,220,255,.16),transparent 70%)');
    if (has('sun')) { el('se-rays'); el('se-sun'); }
    const clouds = [], flies = [];
    if (has('clouds')) for (let i = 0; i < 5 * Q; i++) clouds.push({ x: rand(-100, W), y: rand(H * .05, H * .35), s: Math.round(rand(50, 90)), vx: rand(.15, .4), a: rand(.35, .6) });
    if (has('butterflies')) for (let i = 0; i < 7 * Q; i++) flies.push({ ch: pick(['🦋', '🦋', '🌼', '🍃']), x: rand(0, W), y: rand(H * .3, H), s: Math.round(rand(18, 30)), phase: rand(0, 6), vx: rand(-.8, .8), vy: -rand(.2, .6) });
    return {
      step(dt) {
        ctx.clearRect(0, 0, W, H);
        for (const c of clouds) {
          c.x += c.vx * dt; if (c.x > W + 120) { c.x = -140; c.y = rand(H * .05, H * .35); }
          ctx.globalAlpha = c.a; const im = emoji('☁️', c.s); ctx.drawImage(im, c.x - im.width / 2, c.y - im.height / 2);
        }
        for (const f of flies) {
          f.phase += .08 * dt; f.x += (f.vx + Math.sin(f.phase * .4) * 1.2) * dt; f.y += (f.vy + Math.cos(f.phase * .5) * .6) * dt;
          if (f.y < -40) { f.y = H + 30; f.x = rand(0, W); } if (f.x < -40) f.x = W + 30; if (f.x > W + 40) f.x = -30;
          const flap = f.ch === '🦋' ? .6 + .4 * Math.abs(Math.sin(f.phase * 2)) : 1;
          const im = emoji(f.ch, f.s); ctx.globalAlpha = .9;
          ctx.save(); ctx.translate(f.x, f.y); ctx.scale(flap, 1); ctx.rotate(Math.sin(f.phase) * .2); ctx.drawImage(im, -im.width / 2, -im.height / 2); ctx.restore();
        }
        ctx.globalAlpha = 1;
      },
    };
  };

  // ===================================================================
  // Loop and switching
  // ===================================================================
  function frame(t) {
    raf = 0;
    if (!scene || document.hidden) return;
    const dt = Math.min(3, (t - last) / 16.7 || 1) * SPEED; last = t;
    try { scene.step(dt, t); } catch (e) { console.warn('seasonal-effects', e); }
    raf = requestAnimationFrame(frame);
  }
  function startLoop() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  const clamp = (v, a, b, d) => { const n = Number(v); return isFinite(n) && n > 0 ? Math.min(b, Math.max(a, n)) : d; };
  let paramsKey = '';
  function apply(choice) {
    const eff = choice ? choice.effect : null;
    const p = (choice && choice.params) || {};
    const key = JSON.stringify([eff, p.count, p.opacity, p.speed, p.extras, QBASE, LITE]);
    build();
    const changed = key !== paramsKey;
    if (changed) {
      paramsKey = key;
      if (scene && scene.stop) scene.stop();
      scene = null; layer.innerHTML = ''; ctx.clearRect(0, 0, W, H);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      current = eff;
      EX = Object.assign({}, p.extras || {});
      Q = QBASE * clamp(p.count, 0.2, 1.5, 1);
      SPEED = clamp(p.speed, 0.2, 2, 1);
      const op = clamp(p.opacity, 0.1, 1, 1);
      cv.style.opacity = op; layer.style.opacity = op;
      if (eff && SCENES[eff] && !reducedMotion) { scene = SCENES[eff](); startLoop(); }
    }
    if (!eff) { if (banner.dataset.t) showBanner(''); return; }
    if (choice.text && (!choice.manual || changed)) showBanner(choice.text, choice.bannerFor);
  }

  // ===================================================================
  // Finding the configuration (the card in the current dashboard)
  // ===================================================================
  const CARD_TYPE = 'custom:seasonal-effects-card';
  const GLOBAL_KEY = 'seasonal-effects:global';
  const state = { cfg: null, dash: undefined, dashCache: {}, pushed: {}, previewUntil: 0, preview: null };

  const getHass = () => { const ha = document.querySelector('home-assistant'); return ha && ha.hass; };

  function findCard(node) {
    if (!node || typeof node !== 'object') return null;
    if (Array.isArray(node)) { for (const n of node) { const r = findCard(n); if (r) return r; } return null; }
    if (node.type === CARD_TYPE) return node;
    for (const k of ['views', 'sections', 'cards', 'card', 'elements', 'badges']) { if (node[k]) { const r = findCard(node[k]); if (r) return r; } }
    return null;
  }

  function currentDashboard(hass) {
    const seg = decodeURIComponent((location.pathname.split('/')[1] || ''));
    const panel = hass.panels && hass.panels[seg];
    if (!panel || panel.component_name !== 'lovelace') return undefined; // not a dashboard
    return seg;
  }

  function loadDashboardConfig(hass, seg) {
    const c = state.dashCache[seg];
    if (c && (c.busy || Date.now() - c.t < 5 * 60000)) return;
    state.dashCache[seg] = Object.assign(c || { cfg: null }, { busy: true, t: Date.now() });
    hass.callWS({ type: 'lovelace/config', url_path: seg === 'lovelace' ? null : seg })
      .then((conf) => { state.dashCache[seg].cfg = findCard(conf); })
      .catch(() => { state.dashCache[seg].cfg = null; })
      .finally(() => {
        state.dashCache[seg].busy = false; state.dashCache[seg].t = Date.now();
        const cfg = state.dashCache[seg].cfg;
        try { if (cfg && cfg.all_dashboards) localStorage.setItem(GLOBAL_KEY, JSON.stringify(cfg)); else if (cfg) localStorage.removeItem(GLOBAL_KEY); } catch (e) { /* storage blocked */ }
        check();
      });
  }

  function resolveConfig(hass) {
    const seg = currentDashboard(hass);
    state.dash = seg;
    if (seg === undefined) return null;
    if (state.pushed[seg]) return state.pushed[seg];
    loadDashboardConfig(hass, seg);
    const cfg = state.dashCache[seg] && state.dashCache[seg].cfg;
    if (cfg) return cfg;
    try { const g = JSON.parse(localStorage.getItem(GLOBAL_KEY) || 'null'); if (g && g.all_dashboards) return g; } catch (e) { /* ignore */ }
    return null;
  }

  function setPerformance(cfg) {
    const ua = navigator.userAgent;
    const autoLite = /; wv\)|HAPanel|Fully|Silk|Android [4-8]\b/i.test(ua) || (navigator.deviceMemory && navigator.deviceMemory <= 2);
    const lite = cfg && cfg.lite === 'on' ? true : cfg && cfg.lite === 'off' ? false : !!autoLite;
    const intensity = Math.min(1.5, Math.max(0.2, Number(cfg && cfg.intensity) || 1));
    const q = (lite ? 0.5 : 1) * intensity;
    reducedMotion = !(cfg && cfg.reduced_motion === 'ignore') && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lite !== LITE || q !== QBASE) {
      LITE = lite; QBASE = q;
      if (cv) resize();
    }
  }

  function check() {
    try {
      const hass = getHass(); if (!hass || !hass.states) return;
      if (state.preview && Date.now() < state.previewUntil) return;
      if (state.preview) { state.preview = null; paramsKey = ''; }
      if (document.hidden) return;
      const cfg = resolveConfig(hass);
      state.cfg = cfg;
      setPerformance(cfg);
      apply(choose(hass, cfg));
    } catch (e) { console.warn('seasonal-effects', e); }
  }

  window.addEventListener('location-changed', () => setTimeout(check, 300));
  window.addEventListener('popstate', () => setTimeout(check, 300));
  setTimeout(check, 2000);
  setInterval(check, 15000);

  window.seasonalEffects = {
    version: SE_VERSION,
    /** Show an effect for a while (default 15 s), e.g. seasonalEffects.preview('christmas'). */
    preview(effect, seconds, params) {
      const hass = getHass();
      const T = SE_TEXT[seLang(state.cfg, hass)];
      let scene = effect;
      let p = params;
      if (SE_SCENE_OF[effect]) { // an occasion key: use its saved settings
        scene = SE_SCENE_OF[effect];
        if (!p) { const o = seSettings(state.cfg).occasions[effect]; p = { count: o.count, opacity: o.opacity, speed: o.speed, extras: o.extras }; }
      }
      state.preview = scene || 'off'; state.previewUntil = Date.now() + (seconds || 15) * 1000;
      build(); const prevReduced = reducedMotion; reducedMotion = false;
      paramsKey = '';
      apply(scene && SCENES[scene] ? { effect: scene, text: fixedText(scene, T), bannerFor: Math.min(10, seconds || 15), params: p || {} } : null);
      reducedMotion = prevReduced;
      setTimeout(check, (seconds || 15) * 1000 + 50);
    },
    /** Called by the card so changes made in the wizard apply immediately. */
    configure(cfg) {
      const hass = getHass(); if (!hass) return;
      const seg = currentDashboard(hass); if (seg === undefined) return;
      state.pushed[seg] = cfg; state.dashCache[seg] = { cfg, t: Date.now(), busy: false };
      check();
    },
    release() { state.pushed = {}; state.dashCache = {}; check(); },
    refresh() { state.dashCache = {}; calCache.t = 0; check(); },
    current: () => ({ effect: current, text: banner ? banner.dataset.t : '', lite: LITE, intensity: Q, dashboard: state.dash, device: seDevice() }),
    /** What would show today (no side effects). */
    choose: (cfg) => choose(getHass(), cfg, true),
    /** Today's occasions for a configuration: { key: { text } }. */
    occasions: (cfg) => { const h = getHass(); const c = cfg || state.cfg || {}; return h ? occasionsToday(h, c, SE_TEXT[seLang(c, h)], seSettings(c)) : {}; },
    /** Settings with defaults filled in. */
    settings: (cfg) => seSettings(cfg || state.cfg),
    /** Should the "day off" chip be visible now (for dashboard templates)? */
    chipVisible: () => chipVisible(state.cfg),
    device: { get: seDevice, auto: seDeviceAuto, set: (v) => { try { if (v === 'tablet' || v === 'phone') localStorage.setItem(SE_DEVICE_KEY, v); else localStorage.removeItem(SE_DEVICE_KEY); } catch (e) { /* storage blocked */ } paramsKey = ''; check(); } },
    /** Forget when effects ran today on this device (they start again). */
    resetToday() { run = { day: ymd(new Date()), occ: {} }; saveRun(); paramsKey = ''; check(); },
    effects: SE_EFFECTS.slice(),
    occasionKeys: SE_OCCASIONS.slice(),
    sceneOf: Object.assign({}, SE_SCENE_OF),
    extras: JSON.parse(JSON.stringify(SE_EXTRAS)),
  };
  console.info('%c SEASONAL-EFFECTS ' + SE_VERSION + ' ', 'color:#fff;background:linear-gradient(90deg,#ff5f9e,#ffb347);font-weight:bold;border-radius:4px');
})();
