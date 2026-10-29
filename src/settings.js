/*
 * Seasonal Effects – settings panel shown on the dashboard (option `show_settings: true`).
 * Every occasion gets its own timing for tablets and for phones, banner time, intensity and extras.
 * Changes are kept as a draft until "Save", which writes them into the dashboard configuration.
 */

const SE_SET_UI = {
  en: {
    title: 'Seasonal effects', now: 'Showing now', none: 'nothing', today: 'today',
    device: 'This device is treated as', devAuto: 'Automatic', tablet: 'Tablet', phone: 'Phone / computer',
    restart: 'Start today\'s effects again', quiet: 'Quiet hours (no effects)', from: 'From', to: 'To',
    on: 'Enabled', tabletCol: 'Tablet', phoneCol: 'Phones and computers', show: 'Show',
    duration: 'Animation', repeat: 'Repeat', banner: 'Greeting banner',
    count: 'Number of elements', opacity: 'Visibility', speed: 'Speed', extras: 'Parts of the effect',
    preview: 'Preview', chip: 'Day-off badge on the dashboard', chipFor: 'for', weekends: 'Weekends count as days off',
    whole: 'whole time', once: 'once a day', every: 'every {h} h', off: 'off', asAnim: 'as long as the animation',
    hidden: 'hidden', allDay: 'all day', min: 'min', s: 's',
    save: 'Save', cancel: 'Cancel', unsaved: 'Save the changes?', saved: 'Saved ✓', saveErr: 'Could not save: ',
    adminOnly: 'Only an administrator can save these settings.',
    hint: 'Animation starts when the time window begins (or when the dashboard is opened inside it). "Whole time" keeps it on for the whole window.',
    names: {
      birthday_home: '🎂 Family birthdays', nameday: '🎉 Family name days', birthday_other: '🎈 Other birthdays (calendar)',
      newyear: '🎆 New Year\'s Eve', christmas: '🎄 Christmas', easter: '🐣 Easter', valentine: '💘 Valentine\'s Day and anniversaries',
      halloween: '🎃 Halloween', dayoff: '🌞 Day off',
    },
    ex: {
      moon: 'Moon', fog: 'Fog', eyes: 'Eyes in the dark', lightning: 'Lightning', bats: 'Bats', pumpkins: 'Pumpkins', leaves: 'Leaves', ghosts: 'Ghosts', spider: 'Spider',
      snow: 'Snow', garland: 'Garland', snowbank: 'Snowbank', sleigh: 'Santa\'s sleigh', star: 'Shooting star',
      fireworks: 'Fireworks', countdown: 'Countdown at midnight', midnight: 'Always at midnight (23:45–0:30)',
      hearts: 'Hearts', bokeh: 'Lights', flowers: 'Flowers and eggs', bunny: 'Bunny', balloons: 'Balloons', confetti: 'Confetti',
      sun: 'Sun', clouds: 'Clouds', butterflies: 'Butterflies',
    },
  },
  pl: {
    title: 'Efekty sezonowe', now: 'Teraz', none: 'nic', today: 'dziś',
    device: 'To urządzenie traktuj jako', devAuto: 'Automatycznie', tablet: 'Tablet', phone: 'Telefon / komputer',
    restart: 'Uruchom dzisiejsze efekty od nowa', quiet: 'Cisza nocna (bez efektów)', from: 'Od', to: 'Do',
    on: 'Włączone', tabletCol: 'Tablet', phoneCol: 'Telefony i komputery', show: 'Pokazuj',
    duration: 'Animacja', repeat: 'Powtarzaj', banner: 'Baner z życzeniami',
    count: 'Liczba elementów', opacity: 'Widoczność', speed: 'Prędkość', extras: 'Elementy efektu',
    preview: 'Podgląd', chip: 'Plakietka dnia wolnego u góry', chipFor: 'przez', weekends: 'Weekendy jako dni wolne',
    whole: 'cały czas', once: 'raz dziennie', every: 'co {h} h', off: 'wyłączony', asAnim: 'tak długo jak animacja',
    hidden: 'ukryta', allDay: 'cały dzień', min: 'min', s: 's',
    save: 'Zapisz', cancel: 'Anuluj', unsaved: 'Zapisać zmiany?', saved: 'Zapisano ✓', saveErr: 'Nie udało się zapisać: ',
    adminOnly: 'Te ustawienia może zapisać tylko administrator.',
    hint: 'Animacja startuje, gdy zaczynają się godziny (albo gdy otworzysz dashboard w tych godzinach). „Cały czas” – trwa przez wszystkie te godziny.',
    names: {
      birthday_home: '🎂 Urodziny domowników', nameday: '🎉 Imieniny domowników', birthday_other: '🎈 Urodziny innych (z kalendarza)',
      newyear: '🎆 Sylwester i Nowy Rok', christmas: '🎄 Święta', easter: '🐣 Wielkanoc', valentine: '💘 Walentynki i rocznice',
      halloween: '🎃 Halloween', dayoff: '🌞 Dzień wolny',
    },
    ex: {
      moon: 'Księżyc', fog: 'Mgła', eyes: 'Oczy w ciemności', lightning: 'Błyskawice', bats: 'Nietoperze', pumpkins: 'Dynie', leaves: 'Liście', ghosts: 'Duchy', spider: 'Pająk',
      snow: 'Śnieg', garland: 'Girlanda', snowbank: 'Zaspa', sleigh: 'Sanie Mikołaja', star: 'Spadająca gwiazda',
      fireworks: 'Fajerwerki', countdown: 'Odliczanie o północy', midnight: 'Zawsze o północy (23:45–0:30)',
      hearts: 'Serduszka', bokeh: 'Światełka', flowers: 'Kwiaty i pisanki', bunny: 'Zajączek', balloons: 'Balony', confetti: 'Konfetti',
      sun: 'Słońce', clouds: 'Chmurki', butterflies: 'Motyle',
    },
  },
};

const SE_DURATIONS = [15, 30, 60, 120, 180, 300, 600, 900, 1800, 3600, 0];
const SE_REPEATS = [0, 1, 2, 3, 4, 6];
const SE_BANNERS = [0, 5, 10, 16, 20, 30, 60, 120, -1];
const SE_CHIP = [0, 30, 60, 90, 120, 180, 240, 1440];

const SE_SET_STYLE = `
  :host{display:block}
  .wrap{padding:16px;font-family:var(--paper-font-body1_-_font-family, Roboto, system-ui, sans-serif);color:var(--primary-text-color)}
  h3{margin:0 0 6px;font-size:18px;display:flex;align-items:center;gap:8px}
  .status{font-size:13px;color:var(--secondary-text-color);margin-bottom:12px;line-height:1.5}
  .row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0;font-size:14px}
  .row label{display:flex;align-items:center;gap:6px}
  select,input[type=time]{font:inherit;font-size:13.5px;padding:5px 8px;border-radius:8px;border:1px solid var(--divider-color,#555);background:var(--card-background-color,#fff);color:var(--primary-text-color)}
  input[type=range]{flex:1;min-width:120px;accent-color:var(--primary-color)}
  details{border:1px solid var(--divider-color,#444);border-radius:14px;margin:8px 0;background:rgba(127,127,127,.04);overflow:hidden}
  details[open]{background:rgba(127,127,127,.07)}
  summary{list-style:none;cursor:pointer;padding:10px 12px;display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600}
  summary::-webkit-details-marker{display:none}
  summary .nm{flex:1}
  summary .chev{transition:transform .2s;opacity:.6}
  details[open] summary .chev{transform:rotate(90deg)}
  .badge{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--primary-color);color:var(--text-primary-color,#fff)}
  .badge.off{background:var(--disabled-color,#777)}
  .body{padding:4px 12px 12px}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  @media (max-width:600px){.cols{grid-template-columns:1fr}}
  .col{border-radius:12px;padding:8px 10px;background:rgba(127,127,127,.08)}
  .col h4{margin:2px 0 6px;font-size:13px;display:flex;align-items:center;gap:6px}
  .grid2{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;align-items:center;font-size:13px}
  .col.dis .grid2{opacity:.45;pointer-events:none}
  .sl{display:grid;grid-template-columns:150px 1fr 44px;align-items:center;gap:8px;font-size:13px;margin:6px 0}
  .sl b{text-align:right;font-size:12px}
  .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
  .chip{display:flex;align-items:center;gap:4px;font-size:12.5px;padding:4px 10px;border-radius:999px;border:1px solid var(--divider-color,#555);cursor:pointer;user-select:none}
  .chip input{margin:0}
  .sub{font-size:13px;font-weight:600;margin:10px 0 2px;color:var(--secondary-text-color)}
  .hint{font-size:12px;color:var(--secondary-text-color);line-height:1.4}
  button.b{font:inherit;font-size:13.5px;font-weight:600;padding:7px 14px;border-radius:999px;border:1px solid var(--primary-color);background:transparent;color:var(--primary-color);cursor:pointer}
  button.b.fill{background:var(--primary-color);color:var(--text-primary-color,#fff)}
  .tg{position:relative;width:40px;height:22px;flex:0 0 auto}
  .tg input{opacity:0;width:0;height:0;position:absolute}
  .tg span{position:absolute;inset:0;border-radius:999px;background:var(--disabled-color,#777);transition:.2s;cursor:pointer}
  .tg span:before{content:'';position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.2s}
  .tg input:checked+span{background:var(--primary-color)}
  .tg input:checked+span:before{transform:translateX(18px)}
  .bar{position:sticky;bottom:8px;margin-top:12px;display:flex;align-items:center;gap:10px;justify-content:space-between;padding:10px 14px;border-radius:14px;
    background:var(--primary-color);color:var(--text-primary-color,#fff);box-shadow:0 6px 20px rgba(0,0,0,.35);font-weight:600}
  .bar button{border-color:var(--text-primary-color,#fff);color:var(--text-primary-color,#fff)}
  .bar button.fill{background:var(--text-primary-color,#fff);color:var(--primary-color)}
  .msg{font-size:13px;margin-top:8px}
  .msg.err{color:var(--error-color,#e33)} .msg.ok{color:var(--success-color,#4caf50)}
`;

class SeasonalEffectsSettings extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this._open = {}; this._msg = ''; }

  setConfig(cfg) {
    const json = JSON.stringify(cfg || {});
    if (this._dirty && this._base === json) return;
    this._base = json;
    this._cfg = JSON.parse(json);
    this._draft = this._fromCfg(this._cfg);
    this._dirty = false;
    this._render();
  }
  set hass(h) { const first = !this._hass; this._hass = h; if (first) this._render(); else this._status(); }

  _fromCfg(cfg) {
    const S = window.seasonalEffects ? window.seasonalEffects.settings(cfg) : { occasions: {}, quiet: {} };
    return { occasions: JSON.parse(JSON.stringify(S.occasions)), quiet: Object.assign({}, S.quiet) };
  }
  _U() { return SE_SET_UI[seLang(this._cfg, this._hass)]; }
  _isAdmin() { return !!(this._hass && this._hass.user && this._hass.user.is_admin); }

  _fmtDur(U, v) { return v === 0 ? U.whole : v < 60 ? v + ' ' + U.s : (v / 60) + ' ' + U.min; }
  _fmtRep(U, v) { return v === 0 ? U.once : U.every.replace('{h}', v); }
  _fmtBan(U, v) { return v === 0 ? U.off : v < 0 ? U.asAnim : this._fmtDur(U, v); }
  _fmtChip(U, v) { return v === 0 ? U.hidden : v >= 1440 ? U.allDay : v < 60 ? v + ' ' + U.min : (v % 60 ? (v / 60).toFixed(1).replace('.', ',') : v / 60) + ' h'; }
  _opts(list, val, fmt) {
    const l = list.includes(Number(val)) ? list : list.concat([Number(val)]).sort((a, b) => (a || 1e9) - (b || 1e9));
    return l.map((v) => `<option value="${v}" ${Number(val) === v ? 'selected' : ''}>${fmt(v)}</option>`).join('');
  }

  _status() {
    const box = this.shadowRoot && this.shadowRoot.querySelector('.status');
    if (!box || !window.seasonalEffects) return;
    const U = this._U();
    const cur = window.seasonalEffects.current();
    const today = window.seasonalEffects.occasions(this._cfg);
    const names = Object.keys(today).map((k) => (U.names[k] || k).split(' (')[0]);
    this.shadowRoot.querySelectorAll('details[data-k]').forEach((d) => {
      const k = d.dataset.k; const b = d.querySelector('summary .badge');
      if (today[k] && !b) d.querySelector('summary .nm').insertAdjacentHTML('afterend', `<span class="badge">${U.today}</span>`);
      else if (!today[k] && b) b.remove();
    });
    box.innerHTML = `${U.now}: <b>${cur.effect ? seEsc(cur.effect) : U.none}</b>${cur.text ? ' – ' + seEsc(cur.text) : ''}`
      + (names.length ? `<br>${U.today[0].toUpperCase() + U.today.slice(1)}: ${names.map(seEsc).join(', ')}` : '');
  }

  _render() {
    if (!this.shadowRoot || !this._cfg || !this._hass) return;
    const U = this._U();
    const D = this._draft;
    const SE = window.seasonalEffects;
    if (!SE) { this.shadowRoot.innerHTML = ''; return; }
    const today = SE.occasions(this._cfg);
    const dev = SE.device.get();
    let stored = ''; try { stored = localStorage.getItem('seasonal-effects:device') || ''; } catch (e) { /* ignore */ }
    const occHtml = SE.occasionKeys.map((k) => {
      const o = D.occasions[k];
      const scene = SE.sceneOf[k];
      const col = (d) => {
        const s = o[d];
        return `<div class="col ${s.on === false ? 'dis' : ''}">
          <h4><label class="tg"><input type="checkbox" data-o="${k}" data-d="${d}" data-f="on" ${s.on !== false ? 'checked' : ''}><span></span></label>${d === 'tablet' ? U.tabletCol : U.phoneCol}</h4>
          <div class="grid2">
            <span>${U.from}</span><span><input type="time" data-o="${k}" data-d="${d}" data-f="from" value="${seEsc(s.from)}"> ${U.to} <input type="time" data-o="${k}" data-d="${d}" data-f="to" value="${seEsc(s.to)}"></span>
            <span>${U.duration}</span><select data-o="${k}" data-d="${d}" data-f="duration" data-n="1">${this._opts(SE_DURATIONS, s.duration, (v) => this._fmtDur(U, v))}</select>
            <span>${U.repeat}</span><select data-o="${k}" data-d="${d}" data-f="repeat" data-n="1">${this._opts(SE_REPEATS, s.repeat, (v) => this._fmtRep(U, v))}</select>
          </div></div>`;
      };
      const slider = (f) => `<div class="sl"><span>${U[f]}</span><input type="range" min="${f === 'opacity' ? 0.1 : 0.2}" max="${f === 'speed' ? 2 : f === 'opacity' ? 1 : 1.5}" step="0.1" data-o="${k}" data-f="${f}" data-n="1" value="${Number(o[f]) || 1}"><b data-v="${k}-${f}">${Math.round((Number(o[f]) || 1) * 100)}%</b></div>`;
      const extras = (SE.extras[scene] || []).map((x) => `<label class="chip"><input type="checkbox" data-o="${k}" data-x="${x}" ${o.extras[x] !== false ? 'checked' : ''}>${seEsc(U.ex[x] || x)}</label>`).join('');
      const dayoff = k === 'dayoff' ? `<div class="sub">${U.chip}</div>
          <div class="row">${U.from} <input type="time" data-o="${k}" data-f="chip_from" value="${seEsc(o.chip_from)}"> ${U.chipFor}
          <select data-o="${k}" data-f="chip_minutes" data-n="1">${this._opts(SE_CHIP, o.chip_minutes, (v) => this._fmtChip(U, v))}</select></div>
          <div class="row"><label><input type="checkbox" data-o="${k}" data-f="weekends" data-c="1" ${o.weekends ? 'checked' : ''}>${U.weekends}</label></div>` : '';
      return `<details data-k="${k}" ${this._open[k] ? 'open' : ''}>
        <summary><span class="chev">›</span><span class="nm">${seEsc(U.names[k])}</span>${today[k] ? `<span class="badge">${U.today}</span>` : ''}
          <label class="tg" title="${U.on}"><input type="checkbox" data-o="${k}" data-f="on" data-c="1" ${o.on !== false ? 'checked' : ''}><span></span></label></summary>
        <div class="body">
          <div class="cols">${col('tablet')}${col('phone')}</div>
          <div class="row">${U.banner} <select data-o="${k}" data-f="banner" data-n="1">${this._opts(SE_BANNERS, o.banner, (v) => this._fmtBan(U, v))}</select>
            <span style="flex:1"></span><button class="b" data-p="${k}">▶ ${U.preview}</button></div>
          ${slider('count')}${slider('opacity')}${slider('speed')}
          ${extras ? `<div class="sub">${U.extras}</div><div class="chips">${extras}</div>` : ''}
          ${dayoff}
        </div></details>`;
    }).join('');

    this.shadowRoot.innerHTML = `<style>${SE_SET_STYLE}</style><ha-card><div class="wrap">
      <h3>✨ ${U.title}</h3>
      <div class="status"></div>
      <div class="row">${U.device}:
        <select data-dev="1">
          <option value="" ${!stored ? 'selected' : ''}>${U.devAuto} (${SE.device.auto() === 'tablet' ? U.tablet : U.phone})</option>
          <option value="tablet" ${stored === 'tablet' ? 'selected' : ''}>${U.tablet}</option>
          <option value="phone" ${stored === 'phone' ? 'selected' : ''}>${U.phone}</option>
        </select>
        <button class="b" data-a="restart">↻ ${U.restart}</button></div>
      <div class="row"><label class="tg"><input type="checkbox" data-q="on" ${D.quiet.on ? 'checked' : ''}><span></span></label>${U.quiet}:
        ${U.from} <input type="time" data-q="from" value="${seEsc(D.quiet.from)}"> ${U.to} <input type="time" data-q="to" value="${seEsc(D.quiet.to)}"></div>
      <div class="hint">${U.hint}</div>
      ${occHtml}
      <div class="msgbox">${this._msg}</div>
      <div class="barwrap"></div>
    </div></ha-card>`;
    void dev;
    this._bind();
    this._bar();
    this._status();
  }

  _bar() {
    const U = this._U();
    const w = this.shadowRoot.querySelector('.barwrap');
    if (!w) return;
    if (!this._dirty) { w.innerHTML = ''; return; }
    if (w.firstChild) return;
    w.innerHTML = `<div class="bar"><span>${this._isAdmin() ? U.unsaved : U.adminOnly}</span><span style="display:flex;gap:8px">
      <button class="b" data-a="cancel">${U.cancel}</button>${this._isAdmin() ? `<button class="b fill" data-a="save">${U.save}</button>` : ''}</span></div>`;
    w.querySelector('[data-a=cancel]').addEventListener('click', () => { this._draft = this._fromCfg(this._cfg); this._dirty = false; this._msg = ''; this._render(); });
    const save = w.querySelector('[data-a=save]');
    if (save) save.addEventListener('click', () => this._save());
  }

  _bind() {
    const R = this.shadowRoot;
    const D = this._draft;
    const touch = () => { if (!this._dirty) { this._dirty = true; this._msg = ''; const m = R.querySelector('.msgbox'); if (m) m.innerHTML = ''; this._bar(); } };
    R.querySelectorAll('details').forEach((d) => d.addEventListener('toggle', () => { this._open[d.dataset.k] = d.open; }));
    R.querySelectorAll('summary .tg').forEach((t) => t.addEventListener('click', (e) => e.stopPropagation()));
    R.querySelectorAll('[data-o]').forEach((inp) => {
      const ev = inp.type === 'range' ? 'input' : 'change';
      inp.addEventListener(ev, () => {
        const o = D.occasions[inp.dataset.o];
        if (inp.dataset.x) { if (inp.checked) delete o.extras[inp.dataset.x]; else o.extras[inp.dataset.x] = false; touch(); return; }
        const tgt = inp.dataset.d ? o[inp.dataset.d] : o;
        const f = inp.dataset.f;
        let v = inp.type === 'checkbox' ? inp.checked : inp.value;
        if (inp.dataset.n) v = Number(v);
        tgt[f] = v;
        if (inp.type === 'range') { const b = R.querySelector(`[data-v="${inp.dataset.o}-${f}"]`); if (b) b.textContent = Math.round(v * 100) + '%'; }
        if (f === 'on' && inp.dataset.d) { const c = inp.closest('.col'); if (c) c.classList.toggle('dis', !v); }
        touch();
      });
    });
    R.querySelectorAll('[data-q]').forEach((inp) => inp.addEventListener('change', () => { D.quiet[inp.dataset.q] = inp.type === 'checkbox' ? inp.checked : inp.value; touch(); }));
    R.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => {
      const o = D.occasions[b.dataset.p];
      window.seasonalEffects.preview(b.dataset.p, 15, { count: o.count, opacity: o.opacity, speed: o.speed, extras: o.extras });
    }));
    const dev = R.querySelector('[data-dev]');
    if (dev) dev.addEventListener('change', () => { window.seasonalEffects.device.set(dev.value); this._render(); });
    const restart = R.querySelector('[data-a=restart]');
    if (restart) restart.addEventListener('click', () => { window.seasonalEffects.resetToday(); setTimeout(() => this._status(), 500); });
  }

  /** Only what differs from the defaults is stored, so the YAML stays short. */
  _compact() {
    const def = window.seasonalEffects.settings({ language: this._cfg.language });
    const out = {};
    for (const k of Object.keys(this._draft.occasions)) {
      const o = this._draft.occasions[k], d = def.occasions[k];
      const r = {};
      for (const f of Object.keys(o)) {
        if (f === 'tablet' || f === 'phone') {
          const sd = {}; for (const g of Object.keys(o[f])) if (o[f][g] !== d[f][g]) sd[g] = o[f][g];
          if (Object.keys(sd).length) r[f] = sd;
        } else if (f === 'extras') { if (Object.keys(o.extras).length) r.extras = o.extras; } else if (o[f] !== d[f]) r[f] = o[f];
      }
      if (Object.keys(r).length) out[k] = r;
    }
    return out;
  }

  async _save() {
    const U = this._U();
    const h = this._hass;
    try {
      const seg = decodeURIComponent(location.pathname.split('/')[1] || '');
      const url = seg === 'lovelace' ? null : seg;
      const conf = await h.callWS({ type: 'lovelace/config', url_path: url });
      const node = (function find(n) {
        if (!n || typeof n !== 'object') return null;
        if (Array.isArray(n)) { for (const x of n) { const r = find(x); if (r) return r; } return null; }
        if (n.type === 'custom:seasonal-effects-card') return n;
        for (const k of ['views', 'sections', 'cards', 'card', 'elements']) if (n[k]) { const r = find(n[k]); if (r) return r; }
        return null;
      })(conf);
      if (!node) throw new Error('card not found');
      const occ = this._compact();
      if (Object.keys(occ).length) node.occasions = occ; else delete node.occasions;
      const q = this._draft.quiet, dq = SE_QUIET_DEFAULT();
      if (q.on !== dq.on || q.from !== dq.from || q.to !== dq.to) node.quiet = q; else delete node.quiet;
      await h.callWS({ type: 'lovelace/config/save', url_path: url, config: conf });
      this._cfg = JSON.parse(JSON.stringify(node));
      this._base = JSON.stringify(this._cfg);
      this._dirty = false;
      this._msg = `<div class="msg ok">${U.saved}</div>`;
      if (window.seasonalEffects) window.seasonalEffects.configure(this._cfg);
    } catch (e) {
      this._msg = `<div class="msg err">${U.saveErr}${seEsc(e && e.message)}</div>`;
    }
    this._render();
  }
}
if (!customElements.get('seasonal-effects-settings')) customElements.define('seasonal-effects-settings', SeasonalEffectsSettings);
