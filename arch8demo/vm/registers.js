//Arch.js Registers:
//This simulates the registers on a 8 bit CPU.
//These were largely modeled after the JDH-8.

class registers {

    a=null;
    b=null;
    c=null;
    d=null;

    ih=null;
    il=null;
    r=null;

    f = null;

    mb = null;
    sp = null;
    pc = null;

    constructor()
    {
        //Sets up registers
        this.f = new register8();

        this.a = new register8();
        this.b = new register8();
        this.c = new register8();
        this.d = new register8();

        this.ih = new register8();
        this.il = new register8();
        this.r = new register8();

        this.mb = new register16();
        this.sp = new register16();
        this.pc = new register16();
    }
}

class register8
{
    data="";
    constructor()
    {
        this.data="00000000"
    }
    setbit = function(bit, val)
    {
        let da = []
        da = this.data.split('')
        if(bit >= 0 && bit <= 7 && (val==0 || val==1))
            da[bit] = val;
            this.data=da.toString().replace(/,/g, '');
        
    }
    getbit = function(bit)
    {
        if(bit >= 0 && bit <= 7)
            return parseInt(this.data[bit], 2);
    }
    set = function(val)
    {
        if(val >= 0 && val <= 255)
            this.data = val.toString(2);
    }
    get = function()
    {
        return parseInt(this.data, 2)
    }
}

class register16
{
    data="";
    constructor()
    {
        this.data="0000000000000000"
    }
    seth = function(val)
    {
        let l = []
        let vals = []
        if(val>=0 && val<=255)
            vals = val.toString(2);
            while(vals.length < 8)
                vals = "0" + vals;
            for(let i=8; i<16; i++)
                l[i]=this.data[i]
            this.data=vals + l.join('');
    }
    setl = function(val)
    {
        let h = []
        let vals = []
        if(val>=0 && val<=255)
            vals = val.toString(2);
            while(vals.length < 8)
                vals = "0" + vals;
            for(let i=0; i<8; i++)
                h[i]=this.data[i]
            this.data=h.join('') + vals;
    }
    geth = function()
    {
        let vals = "";
        for(let i=0; i<8; i++)
            vals+=this.data[i];

        return parseInt(vals, 2);
    }
    getl = function()
    {
        let vals = "";
        for(let i=8; i<16; i++)
            vals+=this.data[i];

        return parseInt(vals, 2);
    }
    set = function(val)
    {
        if(val >= 0 && val <= 65535)
        {
            let vals = val.toString(2);
            while(vals.length < 16)
            {
                vals = "0" + vals;
            }
            this.data = vals;
        }
    }
    get = function()
    {
        return parseInt(this.data, 2)
    }
}



/*
//This is the 16 bit split register class.
//Basically, it's just a regular 16 bit register that is split into high and low values.
//It also supports utilizing the whole 16 bits if nessecary.
class register16s {
    h = 0;
    l = 0;

    seth = function(val) {
        if(val >= 0 && val <= 255)
            this.h = val;
    }
    setl = function(val) {
        if(val >= 0 && val <= 255)
            this.l = val;
    }

    setr = function(val) {
        //just some funky code to convert an input number into a binary string,
        //split it in half, and parse those strings into numbers and set it to the
        //high and low values.

        //Basically a number like 5000 will go to 0001001110001000 -> 00010011 and 10001000 -> 19 and 136
        if(val >= 0 && val <= 65535)
        {
            val = val.toString(2)
            while(val.length < 16){val = "0" + val;}
            num1="";
            num2="";

            for(let i=0; i<8; i++){num1+=val[i]}
            for(let i=8; i<16; i++){num2+=val[i]}

            this.h=parseInt(num1, 2);
            this.l=parseInt(num2, 2);
        }
    }

    //This is just the inverse of the previous function. Add the binary strings from high and low, then
    //parse it and return the whole value.
    //if high is 19 and low is 136, we turn it into:
    //00010011 and 10001000 -> 0001001110001000 -> 5000
    getr = function() {
        num1=this.h.toString(2);
        num2=this.l.toString(2);

        val=num1+num2;
        return parseInt(val, 2)
    }
}

//16 bit number. That's it.
class register16 {
    r=0;

    setr = function(val) {
        if(val >= 0 && val <= 65535)
        {
            this.r=val;
        }
    }

    getr = function() {
        return this.r;
    }
}*/