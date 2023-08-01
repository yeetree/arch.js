//Arch.js:
//This is a custom cpu written in javascript!

class arch
{
    storage = null;
    ram = null;
    vram = null;
    video = null;
    reg = null;
    
    ptr = null;
    noop = null;

    constructor()
    {
        //initiate components
        this.storage = new memory(65536);
        this.ram = new memory(65536);
        this.vram = new memory(65536);
        this.video = new display();
        this.reg = new registers();

        this.ptr = -1;
        this.noop = true;

        //get storage
        if(localStorage.getItem("slot1") === null)
            localStorage.setItem("slot1", this.storage.data);
        else
            this.storage.load(localStorage.getItem("slot1"));

        //load first 512 bytes into memory
        for(let i=0; i<512; i++)
            this.ram.set(i, this.storage.get(i));

        //start cpu
        this.cycle();
    }

    cycle = function()
    {
        //process current instruction at program pointer
        this.process();
        //refresh video from vram
        this.video.RefreshVideo(this.vram.data);
        //if noop, or halt, dont continue
        if(!this.noop)
            this.cycle();
    }

    process = function()
    {
        //increment prg pointer by one
        this.ptr++;
        //process instruction
        switch(this.ram.get(this.ptr))
        {
            case 0:
                this.noop = true;
                break;
        }
    }
}