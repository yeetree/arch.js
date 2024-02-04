class archjs {
    cpumemory = null;
    bios = null;
    ram = null;
    registers = null;
    io = null;

    isrunning = false;

    constructor() {
        // Create memory map and add ram then bios
        this.reset();
    }

    init = function() {
        this.reset();
        this.start();
    }

    reset = function() {
        // Set up memory and registers
        this.cpumemory = new addressable();
        this.bios = new memory(4096, true);
        this.ram = new memory(61440);
        this.registers = new registers();
        this.io = new iomanager();
        this.cpumemory.data.push(this.ram, this.bios)

        // Add devices
        let term = new consoletty(this.io);
        let stomgr = new diskmgr(this.io);
        let sto = new disk(this.io);
        this.io.devices.push(term);
        this.io.devices.push(stomgr);
        this.io.devices.push(sto);

        // Set base and stack pointers to end of workingmemory
        this.registers.bp.set(61439);
        this.registers.sp.set(61439);

        // Load BIOS
        this.bios.load("bios");
        this.bios.save("bios", false);

        // Load Storage
        let tmp = "slot1";
        if(!localStorage.getItem("load"))
            localStorage.setItem("load", "slot1");
        else
        {
            tmp = localStorage.getItem("load");
        }

        this.io.getdevice(11).storage.load(tmp);

        // Set program counter to 61440 (bios);
        this.registers.pc.set(61440);

        this.isrunning = false

        // ADD BIOS LOADER
        // this.registers.pc.set(61440);
    }

    stop = function() {
        this.isrunning = false;
    }

    start = async function() {
        this.isrunning = true;

        while(this.isrunning) {
            this.step();
            await sleep(1);
        }
    }

    step = function() {
        let insts = {
            noop:   0x0,

            add:    0x1,
            adc:    0x2,
            and:    0x3,
            or:     0x4,
            xor:    0x5,
            sub:    0x6,
            sbb:    0x7,
            mul:    0x8,
            imul:   0x9,
            div:    0xA,
            idiv:   0xB,
            not:    0xC,
            neg:    0xD,
            inc:    0xE,
            dec:    0xF,

            load:   0x10,
            store:  0x11,

            cmp:    0x12,

            push:   0x13,
            pop:    0x14,

            jmp:    0x15,
            je:     0x16,
            jne:    0x17,
            jz:     0x18,
            jnz:    0x19,
            jc:     0x1A,
            jnc:    0x1B,
            jo:     0x1C,
            jno:    0x1D,

            inb:    0x1E,
            inw:    0x1F,

            outb:   0x20,
            outw:   0x21,

            call:   0x22,
            ret:    0x23,

            int:    0x24,

            pushw:  0x25,
            popw:   0x26,

            mov:    0x27,

            break:  0x28,
        }

        let types = {
            reg16:  0,
            reg8h:  1,
            reg8l:  2,
            imm16:  3,
            imm8:   4,
            w:      5,
        }

        // How many bytes the program counter will need to advance after the instruction
        let mov = 2;

        // Arguments passed alongside instruction
        let args;

        // Arguments 1 and 2
        let arg1;
        let arg2;

        // True values of 1 and 2 (calculated after finding type)
        let arg1v;
        let arg2v;

        // Temporary variable
        let val;
        let sp;
        let bp;
        
        let pc = this.registers.pc.get()

        // Get byte of current program counter in CPU's addressable memory
        switch(this.cpumemory.getbyte(pc)) {
            case insts.noop:
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]
                break;

            case insts.add:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and adds values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v + arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v + arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v + arg2v, false, true)
                }

                break;

            case insts.adc:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and adds values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v + arg2v, true)

                    // If carry flag set, add one
                    if(this.registers.f.getbit(6)) {
                        arg1[1].set(arg1v + arg2v + 1, true)
                    }
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v + arg2v, true,  true)

                    // If carry flag set, add one
                    if(this.registers.f.getbit(6)) {
                        arg1[1].set8(arg1v + arg2v + 1, true, true)
                    }
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v + arg2v, false, true)

                    // If carry flag set, add one
                    if(this.registers.f.getbit(6)) {
                        arg1[1].set8(arg1v + arg2v + 1, false, true)
                    }
                }

                break;

            case insts.and:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and does bitwise AND on values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v & arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v & arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v & arg2v, false, true)
                }

                break;

            case insts.or:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and does bitwise OR on values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v | arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v | arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v | arg2v, false, true)
                }

                break;

            case insts.xor:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and does bitwise XOR on values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v ^ arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v ^ arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v ^ arg2v, false, true)
                }

                break;

            case insts.sub:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and subtracts values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v - arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v - arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v - arg2v, false, true)
                }

                break;

            case insts.sbb:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and subtracts values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v - arg2v, true)

                    // If carry flag set, add one
                    if(this.registers.f.getbit(6)) {
                        arg1[1].set(arg1v - (arg2v + 1), true)
                    }
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v - arg2v, true,  true)

                    // If carry flag set, add one
                    if(this.registers.f.getbit(6)) {
                        arg1[1].set8(arg1v - (arg2v + 1), true, true)
                    }
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v - arg2v, false, true)

                    // If carry flag set, add one
                    if(this.registers.f.getbit(6)) {
                        arg1[1].set8(arg1v - (arg2v + 1), false, true)
                    }
                }

                break;

            case insts.mul:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and multiplies values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v * arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v * arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v * arg2v, false, true)
                }

                break;

            case insts.imul:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and multiplies values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v * arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v * arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v * arg2v, false, true)
                }

                break;

            case insts.div:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and divides values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v / arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v / arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v / arg2v, false, true)
                }

                break;

            case insts.idiv:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and divides values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v / arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v / arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v / arg2v, false, true)
                }

                break;

            case insts.not:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1];
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register and does bitwise NOT on it. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(~arg1v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(~arg1v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(~arg1v, false, true)
                }

                break;

            case insts.neg:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1];
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register and does bitwise NOT on it. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(-arg1v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(-arg1v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(-arg1v, false, true)
                }

                break;

            case insts.inc:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1];
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register and does bitwise NOT on it. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v + 1, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v + 1, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v + 1, false, true)
                }

                break;

            case insts.dec:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1];
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register and does bitwise NOT on it. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(arg1v - 1, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(arg1v - 1, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(arg1v - 1, false, true)
                }

                break;

            case insts.load:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and retrieves value from memory. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    arg1[1].set(this.cpumemory.getword(arg2v), true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    arg1[1].set8(this.cpumemory.getbyte(arg2v), true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    arg1[1].set8(this.cpumemory.getbyte(arg2v), false, true)
                }

                break;

            case insts.store:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                // Checks if argument 2 is a register or immediate and stores its value in memory
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                    this.cpumemory.setword(arg1v, arg2v);
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                    this.cpumemory.setbyte(arg1v, arg2v);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                    this.cpumemory.setbyte(arg1v, arg2v);
                }
                else if(arg2[0] == types.imm16) {
                    arg2v = arg2[1];
                    this.cpumemory.setword(arg1v, arg2v)
                }
                else if(arg2[0] == types.imm8) {
                    arg2v = arg2[1];
                    this.cpumemory.setbyte(arg1v, arg2v)
                }


                break;

            case insts.cmp:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Subtracts values and sets flags accordingly
                let cmp = arg1v - arg2v

                if(cmp == 0) {
                    this.registers.f.setbit(6, 0) // Carry Flag set 0
                    this.registers.f.setbit(2, 1) // Zero Flag set 1
                }
                else if(cmp > 0) {
                    this.registers.f.setbit(6, 0) // Carry Flag set 0
                    this.registers.f.setbit(2, 0) // Zero Flag set 0
                }
                else if(cmp < 0) {
                    this.registers.f.setbit(6, 1) // Carry Flag set 1
                    this.registers.f.setbit(2, 0) // Zero Flag set 0
                }

                break;

            case insts.push:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register or immediate
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                // Wraps arg1v
                arg1v = wrap(256, arg1v)

                // Stores value on stack and increments pointer
                
                /*if(sp <= bp) {
                    this.registers.sp.set(this.registers.sp.get() - 1);
                    sp = this.registers.sp.get()
                    bp = this.registers.bp.get()
                    this.cpumemory.setbyte(sp, arg1v)
                }*/

                this.push(arg1v)
                
                break;

            case insts.pop:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                /*
                // Retrieves value on stack and decrements pointer
                sp = this.registers.sp.get()
                bp = this.registers.bp.get()
                let val = this.cpumemory.getbyte(sp)
                
                if (sp < bp) {
                    // Checks if argument 1 is a register and copy value. If not, do nothing
                    if(arg1[0] == types.reg16) {
                        arg1[0].set(val);
                    }
                    else if(arg2[0] == types.reg8h) {
                        arg1[0].set8(val, true);
                    }
                    else if(arg2[0] == types.reg8l) {
                        arg1[0].set(val, false);
                    }
                    else {
                        break;
                    }

                    this.registers.sp.set(this.registers.sp.get() + 1);
                }*/

                val = this.pop();

                if(arg1[0] == types.reg16) {
                    arg1[1].set(val);
                }
                else if(arg1[0] == types.reg8h) {
                    arg1[1].set8(val, true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1[1].set(val, false);
                }
                else {
                    break;
                }

                break;

            case insts.jmp:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                // Set program counter to value
                mov = 0 // No skip (we're already moving)
                pc = arg1v
                
                break;

            case insts.je:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                if(this.registers.f.getbit(2)) {
                    // Set program counter to value
                    mov = 0 // No skip (we're already moving)
                    pc = arg1v
                }
                
                break;

            case insts.jne:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                if(!this.registers.f.getbit(2)) {
                    // Set program counter to value
                    mov = 0 // No skip (we're already moving)
                    pc = arg1v
                }
                
                break;

            case insts.jz:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                if(this.registers.f.getbit(2)) {
                    // Set program counter to value
                    mov = 0 // No skip (we're already moving)
                    pc = arg1v
                }
                
                break;

            case insts.jnz:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                if(!this.registers.f.getbit(2)) {
                    // Set program counter to value
                    mov = 0 // No skip (we're already moving)
                    pc = arg1v
                }
                
                break;

            case insts.je:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                if(this.registers.f.getbit(6)) {
                    // Set program counter to value
                    mov = 0 // No skip (we're already moving)
                    pc = arg1v
                }
                
                break;

            case insts.jc:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                if(!this.registers.f.getbit(6)) {
                    // Set program counter to value
                    mov = 0 // No skip (we're already moving)
                    pc = arg1v
                }
                
                break;

            case insts.jo:
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]
                break;

            case insts.jno:
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]
                break;

            case insts.inb:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and retrieves value from device. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1[1].set(this.io.inb(arg2v), true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1[1].set8(this.io.inb(arg2v), true, true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1[1].set8(this.io.inb(arg2v), false, true)
                    //console.log(arg1[1].get());
                }
                else {
                    this.io.inb(arg2v)
                }

                break;

            case insts.inw:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a 16 bit register and retrieves value from device. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1[1].set(this.io.inw(arg2v), true)
                }
                else {
                    this.io.inw(arg2v)
                }

                break;

            case insts.outb:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a 8 bit register and sends value to device. If not, do nothing
                if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    this.io.outb(arg1v, arg2v)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    this.io.outb(arg1v, arg2v)
                }
                else if(arg1[0] == types.imm8) {
                    arg1v = arg1[1];
                    this.io.outb(arg1v, arg2v)
                }
                else {
                    arg1v = arg1[1];
                    this.io.outb(arg1v, arg2v)
                }

                break;
                
            case insts.outw:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and sends value to device. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                    this.io.outw(arg1v, arg2v)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                    this.io.outw(arg1v, arg2v)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                    this.io.outw(arg1v, arg2v)
                }
                else if(arg1[0] == types.imm8 || arg1[0] == types.imm16) {
                    arg1v = arg1[1];
                    this.io.outw(arg1v, arg2v)
                }

                break;

            case insts.call:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                this.call(arg1v, mov);

                // Set program counter to value
                mov = 0 // No skip (we're already moving)

                pc = arg1v

                break;

            case insts.ret:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Assuming stack pointer and base pointer are exactly as we left it..
                // Move base pointer forward 5 bytes
                this.registers.bp.set(this.registers.bp.get() + 5)

                // Pop 1 Word (Program Counter) and set it to program counter
                mov = 0;
                pc = this.popw();

                // Same with flags
                this.registers.f.set(this.popw())

                // Finally, pop base pointer and set it to that
                this.registers.bp.set(this.popw())

                //Since we already changed program counter, we already jumped
                break;

            case insts.int:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                arg1v = wrap(256, arg1v);

                if(arg1v != 0) {
                    this.call(this.cpumemory.getword(arg1v * 2), mov);

                    // Set program counter to value
                    mov = 0 // No skip (we're already moving)

                    pc = this.cpumemory.getword(arg1v * 2)
                }

                break;

            case insts.pushw:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 1 is a register or immediate
                if(arg1[0] == types.reg16) {
                    arg1v = arg1[1].get();
                }
                else if(arg1[0] == types.reg8h) {
                    arg1v = arg1[1].get8(true);
                }
                else if(arg1[0] == types.reg8l) {
                    arg1v = arg1[1].get8(false);
                }
                else {
                    arg1v = arg1[1];
                }

                // Wraps arg1v
                arg1v = wrap(65536, arg1v)

                // Stores value on stack and increments pointer
                
                /*if(sp <= bp) {
                    this.registers.sp.set(this.registers.sp.get() - 1);
                    sp = this.registers.sp.get()
                    bp = this.registers.bp.get()
                    this.cpumemory.setbyte(sp, arg1v)
                }*/

                this.pushw(arg1v)
                
                break;

            case insts.popw:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                /*
                // Retrieves value on stack and decrements pointer
                sp = this.registers.sp.get()
                bp = this.registers.bp.get()
                let val = this.cpumemory.getbyte(sp)
                
                if (sp < bp) {
                    // Checks if argument 1 is a register and copy value. If not, do nothing
                    if(arg1[0] == types.reg16) {
                        arg1[0].set(val);
                    }
                    else if(arg2[0] == types.reg8h) {
                        arg1[0].set8(val, true);
                    }
                    else if(arg2[0] == types.reg8l) {
                        arg1[0].set(val, false);
                    }
                    else {
                        break;
                    }

                    this.registers.sp.set(this.registers.sp.get() + 1);
                }*/

                val = this.popw();

                if(arg1[0] == types.reg16) {
                    arg1[1].set(val);
                }
                else {
                    break;
                }

                break;

            case insts.mov:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                // Checks if argument 2 is a register
                if(arg2[0] == types.reg16) {
                    arg2v = arg2[1].get();
                }
                else if(arg2[0] == types.reg8h) {
                    arg2v = arg2[1].get8(true);
                }
                else if(arg2[0] == types.reg8l) {
                    arg2v = arg2[1].get8(false);
                }
                else {
                    arg2v = arg2[1];
                }

                // Checks if argument 1 is a register and adds values. If not, do nothing
                if(arg1[0] == types.reg16) {
                    arg1[1].set(arg2v, true)
                }
                else if(arg1[0] == types.reg8h) {
                    arg1[1].set8(arg2v, true,  true)
                }
                else if(arg1[0] == types.reg8l) {
                    arg1[1].set8(arg2v, false, true)
                }

                break;

            case insts.break:
                // Retrieve arguments and advance pointer however many bytes is necessary
                args = this.getarguments(pc)
                arg1 = args[0];
                arg2 = args[1]
                mov += arg1[2] + arg2[2]

                this.stop();
                
                break;
        }

        this.registers.pc.set(pc + mov);
    }

    call = function(addr, mov) {
        // Push base pointer
        let sp = this.registers.sp.get();
        let bp = this.registers.bp.get();

        this.pushw(bp);

        // Set base pointer to stack pointer
        this.registers.bp.set(this.registers.sp.get());
        sp = this.registers.sp.get();
        bp = this.registers.bp.get();

        // Push flags
        this.pushw(this.registers.f.get());

        // Push Program Counter + offset (next instruction)
        this.pushw(this.registers.pc.get() + mov);

        // Set base to stack pointer to begin new stack frame
        this.registers.bp.set(sp);
    }

    push = function(val) {
        let sp = this.registers.sp.get();
        let bp = this.registers.bp.get();

        if(sp <= bp) {
            this.registers.sp.set(this.registers.sp.get() - 1);
            sp = this.registers.sp.get();
            this.cpumemory.setbyte(sp, val);
        }
    }

    pop = function() {
        let sp = this.registers.sp.get()
        let bp = this.registers.bp.get()
        let val = this.cpumemory.getbyte(sp)
        
        if (sp < bp) {
            this.registers.sp.set(this.registers.sp.get() + 1);
        }

        return val;
    }

    pushw = function(val) {
        let hl = gethl(val);
        this.push(hl[0]);
        this.push(hl[1]);
    }

    popw = function() {
        let hl = [];
        hl[1] = this.pop();
        hl[0] = this.pop();

        return getfromhl(hl[0], hl[1]);
    }

    getarguments = function(pc) {
        let arg1 = [5, 0, 0] // 5, 0, 0 is default type which doesnt do anything
        let arg2 = [5, 0, 0] // For these arguments:
                             // 0: Argument type
                             // 1: Argument value
                             // 2: How many bytes to advance

        // Gets argument types from the next byte (see instruction format in instructions.txt)
        let argt = this.getargumentstype(this.cpumemory.getbyte(pc + 1))
        
        // Defaults to argument type 5 if greater than 5
        if(argt[0] > 5) { argt[0] = 5 };
        if(argt[1] > 5) { argt[1] = 5 };
        // Sets argument types
        arg1[0] = argt[0];
        arg2[0] = argt[1];
        
        let off = 2; // argument offset

        // Detects argument values
        // Arg1 value:
        let arg1vt = this.getargumentvalue(arg1[0], pc + off)
        arg1[1] = arg1vt[0];
        arg1[2] = arg1vt[1];
        off += arg1[2];
    
        // Arg1 value:
        let arg2vt = this.getargumentvalue(arg2[0], pc + off)
        arg2[1] = arg2vt[0];
        arg2[2] = arg2vt[1];
        off += arg2[2];

        return [arg1, arg2]
    }

    getargumentvalue = function(type, loc) {
        let val = 5;
        let bskip = 0;
        let regval = 0;
        switch(type) {
            case 0: //reg16
                regval = this.cpumemory.getbyte(loc);
                val = this.getregisterfromcode(regval);
                bskip = 1;
                break;
            
            case 1: //reg8 (h)
                regval = this.cpumemory.getbyte(loc);
                val = this.getregisterfromcode(regval);
                bskip = 1;
                break;

            case 2: //reg8 (l)
                regval = this.cpumemory.getbyte(loc);
                val = this.getregisterfromcode(regval);
                bskip = 1;
                break;

            case 3: //imm16
                val = this.cpumemory.getword(loc);
                bskip = 2;
                break;

            case 4: //imm8
                val = this.cpumemory.getbyte(loc);
                bskip = 1;
                break;
        }

        return [val, bskip]
    }

    // Gets argument types from lower byte of instruction
    getargumentstype = function(byte) {
        // Get convert byte into a string
        byte = wrap(256, byte).toString(2).padStart(8, '0');

        // Split byte into two and get arg types from them
        let argt1 = parseInt(byte.slice(0, 4), 2)
        let argt2 = parseInt(byte.slice(4, 8), 2)
        return [argt1, argt2]
    }

    // Gets register from register number
    getregisterfromcode = function(code) {
        switch(code) {
            case 0:
                return this.registers.f;
                break;
            case 1:
                return this.registers.pc;
                break;
            case 2:
                return this.registers.sp;
                break;
            case 3:
                return this.registers.bp;
                break;
            case 4:
                return this.registers.i;
                break;
            case 5:
                return this.registers.ax;
                break;
            case 6:
                return this.registers.bx;
                break;
            case 7:
                return this.registers.cx;
                break;
            case 8:
                return this.registers.dx;
                break;
            default:
                return this.registers.w;
                break;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}