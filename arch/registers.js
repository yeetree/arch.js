class registers {
    f = new register16(this);
    pc = new register16(this);
    sp = new register16(this);
    bp = new register16(this);

    i = new register16(this);

    ax = new register16(this);
    bx = new register16(this);
    cx = new register16(this);
    dx = new register16(this);
}

class register16 {
    registers = null;
    high = 0
    low = 0

    constructor(reg = null) {
        this.registers = reg;
    }

    get = function() {
        return parseInt((this.high.toString(2).padStart(8, '0') + this.low.toString(2).padStart(8, '0')).split(''), 2)
    }

    set = function(value) {
        // Get current value
        let val = this.get();
    }

    setbit = function(bit, value) {
        // Gets 16 bit binary array of high and low values
        let bstring = (this.high.toString(2).padStart(8, '0') + this.low.toString(2).padStart(8, '0')).split('')
        if(value) { bstring[bit] = '1' }
        else { bstring[bit] = '0' }

        // Reconnects string
        bstring = bstring.join('');
        // Splits string into two numbers from binary value
        this.high = parseInt(bstring.substring(0,8), 2);
        this.low = parseInt(bstring.substring(8,16), 2);
    }
}