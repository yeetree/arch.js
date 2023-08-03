//Arch.JS Display Firmware:
//This manages the display from the VM, and has nothing to do with the actual
//simulation of the CPU, and acts more like an accessory. This is the firmware for the display.

class display {
    canvas = null;
    ctx = null;

    constructor()
    {
        //get canvas for video and get 2d context
        this.canvas = document.getElementById("screen"),
        this.ctx = this.canvas.getContext("2d");

        //set resolution
        this.canvas.width = 192;
        this.canvas.height = 192;
        this.canvas.willReadFrequently = true;

        //set to black
        this.ctx.fillStyle="#0x00";
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
            let pxcol=hex2rgb(this.colors[buffer[i]])
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
    
    colors = [
        '#000000', '#400000', '#400000', '#400900', '#234000', '#004000', '#004000', '#004000',
        '#000d40', '#000040', '#000040', '#000040', '#000040', '#280040', '#400003',
        '#400000', '#540000', '#540000', '#541d00', '#375400', '#005400',
        '#005400', '#005402', '#002154', '#000054', '#000054', '#000054', '#000054',
        '#3c0054', '#540017', '#540000', '#0d0d0d', '#680000', '#680000', '#683100',
        '#4b6800', '#006800', '#006800', '#006816', '#003568', '#001168', '#000068',
        '#000068', '#000068', '#500068', '#68002b', '#680000', '#212121', '#7c0000',
        '#7c0000', '#7c4500', '#5f7c00', '#0b7c00', '#007c00', '#007c2a', '#00497c',
        '#00257c', '#00007c', '#00007c', '#10007c', '#64007c', '#7c003f', '#7c0000',
        '#353535', '#900000', '#900400', '#905900', '#739000', '#1f9000', '#009000',
        '#00903e', '#005d90', '#003990', '#000090', '#000090', '#240090', '#780090',
        '#900053', '#900000', '#494949', '#a40000', '#a41800', '#a46d00', '#87a400',
        '#33a400', '#00a400', '#00a452', '#0071a4', '#004da4', '#0000a4', '#0000a4',
        '#3800a4', '#8c00a4', '#a40067', '#a40013', '#5d5d5d', '#b80000', '#b82c00',
        '#b88100', '#9bb800', '#47b800', '#00b800', '#00b866', '#0085b8', '#0061b8',
        '#000db8', '#0000b8', '#4c00b8', '#a000b8', '#b8007b', '#b80027', '#717171',
        '#cc0000', '#cc4000', '#cc9500', '#afcc00', '#5bcc00', '#06cc00', '#00cc7a',
        '#0099cc', '#0075cc', '#0021cc', '#0c00cc', '#6000cc', '#b400cc', '#cc008f',
        '#cc003b', '#858585', '#e00000', '#e05400', '#e0a900', '#c3e000', '#6fe000',
        '#1ae000', '#00e08e', '#00ade0', '#0089e0', '#0035e0', '#2000e0', '#7400e0',
        '#c800e0', '#e000a3', '#e0004f', '#999999', '#f41414', '#f46814', '#f4bd14',
        '#d7f414', '#83f414', '#2ef414', '#14f4a2', '#14c1f4', '#149df4', '#1449f4',
        '#3414f4', '#8814f4', '#dc14f4', '#f414b7', '#f41463', '#adadad', '#ff2828',
        '#ff7c28', '#ffd128', '#ebff28', '#97ff28', '#42ff28', '#28ffb6', '#28d5ff',
        '#28b1ff', '#285dff', '#4828ff', '#9c28ff', '#f028ff', '#ff28cb', '#ff2877',
        '#c1c1c1', '#ff3c3c', '#ff903c', '#ffe53c', '#ffff3c', '#abff3c', '#56ff3c',
        '#3cffca', '#3ce9ff', '#3cc5ff', '#3c71ff', '#5c3cff', '#b03cff', '#ff3cff',
        '#ff3cdf', '#ff3c8b', '#d5d5d5', '#ff5050', '#ffa450', '#fff950', '#ffff50',
        '#bfff50', '#6aff50', '#50ffde', '#50fdff', '#50d9ff', '#5085ff', '#7050ff',
        '#c450ff', '#ff50ff', '#ff50f3', '#ff509f', '#e9e9e9', '#ff6464', '#ffb864',
        '#ffff64', '#ffff64', '#d3ff64', '#7eff64', '#64fff2', '#64ffff', '#64edff',
        '#6499ff', '#8464ff', '#d864ff', '#ff64ff', '#ff64ff', '#ff64b3', '#fdfdfd',
        '#ff7878', '#ffcc78', '#ffff78', '#ffff78', '#e7ff78', '#92ff78', '#78ffff',
        '#78ffff', '#78ffff', '#78adff', '#9878ff', '#ec78ff', '#ff78ff', '#ff78ff',
        '#ff78c7', '#ffffff', '#ff8c8c', '#ffe08c', '#ffff8c', '#ffff8c', '#fbff8c',
        '#a6ff8c', '#8cffff', '#8cffff', '#8cffff', '#8cc1ff', '#ac8cff', '#ff8cff',
        '#ff8cff', '#ff8cff', '#ff8cdb', '#ffffff'
    ]
}

//This converts a hex string to RGB values
const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // return {r, g, b} 
    return { r, g, b };
}