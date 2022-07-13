var fs = require('fs')

module.exports = {
    modpack_name: 'Chimbaland 3',
    profile_dir: 'chimbaland',

    repo: 'https://github.com/Jleguim/chimba-installer/',
    branch: 'mods',
    name: 'chimba-installer',

    image: 'data:image/png;base64,' + fs.readFileSync('./public/img/image.png', 'base64'),
    forgeVersion: '1.16.5-forge-36.2.34',
    javaArgs: '-Xmx4G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1NewSizePercent=20 -XX:G1ReservePercent=20 -XX:MaxGCPauseMillis=50 -XX:G1HeapRegionSize=32M'
}