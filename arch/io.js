class iomanager {
    devices = [];
    blankdev = new blankdevice();

    getdevice = function(port) {
        for(let i = 0; i < this.devices.length; i++) {
            if(this.devices[i].address == port) {
                if(!this.devices[i].static) {
                    this.devices[i].process();
                }
                return this.devices[i];
            }
        }
        return this.blankdev;
    }

    inb = function(port) {
        return this.getdevice(port).inb();
    }

    outb = function(val, port) {
        this.getdevice(port).outb(val);
    }

    inw = function(port) {
        return this.getdevice(port).inw();
    }

    outw = function(val, port) {
        this.getdevice(port).outw(val);
    }
}

class device {
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
}

class blankdevice extends device {
    static = true;

    // Called when CPU is reading device
    inb = function() {
        return 0;
    }

    // Called when CPU is sending data to device
    outb = function(val) {
        return;
    }

    // Called when CPU is reading device
    inw = function() {
        return 0;
    }

    // Called when CPU is sending data to device
    outw = function(val) {
        return;
    }
}