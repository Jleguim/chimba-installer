const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('installer', {
    downloadMods: () => ipcRenderer.invoke('downloadMods'),
    unzipMods: () => ipcRenderer.invoke('unzipMods'),
    deleteModFolder: () => ipcRenderer.invoke('deleteModFolder'),
    checkInstalled: () => ipcRenderer.invoke('checkInstalled'),
    createProfile: () => ipcRenderer.invoke('createProfile'),

    getVersion: () => ipcRenderer.invoke('getVersion'),
    getModpackName: () => ipcRenderer.invoke('getModpackName')
})