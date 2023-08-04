class registers {
    ax = new register16();
    bx = new register16();
    cx = new register16();
    dx = new register16();

    r = new register16();

    sp = new register16();
    bp = new register16();

    f = new register16();

    pc = new register16();
}

class register8 {
    data=0;

    //This whole class is simple.
    //If the value is in range, set it.
    set = function(val) {
        if(val > 255)
            this.data = 255;
        else if(val < 0)
            this.data = 0;
        else
            this.data = val;
    }

    get = function(val) {
        return this.data;
    }
}

class register16 {
    high = new register8();
    low = new register8();

    //This class is way simpler than the older one.
    //No more binary string manipulation. Just numbers..... except for setbit and getbit..
    set = function(val) {
        if(val > 65535) {
            this.high.set(255);
            this.low.set(255);
        }
        else if(val < 0)
        {
            this.high.set(0);
            this.low.set(0);
        }
        else
        {
            let hl = gethl(val);
            this.high.set(hl[0]);
            this.low.set(hl[1]);
        }
    }

    get = function() {
        return getfromhl(this.high.get(), this.low.get());
    }

    setbit = function(bit, val)
    {
        //Get binary string from current 16 bit binary value
        let str = this.get().toString(2);

        //Make sure it is 16 bits long
        while(str.length < 16)
            str = "0" + str;

        //If it is in range and either 1 or 0, set the bit.
        if(bit >= 0 && bit < 16 && (val==1 || val==0))
        {
            let da = str.split('')
            da[bit] = val;
            str=da.toString().replace(/,/g, '');
            let num = parseInt(str, 2);
            let hl = gethl(num);
            this.high.set(hl[0]);
            this.low.set(hl[1]);
        }
    }

    getbit = function(bit)
    {
            //Get binary string from current 16 bit binary value
            let str = this.get().toString(2);

            //Make sure it is 16 bits long
            while(str.length < 16)
                str = "0" + str;

            //If bit is in range, return value.
            if(bit >= 0 && bit < 16)
            {
                if(str[bit] == "1")
                    return 1;
                else
                    return 0
            }
            else
                //return zero just in case
                console.log("Bit out of range.")
                return 0;
    }
}