function saveStorage()
{
    let slot = document.getElementById("slot");
    archjs.storage.save(slot.value);
}

function loadStorage()
{
    let slot = document.getElementById("slot");
    archjs.storage.load(slot.value);
}

function insertStorage()
{
    let where = document.getElementById("where");
    let what = document.getElementById("what");
    console.log(where + " " + what);
    archjs.storage.loadfrom(parseInt(where.value), what.value);
}