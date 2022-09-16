import { execute } from "./modules/compiler.js";
import { writeMemoryByte, writeMemoryWord } from "./modules/memory.js";
import { writeRegister } from "./modules/register.js";

// writeMemoryWord(0x0, 0xaabbccdd);
// writeRegister(0x0, 0x11223344);

const [valid, error] = execute(`
    MOV R0, #0b1110
    MOV R1, #0b1011
    AND R2, R0, R1
    ORR R3, R0, R1
    EOR R4, R0, R1
    LSL R5, R0, #2
    LSR R6, R0, #1
    MVN R7, R1
    AND R8, R1, #13
    LSL R9, R0, R1
`);

if (error) {
	console.error(error);
} else {
	console.log(`Executed code successfully`);
}
