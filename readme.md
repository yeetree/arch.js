# Arch.js - A 16 bit CPU written in JavaScript!
## What is Arch.js?
Arch.js is my custom 16 bit CPU that I wrote in JavaScript.
I also wrote an assembler for it, and a BIOS.

## How do I use Arch.js?
### \<Note\>

This doesn't cover how to use the assembler, or how Arch.js works internally.

Documentation on the default devices that come with Arch.js can be found at `arch/devices/deviceinstructions.txt`.

Documentation on ArchOfficial programs (such as BIOS) will be found in the `archofficial` directory.

### \</Note\>

As of now, the Arch.js VM has two things: a serial console and VM Management Menus.

### Using the VM

The Serial Console can send and receive ASCII character data. Any data it receives to it will be automatically displayed. To send characters, click on the serial console to focus it, and type whatever.

The VM Management Menu has 5 buttons.
Here's what they do:
* System
    * Stop - Pauses Machine
    * Start - Starts Machine
    * Reset - Resets Machine, does not start clock
    * Step - Executes one cycle and stops.

* Storage
    * Storage Options
        * Slot - Slot which storage is being loaded in localStorage
        * Save Storage - Saves storage in slot. This slot will be automatically loaded from in the future.
        * Load Storage - Loads storage from slot. This slot will be automatically loaded from in the future.
        * Reset Storage - Sets storage to all 0's, does not save automatically
    * Insert Data
        * Where - What memory location data is being inserted
        * What - What data to insert
        * Insert - Inserts storage with data specified in the memory location specified, does not save automatically
    * RAM
        * RAM Settings
            * Reset RAM - Sets all RAM values to 0
        * Insert Data
            * Where - What memory location data is being inserted
            * What - What data to insert
            * Insert - Inserts RAM with data specified in the memory location specified
    * BIOS
        * BIOS Settings
            * Dropdown - Which BIOS Version to flash. Select "custom" to use data in What
            * What - What data to flash to BIOS. Select "custom" to use this data
            * Flash BIOS - Flashes BIOS with data specified

### Getting Started

The first time you use Arch.js, the BIOS is likely not to be flashed.

You can flash the BIOS by selecting which version in the BIOS menu, or by flashing your own by selecting "custom" and entering your data.

After this, you need to load a program.

The default Arch.js bootloader checks to see if a disk is bootable by seeing if the last two bytes are 0x55 and 0xAA. If this is true, then the BIOS will load the first 512 bytes of the disk at memory addresses 512-1024, and then jumps to it. Those 512 bytes are called a Master Boot Record.

The Arch.js Assembler (./tools/asm/index.html) can generate these by selecting the "Make Bootable" option, but if you want to test something right away, load the contents of ./tests/bin/bootcat (bootable).bin to Storage at address 0. Make sure to press save.

You can then do System -> Reset, System -> Start, and the program will start running.
Keep in mind that loading can take awhile. As long as the Program Counter is moving, it's working.