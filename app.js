/* ═══════════════════════════════════════════════════
   UNLIMITED FREE DATA — app.js
   No ads · No Telegram popup · No tracking
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── SERVERS DATA ──────────────────────────────────── */
const SERVERS = [
  { id:1,  country:'United States', city:'New York',      cc:'us', ping:28,  type:'free',    tags:['free','fast'] },
  { id:2,  country:'United States', city:'Los Angeles',   cc:'us', ping:32,  type:'free',    tags:['free','fast'] },
  { id:3,  country:'United Kingdom',city:'London',        cc:'gb', ping:42,  type:'free',    tags:['free'] },
  { id:4,  country:'Germany',       city:'Frankfurt',     cc:'de', ping:38,  type:'free',    tags:['free','fast'] },
  { id:5,  country:'Japan',         city:'Tokyo',         cc:'jp', ping:65,  type:'premium', tags:['premium','fast'] },
  { id:6,  country:'Singapore',     city:'Singapore',     cc:'sg', ping:72,  type:'free',    tags:['free'] },
  { id:7,  country:'Canada',        city:'Toronto',       cc:'ca', ping:35,  type:'free',    tags:['free'] },
  { id:8,  country:'Australia',     city:'Sydney',        cc:'au', ping:110, type:'premium', tags:['premium'] },
  { id:9,  country:'Netherlands',   city:'Amsterdam',     cc:'nl', ping:45,  type:'free',    tags:['free','fast'] },
  { id:10, country:'France',        city:'Paris',         cc:'fr', ping:48,  type:'free',    tags:['free'] },
  { id:11, country:'South Korea',   city:'Seoul',         cc:'kr', ping:68,  type:'premium', tags:['premium','fast'] },
  { id:12, country:'Brazil',        city:'São Paulo',     cc:'br', ping:95,  type:'free',    tags:['free'] },
  { id:13, country:'India',         city:'Mumbai',        cc:'in', ping:82,  type:'free',    tags:['free'] },
  { id:14, country:'South Africa',  city:'Johannesburg',  cc:'za', ping:125, type:'premium', tags:['premium'] },
  { id:15, country:'Sweden',        city:'Stockholm',     cc:'se', ping:50,  type:'free',    tags:['free'] },
  { id:16, country:'Switzerland',   city:'Zurich',        cc:'ch', ping:44,  type:'premium', tags:['premium','fast'] },
  { id:17, country:'Poland',        city:'Warsaw',        cc:'pl', ping:55,  type:'free',    tags:['free'] },
  { id:18, country:'Turkey',        city:'Istanbul',      cc:'tr', ping:78,  type:'free',    tags:['free'] },
  { id:19, country:'Mexico',        city:'Mexico City',   cc:'mx', ping:60,  type:'free',    tags:['free'] },
  { id:20, country:'Philippines',   city:'Manila',        cc:'ph', ping:88,  type:'free',    tags:['free'] },
  { id:21, country:'Indonesia',     city:'Jakarta',       cc:'id', ping:92,  type:'free',    tags:['free'] },
  { id:22, country:'UAE',           city:'Dubai',         cc:'ae', ping:70,  type:'premium', tags:['premium','fast'] },
  { id:23, country:'Hong Kong',     city:'Hong Kong',     cc:'hk', ping:74,  type:'free',    tags:['free'] },
  { id:24, country:'Finland',       city:'Helsinki',      cc:'fi', ping:52,  type:'free',    tags:['free'] },
  { id:25, country:'Italy',         city:'Milan',         cc:'it', ping:49,  type:'free',    tags:['free'] },
];

/* ── STATE ─────────────────────────────────────────── */
const state = {
  connected: false,
  connecting: false,
  selectedServer: SERVERS[0],
  currentPage: 'home',
  activeTab: 'all',
  logs: [],
  timer: null,
  timerSecs: 0,
  statsInterval: null,
};

/* ── SPLASH ─────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  // Splash out after 2.6s
  setTimeout(() => {
    document.getElementById('splash').classList.add('out');
    document.getElementById('app').style.display = 'flex';
    // Simulate IP lookup
    setTimeout(detectIP, 800);
  }, 2600);

  buildServerList();
});

function detectIP() {
  const el = document.getElementById('ip-my');
  // Simulate realistic IP-ish value without real network call
  const fakeIP = `${rnd(100,220)}.${rnd(10,250)}.${rnd(1,200)}.${rnd(1,250)}`;
  el.textContent = fakeIP;
}

/* ── DRAWER ─────────────────────────────────────────── */
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── NAVIGATION ─────────────────────────────────────── */
function navTo(page, el) {
  closeDrawer();

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  // Update drawer active state
  document.querySelectorAll('.dr-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  // Update topbar title
  const titles = {
    home: 'HOME', servers: 'SERVERS', payload: 'PAYLOAD / CONFIG',
    logs: 'LOGS', premium: 'PREMIUM', about: 'ABOUT',
  };
  document.getElementById('tb-title').textContent = titles[page] || page.toUpperCase();
  state.currentPage = page;
}

/* ── VPN CONNECT LOGIC ──────────────────────────────── */
function toggleVPN() {
  if (state.connecting) return;

  if (state.connected) {
    disconnectVPN();
  } else {
    connectVPN();
  }
}

function connectVPN() {
  state.connecting = true;
  const orb = document.getElementById('orb');
  const lbl = document.getElementById('orb-lbl');

  orb.classList.add('connecting');
  lbl.textContent = 'CONNECTING…';
  setStatus('CONNECTING…', 'connecting');
  addLog('info', 'Initiating VPN connection…');
  addLog('info', `Server: ${state.selectedServer.country} — ${state.selectedServer.city}`);
  addLog('info', 'Establishing SSH tunnel…');

  const steps = [
    [600,  'info',    'Resolving hostname…'],
    [1200, 'info',    'Handshake in progress…'],
    [1900, 'info',    'Authenticating…'],
    [2500, 'info',    'Configuring tunnel…'],
    [3100, 'ok',      'Tunnel established ✓'],
    [3500, 'ok',      'VPN connected — Unlimited data active ♾'],
  ];

  steps.forEach(([delay, level, msg]) => {
    setTimeout(() => addLog(level, msg), delay);
  });

  setTimeout(() => {
    state.connecting = false;
    state.connected  = true;

    orb.classList.remove('connecting');
    orb.classList.add('connected');
    lbl.textContent = 'CONNECTED';

    setStatus('CONNECTED', 'on');
    document.getElementById('ip-vpn').textContent =
      `${rnd(100,220)}.${rnd(10,250)}.${rnd(1,200)}.${rnd(1,250)}`;
    document.getElementById('ip-proto').textContent = 'SSH Tunnel / WS';
    document.getElementById('sig').classList.add('on');
    document.getElementById('dru-conn').textContent =
      `${state.selectedServer.country}`;

    startTimer();
    startStats();
    showToast('✓ Connected — Unlimited data active');
  }, 3600);
}

function disconnectVPN() {
  state.connected = false;
  clearInterval(state.statsInterval);
  clearInterval(state.timer);
  state.timerSecs = 0;

  const orb = document.getElementById('orb');
  const lbl = document.getElementById('orb-lbl');
  orb.classList.remove('connected', 'connecting');
  lbl.textContent = 'TAP TO\nCONNECT';

  setStatus('DISCONNECTED', '');
  document.getElementById('ip-vpn').textContent  = '—';
  document.getElementById('ip-proto').textContent = '—';
  document.getElementById('sc-time').textContent  = '';
  document.getElementById('sig').classList.remove('on');
  document.getElementById('dru-conn').textContent = 'Not Connected';

  resetStats();
  addLog('warn', 'VPN disconnected.');
  showToast('Disconnected');
}

function setStatus(text, cls) {
  const chip = document.getElementById('status-chip');
  const dot  = document.getElementById('sc-dot');
  const txt  = document.getElementById('sc-text');
  chip.className = 'status-chip' + (cls ? ' ' + cls : '');
  dot.className  = 'sc-dot'      + (cls === 'on' ? ' on' : cls === 'connecting' ? '' : '');
  txt.textContent = text;
}

/* ── TIMER ──────────────────────────────────────────── */
function startTimer() {
  state.timerSecs = 0;
  const el = document.getElementById('sc-time');
  state.timer = setInterval(() => {
    state.timerSecs++;
    el.textContent = formatTime(state.timerSecs);
  }, 1000);
}

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h
    ? `${pad(h)}:${pad(m)}:${pad(sec)}`
    : `${pad(m)}:${pad(sec)}`;
}
function pad(n) { return String(n).padStart(2, '0'); }

/* ── LIVE STATS ─────────────────────────────────────── */
function startStats() {
  document.getElementById('stats-row').classList.add('live');
  state.statsInterval = setInterval(() => {
    document.getElementById('s-dn').textContent  = `${(Math.random() * 5 + 0.5).toFixed(1)} MB/s`;
    document.getElementById('s-up').textContent  = `${(Math.random() * 1.5 + 0.1).toFixed(2)} MB/s`;
    document.getElementById('s-pi').textContent  = `${state.selectedServer.ping + rnd(-5, 15)} ms`;
  }, 1200);
}

function resetStats() {
  document.getElementById('stats-row').classList.remove('live');
  ['s-dn','s-up','s-pi'].forEach(id => document.getElementById(id).textContent = '—');
}

/* ── SERVER LIST ────────────────────────────────────── */
let _tab = 'all';
let _query = '';

function buildServerList(filter = _tab, query = _query) {
  _tab   = filter;
  _query = query;
  const list = document.getElementById('srv-list');
  if (!list) return;

  const q = query.toLowerCase().trim();
  const items = SERVERS.filter(s => {
    const tabOk = filter === 'all' || s.type === filter;
    const qOk   = !q || s.country.toLowerCase().includes(q) || s.city.toLowerCase().includes(q);
    return tabOk && qOk;
  });

  if (!items.length) {
    list.innerHTML = '<p style="font-family:var(--fm);font-size:12px;color:var(--dim);text-align:center;padding:30px 0">No servers found</p>';
    return;
  }

  list.innerHTML = items.map(s => {
    const pingClass = s.ping < 60 ? 'low' : s.ping < 100 ? 'mid' : '';
    const sel = s.id === state.selectedServer.id ? ' sel' : '';
    const tagsHtml = s.tags.map(t => `<span class="tag ${t}">${t.toUpperCase()}</span>`).join('');
    return `
      <div class="srv-item${sel}" onclick="selectServer(${s.id})">
        <img class="srv-flag"
          src="https://flagcdn.com/w40/${s.cc}.webp"
          onerror="this.style.display='none'" alt="${s.country}"/>
        <div class="srv-info">
          <div class="srv-country">${s.country}</div>
          <div class="srv-city">${s.city}</div>
          <div class="srv-tags">${tagsHtml}</div>
        </div>
        <div class="srv-ping ${pingClass}">${s.ping} ms</div>
      </div>`;
  }).join('');
}

function filterServers(q) { buildServerList(_tab, q); }

function setTab(tab, el) {
  document.querySelectorAll('.tb').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  buildServerList(tab, _query);
}

function selectServer(id) {
  const srv = SERVERS.find(s => s.id === id);
  if (!srv) return;
  state.selectedServer = srv;
  buildServerList();

  // Update home card
  document.getElementById('sel-srv').textContent = `${srv.country} — ${srv.city}`;
  const flagEl = document.getElementById('sel-flag');
  flagEl.src = `https://flagcdn.com/w40/${srv.cc}.webp`;
  flagEl.style.display = '';

  showToast(`Server: ${srv.country} — ${srv.city}`);

  // If connected, reconnect
  if (state.connected) {
    addLog('warn', `Switching server to ${srv.country} — ${srv.city}…`);
  }
}

/* ── PAYLOAD ────────────────────────────────────────── */
function pickMode(btn) {
  document.querySelectorAll('.mb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`Mode: ${btn.textContent}`);
}

function saveCfg() {
  const cfg = {
    mode:      document.querySelector('.mb.active')?.textContent,
    payload:   document.getElementById('pay-txt')?.value,
    sni:       document.getElementById('cf-sni')?.value,
    proxyIp:   document.getElementById('cf-pip')?.value,
    proxyPort: document.getElementById('cf-pport')?.value,
    sshPort:   document.getElementById('cf-sport')?.value,
    rdns:      document.getElementById('cf-rdns')?.value,
    udp:       document.getElementById('t-udp')?.checked,
    ssl:       document.getElementById('t-ssl')?.checked,
    slowDns:   document.getElementById('t-sdns')?.checked,
    unlimited: document.getElementById('t-uldata')?.checked,
  };

  try {
    localStorage.setItem('ufd_config', JSON.stringify(cfg));
  } catch(_) {}

  addLog('ok', 'Configuration saved.');
  showToast('✓ Configuration saved');
}

/* ── LOGS ───────────────────────────────────────────── */
function addLog(level, msg) {
  const now  = new Date();
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  state.logs.push({ time, level, msg });

  const body = document.getElementById('log-body');
  if (!body) return;

  // Remove empty state
  const empty = body.querySelector('.log-empty');
  if (empty) empty.remove();

  const div = document.createElement('div');
  div.className = 'log-line';
  div.innerHTML = `
    <span class="ll-time">${time}</span>
    <span class="ll-lvl ${level}">${level.toUpperCase()}</span>
    <span class="ll-msg">${msg}</span>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;

  const ct = document.getElementById('log-ct');
  if (ct) ct.textContent = `${state.logs.length} ${state.logs.length === 1 ? 'entry' : 'entries'}`;
}

function clearLogs() {
  state.logs = [];
  const body = document.getElementById('log-body');
  if (body) body.innerHTML = '<p class="log-empty">No logs yet. Connect to start logging.</p>';
  const ct = document.getElementById('log-ct');
  if (ct) ct.textContent = '0 entries';
}

/* ── TOAST ──────────────────────────────────────────── */
let _toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ── HELPERS ────────────────────────────────────────── */
function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

/* ── KEYBOARD ───────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDrawer();
});
