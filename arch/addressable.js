class addressable {
    data = [];

    // Gets the "real" location of memory address by calculating where it is on memory map
    // 0: Which chip is it? (what element on data array)
    // 1: Which address is it? (what element on chip's data array)
    // 0 will be -1 if real memory location cannot be found
    getreallocation(loc) {
        // Build memory map
        let mmap = [];
        let prevvalue = 0; 
        let totallength = 0;
        for(let i = 0; i < this.data.length; i++) {
            mmap.push(this.data[i].data.length - 1 + prevvalue);
            prevvalue += this.data[i].data.length + prevvalue;
            totallength += this.data[i].data.length
        }

        loc = wrap(totallength, loc)

        // Reset variable for later
        prevvalue = 0
        // Variable for what memory slot the address is located in
        let memloc = -1;
        // Variable for what offset the memory slot address is
        let memlocoff = 0;
        // Variable for what location in the memory slot the address is located in
        let memlocadd = 0;

        for(let i = 0; i < this.data.length; i++) {
            if(loc >= prevvalue && loc <= mmap[i]) {
                memloc = i;
                memlocoff = prevvalue;
                break;
            }
            prevvalue += this.data[i].data.length + prevvalue;
        }

        if(memloc >= 0) {
            memlocadd = loc - memlocoff;
        }

        return [memloc, memlocadd]
    }

    // Sets a byte at given location
    setbyte = function(loc, val)
    {
        //Sets a byte in this memory.
        //If the location is in bounds and this storage isn't readonly, continue.

        //Get real memory location
        let rloc = this.getreallocation(loc);

        if(rloc[0] != -1) {
            // Wrap value (just in case)
            this.data[rloc[0]].setbyte([rloc[1]], val);
        }
    }

    // Sets a word at given location
    setword = function(loc, val)
    {
        //Sets a word in this memory.
        //If the location is in bounds and this storage isn't readonly, continue.

        //Get real memory location
        let rloc = this.getreallocation(loc);
        let rloc2 = this.getreallocation(loc + 1);

        let hl = gethl(val);

        if(rloc[0] != -1) {
            // Wrap value (just in case)
            this.data[rloc[0]].setbyte([rloc[1]], hl[0]);
        }

        if(rloc[1] != -1) {
            // Wrap value (just in case)
            this.data[rloc2[0]].setbyte([rloc2[1]], hl[1]);
        }
    }

    // Retrieves a byte at given location
    getbyte = function(loc)
    {
        //This one is simple. If the location is in range, return
        //the data at the requested location

        //Get real memory location
        let rloc = this.getreallocation(loc);

        if(rloc[0] != -1)
            return this.data[rloc[0]].getbyte([rloc[1]]);
    }

    // Retrieves a word at given location
    getword = function(loc)
    {
        //If the location is in range, return the data combined with the next data at the
        //requested location.

        //Get real memory location
        let rloc = this.getreallocation(loc);

        if(rloc[0] != -1)
            return this.data[rloc[0]].getword(rloc[1]);
    }

    // Dumps all memory in the system
    memdump = function() {
        // Build memory map
        let mmap = [];
        let prevvalue = 0; 
        let totallength = 0;
        for(let i = 0; i < this.data.length; i++) {
            mmap.push(this.data[i].data.length - 1 + prevvalue);
            prevvalue += this.data[i].data.length + prevvalue;
            totallength += this.data[i].data.length
        }

        let memdump = []

        for(let i = 0; i < totallength; i++) {
            memdump[i] = this.getbyte(i);
        }

        return memdump;
    }
}