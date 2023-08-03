//Arch.JS Memory:
//This is a general-use class for memories. Like RAM, VRAM, Storage, etc.
//This pretty much is just a fancy array.

class memory {
    data = [];
    readonly=false;
    set = function(loc, val)
    {
        if(loc >= 0 && loc <= this.data.length - 1)
            this.data[loc] = val;
    }
    get = function(loc)
    {
        if(loc >= 0 && loc <= this.data.length - 1)
            return this.data[loc];
        else
            return 0;
    }
    load = function(slot)
    {
        if(localStorage.getItem(slot) === null)
        {
            localStorage.setItem(slot, this.data);
            this.loadfrom(0, defaultprg);
            this.save(slot);
        }
        else
        {
            let tmp = localStorage.getItem(slot).split(',');
            let tmpn = [];

            for(let i=0; i<tmp.length; i++)
                tmpn[i] = parseInt(tmp[i]);

            this.data=tmpn;
        }
        localStorage.setItem("load",slot);
    }
    loadfrom(pt, mem)
    {
        let st = mem.split(',');
        let stn = []
        for(let i=0; i<st.length; i++)
            stn[i] = parseInt(st[i]);

        for(let i=0; i<stn.length; i++)
        {
            this.set(i+pt, stn[i])
        }
    }
    save = function(slot)
    {
        localStorage.setItem("load", slot);
        localStorage.setItem(slot, this.data);
    }
    constructor(size)
    {
        this.data = Array(size).fill(0);
    }
}

defaultprg="144,72,240,1,144,101,240,1,144,108,240,1,240,1,144,111,240,1,144,44,240,1,144,32,240,1,144,87,240,1,144,111,240,1,144,114,240,1,144,108,240,1,144,100,240,1,144,33,240,1,144,13,240,1,144,87,240,1,144,101,240,1,144,108,240,1,144,99,240,1,144,111,240,1,144,109,240,1,144,101,240,1,144,32,240,1,144,116,240,1,144,111,240,1,144,32,240,1,144,65,240,1,144,114,240,1,144,99,240,1,144,104,240,1,144,46,240,1,144,74,240,1,144,83,240,1,144,33,240,1"