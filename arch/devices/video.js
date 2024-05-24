class display {
    canvas = null;
    ctx = null;

    constructor()
    {
        //get canvas for video and get 2d context
        this.canvas = document.getElementById("screen"),
        this.ctx = this.canvas.getContext("2d");

        //set resolution
        this.canvas.width = 256;
        this.canvas.height = 256;
        this.canvas.willReadFrequently = true;

        //set to black
        this.ctx.fillStyle="0x00";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    RefreshVideo = function(buffer)
    {
        //get old buffer from 2d context (we're not using the old pixel data, but it has
        //some nessecary information that we need to plug it back into the 2d context)
        let oldbuf=this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
        let newbuf=[];

        //loop through every pixel and get each RGB value from the buffer
        //from the color pallete defined below
        for(let i=0; i<oldbuf.data.length/4; i++)
        {
            let pxcol=this.colors[wrap(256, buffer[i])]
            newbuf.push(pxcol.r)
            newbuf.push(pxcol.g)
            newbuf.push(pxcol.b)
            newbuf.push(255)
        }
        //overwrite old buffer pixel data with our updated one
        oldbuf.data.set(newbuf);
        //push our new buffer to the 2d context
        this.ctx.putImageData(oldbuf,0,0)
    }

    /* My 256 Color Pallete -- https://codepen.io/Vinny-the-flexboxer/pen/yLwQMNo */
    colors = [{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":65},{"r":0,"g":0,"b":130},{"r":0,"g":0,"b":195},{"r":0,"g":65,"b":0},{"r":0,"g":65,"b":65},{"r":0,"g":65,"b":130},{"r":0,"g":65,"b":195},{"r":0,"g":130,"b":0},{"r":0,"g":130,"b":65},{"r":0,"g":130,"b":130},{"r":0,"g":130,"b":195},{"r":0,"g":195,"b":0},{"r":0,"g":195,"b":65},{"r":0,"g":195,"b":130},{"r":0,"g":195,"b":195},{"r":65,"g":0,"b":0},{"r":65,"g":0,"b":65},{"r":65,"g":0,"b":130},{"r":65,"g":0,"b":195},{"r":65,"g":65,"b":0},{"r":65,"g":65,"b":65},{"r":65,"g":65,"b":130},{"r":65,"g":65,"b":195},{"r":65,"g":130,"b":0},{"r":65,"g":130,"b":65},{"r":65,"g":130,"b":130},{"r":65,"g":130,"b":195},{"r":65,"g":195,"b":0},{"r":65,"g":195,"b":65},{"r":65,"g":195,"b":130},{"r":65,"g":195,"b":195},{"r":130,"g":0,"b":0},{"r":130,"g":0,"b":65},{"r":130,"g":0,"b":130},{"r":130,"g":0,"b":195},{"r":130,"g":65,"b":0},{"r":130,"g":65,"b":65},{"r":130,"g":65,"b":130},{"r":130,"g":65,"b":195},{"r":130,"g":130,"b":0},{"r":130,"g":130,"b":65},{"r":130,"g":130,"b":130},{"r":130,"g":130,"b":195},{"r":130,"g":195,"b":0},{"r":130,"g":195,"b":65},{"r":130,"g":195,"b":130},{"r":130,"g":195,"b":195},{"r":195,"g":0,"b":0},{"r":195,"g":0,"b":65},{"r":195,"g":0,"b":130},{"r":195,"g":0,"b":195},{"r":195,"g":65,"b":0},{"r":195,"g":65,"b":65},{"r":195,"g":65,"b":130},{"r":195,"g":65,"b":195},{"r":195,"g":130,"b":0},{"r":195,"g":130,"b":65},{"r":195,"g":130,"b":130},{"r":195,"g":130,"b":195},{"r":195,"g":195,"b":0},{"r":195,"g":195,"b":65},{"r":195,"g":195,"b":130},{"r":195,"g":195,"b":195},{"r":20,"g":20,"b":20},{"r":20,"g":20,"b":85},{"r":20,"g":20,"b":150},{"r":20,"g":20,"b":215},{"r":20,"g":85,"b":20},{"r":20,"g":85,"b":85},{"r":20,"g":85,"b":150},{"r":20,"g":85,"b":215},{"r":20,"g":150,"b":20},{"r":20,"g":150,"b":85},{"r":20,"g":150,"b":150},{"r":20,"g":150,"b":215},{"r":20,"g":215,"b":20},{"r":20,"g":215,"b":85},{"r":20,"g":215,"b":150},{"r":20,"g":215,"b":215},{"r":85,"g":20,"b":20},{"r":85,"g":20,"b":85},{"r":85,"g":20,"b":150},{"r":85,"g":20,"b":215},{"r":85,"g":85,"b":20},{"r":85,"g":85,"b":85},{"r":85,"g":85,"b":150},{"r":85,"g":85,"b":215},{"r":85,"g":150,"b":20},{"r":85,"g":150,"b":85},{"r":85,"g":150,"b":150},{"r":85,"g":150,"b":215},{"r":85,"g":215,"b":20},{"r":85,"g":215,"b":85},{"r":85,"g":215,"b":150},{"r":85,"g":215,"b":215},{"r":150,"g":20,"b":20},{"r":150,"g":20,"b":85},{"r":150,"g":20,"b":150},{"r":150,"g":20,"b":215},{"r":150,"g":85,"b":20},{"r":150,"g":85,"b":85},{"r":150,"g":85,"b":150},{"r":150,"g":85,"b":215},{"r":150,"g":150,"b":20},{"r":150,"g":150,"b":85},{"r":150,"g":150,"b":150},{"r":150,"g":150,"b":215},{"r":150,"g":215,"b":20},{"r":150,"g":215,"b":85},{"r":150,"g":215,"b":150},{"r":150,"g":215,"b":215},{"r":215,"g":20,"b":20},{"r":215,"g":20,"b":85},{"r":215,"g":20,"b":150},{"r":215,"g":20,"b":215},{"r":215,"g":85,"b":20},{"r":215,"g":85,"b":85},{"r":215,"g":85,"b":150},{"r":215,"g":85,"b":215},{"r":215,"g":150,"b":20},{"r":215,"g":150,"b":85},{"r":215,"g":150,"b":150},{"r":215,"g":150,"b":215},{"r":215,"g":215,"b":20},{"r":215,"g":215,"b":85},{"r":215,"g":215,"b":150},{"r":215,"g":215,"b":215},{"r":40,"g":40,"b":40},{"r":40,"g":40,"b":105},{"r":40,"g":40,"b":170},{"r":40,"g":40,"b":235},{"r":40,"g":105,"b":40},{"r":40,"g":105,"b":105},{"r":40,"g":105,"b":170},{"r":40,"g":105,"b":235},{"r":40,"g":170,"b":40},{"r":40,"g":170,"b":105},{"r":40,"g":170,"b":170},{"r":40,"g":170,"b":235},{"r":40,"g":235,"b":40},{"r":40,"g":235,"b":105},{"r":40,"g":235,"b":170},{"r":40,"g":235,"b":235},{"r":105,"g":40,"b":40},{"r":105,"g":40,"b":105},{"r":105,"g":40,"b":170},{"r":105,"g":40,"b":235},{"r":105,"g":105,"b":40},{"r":105,"g":105,"b":105},{"r":105,"g":105,"b":170},{"r":105,"g":105,"b":235},{"r":105,"g":170,"b":40},{"r":105,"g":170,"b":105},{"r":105,"g":170,"b":170},{"r":105,"g":170,"b":235},{"r":105,"g":235,"b":40},{"r":105,"g":235,"b":105},{"r":105,"g":235,"b":170},{"r":105,"g":235,"b":235},{"r":170,"g":40,"b":40},{"r":170,"g":40,"b":105},{"r":170,"g":40,"b":170},{"r":170,"g":40,"b":235},{"r":170,"g":105,"b":40},{"r":170,"g":105,"b":105},{"r":170,"g":105,"b":170},{"r":170,"g":105,"b":235},{"r":170,"g":170,"b":40},{"r":170,"g":170,"b":105},{"r":170,"g":170,"b":170},{"r":170,"g":170,"b":235},{"r":170,"g":235,"b":40},{"r":170,"g":235,"b":105},{"r":170,"g":235,"b":170},{"r":170,"g":235,"b":235},{"r":235,"g":40,"b":40},{"r":235,"g":40,"b":105},{"r":235,"g":40,"b":170},{"r":235,"g":40,"b":235},{"r":235,"g":105,"b":40},{"r":235,"g":105,"b":105},{"r":235,"g":105,"b":170},{"r":235,"g":105,"b":235},{"r":235,"g":170,"b":40},{"r":235,"g":170,"b":105},{"r":235,"g":170,"b":170},{"r":235,"g":170,"b":235},{"r":235,"g":235,"b":40},{"r":235,"g":235,"b":105},{"r":235,"g":235,"b":170},{"r":235,"g":235,"b":235},{"r":60,"g":60,"b":60},{"r":60,"g":60,"b":125},{"r":60,"g":60,"b":190},{"r":60,"g":60,"b":255},{"r":60,"g":125,"b":60},{"r":60,"g":125,"b":125},{"r":60,"g":125,"b":190},{"r":60,"g":125,"b":255},{"r":60,"g":190,"b":60},{"r":60,"g":190,"b":125},{"r":60,"g":190,"b":190},{"r":60,"g":190,"b":255},{"r":60,"g":255,"b":60},{"r":60,"g":255,"b":125},{"r":60,"g":255,"b":190},{"r":60,"g":255,"b":255},{"r":125,"g":60,"b":60},{"r":125,"g":60,"b":125},{"r":125,"g":60,"b":190},{"r":125,"g":60,"b":255},{"r":125,"g":125,"b":60},{"r":125,"g":125,"b":125},{"r":125,"g":125,"b":190},{"r":125,"g":125,"b":255},{"r":125,"g":190,"b":60},{"r":125,"g":190,"b":125},{"r":125,"g":190,"b":190},{"r":125,"g":190,"b":255},{"r":125,"g":255,"b":60},{"r":125,"g":255,"b":125},{"r":125,"g":255,"b":190},{"r":125,"g":255,"b":255},{"r":190,"g":60,"b":60},{"r":190,"g":60,"b":125},{"r":190,"g":60,"b":190},{"r":190,"g":60,"b":255},{"r":190,"g":125,"b":60},{"r":190,"g":125,"b":125},{"r":190,"g":125,"b":190},{"r":190,"g":125,"b":255},{"r":190,"g":190,"b":60},{"r":190,"g":190,"b":125},{"r":190,"g":190,"b":190},{"r":190,"g":190,"b":255},{"r":190,"g":255,"b":60},{"r":190,"g":255,"b":125},{"r":190,"g":255,"b":190},{"r":190,"g":255,"b":255},{"r":255,"g":60,"b":60},{"r":255,"g":60,"b":125},{"r":255,"g":60,"b":190},{"r":255,"g":60,"b":255},{"r":255,"g":125,"b":60},{"r":255,"g":125,"b":125},{"r":255,"g":125,"b":190},{"r":255,"g":125,"b":255},{"r":255,"g":190,"b":60},{"r":255,"g":190,"b":125},{"r":255,"g":190,"b":190},{"r":255,"g":190,"b":255},{"r":255,"g":255,"b":60},{"r":255,"g":255,"b":125},{"r":255,"g":255,"b":190},{"r":255,"g":255,"b":255}]
}

class videodevice {
  display = null; // Display
  vram = null; // VRAM

  mode = 0; // Video Update Mode
  cfg = 0; // Current Foreground Color
  cbg = 0; // Current Background Color

  constructor() {
    this.display = new display(); // Initialize Display
    this.vram = new memory(65536); // Initialize VRAM
  }

  update = function() {
    switch(this.mode) {
      
      default: // 0 - No Mode
        break;

      case 1: // 1 - Text Mode (32 chars x 32 chars)
        this.updatetext();
        break;

      case 2: // 2 - Copy Font ROM to VRAM
        this.vram.memcpy(64512, fontromdata); /* Can be found in fontrom.js */
        break;

      case 3: // 3 - Bitmap Mode (256 x 256)
        this.display.RefreshVideo(this.vram.data);
    }
  }

  updatetext = function() {
    let ind = 0; // Index in memory
    let ln = 0; // Line
    let ch = 0; // Character
    let letter = 0; // Letter
    let fg = 0; // Foreground Color
    let bg = 0; // Background Color

    let chfontaddr = 64512; // Address of font
    let charfont = "";      // String of current character
    let bufind = 0;         // Index of character location on buffer
    let letterind = 0;      // Index of pixel of character being drawn


    let buffer = Array(65536).fill(0); // Pixel buffer

    // 32 x 32 = 1024
    for(let i=0; i<1024; i++) {
      
      // Get character details
      letter = this.vram.getbyte(ind); ind+=1;
      fg = this.vram.getbyte(ind); ind+=1;
      bg = this.vram.getbyte(ind); ind+=1;

      // Get binary string of current letter
      charfont = "";

      for(let e=0; e<8; e++) {
        console.log(this.vram.getbyte(chfontaddr + (letter*8) + e))
        charfont += this.vram.getbyte(chfontaddr + (letter*8) + e).toString(2).padStart(8, '0');
      }

      // Get location of character on buffer
      bufind = (ch * 8) + (ln * 2048);
      letterind = 0;

      // Draw character
      for(let e=0; e<8; e++)
      {
          for(let f=0; f<8; f++)
          {
              if(charfont[letterind] == "1") {
                  buffer[bufind] = fg;
              }
              else
                  buffer[bufind] = bg;
              bufind+=1
              letterind+=1;
          }
          bufind+=248;
      }

      // If we have reached horizontal character limit
      if(ch == 31) {
        ch = 0;
        ln += 1;
      }
      else {
        ch += 1;
      }

    }

    this.display.RefreshVideo(buffer);
  }
}

class videoserial extends device {
  devices = null;

  address = 20;
  h = 0;
  l = 0;
  static = false;

  row = 0;
  col = 0;
  esc = false;
  escstr = "";

  //term = null

  constructor(device) {
      super(device);
      this.devices = device;
      //this.term = document.getElementById("console");
      //this.term.innerHTML = "";
      //this.term.outerHTML = this.term.outerHTML;
      //this.term = document.getElementById("console");

      //this.term.addEventListener('keydown', this.keyhandler.bind(this), false);
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

  /*
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
  }*/

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

      let buf = this.devices.getdevice(this.address + 3).videodevice.vram.data;
      let txt = [];
      for(let i=0; i<3072; i++) {
        txt[i] = buf[i];
      }

      let hc = this.handlecontrol(txt, val);
      txt = hc.txt;

      let addr = this.col*(this.row+1);

      if(!hc.handled) {
        this.devices.getdevice(this.address+3).videodevice.vram.setbyte(addr  , val)
        this.devices.getdevice(this.address+3).videodevice.vram.setbyte(addr+1, 255)
      }

      this.col+=1;
      if(this.col >= 32) {
        this.col == 0;
        this.row +=1;
      }
      if(this.row >= 32) {
        this.col == 0;
        this.row == 0;
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

  handleesc = function(val) {
    let nescstr = this.escstr.concat([val]);
    let goodesc = false;
    /*switch(nescstr[0]) {
      case 
    }*/
  }

  handlecontrol = function(txt, val) {
    
    let handled = false;

    switch(val) {
      case 7: // Bell
        //bell
        handled = true;
        break;
      
      case 8: // Backspace
        handled = true;
        break;

      case 9: // Horizontal Tab
        handled = true;
        break;

      case 10: // Line Feed
        handled = true;
        break;

      case 12: // Form Feed -- Theres no printer :(
        handled = true;
        break;

      case 13: // Carriage Return
        handled = true;
        break;

      case 27: // Escape
        this.escstr = "";
        this.esc = true;
        handled = true;
        break;
    }

    if(this.esc) {
      this.handleesc(val);
      handled = true;
    }

    return {txt:txt, handled:handled};
  }
}

class videomanager extends device {
  devices = null;
  
  address = 21;
  static = true;

  // Called before data is being read / written do device
  process = function() {
      
  }

  // Called when CPU is reading device
  inb = function() {
      this.devices.getdevice(this.address + 2).videodevice.update();
      return this.devices.getdevice(this.address + 2).videodevice.mode
  }

  // Called when CPU is reading device
  inw = function() {
      this.devices.getdevice(this.address + 2).videodevice.update();
      return this.devices.getdevice(this.address + 2).videodevice.mode
  }

  // Called when CPU is sending data to device
  outb = function(val) {
      this.devices.getdevice(this.address + 2).videodevice.mode = wrap(256, val);
  }

  // Called when CPU is sending data to device
  outw = function(val) {
      this.devices.getdevice(this.address + 2).videodevice.mode = wrap(256, val);
  }

  constructor(device) {
      super(device);
      this.devices = device;
  }
}

class videodatamanager extends device {
  devices = null;
    
  address = 22;
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

  constructor(device) {
      super(device);
      this.devices = device;
  }
}

class videodata extends device {
  devices = null;
  
  address = 23;
  static = true;
  mode = 0;

  straddress = 0;
  videodevice = null;

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
              return this.videodevice.vram.getbyte(this.straddress);
              break;
          case 2:     /* Mode 2 */
              let val = this.videodevice.vram.getbyte(this.straddress);
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
              return this.videodevice.vram.getword(this.straddress);
              break;
          case 2:     /* Mode 2 */
              let val = this.videodevice.vram.getword(this.straddress);
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
              this.videodevice.vram.setbyte(this.straddress, val)
              break;
          case 4:     /* Mode 4 */
              this.videodevice.vram.setbyte(this.straddress, val)
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
              if(this.setword) { this.videodevice.vram.setword(this.straddress, val); }
              else { this.straddress = val; }
          case 6:  /* Mode 6 */
              if(this.setword) { this.videodevice.vram.setword(this.straddress, val); this.straddress += 2; }
              else { this.straddress = val; }
      }
  }

  constructor(device, videodevice = null) {
      super(device);
      this.devices = device;
      this.videodevice = videodevice;
  }
}

//This converts a hex string to RGB values
const hex2rgb = (hex) => {
    // Remove the # character if present
    hex = hex.replace("#", "");
  
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    if (hex.length === 3) {
      hex = hex.replace(/(.)/g, "$1$1");
    }
  
    // Verify if the input is a valid hexadecimal color code
    const validHexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  
    if (!validHexRegex.test(hex)) {
      throw new Error("Invalid Hexadecimal Color Code.");
    }
  
    // Convert the hex value to decimal
    const [r, g, b] = hex.match(/[A-Fa-f0-9]{2}/g).map((value) => parseInt(value, 16));
  
    // Return the RGB values as an object
    return {
      r,
      g,
      b
    };
  };