var MODPACK_NAME = undefined

async function loadFooter(){
    var footer = document.querySelector("footer")
    var ver = await window.installer.getVersion()

    footer.innerHTML =
    `<span id="state">${MODPACK_NAME} Installer v${ver}</span>
    <span>
        <i id="loading" class="fa-solid fa-slash fa-spin-pulse" style="--fa-animation-duration: 0.5s;"></i>
    </span>`
}


async function loadName() {
    var nameElement = document.getElementById('modpack_name')
    var name = await window.installer.getName()
    MODPACK_NAME = name

    nameElement.innerText = `${name} Installer`
}