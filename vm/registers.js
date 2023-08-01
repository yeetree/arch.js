//Arch.js Registers:
//This simulates the registers on a 16 bit CPU.
//These were largely modeled after the 8086.

class registers {
    ax=null;
    bx=null;
    cx=null;
    dx=null;
    sp=null;
    bp=null;
    si=null;
    di=null;

    constructor()
    {
        this.ax = new register16s();
        this.bx = new register16s();
        this.cx = new register16s();
        this.dx = new register16s();

        this.sp = new register16();
        this.bp = new register16();
        this.si = new register16();
        this.di = new register16();
    }
}

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
    getr = function() {
        num1=this.h.toString(2);
        num2=this.l.toString(2);

        val=num1+num2;
        return parseInt(val, 2)
    }
}

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
}