// Simulated window contents. Everything here is local, random, and fictional.
const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[R(0, a.length - 1)];
const hex = n => Array.from({ length: n }, () => R(0, 255).toString(16).padStart(2, '0').toUpperCase()).join(' ');
const ip = () => `${R(10,223)}.${R(0,255)}.${R(0,255)}.${R(1,254)}`;
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const every = (ms, fn) => setInterval(() => { try { fn(); } catch (_) {} }, ms);
function append(box, html, max = 120){ const d = document.createElement('div'); d.innerHTML = html; box.appendChild(d);
  while (box.children.length > max) box.firstChild.remove(); box.scrollTop = box.scrollHeight; }

const CODE = ['a.migrate() {','  return cipher.decrypt();','}','const session = initialize();','const node = network.resolve();',
 'if (secure === true) {','  handshake();','}','var e = a.prop(b, d);','return f === !0 || "bool" != typeof f;',
 'k = /^(?:input|The)(b, d)/;','// simulated, never executed','for (let i = 0; i < n; i++) {','  buf[i] ^= key[i % 16];','}'];
function hl(l){ return esc(l).replace(/(\/\/.*)$/,'<span class="c">$1</span>')
  .replace(/\b(const|var|let|return|if|for|function)\b/g,'<span class="k">$1</span>')
  .replace(/("[^"]*")/g,'<span class="s">$1</span>').replace(/\b(\d+)\b/g,'<span class="n">$1</span>'); }

const Windows = {
  console: (b) => { const t = document.createElement('div'); t.className = 'scroll'; b.appendChild(t);
    every(700, () => append(t, hl(pick(CODE)), 80));
    every(3000, () => append(t, `<span class="${pick(['ok','ok','wr'])}">${pick(['[OK] Loading cryptographic modules...','[SIM] Establishing encrypted tunnel...','[SIM] Parsing packet stream...','[WARN] Suspicious activity detected...','[OK] Containment protocol active...'])}</span>`)); },

  cracker: (b) => { b.innerHTML = `<div>HEDEF: <b id="tg">23.86.111.0</b> (simulated)</div><div>VERİTABANI: Kullanıcı tablosu / Admin rolü</div>
    <div style="margin:6px 0"><button class="sim on" data-m="CRACK">CRACK</button> <button class="sim" data-m="ŞİFRELE">ŞİFRELE</button> <button class="sim" data-m="SALDIR">SALDIR</button></div>
    <div class="bar"><i></i></div><div class="st">DURUM: Beklemede</div>
    <button class="sim go">BRUTE FORCE SIMULATION BAŞLAT</button><div class="scroll log" style="height:90px;margin-top:6px"></div>
    <div class="c">Simulation only. No target is contacted.</div>`;
    const bar = b.querySelector('.bar i'), st = b.querySelector('.st'), log = b.querySelector('.log'); let run = false, mode = 'CRACK';
    b.querySelectorAll('[data-m]').forEach(x => x.onclick = () => { mode = x.dataset.m; b.querySelectorAll('[data-m]').forEach(y => y.classList.toggle('on', y === x)); });
    b.querySelector('.go').onclick = () => { if (run) return; run = true; let p = 0, n = 1293;
      const t = setInterval(() => { p += R(1, 4); n++; if (p >= 100) { p = 100; clearInterval(t); run = false; st.textContent = 'SIMULATION COMPLETE'; }
        else st.textContent = `DURUM: ${mode} ${p}%`; bar.style.width = p + '%';
        append(log, `Attempt ${String(n).padStart(6,'0')} ${hex(4)}`, 40); }, 120); }; },

  network: (b) => { const c = document.createElement('canvas'); c.className = 'fill'; b.style.padding = 0; b.appendChild(c);
    const x = c.getContext('2d'), L = ['NODE-01','NODE-02','GATEWAY','DATABASE','AUTH','CLIENT','SERVER','NODE-07'];
    const N = L.map(l => ({ l, x: Math.random(), y: Math.random(), vx: (Math.random()-.5)*.0006, vy: (Math.random()-.5)*.0006 }));
    let pk = 1; const P = [];
    const frame = () => { const W = c.width = c.clientWidth, H = c.height = c.clientHeight; x.clearRect(0,0,W,H);
      N.forEach(n => { n.x += n.vx; n.y += n.vy; if (n.x < .05 || n.x > .95) n.vx *= -1; if (n.y < .08 || n.y > .92) n.vy *= -1; });
      x.strokeStyle = '#00aa1866';
      N.forEach((a,i) => N.forEach((q,j) => { if (j > i && Math.hypot(a.x-q.x,a.y-q.y) < .5) { x.beginPath(); x.moveTo(a.x*W,a.y*H); x.lineTo(q.x*W,q.y*H); x.stroke(); } }));
      if (Math.random() < .05) P.push({ a: pick(N), b: pick(N), t: 0, id: pk++ });
      x.font = '10px monospace';
      P.forEach((p,i) => { p.t += .02; x.fillStyle = '#ffe600'; x.fillRect((p.a.x+(p.b.x-p.a.x)*p.t)*W,(p.a.y+(p.b.y-p.a.y)*p.t)*H,4,4); if (p.t >= 1) P.splice(i,1); });
      N.forEach(n => { x.fillStyle = '#00ff22'; x.beginPath(); x.arc(n.x*W,n.y*H,4,0,7); x.fill(); x.fillText(n.l,n.x*W+7,n.y*H-5); });
      x.fillStyle = '#7cff8a'; x.fillText('PACKET ' + String(pk).padStart(3,'0'), 8, H-8);
      requestAnimationFrame(frame); }; frame(); },

  codes: (b) => { const c = document.createElement('canvas'); c.className = 'fill'; b.style.padding = 0; b.appendChild(c);
    const x = c.getContext('2d'), ch = 'ｱｲｳｴｵｶｷｸｹｺ0123456789ABCDEF<>/\\{}'.split(''); let drops = [];
    const t = setInterval(() => { try { const W = c.width = c.clientWidth, H = c.height = c.clientHeight; const cols = Math.floor(W/14);
      while (drops.length < cols) drops.push(R(0,40)); x.fillStyle = '#000'; x.fillRect(0,0,W,H); x.font = '14px monospace';
      drops.forEach((d,i) => { x.fillStyle = '#00ff22'; x.fillText(pick(ch), i*14, d*14); drops[i] = d*14 > H && Math.random() > .95 ? 0 : d+1; });
      x.fillStyle = '#ffe600'; x.fillText(`CODE STREAM: ${R(60,80)}%  BUFFER: ${hex(6)}`, 6, H-6); } catch (_) {} }, 80); },

  terminal: (b) => { b.innerHTML = '<div class="scroll out" style="height:calc(100% - 22px)"></div><div>cipher@secure-node:~$ <input class="cmd" spellcheck="false"></div>';
    const out = b.querySelector('.out'), inp = b.querySelector('input'); const hist = [];
    const C = { help: () => 'help clear status scan whoami ls pwd netstat top ps history matrix decrypt trace connect',
      status: () => '[SIMULATION] All virtual nodes nominal.', whoami: () => 'cipher (simulated)', pwd: () => '/virtual/root',
      ls: () => 'access.log  firewall.log  kernel.trace  users.db  network.pcap  security.key  system.conf',
      scan: () => '[SIMULATION]\nScanning virtual environment...\n192.168.0.1    ONLINE\n192.168.0.12   ONLINE\n192.168.0.24   FILTERED',
      netstat: () => Array.from({length:4},()=>`tcp  ${ip()}:${R(1024,65000)}  ESTABLISHED (fake)`).join('\n'),
      top: () => 'PID  CPU  CMD\n' + Array.from({length:4},()=>`${R(100,9999)}  ${R(1,40)}%  ${pick(['sim_kernel','aes_sim','pktgen','authd'])}`).join('\n'),
      ps: () => 'sim_kernel\naes_sim\npktgen\nauthd', history: () => hist.join('\n'), matrix: () => hex(16), decrypt: () => '[SIM] decrypting... ' + hex(8),
      trace: () => '[SIM] hop1 ' + ip() + '\n[SIM] hop2 ' + ip(), connect: () => '[SIM] connected to virtual host ' + ip() };
    inp.onkeydown = e => { if (e.key !== 'Enter') return; const v = inp.value.trim(); inp.value = ''; if (!v) return; hist.push(v);
      append(out, 'cipher@secure-node:~$ ' + esc(v)); if (v === 'clear') { out.innerHTML = ''; return; }
      append(out, esc(C[v] ? C[v]() : `${v}: command not found (simulation)`)); };
    b.onclick = () => inp.focus(); },

  monitor: (b) => { const rows = ['CPU','RAM','GPU','DISK']; b.innerHTML = rows.map(r => `<div>${r} <span data-v="${r}"></span><div class="bar"><i data-b="${r}"></i></div></div>`).join('') + '<div>NETWORK <span id="net"></span></div>';
    every(1000, () => { rows.forEach(r => { const v = R(15,85); b.querySelector(`[data-v=${r}]`).textContent = v + '%'; b.querySelector(`[data-b=${r}]`).style.width = v + '%'; });
      b.querySelector('#net').textContent = R(10,400) + ' KB/s'; }); },

  threats: (b) => { const t = document.createElement('div'); t.className = 'scroll'; b.appendChild(t);
    const S = [['LOW','ok','Port anomaly detected'],['INFO','ok','Authentication request observed'],['MEDIUM','wr','Unknown process signature'],['HIGH','cr','Suspicious pattern detected'],['OK','ok','Containment simulation completed']];
    every(1800, () => { const s = pick(S); append(t, `<span class="${s[1]}">[${s[0]}]</span> ${s[2]} (fictional)`); }); },

  logs: (b) => { const t = document.createElement('div'); t.className = 'scroll'; b.appendChild(t);
    every(900, () => { const d = new Date().toTimeString().slice(0,8); append(t, `${d} ${pick(['AUTH_ENGINE initialized','NODE_0'+R(1,9)+' connected','PACKET_STREAM started','ENCRYPTION_LAYER synchronized','SESSION stable'])}`); }); }
};
