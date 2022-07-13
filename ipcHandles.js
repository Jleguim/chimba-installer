const { ipcMain } = require('electron')
const request = require('superagent')
const admZip = require('adm-zip')
const path = require('path')
const fs = require('fs-extra')

const { profilePath, tempPath, launcherProfilesPath, modsPath, rarPath } = require('./paths')
const { repo, branch, modpack_name, forgeVersion, javaArgs, name, image } = require('./config')
const mods_url = `${repo}archive/refs/heads/${branch}.zip`

ipcMain.handle('checkInstalled', () => {
    return new Promise((res, rej) => {
        if (!fs.existsSync(profilePath)) res(false)
        if (fs.existsSync(modsPath)) res(true)
    })
})

ipcMain.handle('deleteModFolder', () => {
    const dest = modsPath
    return fs.rm(dest, { recursive: true, force: true })
})

ipcMain.handle('downloadMods', (event) => {
    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath)

    const dest = rarPath
    const stream = fs.createWriteStream(dest)
    const pipe = request.get(mods_url).pipe(stream)

    return new Promise((resolve) => {
        pipe.on('finish', () => resolve())
    })
})

ipcMain.handle('unzipMods', (event) => {
    return new Promise((resolve, reject) => {
        var zip = new admZip(rarPath)

        var currentPath = null
        var entries = zip.getEntries()
        var regex = /.*[^\/]$/

        var toReplace = `${name}-${branch}/`

        entries.forEach((entry, i) => {
            if (!entry.entryName.match(regex)) {
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

ipcMain.handle('createProfile', (event) => {
    return new Promise(async (res, rej) => {
        if (!fs.existsSync(launcherProfilesPath)) return res()

        const profile_data = JSON.parse(fs.readFileSync(launcherProfilesPath))

        if (profile_data.profiles[modpack_name]) return res()

        profile_data.profiles[modpack_name] = {
            gameDir: path.normalize(profilePath),
            icon: image,
            javaArgs: javaArgs,
            lastVersionId: forgeVersion,
            name: modpack_name,
            type: 'custom'
        }

        fs.writeFileSync(launcherProfilesPath, JSON.stringify(profile_data, 0, 3))
        res()
    })
})

ipcMain.handle('getModpackName', () => modpack_name)
ipcMain.handle('getVersion', (event) => {
    return require('./package.json').version
})