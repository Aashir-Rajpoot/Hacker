// CIPHERLOCK renderer bootstrap: boot sequence, clock, background, windows, exit dialog.
(function(){
  const $ = id => document.getElementById(id);
  const sid = () => Array.from({length:2},()=>Math.random().toString(16).slice(2,6).toUpperCase()).join('-');
  $('sess').textContent = 'SESSION: ' + sid();

  // Boot
  const lines = ['CIPHERLOCK BIOS v4.7','--------------------','Initializing visual kernel...  [OK]','Loading simulation engine...  [OK]','Mounting virtual filesystem...  [OK]','Starting threat monitor...  [OK]','Starting network visualization...  [OK]','Loading interface...  [OK]','','SESSION READY'];
  let i = 0; const bt = $('bootText');
  const step = setInterval(() => { bt.textContent += (lines[i++] || '') + '\n'; if (i >= lines.length) { clearInterval(step); setTimeout(() => $('boot').classList.add('done'), 500); } }, 320);

  // Clock
  const tick = () => { const d = new Date(); $('clock').textContent = d.toTimeString().slice(0,8);
    $('date').textContent = d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase(); };
  tick(); setInterval(tick, 1000);

  // Background: faint grid + falling characters (lightweight)
  const bg = $('bg'), x = bg.getContext('2d'); let cols = [];
  setInterval(() => { try { const W = bg.width = innerWidth, H = bg.height = innerHeight; while (cols.length < W/18) cols.push(R(0,60));
    x.fillStyle = '#020702'; x.fillRect(0,0,W,H); x.fillStyle = '#00ff2218'; x.font = '14px monospace';
    cols.forEach((c,k) => { x.fillText(pick('01ABCDEF'.split('')), k*18, c*16); cols[k] = c*16 > H && Math.random() > .97 ? 0 : c+1; }); } catch (_) {} }, 120);

  // Windows (rects are fractions of the desktop area so layout scales to any screen)
  const defs = [
    ['console','PROGRAM CONSOLE',[.01,.02,.27,.42],'console'],
    ['terminal','TERMINAL',[.01,.47,.27,.35],'terminal'],
    ['cracker','CIPHER CRACKER',[.30,.02,.28,.46],'cracker'],
    ['threats','THREAT DETECTION',[.30,.52,.20,.30],'threats'],
    ['monitor','SYSTEM MONITOR',[.60,.02,.18,.32],'monitor'],
    ['logs','LOG MONITOR',[.60,.37,.18,.32],'logs'],
    ['network','NETWORK GRAPH',[.51,.52,.26,.38],'network'],
    ['codes','COLLECTING CODES',[.01,.84,.27,.15],'codes']
  ];
  defs.forEach(d => { try { WM.create(d[0], d[1], d[2], Windows[d[3]]); } catch (e) { console.warn(e); } });
  defs.forEach(d => { const el = document.createElement('div'); el.className = 'icon'; el.tabIndex = 0;
    el.innerHTML = `<div class="g">${d[1][0]}</div>${d[1]}`; el.onclick = () => WM.open(d[0]);
    el.onkeydown = e => { if (e.key === 'Enter') WM.open(d[0]); }; $('icons').appendChild(el); });

  // Exit dialog (triggered by main process on Ctrl+Shift+C+L)
  const dlg = $('exitDlg');
  const show = () => { dlg.hidden = false; $('exitYes').focus(); };
  window.cipherlock && window.cipherlock.onExitSequence(show);
  $('exitNo').onclick = () => { dlg.hidden = true; };
  dlg.addEventListener('keydown', e => { if (e.key === 'Escape') dlg.hidden = true; });
  $('exitYes').onclick = () => { dlg.hidden = true; const s = $('shutdown'); s.hidden = false; const p = s.querySelector('pre');
    const L = ['TERMINATING SIMULATION...','CLOSING VIRTUAL NODES...','SAVING UI STATE...','SESSION CLOSED.']; let k = 0;
    const t = setInterval(() => { p.textContent += L[k++] + '\n'; if (k >= L.length) { clearInterval(t); setTimeout(() => window.cipherlock.confirmExit(), 400); } }, 450); };
})();
