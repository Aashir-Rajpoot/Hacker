// CIPHERLOCK main process. Visual simulation only: no shell, no network, no OS changes.
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win = null;
let allowQuit = false;
const isDev = process.argv.includes('--dev');

// Only one instance at a time
if (!app.requestSingleInstanceLock()) app.quit();

// Exit chord state (Ctrl+Shift+C then L while C is held). Window-local only.
const keys = { c: false };

function createWindow() {
  win = new BrowserWindow({
    fullscreen: !isDev,
    width: 1280, height: 800,
    frame: false,
    backgroundColor: '#020702',
    alwaysOnTop: !isDev,
    skipTaskbar: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: isDev
    }
  });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.once('ready-to-show', () => win.show());

  // Block navigation, popups, and permission requests: nothing remote ever loads.
  win.webContents.on('will-navigate', e => e.preventDefault());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.session.setPermissionRequestHandler((_w, _p, cb) => cb(false));

  // Ignore normal close attempts (Alt+F4); only the exit sequence quits.
  win.on('close', e => { if (!allowQuit) e.preventDefault(); });

  // Window-focused key handling only. No global hooks.
  win.webContents.on('before-input-event', (event, input) => {
    const k = (input.key || '').toLowerCase();
    if (k === 'c') keys.c = input.type === 'keyDown';
    if (input.type === 'keyDown' && k === 'l' && input.control && input.shift && keys.c) {
      win.webContents.send('exit-sequence');
    }
    if (input.type === 'keyDown' && input.alt && k === 'f4') event.preventDefault();
  });
  win.on('blur', () => { keys.c = false; });
}

ipcMain.on('confirm-exit', () => { allowQuit = true; if (win) win.setFullScreen(false); app.quit(); });

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
