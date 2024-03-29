class consoletty extends device {
    devices = null;

    address = 0;
    h = 0;
    l = 0;
    static = false;
    term = null

    constructor(device) {
        super(device);
        this.devices = device;
        this.term = document.getElementById("console");
        this.term.innerHTML = "";
        this.term.outerHTML = this.term.outerHTML;
        this.term = document.getElementById("console");

        this.term.addEventListener('keydown', this.keyhandler.bind(this), false);
    }

    ascii = [
        '','\u0001','\u0002','\u0003','\u0004','\u0005','\u0006','\u0007',
        '\u0008','\u0009','\u000A','\u000B','\u000C','\u000D','\u000E','\u000F',
        '\u0010','\u0011','\u0012','\u0013','\u0014','\u0015','\u0016','\u0017',
        '\u0018','\u0019','\u001A','\u001B','\u001C','\u001D','\u001E','\u001F',
        ' ', '!', '"', '#', '$', '%', '&', '\'',
        '(', ')', '*', '+', ',', '-', '.', '/',
        '0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9', ':', ';', '<', '=', '>', '?',
        '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
        'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
        'X', 'Y', 'Z', '[', '\\' ,']', '^', '_',
        '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
        'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
        'x', 'y', 'z', '{', '|', '}', '~', ''
    ];

    keyhandler = function(e) {
        if(e.key.length == 1)
        {
            let ret = 0;
            if(this.ascii.indexOf(e.key) != -1)
                ret=this.ascii.indexOf(e.key)
            this.l = ret;
        }
        else if(e.key == "Enter")
        {
            this.l = 13;
        }
        else if(e.key == "Backspace")
        {
            this.l = 8;
        }
    }

    // Called before data is being read / written do device
    process = function() {
        
    }

    // Called when CPU is reading device
    inb = function() {
        let tmp = this.l;
        this.h = 0;
        this.l = 0;
        return tmp;
    }

    // Called when CPU is sending data to device
    outb = function(val) {
        val = wrap(256, val);
        if(val == 8) {
            let txt = this.term.value
            this.term.value = txt.substr(0, txt.length - 1)
        }
        else {
            this.term.value += this.ascii[val]
        }
    }

    // Called when CPU is reading device
    inw = function() {
        let tmph = this.h;
        let tmpl = this.l
        this.h = 0;
        this.l = 0;
        return getfromhl(tmph, tmpl);
    }

    // Called when CPU is sending data to device
    outw = function(val) {
        this.outb(val);
    }
}