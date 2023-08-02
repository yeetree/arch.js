class asm {
    lines=[];
    outb="";

    compile = function(inp)
    {
        this.lines=[]
        this.outb=""

        this.lines=inp.split(';')

        for(let i=0; i<this.lines.length; i++)
        {
            let newi = this.getinst(this.lines[i]);
            if(newi == "-1")
                return "ERROR";
            if(newi != "-2")
                this.outb+=newi;
                console.log(newi);
        }

        let outn = "";
        let outba = this.outb.split(',');
        outba.pop();
        for(let i=0; i<outba.length; i++)
        {
            let tmp = parseInt(outba[i], 2)
            outn+=tmp.toString()+",";
        }
        outn = outn.slice(0, -1); 
        return outn;
    }

    getinst = function(inst)
    {
        let str=""
        let reg=""
        let val=""

        if(inst=="")
            return "-2";

        let ins = inst.split(',')

        switch(ins[0].toLowerCase())
        {
            case "noop":
                return "00000000,";
            case "add":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "0001";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                val = this.lookreg(ins[2])

                if(val == "0")
                {
                    let tmp = parseInt(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                return str;
            case "adc":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "0010";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                val = this.lookreg(ins[2])

                if(val == "0")
                {
                    let tmp = parseInt(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                return str;
            case "and":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "0011";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                val = this.lookreg(ins[2])

                if(val == "0")
                {
                    let tmp = parseInt(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                return str;
            case "or":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "0100";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                val = this.lookreg(ins[2])

                if(val == "0")
                {
                    let tmp = parseInt(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                return str;
            case "sub":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "0101";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                val = this.lookreg(ins[2])

                if(val == "0")
                {
                    let tmp = parseInt(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                return str;
            case "cmp":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "0110";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                val = this.lookreg(ins[2])

                if(val == "0")
                {
                    let tmp = parseInt(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                return str;
            case "push":
                if(ins.length != 2)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "0111";

                val = this.lookreg(ins[1])

                if(val == "0")
                {
                    let tmp = parseInt(ins[1]);
                    str+="0000"+","+tmp.toString(2)+",";
                }
                else
                    str+="1000"+",00000"+val+",";

                return str;
            case "pop":
                if(ins.length != 2)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "1000";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                str+="0"+reg+",";

                return str;
            case "mw":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "1001";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                val = this.lookreg(ins[2])

                if(val == "0")
                {
                    let tmp = parseInt(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                return str;
            case "jnz":
                if(ins.length != 2)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "1101";

                val = this.lookreg(ins[1])

                if(val == "0")
                {
                    let tmp = parseInt(ins[1]);
                    str+="0000"+","+tmp.toString(2)+",";
                }
                else
                    str+="1000"+",00000"+val+",";

                return str;
        }
    }

    lookreg = function(r)
    {
        switch(r.toLowerCase())
        {
            case "a":
                return "000";
            case "b":
                return "001";
            case "c":
                return "010";
            case "d":
                return "011";
            case "r":
                return "100";
            case "ih":
                return "101";
            case "il":
                return "110";
            case "f":
                return "111";
            default:
                return "0";
        }
    }
}