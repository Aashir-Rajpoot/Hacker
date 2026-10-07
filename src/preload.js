const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('cipherlock', {
  onExitSequence: cb => ipcRenderer.on('exit-sequence', () => cb()),
  confirmExit: () => ipcRenderer.send('confirm-exit')
});
