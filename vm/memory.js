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
    }
    load = function(mem)
    {
        this.data = mem;
    }
    constructor(size)
    {
        this.data = Array(size).fill(0);
    }
}