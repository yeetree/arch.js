class diskmgr extends device {
    devices = null;
    
    address = 10;
    static = true;

    // Called before data is being read / written do device
    process = function() {
        
    }

    // Called when CPU is reading device
    inb = function() {
        return this.devices.getdevice(this.address + 1).mode
    }

    // Called when CPU is reading device
    inw = function() {
        return this.devices.getdevice(this.address + 1).mode
    }

    // Called when CPU is sending data to device
    outb = function(val) {
        this.devices.getdevice(this.address + 1).straddress = 0;
        this.devices.getdevice(this.address + 1).mode = wrap(256, val);
    }

    // Called when CPU is sending data to device
    outw = function(val) {
        this.devices.getdevice(this.address + 1).straddress = 0;
        this.devices.getdevice(this.address + 1).mode = wrap(256, val);
    }

    constructor(device, space = 65536) {
        super(device);
        this.devices = device;
        this.storage = new memory(space);
    }
}

class disk extends device {
    devices = null;
    
    address = 11;
    static = true;
    mode = 0;

    straddress = 0;
    storage = null;

    setword = false;

    // Called before data is being read / written do device
    process = function() {
        
    }

    // Called when CPU is reading device
    inb = function() {
        switch(this.mode) {
            default:    /* Mode 0 */
                return 0;
                break;
            case 1:     /* Mode 1 */
                return this.storage.getbyte(this.straddress);
                break;
            case 2:     /* Mode 2 */
                let val = this.storage.getbyte(this.straddress);
                this.straddress += 1;
                return val;
                break;
            case 3:     /* Mode 3 */
                return 0;
                break;
            case 4:     /* Mode 4 */
                return 0;
                break;
            case 5:     /* Mode 5 */
                return 0;
                break;
            case 6:     /* Mode 6 */
                return 0;
                break;
        }
    }

    // Called when CPU is reading device
    inw = function() {
        switch(this.mode) {
            default:    /* Mode 0 */
                return 0;
                break;
            case 1:     /* Mode 1 */
                return this.storage.getword(this.straddress);
                break;
            case 2:     /* Mode 2 */
                let val = this.storage.getword(this.straddress);
                this.straddress += 1;
                return val;
                break;
            case 3:     /* Mode 3 */
                return 0;
                break;
            case 4:     /* Mode 4 */
                return 0;
                break;
            case 5:     /* Mode 5 */
                return 0;
                break;
            case 6:     /* Mode 6 */
                return 0;
                break;
        }
    }

    // Called when CPU is sending data to device
    outb = function(val) {
        val = wrap(256, val);

        switch(this.mode) {
            default:    /* Mode 0 */
                this.mode = val;
                this.straddress = 0;
                break;
            case 1:     /* Mode 1 */
                this.straddress = val;
                break;
            case 2:     /* Mode 2 */
                this.straddress = val;
                break;
            case 3:     /* Mode 3 */
                this.storage.setbyte(this.straddress, val)
                break;
            case 4:     /* Mode 4 */
                this.storage.setbyte(this.straddress, val)
                this.straddress += 1;
                break;
            case 5:     /* Mode 5 */
                if(val > 0) { this.setword = true; }
                else { this.setword = false; }
                break;
            case 6:     /* Mode 6 */
                if(val > 0) { this.setword = true; }
                else { this.setword = false; }
                break;
        }
    }

    // Called when CPU is sending data to device
    outw = function(val) {
        val = wrap(65536, val);

        switch(this.mode) {
            default: /* Mode 0 */
                this.mode = wrap(256, val);
                break;
            case 1:  /* Mode 1 */
                this.straddress = val;
                break;
            case 2:  /* Mode 2 */
                this.straddress = val;
                break;
            case 3:  /* Mode 3 */
                this.straddress = val;
                break;
            case 4:  /* Mode 4 */
                this.straddress = val;
                break;
            case 5:  /* Mode 5 */
                if(this.setword) { this.storage.setword(this.straddress, val); }
                else { this.straddress = val; }
            case 6:  /* Mode 6 */
                if(this.setword) { this.storage.setword(this.straddress, val); this.straddress += 2; }
                else { this.straddress = val; }
        }
    }

    constructor(device, space = 65536) {
        super(device);
        this.devices = device;
        this.storage = new memory(space);
    }
}