class asm {
    lines=[];
    outb="";

    curptr=0

    labn=[];
    labptr=[];

    compile = function(inp)
    {
        this.lines=[]
        this.outb=""
        this.labn=[];
        this.labptr=[];
        this.curptr=0;

        this.lines=inp.split(';')

        for(let i=0; i<this.lines.length; i++)
        {
            let newi = this.getinst(this.lines[i]);
            if(newi == "-1")
                return "ERROR: Check Console. Line:" + i;
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
            if(outba[i][0] == ":")
            {
                let gotlabel = false;
                for(let e=0; e<this.labn.length; e++)
                {
                    if(this.labn[e] == outba[i].substring(1))
                    {

                        gotlabel = true;
                        let bin2 = get16bitstr(this.labptr[e]);
                        let tmp2 = bin2.split(',');
                        let num1 = parseInt(tmp2[0], 2);
                        let num2 = parseInt(tmp2[1], 2);
                        outn+=num1.toString() + "," + num2.toString() + ","
                    }
                }
                if(!gotlabel)
                    return "ERROR: Label doesn't exist.";
            }
            else
            {
                outn+=tmp.toString()+",";
            }
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
            case "!":
                return "";
            default:
                return "-1";
            case "noop":
                this.curptr+=1;
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
                    let tmp = get8bitnum(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                this.curptr+=2;
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
                    let tmp = get8bitnum(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                this.curptr+=2;
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
                    let tmp = get8bitnum(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";
                
                this.curptr+=2;
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
                    let tmp = get8bitnum(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                this.curptr+=2;
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
                    let tmp = get8bitnum(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                this.curptr+=2;
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
                    let tmp = get8bitnum(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                this.curptr+=2;
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
                    let tmp = get8bitnum(ins[1]);
                    str+="0000"+","+tmp.toString(2)+",";
                }
                else
                    str+="1000"+",00000"+val+",";

                this.curptr+=2;
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

                this.curptr+=1;
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
                    let tmp = get8bitnum(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                this.curptr+=2;
                return str;
            case "lw":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "1010";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                if(ins[2].toLowerCase() == "ix")
                    val="1"
                else
                    val="0"

                if(val == "0")
                {
                    let tmp = get16bitstr(ins[2]);

                    this.curptr+=2;
                    str+="0"+reg+","+tmp+",";
                }
                else
                    this.curptr+=1;
                    str+="1"+reg+",";

                return str;
            case "sw":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "1011";
                reg = this.lookreg(ins[2])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                if(ins[1].toLowerCase() == "ix")
                    val="1"
                else
                    val="0"

                if(val == "0")
                {
                    let tmp = get16bitstr(ins[1]);


                    str+="0"+reg+","+tmp+",";
                    this.curptr+=2;
                }
                else
                    str+="1"+reg+",";
                    this.curptr+=1;

                return str;
            case "lda":
                if(ins.length != 2)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "1100";


                let tmp = get16bitstr(ins[1]);

                str+="0000,"+tmp+",";

                this.curptr+=3;
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
                    let tmp = get8bitnum(ins[1]);
                    str+="0000"+","+tmp.toString(2)+",";
                }
                else
                    str+="1000"+",00000"+val+",";

                this.curptr+=2;
                return str;
            case "inb":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "1110";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                val = this.lookreg(ins[2])

                if(val == "0")
                {
                    let tmp = get8bitnum(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                this.curptr+=2;
                return str;
            case "outb":
                if(ins.length != 3)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                str = "1111";
                reg = this.lookreg(ins[1])

                if(reg == "0")
                {
                    console.log("First arg has to be register")
                    return "-1";
                }

                val = this.lookreg(ins[2])

                if(val == "0")
                {
                    let tmp = get8bitnum(ins[2]);
                    str+="0"+reg+","+tmp.toString(2)+",";
                }
                else
                    str+="1"+reg+",00000"+val+",";

                this.curptr+=2;
                return str;

            case "label":
                if(ins.length != 2)
                {
                    console.log("Invalid amount of args")
                    return "-1";
                }

                this.labn.push(ins[1]);
                this.labptr.push(this.curptr);
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

function get8bitnum(num)
{
    let tm = parseInt(num);
    for(let i=0; i<asciistr.length; i++)
    {
        if(num==asciistr[i])
        {
            tm = asciistr.indexOf(num)
        }
    }
    if(num[0] == "#")
    {
        tm = parseInt(num.substring(1), 16);
    }
    if(isNaN(tm))
        tm=0;
    if(tm<0)
        return 0;
    else if(tm>255)
        return 255;
    else
        return tm;
}

function get16bitstr(num)
{
    let tm = parseInt(num);
    for(let i=0; i<asciistr.length; i++)
    {
        if(num==asciistr[i])
        {
            tm = asciistr.indexOf(num)
        }
    }
    if(num[0] == "#")
    {
        tm = parseInt(num.substring(1), 16);
    }
    else if(num == "$")
    {
        tm = this.curptr;
    }
    else if(num[0] == ":")
    {
        return num;
    }
    if(isNaN(tm))
        tm=0;
    if(tm<0)
        return "00000000,00000000";
    else if(tm>65535)
        return "11111111,11111111";

    let bin = tm.toString(2);

    while(bin.length < 16)
        bin = "0" + bin;

    let num1 = ""
    let num2 = ""

    for(let i=0; i<8; i++)
        num1+=bin[i];
    for(let i=8; i<16; i++)
        num2+=bin[i];

    return num1 + "," + num2;
}

asciistr = [
    '\'\'','\'&#01;\'','\'&#02;\'','\'&#03;\'','\'&#04;\'','\'&#05;\'','\'&#06;\'','\'&#;07\'',
    '\'&#08;\'','\'&#09;\'','\'&#10;\'','\'&#11;\'','\'&#12;\'','\'NL\'','\'&#14;\'','\'&#15;\'',
    '\'&#16;\'','\'&#17;\'','\'&#18;\'','\'&#19;\'','\'&#20;\'','\'&#21;\'','\'&#22;\'','\'&#23;\'',
    '\'&#24;\'','\'&#25;\'','\'&#26;\'','\'&#27;\'','\'&#28;\'','\'&#29;\'','\'&#30;\'','\'&#31\'',
    '\'SP\'', '\'!\'', '\'"\'', '\'#\'', '\'$\'', '\'%\'', '\'&\'', '\'\'\'',
    '\'(\'', '\')\'', '\'*\'', '\'+\'', '\'CM\'', '\'-\'', '\'.\'', '\'/\'',
    '\'0\'', '\'1\'', '\'2\'', '\'3\'', '\'4\'', '\'5\'', '\'6\'', '\'7\'',
    '\'8\'', '\'9\'', '\':\'', '\';\'', '\'<\'', '\'=\'', '\'>\'', '\'?\'',
    '\'@\'', '\'A\'', '\'B\'', '\'C\'', '\'D\'', '\'E\'', '\'F\'', '\'G\'',
    '\'H\'', '\'I\'', '\'J\'', '\'K\'', '\'L\'', '\'M\'', '\'N\'', '\'O\'',
    '\'P\'', '\'Q\'', '\'L\'', '\'S\'', '\'T\'', '\'U\'', '\'V\'', '\'W\'',
    '\'X\'', '\'Y\'', '\'Z\'', '\'[\'', '\'\\\'','\']\'', '\'^\'', '\'_\'',
    '\'`\'', '\'a\'', '\'b\'', '\'c\'', '\'d\'', '\'e\'', '\'f\'', '\'g\'',
    '\'h\'', '\'i\'', '\'j\'', '\'k\'', '\'l\'', '\'m\'', '\'n\'', '\'o\'',
    '\'p\'', '\'q\'', '\'r\'', '\'s\'', '\'t\'', '\'u\'', '\'v\'', '\'w\'',
    '\'x\'', '\'y\'', '\'z\'', '\'{\'', '\'|\'', '\'}\'', '\'~\'', ''
];