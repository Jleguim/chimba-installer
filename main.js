const { app, BrowserWindow } = require('electron')
const path = require('path')

const { modpack_name } = require('./config')

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 500,
        height: 375,
        resizable: false,
        fullscreenable: false,
        title: `${modpack_name} Installer`,
        icon: './public/img/icon.ico',
        webPreferences: {
            preload: path.join(__dirname, './public/js/preload.js')
        }
    })

    mainWindow.removeMenu()
    mainWindow.loadFile('./public/views/index.html')
}

app.whenReady().then(() => {
    createWindow()

    require('./ipcHandles')
})