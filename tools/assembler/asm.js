class asm {
    prg=[];
    outb="";

    compile = function(inp)
    {
        this.prg=[]
        this.outb=""

        this.prg=inp.split(';')
    }

    getinst = function(inst)
    {
        let ins = inst.split(',')

        switch(ins[0].toLowerCase())
        {
            case "noop":
                outb.push("00000000");
        }
    }
}