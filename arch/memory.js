class memory {
    
    data = [];
    readonly = false;

    constructor(size, reado = false)
    {
        this.data = Array(size).fill(0);
        this.readonly = reado;
    }

    setbyte = function(loc, val, force = false)
    {
        //Sets a byte in this memory.
        //If the location is in bounds and this storage isn't readonly, continue.
        if(loc >= 0 && loc < this.data.length) {
            if(!this.readonly || force) {
                // Wrap value (just in case)
                this.data[loc] = wrap(256, val);
            }
        }
    }
    setword = function(loc, val, force = false)
    {
        //Sets a word in this memory.
        //If the location is in bounds and this storage isn't readonly, continue.
        if(loc >= 0 && loc < this.data.length - 1) {
            if(!this.readonly || force) {
                // Wrap value (just in case) and get high/low values
                let hl = gethl(wrap(65536, val))
                this.data[loc] = hl[0];
                this.data[loc+1] = hl[1];
            }
        }
    }

    getbyte = function(loc)
    {
        //This one is simple. If the location is in range, return
        //the data at the requested location
        if(loc >= 0 && loc < this.data.length)
            return wrap(256, this.data[loc]);
    }

    getword = function(loc)
    {
        //If the location is in range, return the data combined with the next data at the
        //requested location.
        if(loc >= 0 && loc < this.data.length - 1)
            return getfromhl(this.data[loc], this.data[loc+1]);
    }

    load = function(slot)
    {
        if(localStorage.getItem(slot) === null)
        {
            localStorage.setItem(slot, this.data);
            this.memcpy(0, "0");
            this.save(slot);
        }
        else
        {
            let tmp = localStorage.getItem(slot).split(',');
            let tmpn = [];

            for(let i=0; i<tmp.length; i++)
                tmpn[i] = parseInt(tmp[i]);

            for(let i=0; i<tmpn.length; i++)
            {
                this.data[wrap(this.data.length, i)] = tmpn[i];
            }
        }
        localStorage.setItem("load",slot);
    }

    memcpy(pt, mem)
    {
        let st = mem.split(',');
        let stn = []
        for(let i=0; i<st.length; i++)
            stn[i] = parseInt(st[i]);

        for(let i=0; i<stn.length; i++)
        {
            let val = wrap(256, stn[i])
            if(!val) {
                val = 0;
            }
            this.data[wrap(this.data.length, i+pt)] = val;
        }
    }
    
    save = function(slot, setload = true)
    {
        if(setload) { localStorage.setItem("load", slot); }
        localStorage.setItem(slot, this.data);
    }

    reset = function() {
        this.data = Array(this.data.length).fill(0);
    }
}

/* old getfromhl. New version in registers.js
function getfromhl(h, l)
{
    let data="";
    let low = l.toString(2);
    let high = h.toString(2);

    while(low.length < 8)
        low = "0" + low;
    while(high.length < 8)
        high = "0" + high;

    data+=high + low;
    return parseInt(data, 2);
}
*/

/* old gethl. New version in registers.js
function gethl(int)
{
    //This splits the integer into two 8bit binary numbers,
    //then converts them into numbers and returns the split numbers.
    let str = int.toString(2);

    let h = 0;
    let l = 0;

    while(str.length < 16)
        str = "0" + str;

    let hstr = ""
    let lstr = ""
    for(let i=0; i<8; i++)
        hstr+=str[i]
    for(let i=8; i<16; i++)
        lstr+=str[i]

    h = parseInt(hstr, 2);
    l = parseInt(lstr, 2);

    return [h, l];
}*/

