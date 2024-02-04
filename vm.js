function saveStorage()
{
    let slot = document.getElementById("slot");
    arch.storage.save(slot.value);
}

function loadStorage()
{
    let slot = document.getElementById("slot");
    arch.storage.load(slot.value);
}

function insertStorage()
{
    let where = document.getElementById("where");
    let what = document.getElementById("what");
    console.log(where + " " + what);
    arch.storage.memcpy(parseInt(where.value), what.value);
}

function insertRAM()
{
    let where = document.getElementById("ramwhere");
    let what = document.getElementById("ramwhat");
    console.log(where.value + " " + what.value);
    arch.ram.memcpy(parseInt(where.value), what.value);
}

function insertBIOS()
{
    let what = document.getElementById("bioswhat");
    arch.bios.reset();
    if(what.value) {
        arch.bios.memcpy(0, what.value);
        arch.bios.save("bios", false);
    }
    else {
        arch.bios.memcpy(0, "0");
        arch.bios.save("bios", false);
    }
}

async function updateInfo() {
    document.getElementById("infopc").innerHTML = "Program Counter: " + arch.registers.pc.get();
    await sleep(1);
    updateInfo();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}