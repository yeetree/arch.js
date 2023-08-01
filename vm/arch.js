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
        this.storage = new memory(32767);
        this.ram = new memory(65536);
        this.vram = new memory(65536);
        this.memmap = new memory(65536);
        this.video = new display();
        this.reg = new registers();

        this.ptr = -1;

        //get storage
        if(localStorage.getItem("slot1") === null)
            localStorage.setItem("slot1", this.storage.data);
        else
        {
            let tmp = localStorage.getItem("slot1").replace(/,/g, '');
            let tmpn = [];

            for(let i=0; i<tmp.length; i++)
                tmpn[i] = parseInt(tmp[i]);

            this.storage.load(tmpn);
        }

        //load first 512 bytes into memory
        for(let i=0; i<512; i++)
            this.ram.set(i, this.storage.get(i));

        //start cpu
        this.cycle();

    }

    cycle = function()
    {
        this.getmem();
        //process current instruction at program pointer
        this.process();
        //refresh video from vram
        this.setmem();
        
        this.video.RefreshVideo(this.vram.data);
        //if reached end of memory, stop
        //if(this.ptr != this.ram.data.length - 1)
            //this.cycle();
    }

    process = function()
    {
        //increment prg pointer by one
        this.ptr++;
        //process instruction
        switch(this.ram.get(this.ptr))
        {
            case 0:
                break;
        }
    }

    getmem = function()
    {
        this.memmap.set(65530, this.reg.mb.geth())
        this.memmap.set(65531, this.reg.mb.getl())

        this.memmap.set(65532, this.reg.sp.geth())
        this.memmap.set(65533, this.reg.sp.getl())

        this.memmap.set(65534, this.reg.pc.geth())
        this.memmap.set(65535, this.reg.pc.getl())

        for(let i=0; i<32768; i++)
        {
            this.memmap.set(i, this.storage.get(i));
        }
        for(let i=0; i<32762; i++)
        {
            let offset = getfromhl(this.memmap.get(65530), this.memmap.get(65531))
            this.memmap.set(i+32767, this.ram.get(i+offset));
        }
    }

    setmem = function()
    {
        this.reg.mb.seth(this.memmap.get(65530));
        this.reg.mb.setl(this.memmap.get(65531));

        this.reg.sp.seth(this.memmap.get(65532));
        this.reg.sp.setl(this.memmap.get(65533));

        this.reg.pc.seth(this.memmap.get(65534));
        this.reg.pc.setl(this.memmap.get(65535));

        for(let i=0; i<32762; i++)
        {
            let offset = getfromhl(this.memmap.get(65530), this.memmap.get(65531))
            this.ram.set(i+offset, this.memmap.get(i+32767));
        }
    }
}

function getfromhl(h, l)
{
    let data="";
    data+=h.toString(2) + l.toString(2);
    return parseInt(data, 2);
}