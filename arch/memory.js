class memory {
    
    data = [];
    readonly = false;

    constructor(size)
    {
        this.data = Array(size).fill(0);
    }

    setbyte = function(loc, val)
    {
        //Sets a byte in this memory.
        //If the location is in bounds and this storage isn't readonly, continue.
        if(loc >= 0 && loc < this.data.length && !this.readonly)
            //If the value is greater than 255, then just set it to 255
            if(val > 255)
                this.data[loc] = 255;
            //If it is less than zero, then just set it to zero
            else if(val < 0)
                this.data[loc] = 0;
            //If neither, then set it to the value.
            else
                this.data[loc] = val;
    }
    setword = function(loc, val)
    {
        //Sets a word in this memory.
        //If the location is in bounds and this storage isn't readonly, continue.
        if(loc >= 0 && loc < this.data.length - 1 && !this.readonly)
            //If the value is greater than 255, then just set it to 255
            if(val > 65535)
            {
                this.data[loc] = 128;
                this.data[loc+1] = 0;
            }
            //If it is less than zero, then just set it to zero
            else if(val < 0)
            {
                this.data[loc] = 0;
                this.data[loc+1] = 0;
            }
            //If neither, then set it to the value.
            else
            {
                let hl = gethl(val)
                this.data[loc] = hl[0];
                this.data[loc+1] = hl[1];
            }
    }

    getbyte = function(loc)
    {
        //This one is simple. If the location is in range, return
        //the data at the requested location
        if(loc >= 0 && loc < this.data.length)
            return this.data[loc];
    }

    getword = function(loc)
    {
        //If the location is in range, return the data combined with the next data at the
        //requested location.
        if(loc >= 0 && loc < this.data.length - 1)
            return getfromhl(this.data[loc], this.data[loc+1]);
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

