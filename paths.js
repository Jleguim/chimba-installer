const path = require('path')

const { profile_dir } = require('./config')

const MINECRAFT = path.join(process.env.APPDATA, '/.minecraft/')
const PROFILES = path.join(MINECRAFT, '/profiles/')

module.exports.profilePath = path.join(PROFILES, profile_dir)
module.exports.modsPath = path.join(this.profilePath, '/mods/')

module.exports.tempPath = path.join(process.env.TEMP, '/modpack-installer/')
module.exports.rarPath = path.join(this.tempPath, '/modpack.zip')

module.exports.launcherProfilesPath = path.join(MINECRAFT, '/launcher_profiles.json')