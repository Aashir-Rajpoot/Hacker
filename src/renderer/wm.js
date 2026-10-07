// Mini window manager: drag, resize, minimize, maximize, focus, dock. All windows are fake DOM panels.
const WM = (() => {
  const desk = () => document.getElementById('desktop');
  const reg = {}; let z = 10;
  function focus(w){ w.el.style.zIndex = ++z; }
  function refreshDock(){
    const d = document.getElementById('dockItems'); d.innerHTML = '';
    Object.values(reg).forEach(w => {
      const b = document.createElement('button'); b.textContent = w.title;
      b.className = w.hidden ? '' : ('open' + (w.el.classList.contains('min') ? ' min' : ''));
      b.onclick = () => { open(w.id); }; d.appendChild(b);
    });
  }
  function create(id, title, rect, build){
    const el = document.createElement('section'); el.className = 'win'; el.tabIndex = -1;
    el.innerHTML = `<div class="tb"><span>${title}</span><span class="ctl"><button data-a="min" title="Minimize">_</button><button data-a="max" title="Maximize">□</button><button data-a="close" title="Hide">×</button></span></div><div class="body"></div><div class="rz"></div>`;
    desk().appendChild(el);
    const w = { id, title, el, hidden: false, rect };
    reg[id] = w; place(w);
    const body = el.querySelector('.body');
    try { w.api = build(body, el) || {}; } catch (e) { body.textContent = 'Module error (ignored): ' + e.message; }
    el.addEventListener('mousedown', () => focus(w));
    el.querySelector('.ctl').onclick = e => {
      const a = e.target.dataset.a; if (!a) return;
      if (a === 'min') { el.classList.add('min'); }
      if (a === 'max') el.classList.toggle('max');
      if (a === 'close') { w.hidden = true; el.classList.add('min'); }
      refreshDock();
    };
    const tb = el.querySelector('.tb');
    tb.ondblclick = e => { if (!e.target.dataset.a) el.classList.toggle('max'); };
    drag(tb, el); resize(el.querySelector('.rz'), el);
    focus(w); refreshDock(); return w;
  }
  function place(w){ // rect given as fractions of desktop so layout adapts to any resolution
    const D = desk().getBoundingClientRect(), r = w.rect;
    Object.assign(w.el.style, { left: r[0]*D.width+'px', top: r[1]*D.height+'px', width: r[2]*D.width+'px', height: r[3]*D.height+'px' });
  }
  function open(id){ const w = reg[id]; if (!w) return; w.hidden = false; w.el.classList.remove('min'); focus(w); refreshDock(); }
  function drag(h, el){
    h.onmousedown = e => {
      if (e.target.dataset.a || el.classList.contains('max')) return;
      const sx = e.clientX - el.offsetLeft, sy = e.clientY - el.offsetTop;
      const mv = ev => { el.style.left = Math.max(0, ev.clientX - sx) + 'px'; el.style.top = Math.max(0, ev.clientY - sy) + 'px'; };
      const up = () => { removeEventListener('mousemove', mv); removeEventListener('mouseup', up); };
      addEventListener('mousemove', mv); addEventListener('mouseup', up);
    };
  }
  function resize(h, el){
    h.onmousedown = e => {
      e.stopPropagation(); const sx = e.clientX, sy = e.clientY, w0 = el.offsetWidth, h0 = el.offsetHeight;
      const mv = ev => { el.style.width = Math.max(240, w0 + ev.clientX - sx) + 'px'; el.style.height = Math.max(130, h0 + ev.clientY - sy) + 'px'; };
      const up = () => { removeEventListener('mousemove', mv); removeEventListener('mouseup', up); };
      addEventListener('mousemove', mv); addEventListener('mouseup', up);
    };
  }
  addEventListener('resize', () => Object.values(reg).forEach(w => { if (!w.el.classList.contains('max')) place(w); }));
  return { create, open, reg };
})();
