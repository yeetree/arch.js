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

    w = new register16(this);
}

class register16 {
    registers = null;
    high = 0
    low = 0

    constructor(reg = null) {
        this.registers = reg;
    }

    // Get value of registers
    get = function() {
        return getfromhl(this.high, this.low)
    }

    // Set value of registers
    set = function(value, carry = false) {
        // Get current value
        let val = this.get();
        let num = value

        // If num is more than 16 bit limit (carry)
        if(num > 65535) {
            if(carry) {
                // SET CARRY FLAG HERE
                //this.registers.f.set8(0, true);
                this.registers.f.setbit(6, 1);
            }

            // Wrap number
            num = wrap(65536, num)
        }

        // If num is less than 16 bit limit (carry)
        else if(num < 0) {
            if(carry) {
                // SET CARRY FLAG HERE
                //this.registers.f.set8(0, true);
                this.registers.f.setbit(6, 1);
            }
            
            // Wrap number
            num = wrap(65536, num)
        }
        else {
            if(carry) {
                // UNSET CARRY FLAG HERE
                //this.registers.f.set8(true, 0);
                this.registers.f.setbit(6, 0);
            }
        }

        let numa = gethl(num);
        this.high = numa[0];
        this.low = numa[1];
    }

    // Get 8 bit subregister. hl = true: high, hl = false: low
    get8 = function(hl = false) {
        let reg = this.low
        if(hl) { reg = this.high }

        return wrap(256, reg)
    }

    // Set 8 bit subregister. hl = true: high, hl = false: low
    set8 = function(value, hl = false, carry = false) {
        let val = this.low
        if(hl) { val = this.high }

        let num = value

        // If num is more than 8 bit limit (carry)
        if(num > 255) {
            if(carry) {
                // SET CARRY FLAG HERE
                //this.registers.f.set8(0, true);
                this.registers.f.setbit(6, 1);
            }
            // Wrap number
            num = wrap(256, num)
        }

        // If num is less than 8 bit limit (carry)
        else if(num < 0) {
            if(carry) {
                // SET CARRY FLAG HERE
                //this.registers.f.set8(0, true);
                this.registers.f.setbit(6, 1);
            }
            // Wrap number
            num = wrap(256, num)
        }
        else {
            if(carry) {
                // UNSET CARRY FLAG HERE
                //this.registers.f.set8(true, 0);
                this.registers.f.setbit(6, 0);
            }
        }

        if(hl) {
            this.high = num;
        }
        else {
            this.low = num;
        }
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

    getbit = function(bit) {
        // Gets 16 bit binary array of high and low values
        let bstring = (this.high.toString(2).padStart(8, '0') + this.low.toString(2).padStart(8, '0')).split('')
        
        if(bstring[bit] == '1') { return true }
        else { return false }
    }
}

function wrap(m, n) {
    return n >= 0 ? n % m : (n % m + m) % m
}

function getfromhl(h, l) {
    h = wrap(256, h)
    l = wrap(256, l)

    return (h << 8) | l;
}

function gethl(value) {
    let num = value

    // If num is more than 16 bit
    if(num > 65535) {
        // Wrap number
        num = wrap(65536, num)
    }

    // If num is less than 16 bit
    if(num < 0) {     
        // Wrap number
        num = wrap(65536, num)
    }

    let numstring = num.toString(2).padStart(16, '0')

    let num1 = parseInt(numstring.slice(0, 8), 2)
    let num2 = parseInt(numstring.slice(8), 2)

    return [num1, num2]
}