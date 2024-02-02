class asm {
    // Variables for Assembler
    lines=[]; // All of the lines in the program
    curptr=0; // Current pointer
    offset=0; // Pointer offset
    err = false; // Has there been an error?

    compile = function(inp)
    {
        // Reset lines
        this.lines=[]
        // Split file by semicolon
        this.lines=inp.split(';')

        //Loop through all lines
        for(let i=0; i<this.lines.length; i++)
        {
            //Split line by spaces and remove empty 'words'
            let line = this.lines[i].split(" ").filter(n => (n != ''))

            //Compile line
            let linec = this.getline(line)
        }
    }

    getline = function(line) {
        let inst = line[0].toLowerCase()
        let argc = line.length

        switch(inst) {
            case "org":
                // Check if we have enough arguments, and that the argument is an immediate
                
                if(arcg != 2) { console.log("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                let type = gettype(line[1])
                if(type != "imm16" || type != "imm8") { console.log("ASSEMBLER ERROR: Argument type is not imm16 or imm8"); this.err = true; return } 

                this.offset = convert(line[1])
                break;

            
            
        }
    }
}

// Detect type of given argument
function gettype(arg) {

    // Check if it is a register
    if(regstr16.includes(arg)) { return "reg16"; }
    if(regstr8.includes(arg)) { return "reg8"; }

    // See if it is a special character
    if(arg == "$") { return "programcounter"; }
    if(arg == "$$") { return "programstart"; }

    // See if it is a valid number
    let num = convert(arg)

    if(num) {
        if(num >= 0 && num <= 255) { return "imm8" }
        if(num >= 0 && num <= 65535) { return "imm16" }

        console.log("PARSING ERROR: Number " + num + " is not within 0 to 65535")
        return "ERR"
    }

    console.log("PARSING ERROR: ARGUMENT " + arg + " is not a valid type")
    return "ERR"
}

const radixTable = {
    '0b': 2,
    '0o': 8,
    '0x': 16,
};

function convert(str) {
    let radix = 10;
    if (radixTable.hasOwnProperty(str.slice(0, 2))) {
        radix = radixTable[str.slice(0,2)];
        str = str.slice(2);
    }
    return parseInt(str, radix);
  }

regstr16 = [
    "ax", "bx", "cx", "dx", "f", "pc", "sp", "bp",
]

regstr8 = [
    "ah", "bh", "ch", "dh", "fh", "pch", "sph", "bph",
    "al", "bl", "cl", "dl", "fl", "pcl", "spl", "bpl",
]

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