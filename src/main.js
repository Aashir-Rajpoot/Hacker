// CIPHERLOCK main process. Visual simulation only: no shell, no network, no OS changes.
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const kiosk = require('./kiosk');

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
  if (!isDev) {
    win.setAlwaysOnTop(true, 'screen-saver');     // stay above the taskbar / Start menu
    kiosk.start();                                 // guard active only while focused
    kiosk.setActive(true);
    win.on('focus', () => kiosk.setActive(true));
    win.on('blur', () => kiosk.setActive(false));
  }

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

ipcMain.on('confirm-exit', () => { allowQuit = true; kiosk.stop(); if (win) win.setFullScreen(false); app.quit(); });

// First run: put a normal CIPHERLOCK shortcut on the user's Desktop (no startup entry, no registry).
function ensureDesktopShortcut() {
  if (process.platform !== 'win32' || !app.isPackaged) return;
  try {
    const lnk = path.join(app.getPath('desktop'), 'CIPHERLOCK.lnk');
    const flag = path.join(app.getPath('userData'), 'shortcut-created');
    const opts = { target: process.execPath, cwd: path.dirname(process.execPath), description: 'CIPHERLOCK - cyber simulation screen', icon: process.execPath, iconIndex: 0 };
    if (fs.existsSync(lnk)) {
      // Folder moved? Repoint the shortcut.
      if (shell.readShortcutLink(lnk).target !== process.execPath) shell.writeShortcutLink(lnk, 'update', opts);
    } else if (!fs.existsSync(flag)) {
      shell.writeShortcutLink(lnk, 'create', opts);   // only once, so a deleted shortcut stays deleted
    }
    fs.mkdirSync(path.dirname(flag), { recursive: true });
    fs.writeFileSync(flag, '1');
  } catch (_) { /* shortcut is optional; never block startup */ }
}

app.whenReady().then(() => { createWindow(); ensureDesktopShortcut(); });
app.on('will-quit', () => kiosk.stop());
app.on('window-all-closed', () => app.quit());
