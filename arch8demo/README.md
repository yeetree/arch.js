# Arch.JS
#### The 8-Bit CPU that runs in your browser!
---
### What is Arch.JS?
Arch.JS simulates a virtual 8-bit cpu. Complete with its own instructions,
registers, memory, and storage!

Arch.JS comes with an assembler too! (Documentation on Arch.JS Assembly Language is below)
You can find it in /tools/assembler.

### VM Controls
This is a quick overview of all of the VM controls.
* Machine Controls:
    * Start -- Unpauses Machine
    * Stop -- Pauses Machine
    * Reset -- Reboots machine
* Save/Load Storage
    * Slot -- Specifies what slot to use
    * Save -- Saves storage to the slot
    * Load -- Loads storage from slot, and also sets the VM to use that slot
* Insert Storage
    * Where -- Specifies where to insert storage
    * What -- Data to be inserted
    * Insert -- Inserts the data.

### Load programs
Like real CPUs, Arch.js programs are stored in binaries. However, getting
raw binary data from files in javascript is tricky, especially if you're storing data as a string. Arch.JS Binaries are simply numbers ranging from 0-255 separated by commas. Simple.

You can find some example programs in the Arch.JS repositiory.

The source code of them will be in tests/asm. Only use these if you wantto look at the code and assemble them yourself

You can find the example binaries in tests/bin. These contain the data that you load in Arch.JS

At the time of writing this, Arch.JS isn't very user-friendly because it is meant to be very versatile, so the process of loading programs is a little difficult.

First, click options, then click Reset Storage.
Then go to Insert Storage, put "where" to 0, and put your binary in the 'what".
Then click Insert, and then Save Storage.

Next time Arch.JS boots up, your program will be loaded!

### Switch storage slots
In order to switch storage slots, just go to options, change the slot to
whatever slot you want, and click load.
If it is a new slot, the default program will already be loaded.
To clear the slot, click on Reset Storage and then Save Storage.

Next time Arch.JS boots up, your slot will be loaded!
Just keep in mind that Arch.JS will load from this slot from now on until
told to load another one.

# Arch.JS Assembly Language and Arch.JS Specs
#### Complete documentation
---
## Specs:
---
Arch.JS is a 8-Bit Computer that has 64kb of RAM (banked), 32kb of storage, and 36kb of VRAM (not accessible in memory). You can control the video through the Video Port. The screen is 192x192 pixels.
At the time of writing this, while the display is capable of bitmap graphics, it only allows for a basic TTY through the video port.
The last 256 bytes of RAM are reserved for the stack, but can be used for anything else.

###  Ports:
Arch.JS has two ports:
* Console (0)
* Video (1)

Both of the ports have the same input function, it recieves an ASCII character and displays it.

The video port doesnt have an output function, but the console port allows you to input an ascii character.
You have to click on the console, and the cpu is stopped until a key is pressed.

###  Registers:
Arch.JS has eight registers:
* a - General Purpose
* b - General Purpose
* c - General Purpose
* d - General Purpose
* r - General Purpose / Return value (No instruction modifies this, just it's indended use)
* ih - General Purpose / Index High (ih and il are used when using `jnz` and set by `lda`)
* il - General Puspose / Index Low
* f - Flags Register. When f is:
    * 0: Default value
    * 1: result was zero
    * 2: result was equal
    * 3: result had a carry
    * 4: there was a stack overflow/underflow

Arch.JS also has 3 additional registers that can only be accessed at the last 6 bytes of addressable memory (not ram).
* 0xFFFA - 0xFFFB: Memory Pointer: Defines the offset of the banked memory from the actual RAM
* 0xFFFC - 0xFFFD: Stack Pointer: Defines where the stack pointer is. Defaults to the last 256 bytes of RAM. (Keep in mind that if you set this anywhere out of the reserved stack space, it will overwrite any data and will not stop... MAKING THE ENTIRE MEMORY A STACK!!! AHHHH!)
* 0xFFFE - 0xFFFF: Program Counter: Defines what address the CPU is currently reading from. Instead of changing this directly, use `lda` and `jnz`.

###  Memory Map:
![Arch.js Memory Map](https://github.com/yeetree/arch.js/blob/main/memmap.png?raw=true)

## Arch.JS Assembly Language:
---
### Syntax:
The syntax for AAL (Arch.JS Assembly Language) is quite simple.
It goes along the lines of:
`instruction, arg;`
Some instructions have multiple arguments.
`instruction, arg1, arg2;`
Just remember to use commas and semicolons.
Whitespaces are completely ignored in the assembler.

### Instructions:
Here are all of the argument types used in the instructions:
* reg -- Any 8 bit register. (see Registers)

* 16bit -- Any 16 bit number, or any number ranging from 0-65535. Can also be $ for current memory pointer, a colon, ":" with a label name to reference the memory location of the label, an ASCII character surrounded in ', like 'A', and also can recognize hex numbers in the format of "#XXXX".

*  8bit -- Any 8 bit number, or any number ranging from 0-255. Can also be an ASCII character surrounded in ', like 'A', and also can recognize hex numbers in the format of "#XX".

*  INX -- Refers to the index high and low registers.

* PORT -- Just like 8bit, but specifically to reference ports.


Here are all of the instructions:
* `NOOP` -- Does nothing, but does add space in the program.
* `ADD, reg, reg/8bit` -- Adds reg and reg/8bit and stores in reg.
* `ADC, reg, reg/8bit` -- Adds reg and reg/8bit and stores in reg. If there is a carry, then it sets the carry flag.
* `AND, reg, reg/8bit` -- Bitwise AND of reg and reg/8bit, stores result in reg.
* `CMP, reg, reg/8bit` -- Sets equal flag if reg and reg/8bit are equal.
* `PUSH, reg/8bit` -- Pushes reg/8bit onto the stack.
* `POP, reg` -- Pops stack and stores value in reg.
* `MW, reg, reg/8bit` -- Sets reg to reg/8bit.
* `LW, reg, [INX/16bit]` -- Loads from address [INX/16bit] and stores it in reg.
* `SW, [INX/16bit], reg` -- Stores reg in address [INX/16bit].
* `LDA, 16bit` -- Sets index high and low registers to 16bi.
* `JNZ, reg/8bit` -- Sets program counter to index high and low if reg/8bit is not zero.
* `INB, reg, PORT` -- Requests a byte from PORT and stores it in reg.
* `OUTB, reg, PORT` -- Sends value of reg to PORT.

Special Assembler instructions:
* `!,` -- Defines a comment. MUST BE IN THIS FORMAT: `!,Comment here;` 
* `label, name` -- Creates reference to the memory location at the label. Does not have to be set before referencing it.
* `org, 16bit` -- Adds 16bit to every 16bit number referenced going forwards, except for labels and program counter.