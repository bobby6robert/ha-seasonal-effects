/*
 * Seasonal Effects – configuration card + setup wizard (card editor).
 * The card is invisible on the dashboard (it only shows a small status box in edit mode);
 * its configuration is read by the overlay engine for the whole dashboard.
 */

const SE_UI = {
  en: {
    title: 'Seasonal effects',
    hidden: 'This card is invisible on the dashboard – it only stores the settings. Effects work on every view of this dashboard.',
    now: 'Showing now', none: 'nothing (no occasion today)', mode: 'Mode', auto: 'automatic',
    preview: 'Preview', setup: 'Edit this card to open the setup wizard.',
    steps: ['Welcome', 'Control', 'Family', 'Calendars', 'Effects', 'Done'],
    next: 'Next', back: 'Back',
    welcomeTitle: 'Welcome! 👋',
    welcomeText: 'This wizard sets up animated seasonal effects for this dashboard: Halloween, Christmas, New Year\'s Eve, Valentine\'s Day, Easter, plus birthdays and name days of your family. Nothing leaves your Home Assistant.',
    language: 'Language of greetings and of this wizard', langAuto: 'Same as Home Assistant',
    controlTitle: 'How do you want to control the effects?',
    controlText: 'A dropdown helper lets you switch effects from any dashboard or automation (Auto / Off / a specific effect). It is optional.',
    ctlCreate: 'Create a new helper for me', ctlExisting: 'Use an existing dropdown helper (input_select)', ctlNone: 'No helper – always automatic',
    createBtn: 'Create helper', created: 'Helper created:', createFail: 'Could not create the helper (administrator rights are needed). You can choose an existing one instead.',
    pickHelper: 'Dropdown helper',
    familyTitle: 'Your family',
    familyText: 'Add the people whose birthdays and name days should be celebrated. On their day a greeting with their name appears together with balloons and confetti. Leave the list empty if you do not want this.',
    name: 'Name', birthday: 'Birthday', nameday: 'Name day', aliases: 'Other forms of the name (optional, comma-separated)',
    yearIgnored: 'The year is ignored.', add: 'Add person', remove: 'Remove',
    calTitle: 'Calendars and name days (optional)',
    calText: 'Effects can also react to events in your calendars: an event whose title contains “birthday” (or “urodziny”) starts the birthday effect, “anniversary”/“wedding” (or “rocznica”/“ślub”) starts hearts.',
    noCalendars: 'No calendars found in Home Assistant.',
    namedaySensor: 'Name day sensor (optional)',
    namedayText: 'A sensor whose state lists today\'s name days (e.g. “Anna, Joachim”). Names are matched with your family list (including other forms of names).',
    effTitle: 'Which effects and how strong?',
    effNames: { halloween: '🎃 Halloween (25 Oct – 1 Nov)', christmas: '🎄 Christmas (snow, garland, Santa\'s sleigh)', newyear: '🎆 New Year\'s Eve (31 Dec from 18:00, 1 Jan)', valentine: '💘 Valentine\'s Day (14 Feb)', easter: '🐣 Easter (Saturday – Monday)', birthday: '🎂 Family birthdays, name days and anniversaries' },
    xmasStart: 'Christmas effect starts on',
    intensity: 'Number of animated elements', lite: 'Light mode (for tablets and slow devices)',
    liteAuto: 'Automatic', liteOn: 'Always on', liteOff: 'Off',
    banner: 'Show a greeting banner at the top', allDash: 'Also use these settings on dashboards without this card',
    reduced: 'Respect the “reduce motion” setting of the device',
    doneTitle: 'All set! 🎉',
    doneText: 'Click SAVE in this dialog. You can come back to this wizard at any time by editing the card.',
    today: 'Today the dashboard will show', previewText: 'Try the effects (15 s):',
    summary: 'Summary', people: 'people', control: 'control', calendars: 'calendars', effectsOn: 'effects',
    off: 'off',
  },
  pl: {
    title: 'Efekty sezonowe',
    hidden: 'Ta karta jest niewidoczna na dashboardzie – przechowuje tylko ustawienia. Efekty działają na wszystkich widokach tego dashboardu.',
    now: 'Teraz', none: 'nic (dziś brak okazji)', mode: 'Tryb', auto: 'automatycznie',
    preview: 'Podgląd', setup: 'Edytuj tę kartę, aby otworzyć kreator.',
    steps: ['Start', 'Sterowanie', 'Rodzina', 'Kalendarze', 'Efekty', 'Gotowe'],
    next: 'Dalej', back: 'Wstecz',
    welcomeTitle: 'Witaj! 👋',
    welcomeText: 'Ten kreator ustawi animowane efekty sezonowe na tym dashboardzie: Halloween, Święta, Sylwester, Walentynki, Wielkanoc oraz urodziny i imieniny Twojej rodziny. Żadne dane nie opuszczają Twojego Home Assistanta.',
    language: 'Język życzeń i kreatora', langAuto: 'Taki jak w Home Assistant',
    controlTitle: 'Jak chcesz sterować efektami?',
    controlText: 'Pomocnik z listą wyboru pozwala przełączać efekty z dowolnego dashboardu lub automatyzacji (Automatycznie / Wyłączony / konkretny efekt). Jest opcjonalny.',
    ctlCreate: 'Utwórz dla mnie nowego pomocnika', ctlExisting: 'Użyj istniejącego pomocnika z listą wyboru (input_select)', ctlNone: 'Bez pomocnika – zawsze automatycznie',
    createBtn: 'Utwórz pomocnika', created: 'Utworzono pomocnika:', createFail: 'Nie udało się utworzyć pomocnika (potrzebne uprawnienia administratora). Możesz wybrać istniejącego.',
    pickHelper: 'Pomocnik z listą wyboru',
    familyTitle: 'Twoja rodzina',
    familyText: 'Dodaj osoby, których urodziny i imieniny mają być świętowane. W ich dniu pojawią się życzenia z imieniem, balony i konfetti. Zostaw listę pustą, jeśli tego nie chcesz.',
    name: 'Imię', birthday: 'Urodziny', nameday: 'Imieniny', aliases: 'Inne formy imienia (opcjonalnie, po przecinku)',
    yearIgnored: 'Rok nie ma znaczenia.', add: 'Dodaj osobę', remove: 'Usuń',
    calTitle: 'Kalendarze i imieniny (opcjonalnie)',
    calText: 'Efekty mogą też reagować na wydarzenia w kalendarzach: wydarzenie z „urodziny” (lub „birthday”) w tytule włącza efekt urodzinowy, a „rocznica”/„ślub” (lub „anniversary”/„wedding”) – serduszka.',
    noCalendars: 'Nie znaleziono kalendarzy w Home Assistant.',
    namedaySensor: 'Czujnik imienin (opcjonalnie)',
    namedayText: 'Czujnik, którego stan to dzisiejsze imieniny (np. „Anny, Joachima”). Imiona są porównywane z listą rodziny (także z innymi formami imion).',
    effTitle: 'Które efekty i jak intensywne?',
    effNames: { halloween: '🎃 Halloween (25.10–1.11)', christmas: '🎄 Święta (śnieg, girlanda, sanie Mikołaja)', newyear: '🎆 Sylwester (31.12 od 18:00, 1.01)', valentine: '💘 Walentynki (14.02)', easter: '🐣 Wielkanoc (sobota–poniedziałek)', birthday: '🎂 Urodziny, imieniny i rocznice w rodzinie' },
    xmasStart: 'Efekt świąteczny od',
    intensity: 'Liczba animowanych elementów', lite: 'Tryb lekki (dla tabletów i słabszych urządzeń)',
    liteAuto: 'Automatycznie', liteOn: 'Zawsze włączony', liteOff: 'Wyłączony',
    banner: 'Pokazuj baner z życzeniami u góry', allDash: 'Używaj tych ustawień także na dashboardach bez tej karty',
    reduced: 'Szanuj ustawienie urządzenia „ogranicz ruch”',
    doneTitle: 'Gotowe! 🎉',
    doneText: 'Kliknij ZAPISZ w tym oknie. Do kreatora możesz wrócić w każdej chwili, edytując kartę.',
    today: 'Dziś dashboard pokaże', previewText: 'Wypróbuj efekty (15 s):',
    summary: 'Podsumowanie', people: 'osoby', control: 'sterowanie', calendars: 'kalendarze', effectsOn: 'efekty',
    off: 'wyłączone',
  },
};

const SE_DEFAULTS = () => ({
  language: 'auto',
  family: [],
  calendars: [],
  effects: { halloween: true, christmas: true, newyear: true, valentine: true, easter: true, birthday: true },
  christmas_start: '12-06',
  intensity: 1,
  lite: 'auto',
  banner: true,
  all_dashboards: false,
  reduced_motion: 'respect',
});

const seEsc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const seUi = (cfg, hass) => SE_UI[seLang(cfg, hass)];
const seEffectLabel = (U, e) => (U.effNames[e] || e).split(' (')[0];

const SE_STYLE = `
  :host{display:block}
  .wrap{font-family:var(--paper-font-body1_-_font-family, Roboto, system-ui, sans-serif);color:var(--primary-text-color)}
  .steps{display:flex;gap:4px;margin-bottom:16px;flex-wrap:wrap}
  .step{flex:1;min-width:60px;text-align:center;font-size:11.5px;padding:6px 2px;border-radius:8px;background:var(--secondary-background-color);color:var(--secondary-text-color);cursor:pointer;border:none;font-family:inherit}
  .step.on{background:var(--primary-color);color:var(--text-primary-color, #fff);font-weight:700}
  .step.done{color:var(--primary-color)}
  h3{margin:4px 0 8px;font-size:18px}
  p.t{margin:0 0 14px;color:var(--secondary-text-color);line-height:1.45;font-size:14px}
  label.row{display:flex;align-items:center;gap:10px;padding:8px 0;font-size:14px;cursor:pointer}
  .field{display:flex;flex-direction:column;gap:4px;margin:10px 0;font-size:13px;color:var(--secondary-text-color)}
  input[type=text],input[type=date],select{font:inherit;font-size:14px;padding:8px 10px;border-radius:8px;border:1px solid var(--divider-color, #ccc);background:var(--card-background-color, #fff);color:var(--primary-text-color);box-sizing:border-box;width:100%}
  input[type=range]{width:100%}
  .person{border:1px solid var(--divider-color, #ddd);border-radius:12px;padding:10px 12px;margin:10px 0;display:grid;grid-template-columns:1fr 1fr;gap:6px 12px}
  .person .full{grid-column:1 / -1}
  .person .head{display:flex;justify-content:space-between;align-items:center}
  button.b{font:inherit;font-size:14px;font-weight:600;padding:8px 16px;border-radius:999px;border:1px solid var(--primary-color);background:transparent;color:var(--primary-color);cursor:pointer}
  button.b.fill{background:var(--primary-color);color:var(--text-primary-color, #fff)}
  button.b.small{padding:4px 10px;font-size:12.5px}
  button.x{border:none;background:none;color:var(--error-color, #c00);cursor:pointer;font-size:13px}
  .nav{display:flex;justify-content:space-between;margin-top:20px}
  .msg{font-size:13px;margin-top:6px}
  .msg.ok{color:var(--success-color, #2e7d32)} .msg.err{color:var(--error-color, #c00)}
  .hint{font-size:12px;color:var(--secondary-text-color)}
  .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
  .box{background:var(--secondary-background-color);border-radius:12px;padding:12px 14px;margin:12px 0;font-size:14px;line-height:1.6}
  ul{margin:6px 0;padding-left:20px}
`;

class SeasonalEffectsCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  setConfig(config) { this._config = Object.assign(SE_DEFAULTS(), config || {}); this._render(); }
  set hass(h) { const first = !this._hass; this._hass = h; if (first) this._render(); }
  set editMode(v) { this._edit = v; this._render(); }
  get editMode() { return this._edit; }
  set preview(v) { this._preview = v; this._render(); }
  get preview() { return this._preview; }
  connectedCallback() { this._timer = setInterval(() => this._visible() && this._render(), 5000); this._render(); }
  disconnectedCallback() { clearInterval(this._timer); }
  _visible() {
    const editing = this._edit || this._preview || /[?&]edit=1/.test(location.search);
    return !!(editing || (this._config && this._config.show_status));
  }
  getCardSize() { return this._visible() ? 3 : 0; }
  getGridOptions() { return { columns: 12, min_columns: 6 }; }
  static getConfigElement() { return document.createElement('seasonal-effects-wizard'); }
  static getStubConfig() { return SE_DEFAULTS(); }
  _render() {
    if (!this.shadowRoot) return;
    const vis = this._visible();
    this.style.display = vis ? 'block' : 'none';
    if (!vis) { this.shadowRoot.innerHTML = ''; return; }
    const U = seUi(this._config, this._hass);
    const cur = (window.seasonalEffects && window.seasonalEffects.current()) || {};
    const ent = this._config.entity && this._hass && this._hass.states[this._config.entity];
    this.shadowRoot.innerHTML = `<style>${SE_STYLE}</style>
      <ha-card><div class="wrap" style="padding:16px">
        <h3>✨ ${U.title}</h3>
        <p class="t">${U.hidden}</p>
        <div class="box">${U.now}: <b>${cur.effect ? seEsc(seEffectLabel(U, cur.effect)) : U.none}</b>${cur.text ? ' – ' + seEsc(cur.text) : ''}<br>
        ${U.mode}: <b>${ent ? seEsc(ent.state) : U.auto}</b></div>
        <div class="hint">${U.previewText}</div>
        <div class="chips">${SE_EFFECTS.map((e) => `<button class="b small" data-p="${e}">${seEsc(seEffectLabel(U, e))}</button>`).join('')}</div>
        <p class="hint" style="margin-top:12px">${U.setup}</p>
      </div></ha-card>`;
    this.shadowRoot.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => window.seasonalEffects && window.seasonalEffects.preview(b.dataset.p, 15)));
  }
}

class SeasonalEffectsWizard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this._step = 0; this._ctl = null; this._msg = ''; }
  setConfig(config) {
    if (this._lastJson && JSON.stringify(config || {}) === this._lastJson) return; // our own change coming back
    this._config = Object.assign(SE_DEFAULTS(), JSON.parse(JSON.stringify(config || {})));
    this._config.effects = Object.assign(SE_DEFAULTS().effects, this._config.effects || {});
    if (this._ctl === null) this._ctl = this._config.entity ? 'existing' : 'none';
    this._render();
  }
  set hass(h) { const first = !this._hass; this._hass = h; if (first) this._render(); }
  connectedCallback() { this._render(); }
  disconnectedCallback() { if (window.seasonalEffects) window.seasonalEffects.release(); }

  _emit() {
    const c = JSON.parse(JSON.stringify(this._config));
    c.type = c.type || 'custom:seasonal-effects-card';
    if (!c.entity) delete c.entity;
    if (!c.nameday_entity) delete c.nameday_entity;
    c.family = (c.family || []).filter((p) => p && String(p.name || '').trim());
    this._lastJson = JSON.stringify(c);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: c }, bubbles: true, composed: true }));
    if (window.seasonalEffects) window.seasonalEffects.configure(c);
  }

  _entities(domain) {
    if (!this._hass) return [];
    return Object.keys(this._hass.states).filter((e) => e.startsWith(domain + '.')).sort()
      .map((e) => ({ id: e, name: (this._hass.states[e].attributes.friendly_name || e) }));
  }

  _render() {
    if (!this.shadowRoot || !this._config) return;
    const U = seUi(this._config, this._hass);
    const c = this._config;
    const s = this._step;
    let body = '';
    if (s === 0) {
      body = `<h3>${U.welcomeTitle}</h3><p class="t">${U.welcomeText}</p>
        <div class="field">${U.language}
          <select data-k="language">
            <option value="auto" ${c.language === 'auto' ? 'selected' : ''}>${U.langAuto}</option>
            <option value="en" ${c.language === 'en' ? 'selected' : ''}>English</option>
            <option value="pl" ${c.language === 'pl' ? 'selected' : ''}>Polski</option>
          </select></div>`;
    } else if (s === 1) {
      const sel = this._entities('input_select');
      body = `<h3>${U.controlTitle}</h3><p class="t">${U.controlText}</p>
        <label class="row"><input type="radio" name="ctl" value="create" ${this._ctl === 'create' ? 'checked' : ''}>${U.ctlCreate}</label>
        ${this._ctl === 'create' ? `<div style="padding-left:30px"><button class="b fill" data-a="create">${U.createBtn}</button>${this._msg}</div>` : ''}
        <label class="row"><input type="radio" name="ctl" value="existing" ${this._ctl === 'existing' ? 'checked' : ''}>${U.ctlExisting}</label>
        ${this._ctl === 'existing' ? `<div class="field" style="padding-left:30px">${U.pickHelper}
          <select data-k="entity"><option value="">—</option>${sel.map((e) => `<option value="${e.id}" ${c.entity === e.id ? 'selected' : ''}>${seEsc(e.name)} (${e.id})</option>`).join('')}</select></div>` : ''}
        <label class="row"><input type="radio" name="ctl" value="none" ${this._ctl === 'none' ? 'checked' : ''}>${U.ctlNone}</label>`;
    } else if (s === 2) {
      const toDate = (v) => { const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})$/); if (m) return v; const n = String(v || '').match(/^(\d{2})-(\d{2})$/); return n ? `2000-${n[1]}-${n[2]}` : ''; };
      body = `<h3>${U.familyTitle}</h3><p class="t">${U.familyText}</p>
        ${(c.family || []).map((p, i) => `<div class="person">
          <div class="full head"><b>${seEsc(p.name || '…')}</b><button class="x" data-rm="${i}">✕ ${U.remove}</button></div>
          <div class="field full">${U.name}<input type="text" data-f="${i}" data-n="name" value="${seEsc(p.name)}"></div>
          <div class="field">${U.birthday}<input type="date" data-f="${i}" data-n="birthday" value="${toDate(p.birthday)}"></div>
          <div class="field">${U.nameday}<input type="date" data-f="${i}" data-n="nameday" value="${toDate(p.nameday)}"><span class="hint">${U.yearIgnored}</span></div>
          <div class="field full">${U.aliases}<input type="text" data-f="${i}" data-n="aliases" value="${seEsc(Array.isArray(p.aliases) ? p.aliases.join(', ') : (p.aliases || ''))}"></div>
        </div>`).join('')}
        <button class="b" data-a="add">＋ ${U.add}</button>`;
    } else if (s === 3) {
      const cals = this._entities('calendar');
      const sensors = this._entities('sensor');
      body = `<h3>${U.calTitle}</h3><p class="t">${U.calText}</p>
        ${cals.length ? cals.map((e) => `<label class="row"><input type="checkbox" data-cal="${e.id}" ${(c.calendars || []).includes(e.id) ? 'checked' : ''}>${seEsc(e.name)} <span class="hint">${e.id}</span></label>`).join('') : `<p class="hint">${U.noCalendars}</p>`}
        <div class="field" style="margin-top:18px">${U.namedaySensor}
          <input type="text" list="se-sensors" data-k="nameday_entity" value="${seEsc(c.nameday_entity || '')}" placeholder="sensor.…">
          <datalist id="se-sensors">${sensors.map((e) => `<option value="${e.id}">${seEsc(e.name)}</option>`).join('')}</datalist>
          <span class="hint">${U.namedayText}</span></div>`;
    } else if (s === 4) {
      const starts = ['11-15', '12-01', '12-06', '12-15', '12-20', '12-24'];
      body = `<h3>${U.effTitle}</h3>
        ${SE_EFFECTS.map((e) => `<label class="row"><input type="checkbox" data-eff="${e}" ${c.effects[e] !== false ? 'checked' : ''}>${U.effNames[e]}</label>`).join('')}
        <div class="field">${U.xmasStart}<select data-k="christmas_start">${starts.map((v) => `<option value="${v}" ${c.christmas_start === v ? 'selected' : ''}>${v.split('-').reverse().join('.')}</option>`).join('')}</select></div>
        <div class="field">${U.intensity}: <b data-iv>${Math.round((Number(c.intensity) || 1) * 100)}%</b><input type="range" min="0.3" max="1.5" step="0.1" data-k="intensity" value="${Number(c.intensity) || 1}"></div>
        <div class="field">${U.lite}<select data-k="lite">
          <option value="auto" ${c.lite === 'auto' ? 'selected' : ''}>${U.liteAuto}</option>
          <option value="on" ${c.lite === 'on' ? 'selected' : ''}>${U.liteOn}</option>
          <option value="off" ${c.lite === 'off' ? 'selected' : ''}>${U.liteOff}</option></select></div>
        <label class="row"><input type="checkbox" data-b="banner" ${c.banner !== false ? 'checked' : ''}>${U.banner}</label>
        <label class="row"><input type="checkbox" data-b="reduced" ${c.reduced_motion !== 'ignore' ? 'checked' : ''}>${U.reduced}</label>
        <label class="row"><input type="checkbox" data-b="all_dashboards" ${c.all_dashboards ? 'checked' : ''}>${U.allDash}</label>`;
    } else {
      const ch = window.seasonalEffects && window.seasonalEffects.choose(this._emitted());
      const on = SE_EFFECTS.filter((e) => c.effects[e] !== false);
      const fam = (c.family || []).filter((p) => p.name);
      body = `<h3>${U.doneTitle}</h3><p class="t">${U.doneText}</p>
        <div class="box"><b>${U.summary}</b><ul>
          <li>${U.control}: ${c.entity ? seEsc(c.entity) : U.auto}</li>
          <li>${U.people}: ${fam.length ? fam.map((p) => seEsc(p.name)).join(', ') : '—'}</li>
          <li>${U.calendars}: ${(c.calendars || []).length ? c.calendars.map(seEsc).join(', ') : '—'}${c.nameday_entity ? ' · ' + seEsc(c.nameday_entity) : ''}</li>
          <li>${U.effectsOn}: ${on.length ? on.map((e) => seEsc(seEffectLabel(U, e))).join(', ') : U.off}</li>
        </ul>
        ${U.today}: <b>${ch ? seEsc(seEffectLabel(U, ch.effect)) + (ch.text ? ' – ' + seEsc(ch.text) : '') : U.none}</b></div>
        <div class="hint">${U.previewText}</div>
        <div class="chips">${SE_EFFECTS.map((e) => `<button class="b small" data-p="${e}">${seEsc(seEffectLabel(U, e))}</button>`).join('')}</div>`;
    }
    this.shadowRoot.innerHTML = `<style>${SE_STYLE}</style><div class="wrap">
      <div class="steps">${U.steps.map((t, i) => `<button class="step ${i === s ? 'on' : i < s ? 'done' : ''}" data-go="${i}">${i + 1}. ${t}</button>`).join('')}</div>
      ${body}
      <div class="nav">
        ${s > 0 ? `<button class="b" data-go="${s - 1}">‹ ${U.back}</button>` : '<span></span>'}
        ${s < 5 ? `<button class="b fill" data-go="${s + 1}">${U.next} ›</button>` : '<span></span>'}
      </div></div>`;
    this._bind();
  }

  _emitted() {
    const c = JSON.parse(JSON.stringify(this._config));
    c.family = (c.family || []).filter((p) => p && p.name);
    return c;
  }

  _bind() {
    const R = this.shadowRoot;
    const c = this._config;
    R.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { this._step = Number(b.dataset.go); this._msg = ''; this._render(); }));
    R.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => window.seasonalEffects && window.seasonalEffects.preview(b.dataset.p, 15)));
    R.querySelectorAll('[data-k]').forEach((inp) => inp.addEventListener(inp.type === 'range' ? 'input' : 'change', () => {
      const k = inp.dataset.k;
      c[k] = k === 'intensity' ? Number(inp.value) : inp.value.trim();
      if (k === 'intensity') { const iv = R.querySelector('[data-iv]'); if (iv) iv.textContent = Math.round(c.intensity * 100) + '%'; }
      this._emit();
      if (k === 'language') this._render();
    }));
    R.querySelectorAll('input[name=ctl]').forEach((r) => r.addEventListener('change', () => {
      this._ctl = r.value; this._msg = '';
      if (r.value === 'none') { delete c.entity; this._emit(); }
      this._render();
    }));
    const create = R.querySelector('[data-a=create]');
    if (create) create.addEventListener('click', async () => {
      const U = seUi(c, this._hass);
      const lang = seLang(c, this._hass);
      try {
        const res = await this._hass.callWS({ type: 'input_select/create', name: lang === 'pl' ? 'Efekty sezonowe' : 'Seasonal effects', icon: 'mdi:party-popper', options: SE_HELPER_OPTIONS[lang] });
        c.entity = 'input_select.' + res.id;
        this._msg = `<div class="msg ok">${U.created} ${seEsc(c.entity)}</div>`;
        this._ctl = 'existing';
        this._emit();
      } catch (e) {
        this._msg = `<div class="msg err">${U.createFail}<br><span class="hint">${seEsc(e && e.message)}</span></div>`;
      }
      this._render();
    });
    const add = R.querySelector('[data-a=add]');
    if (add) add.addEventListener('click', () => { c.family = (c.family || []).concat([{ name: '' }]); this._render(); const ins = R.querySelectorAll('[data-n=name]'); if (ins.length) ins[ins.length - 1].focus(); });
    R.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', () => { c.family.splice(Number(b.dataset.rm), 1); this._emit(); this._render(); }));
    R.querySelectorAll('[data-f]').forEach((inp) => inp.addEventListener('change', () => {
      const p = c.family[Number(inp.dataset.f)]; const n = inp.dataset.n; let v = inp.value.trim();
      if (n === 'nameday' && v) v = v.slice(5); // MM-DD
      if (n === 'aliases') v = v.split(',').map((x) => x.trim()).filter(Boolean);
      if (v === '' || (Array.isArray(v) && !v.length)) delete p[n]; else p[n] = v;
      this._emit();
      if (n === 'name') { const h = inp.closest('.person').querySelector('.head b'); if (h) h.textContent = v || '…'; }
    }));
    R.querySelectorAll('[data-cal]').forEach((cb) => cb.addEventListener('change', () => {
      const set = new Set(c.calendars || []); if (cb.checked) set.add(cb.dataset.cal); else set.delete(cb.dataset.cal);
      c.calendars = [...set]; this._emit();
    }));
    R.querySelectorAll('[data-eff]').forEach((cb) => cb.addEventListener('change', () => { c.effects[cb.dataset.eff] = cb.checked; this._emit(); }));
    R.querySelectorAll('[data-b]').forEach((cb) => cb.addEventListener('change', () => {
      const k = cb.dataset.b;
      if (k === 'reduced') c.reduced_motion = cb.checked ? 'respect' : 'ignore'; else c[k] = cb.checked;
      this._emit();
    }));
  }
}

if (!customElements.get('seasonal-effects-card')) customElements.define('seasonal-effects-card', SeasonalEffectsCard);
if (!customElements.get('seasonal-effects-wizard')) customElements.define('seasonal-effects-wizard', SeasonalEffectsWizard);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'seasonal-effects-card')) {
  window.customCards.push({
    type: 'seasonal-effects-card',
    name: 'Seasonal Effects',
    description: 'Animated seasonal effects (Halloween, Christmas, New Year, Valentine\'s Day, Easter, family birthdays) with a setup wizard.',
    preview: false,
    documentationURL: 'https://github.com/bobby6robert/ha-seasonal-effects',
  });
}
