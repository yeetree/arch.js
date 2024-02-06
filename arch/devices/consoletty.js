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
        '','&#01;','&#02;','&#03;','&#04;','&#05;','&#06;','&#;07',
        '&#08;','&#09;','&#10;','&#11;','&#12;','&#13;','&#14;','&#15;',
        '&#16;','&#17;','&#18;','&#19;','&#20;','&#21;','&#22;','&#23;',
        '&#24;','&#25;','&#26;','&#27;','&#28;','&#29;','&#30;','&#31',
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