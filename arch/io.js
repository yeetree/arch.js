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

    constructor(device) {
        super(device);
        this.devices = device
    }
}