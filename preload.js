const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld("loader", {
    scripts: () => ipcRenderer.invoke('getScripts'),
    characters: () => ipcRenderer.invoke('getCharacters'),
    maps: () => ipcRenderer.invoke('getMaps'),
    mobs: () => ipcRenderer.invoke('getMobs'),
    projectiles: () => ipcRenderer.invoke('getProjectiles'),
    drops: () => ipcRenderer.invoke('getDrops'),
});


