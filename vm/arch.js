//Arch.js:
//This is a custom cpu written in javascript!

class arch
{
    storage = null;
    ram = null;
    vram = null;
    video = null;
    reg = null;
    ports = null;
    
    ptr = null;
    noop = null;

    do = true;

    paused = false;

    constructor()
    {
        //initiate components
        this.storage = new memory(32767);
        this.ram = new memory(65536);
        this.vram = new memory(65536);
        this.memmap = new memory(65536);
        this.video = new display();
        this.reg = new registers();

        this.ports = new ports();

        //get storage
        if(localStorage.getItem("slot1") === null)
            localStorage.setItem("slot1", this.storage.data);
        else
        {
            let tmp = localStorage.getItem("slot1").split(',');
            let tmpn = [];

            for(let i=0; i<tmp.length; i++)
                tmpn[i] = parseInt(tmp[i]);

            this.storage.load(tmpn);
        }

        //Set stack pointer to the default value
        this.reg.sp.set(65273);

        //Load storage on startup
        for(let i=0; i<32768; i++)
        {
            this.memmap.set(i, this.storage.get(i));
        }

        this.getmem();

        //start cpu
        this.start();

    }

    stop = async function()
    {
        this.do = false;
    }

    start = async function()
    {
        this.do = true;
        let insts = {
            nop:   "0000",
            add:   "0001",
            adc:   "0010",
            and:   "0011",
            or:    "0100",
            sub:   "0101",
            cmp:   "0110",
            push:  "0111",
            pop:   "1000",
            mw:    "1001",
            lw:    "1010",
            sw:    "1011",
            lda:   "1100",
            jnz:   "1101",
            inb:   "1110",
            outb:  "1111",
        }

        while(this.do)
        {
            this.setmem();

            let mov = 1;

            //process instruction
            let byte = this.memmap.get(this.reg.pc.get()).toString(2)
            let byte2 = this.memmap.get(this.reg.pc.get() + 1).toString(2)

            while(byte.length < 8)
                byte = "0" + byte

            while(byte2.length < 8)
                byte2 = "0" + byte2

            let inst = "";
            let regi = "";
            let regr = null;
            let val = null;

            for(let i=0; i<4; i++)
                inst+=byte[i];

            for(let i=5; i<8; i++)
                regi+=byte[i];

            regr = this.getregbybin(regi)

            if(byte[4]=="1")
            {
                val = this.getregbybin(byte2).get();
            }
            else
            {
                val = parseInt(byte2, 2);
            }

            console.log(inst + " " + val)

            switch(inst)
            {
                case insts.nop:
                    break;
                case insts.add:
                    //ADD
                    if(regr.get() + val <= 255)
                        regr.set(regr.get() + val)
                    else
                        regr.set(255)
                    mov+=1;
                    break;
                case insts.adc:
                    //ADD WITH CARRY
                    if(regr.get() + val <= 255)
                    {
                        regr.set(regr.get() + val);
                        this.reg.f.setbit(1,0)
                    }   
                    else
                    {
                        regr.set(255)
                        this.reg.f.setbit(1,1)
                    }
                    mov+=1;
                    break;
                case insts.and:
                    //BITWISE AND
                    regr.set(regr.get() & val)
                    mov+=1
                    break;
                case insts.or:
                    //BITWISE OR
                    regr.set(regr.get() | val)
                    mov+=1
                    break;
                case insts.sub:
                    //SUBTRACT
                    if(regr.get() - val >= 0)
                        regr.set(regr.get() - val)
                    else;
                        regr.set(0)
                    mov+=1;
                    break;
                case insts.cmp:
                    //CMP
                    if(regr.get() == val)
                        this.reg.f.setbit(3,1)
                    else
                        this.reg.f.setbit(3,0)
                    mov+=1;
                    break;
                case insts.push:
                    if(this.reg.sp.get() < 65529)
                    {
                        this.ram.set(this.reg.sp.get(), val);
                        this.reg.sp.set(this.reg.sp.get() + 1);
                        this.reg.f.setbit(7, 0)
                    }
                    else
                    {
                        this.reg.f.setbit(7, 1)
                    }
                    mov+=1;
                    break;
                case insts.pop:
                    if(this.reg.sp.get() > 65273)
                    {
                        this.reg.sp.set(this.reg.sp.get() - 1);
                        regr.set(this.ram.get(this.reg.sp.get()));
                        this.reg.f.setbit(7, 0)
                    }
                    else
                    {
                        this.reg.f.setbit(7, 1)
                    }
                    break;
                case insts.mw:
                    //MOVE WORD
                    regr.set(val)
                    mov+=1;
                    break;
                case insts.lw:
                    if(byte[4]=="1")
                    {
                        val = getfromhl(this.reg.ih.get(), this.reg.il.get());
                    }
                    else
                    {
                        let byte2 = this.memmap.get(this.reg.pc.get() + 1)
                        let byte3 = this.memmap.get(this.reg.pc.get() + 2);

                        val = getfromhl(byte2, byte3);
                        mov+=2;
                    }
                    regr.set(this.memmap.get(val));
                    break;
                case insts.sw:
                    if(byte[4]=="1")
                    {
                        val = getfromhl(this.reg.ih.get(), this.reg.il.get());
                    }
                    else
                    {
                        let byte2 = this.memmap.get(this.reg.pc.get() + 1)
                        let byte3 = this.memmap.get(this.reg.pc.get() + 2);

                        val = getfromhl(byte2, byte3);
                        mov+=2;
                    }
                    this.memmap.set(val, regr.get());
                    break;
                case insts.lda:
                    let byte2 = this.memmap.get(this.reg.pc.get() + 1)
                    let byte3 = this.memmap.get(this.reg.pc.get() + 2);


                    mov+=2;
                    this.reg.ih.set(byte2);
                    this.reg.il.set(byte3);
                    break;
                case insts.jnz:
                    if(val != 0)
                    {
                        mov = 0;
                        this.reg.pc.set(getfromhl(this.reg.ih.get(), this.reg.il.get()));
                    }
                    break;
                case insts.inb:
                    let v = await this.ports.out(val, this)
                    regr.set(v)
                    mov+=1;
                    break;
                case insts.outb:
                    this.ports.in(val, regr.get())
                    mov+=1;
                    break;
            }
            this.reg.pc.set(this.reg.pc.get() + mov);
    
            this.getmem();
            this.video.RefreshVideo(this.vram.data);
    
            if(this.reg.pc.get() >= this.memmap.data.length)
            {
                this.do=false;
                break;
            }

            await sleep(1)
        }
    }

    getregbybin = function(r)
    {
        let v = parseInt(r, 2);
        switch(v)
        {
            case 0:
                return this.reg.a;
            case 1:
                return this.reg.b;
            case 2:
                return this.reg.c;
            case 3:
                return this.reg.d;
            case 4:
                return this.reg.r;
            case 5:
                return this.reg.ih;
            case 6:
                return this.reg.il;
            case 7:
                return this.reg.f;
        }
    }

    getmem = function()
    {
        this.memmap.set(65530, this.reg.mb.geth())
        this.memmap.set(65531, this.reg.mb.getl())

        this.memmap.set(65532, this.reg.sp.geth())
        this.memmap.set(65533, this.reg.sp.getl())

        this.memmap.set(65534, this.reg.pc.geth())
        this.memmap.set(65535, this.reg.pc.getl())

        //Banked RAM
        for(let i=0; i<16252; i++)
        {
            let offset = getfromhl(this.memmap.get(65530), this.memmap.get(65531))
            this.memmap.set(i+32768, this.ram.get(i+offset));
        }
        //Unbanked RAM
        for(let i=0; i<16509; i++)
        {
            this.memmap.set(i+49020, this.ram.get(i+16251));
        }
    }

    setmem = function()
    {
        this.reg.mb.seth(this.memmap.get(65530));
        this.reg.mb.setl(this.memmap.get(65531));

        this.reg.sp.seth(this.memmap.get(65532));
        this.reg.sp.setl(this.memmap.get(65533));

        this.reg.pc.seth(this.memmap.get(65534));
        this.reg.pc.setl(this.memmap.get(65535));

        /*
        for(let i=0; i<32762; i++)
        {
            let offset = getfromhl(this.memmap.get(65530), this.memmap.get(65531))
            this.ram.set(i+offset, this.memmap.get(i+32767));
        }*/
        
        //Banked RAM
        for(let i=0; i<16252; i++)
        {
            let offset = getfromhl(this.memmap.get(65530), this.memmap.get(65531))
            this.ram.set(i+offset, this.memmap.get(i+32768));
        }
        //Unbanked RAM
        for(let i=0; i<16509; i++)
        {
            this.ram.set(i+49020, this.memmap.get(i+49020));
        }
    }
}

function getfromhl(h, l)
{
    let data="";
    let low = l.toString(2);
    let high = h.toString(2);

    while(low.length < 8)
        low = "0" + low;
    while(high.length < 8)
        high = "0" + high;

    data+=high + low;
    return parseInt(data, 2);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}