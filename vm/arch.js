//Arch.js:
//This is a custom cpu written in javascript!

class arch
{
    storage = null;
    ram = null;
    vram = null;
    video = null;
    reg = null;

    constructor()
    {
        this.storage = new memory(65536);
        this.ram = new memory(65536);
        this.vram = new memory(65536);
        this.display = new display();
        this.reg = new registers();
    }
}