// Detect type of given argument
function gettype(arg) {

    // Check if it is a register
    if(regstr16.includes(arg)) { return "reg16"; }
    if(regstr8h.includes(arg)) { return "reg8h"; }
    if(regstr8l.includes(arg)) { return "reg8l"; }

    // See if it is a special character
    if(arg == "$") { return "programcounter"; }
    //if(arg == "$$") { return "programstart"; }

    // See if it is a label
    if(arg[0] == ":") {
        return "imm16";
    }

    // See if it is a character
    if(asciistr.includes(arg)) {
        return "imm8";
    }

    // See if it is a valid number
    let num = convert(arg)

    if(num || num == 0) {
        if(num >= 0 && num <= 255) { return "imm8" }
        if(num >= 0 && num <= 65535) { return "imm16" }

        asm.print("PARSING ERROR: Number " + num + " is not within 0 to 65535")
        return "ERR"
    }

    asm.print("PARSING ERROR: ARGUMENT " + arg + " is not a valid type")
    return "ERR";
}

// Get type code (binary) for instruction
function gettypecode(type) {
    switch(type) {
        case "reg16":
            return "0000";
            break;

        case "reg8h":
            return "0001";
            break;

        case "reg8l":
            return "0010";
            break;

        case "imm16":
            return "0011";
            break;

        case "imm8":
            return "0100"
            break;
    }

    return "0101"; // Whoops type
}

// Find register code (binary) for instruction
function getregistercode(arg) {
    let regindex = -1

    if (regstr16.includes(arg)) { regindex = regstr16.indexOf(arg)}
    else if (regstr8h.includes(arg)) { regindex = regstr8h.indexOf(arg)}
    else if (regstr8l.includes(arg)) { regindex = regstr8l.indexOf(arg)}

    //if (regindex == -1) { asm.print("PARSING ERROR: Cannot find register code of " + arg); return "ERR"; }

    switch(regindex) {
        case 0:
            return "00000000";
            break;
        case 1:
            return "00000001";
            break;
        case 2:
            return "00000010";
            break;
        case 3:
            return "00000011";
            break;
        case 4:
            return "00000100";
            break;
        case 5:
            return "00000101";
            break;
        case 6:
            return "00000110";
            break;
        case 7:
            return "00000111";
            break;
        case 8:
            return "00001000";
            break;
    }

    asm.print("PARSING ERROR: Cannot find register code of " + arg)
    return "ERR";
}

// Find value of argument
function getargumentvalue(arg, pc, off = 0) {
    let type = gettype(arg);
    let bstring = ""
    let plength = 0
    let rcode = "ERR"

    if(type == "reg16" || type == "reg8h" || type == "reg8l") {
        rcode = getregistercode(arg);
        if(rcode == "ERR") {
            asm.print("PARSER ERROR: Could not get argument value of register " + arg)
            return ["", 0]
        }
        bstring += getregistercode(arg);
        plength = 1;
    }

    if(type == "imm16") {
        // Check if it is a label
        if(arg[0] == ":") {
            bstring += arg + ",00000000"
            plength = 2;
        }
        else {
            let num = convert(arg) + off
            if(!off) {
                if(num < 0) { asm.print("PARSER WARNING: Given number is not a 16 bit number and will be clamped"); num = 0; }
                if(num > 65535) { asm.print("PARSER WARNING: Given number is not a 16 bit number and will be clamped"); num = 65535; }
            
                let tstring = num.toString(2).padStart(16, '0');
                bstring += tstring.slice(0, 8) + "," + tstring.slice(8)
                plength = 2;
            }
            else {
                if(num < 0) { asm.print("PARSER WARNING: Given number offset exceeds 16 bit number limit and will be clamped"); num = 0; }
                if(num > 65535) { asm.print("PARSER WARNING: Given number offset exceeds 16 bit number limit and will be clamped"); num = 65535; }
            
                let tstring = num.toString(2).padStart(16, '0');
                bstring += tstring.slice(0, 8) + "," + tstring.slice(8)
                plength = 2;
            }
        }
    }

    if(type == "imm8") {
        let num = convert(arg) + off

        // Check if it is a character
        if(asciistr.includes(arg)) {
            num = asciistr.indexOf(arg) + off
        }

        if(!off) {
            if(num < 0) { asm.print("PARSER WARNING: Given number is not a 8 bit number and will be clamped"); num = 0; }
            if(num > 255) { asm.print("PARSER WARNING: Given number is not a 8 bit number and will be clamped"); num = 255; }
            bstring += num.toString(2).padStart(8, '0');
            plength = 1;
        }
        else {
            if(num < 0) { asm.print("PARSER WARNING: 8 bit number offset exceeds 16 bit number limit and will be clamped"); num = 0; }
            if(num > 65535) { asm.print("PARSER WARNING: 8 bit number offset exceeds 16 bit number limit and will be clamped"); num = 65535; }
            let tstring = num.toString(2).padStart(16, '0');
            bstring += tstring.slice(0, 8) + "," + tstring.slice(8)
            plength = 2;
        }
    }

    if(type == "programcounter") {
        let num = pc + off
        if(num < 0) { asm.print("PARSER WARNING: Given number is not a 16 bit number and will be clamped"); num = 0; }
        if(num > 65535) { asm.print("PARSER WARNING: Given number is not a 16 bit number and will be clamped"); num = 65535; }
    
        let tstring = num.toString(2).padStart(16, '0');
        bstring += tstring.slice(0, 8) + "," + tstring.slice(8)
        plength = 2;
    }

    return [bstring, plength]
}

function getbyte(arg) {
    let type = gettype(arg);
    if(type == "imm8") {
        let num = convert(arg)
        if(num < 0) { asm.print("PARSER WARNING: Given number is not a 8 bit number and will be clamped"); num = 0; }
        if(num > 255) { asm.print("PARSER WARNING: Given number is not a 8 bit number and will be clamped"); num = 255; }
        return num.toString(2).padStart(8, '0') + ","
    }
    else {
        asm.print("PARSER WARNING: Could not get byte from " + arg + " and defaulting to 0")
        return "00000000";
    }
}

function getword(arg) {
    let type = gettype(arg);
    if(type == "imm8" || type == "imm16") {
        let num = convert(arg)
        if(num < 0) { asm.print("PARSER WARNING: Given number is not a 16 bit number and will be clamped"); num = 0; }
        if(num > 65535) { asm.print("PARSER WARNING: Given number is not a 16 bit number and will be clamped"); num = 65535; }
        let tstring = num.toString(2).padStart(16, '0')
        return tstring.slice(0, 8) + "," + tstring.slice(8)
    }
    else {
        asm.print("PARSER WARNING: Could not get word from " + arg + " and defaulting to 0")
        return "00000000,00000000";
    }
}

// Check if argument is 8 bit
function is8bit(arg) {
    let argtype = gettype(arg)
    if(argtype == "reg8h" || argtype == "reg8l" || argtype == "imm8") { return true; }
    return false;
}

// Check if argument is 16 bit
function is16bit(arg) {
    let argtype = gettype(arg)
    if(argtype == "reg16" || argtype == "imm16" || argtype == "programcounter" || argtype == "programstart") { return true; }
    return false;
}

// Config for convert
const radixTable = {
    '0b': 2,
    '0o': 8,
    '0x': 16,
};

// Convert any string to number
function convert(str) {
    let radix = 10;
    if (radixTable.hasOwnProperty(str.slice(0, 2))) {
        radix = radixTable[str.slice(0,2)];
        str = str.slice(2);
    }
    return parseInt(str, radix);
}

//Names of all registers
regstr16 = [
    "f", "pc", "sp", "bp", "i", "ax", "bx", "cx", "dx", 
]

regstr8h = [
    "fh", "pch", "sph", "bph", "ih", "ah", "bh", "ch", "dh", 
]

regstr8l = [
    "fl", "pcl", "spl", "bpl", "il", "al", "bl", "cl", "dl", 
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
    '\'P\'', '\'Q\'', '\'R\'', '\'S\'', '\'T\'', '\'U\'', '\'V\'', '\'W\'',
    '\'X\'', '\'Y\'', '\'Z\'', '\'[\'', '\'\\\'','\']\'', '\'^\'', '\'_\'',
    '\'`\'', '\'a\'', '\'b\'', '\'c\'', '\'d\'', '\'e\'', '\'f\'', '\'g\'',
    '\'h\'', '\'i\'', '\'j\'', '\'k\'', '\'l\'', '\'m\'', '\'n\'', '\'o\'',
    '\'p\'', '\'q\'', '\'r\'', '\'s\'', '\'t\'', '\'u\'', '\'v\'', '\'w\'',
    '\'x\'', '\'y\'', '\'z\'', '\'{\'', '\'|\'', '\'}\'', '\'~\'', ''
];