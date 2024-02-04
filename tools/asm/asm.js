class asm {
    // Variables for Assembler
    lines=[]; // All of the lines in the program
    curptr=0; // Current pointer
    offset=512; // Pointer offset
    err = false; // Has there been an error?
    log = ""; // Log

    labelnames=[]; // Reset Labels
    labelptr=[];

    print = function(thing) {
        console.log(thing)
        if(thing) { this.log += "> " + thing.toString() + "\n\n"; }
    }

    compile = function(inp, padend = 0)
    {
        // Reset program pointer
        this.curptr = 0;
        // Reset error
        this.err = false;
        // Reset log
        this.log = "";
        // Reset offset
        this.offset = 512;
        // Reset lines
        this.lines=[];
        // Reset Labels
        this.labelnames=[];
        this.labelptr=[];
        // Split file by semicolon
        this.lines=inp.split(/\r\n|\n|\r|;/).filter(n => (n != " " && n != ""))
        // Reset output box
        compileBOX.value = ""

        this.print("Assembly Started")

        this.print(this.lines)

        let prgout = []
        let prgstr = ""

        //Loop through all lines
        for(let i=0; i<this.lines.length; i++)
        {
            //Split line by spaces and remove empty 'words'
            let line = this.lines[i].split(" ").filter(n => n)

            //Compile line
            this.print(line)
            let linec = this.getline(line)
            prgstr += linec
            if (this.err) {
                break;
            }
        }

        prgout = prgstr.split(',').filter(n => n)

        // Match Labels
        for (let i = 0; i < prgout.length; i++) {
            if(prgout[i][0] == ":") {
                if (this.labelnames.includes(prgout[i])) {
                    // Get label pointer
                    let num = this.labelptr[this.labelnames.indexOf(prgout[i])]
                    
                    // Turn the pointer into a binary word string and split it
                    let numa = getword(num.toString()).split(',')
                    
                    // Assign the values to program output (extra byte already allocated)
                    prgout[i] = numa[0]
                    prgout[i+1] = numa[1]
                }
                else {
                    this.print("ASSEMBLER ERROR: Label " + prgout[i] + "does not exist")
                    this.err = true;
                    break;
                }
            }
        }

        if (!this.err) {

            this.print(prgout)

            //Split string into sections of 8 characters (bytes)
            this.print("Assembly Completed")
            //prgout = prgstr.match(/.{1,8}/g)

            if(prgout) {
                //Convert byte string array to number array
                let numout = []
                for (let index = 0; index < prgout.length; index++) {
                    let num = parseInt(prgout[index], 2);
                    numout[index] = num;
                }

                if(padend) {
                    if(padend < numout.length) {
                        this.print("ASSEMBLY WARNING: Program Length exceeds force length. Program size is unchanged.")
                    }
                    else {
                        numout.length = padend;
                        for(let i = 0; i < numout.length; i++) {
                            if(!numout[i]) {
                                numout[i] = 0
                            }
                        }
                    }
                }

                //Set output box value
                compileBOX.value = numout.toString()

                this.print("Program Length: " + numout.length);
            }
        }
        else {
            this.print(prgout)

            this.print("Could not assemble")
            //prgout = prgstr.match(/.{1,8}/g)
        }

        if(logBOX) {
            logBOX.value = this.log
        }

        return
    }

    getline = function(line) {
        if(!line.length) { return ""; }

        let inst = line[0].toLowerCase()
        let argc = line.length

        let arg1t;
        let arg2t;
        let arg1v;
        let arg2v;

        let type;
        
        let bstring;

        if (line[0][0] == "!") {
            return "";
        }

        switch(inst) {
            case "org":
                // Check if we have enough arguments, and that the argument is an immediate
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                type = gettype(line[1])
                if(type != "imm16" && type != "imm8") { this.print("ASSEMBLER ERROR: Argument type is not imm16 or imm8"); this.err = true; return } 

                this.offset = convert(line[1])
                return "";
                break;

            case "db":
                // Check if we have enough arguments, and that the argument is an immediate
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                type = gettype(line[1])
                if(type != "imm8") { this.print("ASSEMBLER ERROR: Argument type is not imm8"); this.err = true; return } 

                bstring = getbyte(line[1]) + ","
                this.curptr += 1
                return bstring;

                break;

            case "dw":
                // Check if we have enough arguments, and that the argument is an immediate
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                type = gettype(line[1])
                if(type != "imm8" && type != "imm16") { this.print("ASSEMBLER ERROR: Argument type is not imm16 or imm8"); this.err = true; return } 

                bstring = getword(line[1]) + ","
                this.curptr += 2
                return bstring;
                
                break;

            case "label":
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                this.labelnames.push(":" + line[1]);
                this.labelptr.push(this.curptr + this.offset)
                return "";
                break;

            case "add":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00000001," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
            
            case "adc":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "000000010," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
                       
            case "and":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00000011," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
        
            case "or":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00000100," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
            
            case "xor":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00000101," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
            
            case "sub":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00000110," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
            
            case "sbb":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00000111," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
            
            case "mul":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00001000," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
            
            case "imul":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00001001," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
            
            case "div":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00001010," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;

            case "idiv":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00001011," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;

            case "not":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 

                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00001100," + gettypecode(arg1t) + "0101,"; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;
                return bstring;
                break;

            case "neg":
                 // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00001101," + gettypecode(arg1t) + "0101,"; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;
                return bstring;
                break;

            case "inc":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00001110," + gettypecode(arg1t) + "0101,"; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;
                return bstring;
                break;

            case "dec":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00001111," + gettypecode(arg1t) + "0101,"; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;
                return bstring;
                break;
        
            case "load":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00010000," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];


                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;

            case "store":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00010001," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                console.log(this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];


                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
        
            case "cmp":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00010010," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, 0)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];


                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;
        
            case "push":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t != "reg8h" && arg1t != "reg8l"&& arg1t != "imm8") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or imm8"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring = "00010011," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, 0)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "pop":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t != "reg8h" && arg1t != "reg8l"&& arg1t != "imm8") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or imm8"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring = "00010100," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "jmp":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring = "00010101," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "je":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00010110," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "jne":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00010111," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "jz":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00011000," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "jnz":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00011001," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "jc":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00011010," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "jnc":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00011011," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            /*case "jo":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00011100," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "jno":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00011101," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;
            */
           
            case "inb":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3 && argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }

                if(argc == 3) {
                    arg1t = gettype(line[1])
                    arg2t = gettype(line[2])

                    if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                    if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 

                    // Adds OPCODE and argument type codes (two bytes)
                    bstring =  "00011110," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                    // Adds register code (one byte)
                    bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                    // Adds second value
                    arg2v = getargumentvalue(line[2], this.curptr, 0)
                    if (arg2v[0] == "") { this.err = true; return; break;}
                    bstring += arg2v[0] + ","; this.curptr += arg2v[1];
                }
                else {
                    arg1t = 5
                    arg2t = gettype(line[1])

                    if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 

                    // Adds OPCODE and argument type codes (two bytes)
                    bstring =  "00011110,0101" + gettypecode(arg2t) + ","; this.curptr += 2;

                    // Adds second value
                    arg2v = getargumentvalue(line[1], this.curptr, 0)
                    if (arg2v[0] == "") { this.err = true; return; break;}
                    bstring += arg2v[0] + ","; this.curptr += arg2v[1];
                }
                return bstring;
                break;

            case "inw":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3 && argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                
                if(argc == 3) {
                    arg1t = gettype(line[1])
                    arg2t = gettype(line[2])
                    if(arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg16"); this.err = true; return } 
                    if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
                
                    // Adds OPCODE and argument type codes (two bytes)
                    bstring =  "00011111," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                    // Adds register code (one byte)
                    bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                    // Adds second value
                    arg2v = getargumentvalue(line[2], this.curptr, 0)
                    if (arg2v[0] == "") { this.err = true; return; break;}
                    bstring += arg2v[0] + ","; this.curptr += arg2v[1];
                }
                else {
                    arg1t = 5
                    arg2t = gettype(line[1])

                    if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 

                    // Adds OPCODE and argument type codes (two bytes)
                    bstring =  "00100000,0101" + gettypecode(arg2t) + ","; this.curptr += 2;

                    // Adds second value
                    arg2v = getargumentvalue(line[1], this.curptr, 0)
                    if (arg2v[0] == "") { this.err = true; return; break;}
                    bstring += arg2v[0] + ","; this.curptr += arg2v[1];
                }

                return bstring;
                break;

            case "outb":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "imm8") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or imm8"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00100000," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, 0)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;

            case "outw":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00100001," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, 0)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];


                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;

            case "call":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00100010," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "ret":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 1) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }

                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00100011,01010101,"; this.curptr += 2;

                return bstring;
                break;

            case "int":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t != "reg8h" && arg1t != "reg8l"&& arg1t != "imm8") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or imm8"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring = "00100100," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, 0)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "pushw":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid."); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring = "00100101," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, 0)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "popw":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 2) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                
                if(arg1t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid."); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring = "00100110," + gettypecode(arg1t) + "0101,"; this.curptr += 2;

                // Adds first value
                arg1v = getargumentvalue(line[1], this.curptr, this.offset)
                if (arg1v[0] == "") { this.err = true; return; break;}
                bstring += arg1v[0] + ","; this.curptr += arg1v[1];

                return bstring;
                break;

            case "mov":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 3) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }
                arg1t = gettype(line[1])
                arg2t = gettype(line[2])
                if(arg1t != "reg8h" && arg1t != "reg8l" && arg1t != "reg16") { this.print("ASSEMBLER ERROR: Argument type is not reg8 or reg16"); this.err = true; return } 
                if(arg2t == "ERR") { this.print("ASSEMBLER ERROR: Argument type is not valid"); this.err = true; return } 
            
                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00100111," + gettypecode(arg1t) + gettypecode(arg2t) + ","; this.curptr += 2;
                // Adds register code (one byte)
                bstring += getregistercode(line[1]) + ","; this.curptr += 1;

                // Adds second value
                arg2v = getargumentvalue(line[2], this.curptr, 0)
                if (arg2v[0] == "") { this.err = true; return; break;}
                bstring += arg2v[0] + ","; this.curptr += arg2v[1];

                return bstring;
                break;

            case "break":
                // Check if we have enough arguments, and check that arguments are valid
                if(argc != 1) { this.print("ASSEMBLER ERROR: Invalid amount of args"); this.err = true; return }

                // Adds OPCODE and argument type codes (two bytes)
                bstring =  "00101000,01010101,"; this.curptr += 2;

                return bstring;
                break;

            default:
                this.print("ASSEMBLER ERROR: Not an instruction"); this.err = true; return
                break;
        }
    }
}