# CIPHERLOCK
*Your screen. Your simulation. Your cyber command center.*

**CIPHERLOCK is a visual cybersecurity simulation. It does not lock Windows or perform real cyber attacks.**

A fullscreen Electron app that makes your screen look like a hacker command center. All data is randomly generated locally. No shell commands, no network requests, no registry or system changes, no admin rights.

## Run
```
npm install
npm run dev     # windowed, with devtools
npm start       # fullscreen, always on top
npm run build   # CIPHERLOCK Setup.exe + CIPHERLOCK Portable.exe in dist/
```

## Exit
Hold **Ctrl + Shift + C**, then press **L**. Confirm with **EXIT SIMULATION**. Only works while the app is focused (no global hooks). Ctrl+Alt+Del, Task Manager and Alt+Tab are never touched.

## Status
Implemented: boot/shutdown, window manager (drag, resize, min, max, hide, dock, icons), Program Console, Cipher Cracker, Network Graph, Collecting Codes, Terminal, System Monitor, Threat Detection, Log Monitor.
Not yet: Settings/themes, File Explorer, Intelligence Panel, sounds, window snapping, hold-to-exit, screenshots, app icon.

## Release
Build, then zip `dist/CIPHERLOCK Portable.exe` and upload it to a GitHub Release.

MIT licensed. For entertainment only.
