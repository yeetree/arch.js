class display{
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
    colors = [{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":43},{"r":0,"g":0,"b":86},{"r":0,"g":0,"b":129},{"r":0,"g":43,"b":0},{"r":0,"g":43,"b":43},{"r":0,"g":43,"b":86},{"r":0,"g":43,"b":129},{"r":0,"g":86,"b":0},{"r":0,"g":86,"b":43},{"r":0,"g":86,"b":86},{"r":0,"g":86,"b":129},{"r":0,"g":129,"b":0},{"r":0,"g":129,"b":43},{"r":0,"g":129,"b":86},{"r":0,"g":129,"b":129},{"r":43,"g":0,"b":0},{"r":43,"g":0,"b":43},{"r":43,"g":0,"b":86},{"r":43,"g":0,"b":129},{"r":43,"g":43,"b":0},{"r":43,"g":43,"b":43},{"r":43,"g":43,"b":86},{"r":43,"g":43,"b":129},{"r":43,"g":86,"b":0},{"r":43,"g":86,"b":43},{"r":43,"g":86,"b":86},{"r":43,"g":86,"b":129},{"r":43,"g":129,"b":0},{"r":43,"g":129,"b":43},{"r":43,"g":129,"b":86},{"r":43,"g":129,"b":129},{"r":86,"g":0,"b":0},{"r":86,"g":0,"b":43},{"r":86,"g":0,"b":86},{"r":86,"g":0,"b":129},{"r":86,"g":43,"b":0},{"r":86,"g":43,"b":43},{"r":86,"g":43,"b":86},{"r":86,"g":43,"b":129},{"r":86,"g":86,"b":0},{"r":86,"g":86,"b":43},{"r":86,"g":86,"b":86},{"r":86,"g":86,"b":129},{"r":86,"g":129,"b":0},{"r":86,"g":129,"b":43},{"r":86,"g":129,"b":86},{"r":86,"g":129,"b":129},{"r":129,"g":0,"b":0},{"r":129,"g":0,"b":43},{"r":129,"g":0,"b":86},{"r":129,"g":0,"b":129},{"r":129,"g":43,"b":0},{"r":129,"g":43,"b":43},{"r":129,"g":43,"b":86},{"r":129,"g":43,"b":129},{"r":129,"g":86,"b":0},{"r":129,"g":86,"b":43},{"r":129,"g":86,"b":86},{"r":129,"g":86,"b":129},{"r":129,"g":129,"b":0},{"r":129,"g":129,"b":43},{"r":129,"g":129,"b":86},{"r":129,"g":129,"b":129},{"r":42,"g":42,"b":42},{"r":42,"g":42,"b":85},{"r":42,"g":42,"b":128},{"r":42,"g":42,"b":171},{"r":42,"g":85,"b":42},{"r":42,"g":85,"b":85},{"r":42,"g":85,"b":128},{"r":42,"g":85,"b":171},{"r":42,"g":128,"b":42},{"r":42,"g":128,"b":85},{"r":42,"g":128,"b":128},{"r":42,"g":128,"b":171},{"r":42,"g":171,"b":42},{"r":42,"g":171,"b":85},{"r":42,"g":171,"b":128},{"r":42,"g":171,"b":171},{"r":85,"g":42,"b":42},{"r":85,"g":42,"b":85},{"r":85,"g":42,"b":128},{"r":85,"g":42,"b":171},{"r":85,"g":85,"b":42},{"r":85,"g":85,"b":85},{"r":85,"g":85,"b":128},{"r":85,"g":85,"b":171},{"r":85,"g":128,"b":42},{"r":85,"g":128,"b":85},{"r":85,"g":128,"b":128},{"r":85,"g":128,"b":171},{"r":85,"g":171,"b":42},{"r":85,"g":171,"b":85},{"r":85,"g":171,"b":128},{"r":85,"g":171,"b":171},{"r":128,"g":42,"b":42},{"r":128,"g":42,"b":85},{"r":128,"g":42,"b":128},{"r":128,"g":42,"b":171},{"r":128,"g":85,"b":42},{"r":128,"g":85,"b":85},{"r":128,"g":85,"b":128},{"r":128,"g":85,"b":171},{"r":128,"g":128,"b":42},{"r":128,"g":128,"b":85},{"r":128,"g":128,"b":128},{"r":128,"g":128,"b":171},{"r":128,"g":171,"b":42},{"r":128,"g":171,"b":85},{"r":128,"g":171,"b":128},{"r":128,"g":171,"b":171},{"r":171,"g":42,"b":42},{"r":171,"g":42,"b":85},{"r":171,"g":42,"b":128},{"r":171,"g":42,"b":171},{"r":171,"g":85,"b":42},{"r":171,"g":85,"b":85},{"r":171,"g":85,"b":128},{"r":171,"g":85,"b":171},{"r":171,"g":128,"b":42},{"r":171,"g":128,"b":85},{"r":171,"g":128,"b":128},{"r":171,"g":128,"b":171},{"r":171,"g":171,"b":42},{"r":171,"g":171,"b":85},{"r":171,"g":171,"b":128},{"r":171,"g":171,"b":171},{"r":84,"g":84,"b":84},{"r":84,"g":84,"b":127},{"r":84,"g":84,"b":170},{"r":84,"g":84,"b":213},{"r":84,"g":127,"b":84},{"r":84,"g":127,"b":127},{"r":84,"g":127,"b":170},{"r":84,"g":127,"b":213},{"r":84,"g":170,"b":84},{"r":84,"g":170,"b":127},{"r":84,"g":170,"b":170},{"r":84,"g":170,"b":213},{"r":84,"g":213,"b":84},{"r":84,"g":213,"b":127},{"r":84,"g":213,"b":170},{"r":84,"g":213,"b":213},{"r":127,"g":84,"b":84},{"r":127,"g":84,"b":127},{"r":127,"g":84,"b":170},{"r":127,"g":84,"b":213},{"r":127,"g":127,"b":84},{"r":127,"g":127,"b":127},{"r":127,"g":127,"b":170},{"r":127,"g":127,"b":213},{"r":127,"g":170,"b":84},{"r":127,"g":170,"b":127},{"r":127,"g":170,"b":170},{"r":127,"g":170,"b":213},{"r":127,"g":213,"b":84},{"r":127,"g":213,"b":127},{"r":127,"g":213,"b":170},{"r":127,"g":213,"b":213},{"r":170,"g":84,"b":84},{"r":170,"g":84,"b":127},{"r":170,"g":84,"b":170},{"r":170,"g":84,"b":213},{"r":170,"g":127,"b":84},{"r":170,"g":127,"b":127},{"r":170,"g":127,"b":170},{"r":170,"g":127,"b":213},{"r":170,"g":170,"b":84},{"r":170,"g":170,"b":127},{"r":170,"g":170,"b":170},{"r":170,"g":170,"b":213},{"r":170,"g":213,"b":84},{"r":170,"g":213,"b":127},{"r":170,"g":213,"b":170},{"r":170,"g":213,"b":213},{"r":213,"g":84,"b":84},{"r":213,"g":84,"b":127},{"r":213,"g":84,"b":170},{"r":213,"g":84,"b":213},{"r":213,"g":127,"b":84},{"r":213,"g":127,"b":127},{"r":213,"g":127,"b":170},{"r":213,"g":127,"b":213},{"r":213,"g":170,"b":84},{"r":213,"g":170,"b":127},{"r":213,"g":170,"b":170},{"r":213,"g":170,"b":213},{"r":213,"g":213,"b":84},{"r":213,"g":213,"b":127},{"r":213,"g":213,"b":170},{"r":213,"g":213,"b":213},{"r":126,"g":126,"b":126},{"r":126,"g":126,"b":169},{"r":126,"g":126,"b":212},{"r":126,"g":126,"b":255},{"r":126,"g":169,"b":126},{"r":126,"g":169,"b":169},{"r":126,"g":169,"b":212},{"r":126,"g":169,"b":255},{"r":126,"g":212,"b":126},{"r":126,"g":212,"b":169},{"r":126,"g":212,"b":212},{"r":126,"g":212,"b":255},{"r":126,"g":255,"b":126},{"r":126,"g":255,"b":169},{"r":126,"g":255,"b":212},{"r":126,"g":255,"b":255},{"r":169,"g":126,"b":126},{"r":169,"g":126,"b":169},{"r":169,"g":126,"b":212},{"r":169,"g":126,"b":255},{"r":169,"g":169,"b":126},{"r":169,"g":169,"b":169},{"r":169,"g":169,"b":212},{"r":169,"g":169,"b":255},{"r":169,"g":212,"b":126},{"r":169,"g":212,"b":169},{"r":169,"g":212,"b":212},{"r":169,"g":212,"b":255},{"r":169,"g":255,"b":126},{"r":169,"g":255,"b":169},{"r":169,"g":255,"b":212},{"r":169,"g":255,"b":255},{"r":212,"g":126,"b":126},{"r":212,"g":126,"b":169},{"r":212,"g":126,"b":212},{"r":212,"g":126,"b":255},{"r":212,"g":169,"b":126},{"r":212,"g":169,"b":169},{"r":212,"g":169,"b":212},{"r":212,"g":169,"b":255},{"r":212,"g":212,"b":126},{"r":212,"g":212,"b":169},{"r":212,"g":212,"b":212},{"r":212,"g":212,"b":255},{"r":212,"g":255,"b":126},{"r":212,"g":255,"b":169},{"r":212,"g":255,"b":212},{"r":212,"g":255,"b":255},{"r":255,"g":126,"b":126},{"r":255,"g":126,"b":169},{"r":255,"g":126,"b":212},{"r":255,"g":126,"b":255},{"r":255,"g":169,"b":126},{"r":255,"g":169,"b":169},{"r":255,"g":169,"b":212},{"r":255,"g":169,"b":255},{"r":255,"g":212,"b":126},{"r":255,"g":212,"b":169},{"r":255,"g":212,"b":212},{"r":255,"g":212,"b":255},{"r":255,"g":255,"b":126},{"r":255,"g":255,"b":169},{"r":255,"g":255,"b":212},{"r":255,"g":255,"b":255}]
}

class videodevice {
  display = null; // Display
  vram = null; // VRAM

  mode = 0; // Video Mode
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
    term = null

    
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