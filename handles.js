const { ipcMain } = require('electron')
const request = require('superagent')
const path = require('path')
const fs = require('fs-extra')
const admZip = require('adm-zip')

const { repo, modpack_name, image, forgeVersion, javaArgs } = require('./config.js')
const { profilePath, tempPath, launcherProfilesPath, rarPath, modsPath } = require('./paths.js')
const { name } = require('./config.js')
const { branch } = require('./config.js')

const mods_url = `${repo}/archive/refs/heads/${branch}.zip`

ipcMain.handle('checkInstalled', () => {
    return new Promise((res, rej) => {
        if (!fs.existsSync(profilePath)) res(false)
        if (fs.existsSync(modsPath)) res(true)
    })
})

ipcMain.handle('deleteModFolder', () => {
    return fs.rm(modsPath, { recursive: true, force: true })
})

ipcMain.handle('downloadMods', () => {
    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath)

    const stream = fs.createWriteStream(rarPath) // crea stream al que escribir
    const pipe = request.get(mods_url).pipe(stream) // descarga y escribe al stream

    console.log(mods_url)

    return new Promise((resolve) => {
        pipe.on('finish', () => resolve())
    })
})

ipcMain.handle('unzipMods', () => {
    return new Promise((resolve, reject) => {
        var zip = new admZip(rarPath) // crea zip

        var currentPath = null
        var entries = zip.getEntries()
        var regex = /.*[^\/]$/

        entries.forEach((entry, i) => {
            if (!entry.entryName.match(regex)) {
                var toReplace = `${name}-${branch}`
                currentPath = entry.entryName.replace(toReplace, '')
                return
            }

            var targetPath = path.join(profilePath, currentPath)
            zip.extractEntryTo(entry, targetPath, false, true)

            if (i == entries.length - 1) {
                fs.rmSync(tempPath, { recursive: true, force: true })
                resolve()
            }
        })
    })

})

ipcMain.handle('createProfile', () => {
    return new Promise(async (res, rej) => {
        const profile_data = JSON.parse(fs.readFileSync(launcherProfilesPath))
        
        if (!fs.existsSync(launcherProfilesPath)) return res()
        if (profile_data.profiles[modpack_name]) return res()

        profile_data.profiles[modpack_name] = {
            gameDir: path.normalize(profilePath),
            icon: image,
            javaArgs: javaArgs,
            lastVersionId: forgeVersion,
            name: modpack_name,
            type: "custom"
        }

        fs.writeFileSync(launcherProfilesPath, JSON.stringify(profile_data, 0, 3))
        res()
    })
})

ipcMain.handle('getVersion', () => {
    return require("./package.json").version;
})

ipcMain.handle('getName', () => {
    return modpack_name
})
