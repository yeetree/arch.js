//Arch.JS Memory:
//This is a general-use class for memories. Like RAM, VRAM, Storage, etc.
//This pretty much is just a fancy array.

class memory {
    data = [];
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
            localStorage.setItem(slot, this.data);
        else
        {
            let tmp = localStorage.getItem(slot).split(',');
            let tmpn = [];

            for(let i=0; i<tmp.length; i++)
                tmpn[i] = parseInt(tmp[i]);

            this.data=tmpn;
        }
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
        localStorage.setItem(slot, this.data);
    }
    constructor(size)
    {
        this.data = Array(size).fill(0);
    }
}