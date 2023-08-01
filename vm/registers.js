//Arch.js Registers:
//This simulates the registers on a 8 bit CPU.
//These were largely modeled after the 8-bit AVR.

class registers {
    sreg=null;

    r1=null;
    r2=null;
    r3=null;
    r4=null;
    r5=null;
    r6=null;
    r7=null;
    r8=null;
    r9=null;
    r10=null;
    r11=null;
    r12=null;
    r13=null;
    r14=null;
    r15=null;
    r16=null;

    sph=null;
    spl=null;

    pc=null;

    constructor()
    {
        //Sets up registers
        this.sreg = new register8();

        this.r1 = new register8();
        this.r2 = new register8();
        this.r3 = new register8();
        this.r4 = new register8();
        this.r5 = new register8();
        this.r6 = new register8();
        this.r7 = new register8();
        this.r8 = new register8();
        this.r9 = new register8();
        this.r10 = new register8();
        this.r11 = new register8();
        this.r12 = new register8();
        this.r13 = new register8();
        this.r14 = new register8();
        this.r15 = new register8();
        this.r16 = new register8();

        this.sph = new register8();
        this.spl = new register8();

        this.pc = new register16();
    }
}

class register8
{
    data="";
    constructor()
    {
        data="00000000"
    }
    setbit = function(bit, val)
    {
        if(bit >= 0 && bit <= 7 && (val==0 || val==1))
            this.data[bit] = val;
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
        data="0000000000000000"
    }
    seth = function(val)
    {
        if(val>=0 && val<=255)
            vals = val.toString(2);
            for(let i=0; i<8; i++)
                this.data[i]=vals[i]
    }
    setl = function(val)
    {
        if(val>=0 && val<=255)
            vals = val.toString(2);
            for(let i=9; i<16; i++)
                this.data[i]=vals[i]
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
        for(let i=9; i<16; i++)
            vals+=this.data[i];

        return parseInt(vals, 2);
    }
    set = function(val)
    {
        if(val >= 0 && val <= 65535)
            this.data = val.toString(2);
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