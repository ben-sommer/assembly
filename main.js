import { execute } from "./modules/compiler.js";
import { writeMemoryByte, writeMemoryWord } from "./modules/memory.js";
import { writeRegister } from "./modules/register.js";

// writeMemoryWord(0x0, 0xaabbccdd);
// writeRegister(0x0, 0x11223344);

const [valid, error] = execute(`
    MOV R0, #1
    MOV R1, #2
    MOV R2, #11
    ADD R3, R0, R1
    ADD R3, R3, R2
`);

if (error) {
	console.error(error);
} else {
	console.log(`Executed code successfully`);
}
