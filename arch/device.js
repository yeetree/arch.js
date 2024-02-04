class device {
    devices = null;

    address = 0;
    h = 0;
    l = 0;
    static = false;

    // Called before data is being read / written do device
    process = function() {
        
    }

    // Called when CPU is reading device
    inb = function() {
        return this.l;
    }

    // Called when CPU is sending data to device
    outb = function(val) {
        val = wrap(256, val);
    }

    // Called when CPU is reading device
    inw = function() {
        return getfromhl(this.h, this.l);
    }

    // Called when CPU is sending data to device
    outw = function(val) {
        val = wrap(65536, val);
    }

    constructor(device) {
        this.devices = device
    }
}