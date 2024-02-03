class archjs {
    cpumemory = new addressable();

    bios = new memory(4096, true);
    ram = new memory(61440);
    storage = new memory(1048576);
    registers = new registers();

    constructor() {
        // Create memory map and add ram then bios
        this.cpumemory.data.push(this.ram, this.bios)
    }
}