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
    load = function(mem)
    {
        this.data = mem;
    }
    loadfrom(pt, mem)
    {
        let st = mem.split(',');
        for(let i=0; i<mem.length; i++)
        {
            this.set(i+pt, mem[i])
        }
    }
    constructor(size)
    {
        this.data = Array(size).fill(0);
    }
}