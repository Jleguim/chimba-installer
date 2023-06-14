const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('installer', {
    downloadMods: () => ipcRenderer.invoke('downloadMods'),
    unzipMods: () => ipcRenderer.invoke('unzipMods'),
    deleteModFolder: () => ipcRenderer.invoke('deleteModFolder'),
    checkInstalled: () => ipcRenderer.invoke('checkInstalled'),
    createProfile: () => ipcRenderer.invoke('createProfile'),

    getName: () => ipcRenderer.invoke('getName'),
    getVersion: () => ipcRenderer.invoke('getVersion'),
})