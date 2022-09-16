/*

ADD R0, R1, R2 // Adds R1 to R2 and stores the result in R0
SUB R0, R1, R2 // Subtracts R2 from R1 and stores the result in R0
MOV R0, R1 // Moves the value of R1 to R0
MOV R0, #1 // Moves the value 1 to R0

*/

import { maxWordValue } from "./constants.js";
import { readRegister, writeRegister } from "./register.js";
import { binToDec, hexToDec } from "./format.js";

const OPERANDS = {
	REGISTER: 0,
	IMMEDIATE: 1,
	MEMORY: 2,
};

const getOperand = (operand) => {
	if (operand.startsWith("#0x")) {
		return hexToDec(operand.slice(3));
	} else if (operand.startsWith("#0b")) {
		return binToDec(operand.slice(3));
	} else if (operand.startsWith("R")) {
		return parseInt(readRegister(Number(operand.slice(1))));
	} else {
		return Number(operand.slice(1));
	}
};

const commands = [
	{
		opcode: "ADD",
		operands: [
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER, OPERANDS.IMMEDIATE],
		],
		execute: (operands) => {
			const [destination, source1, source2] = operands;

			writeRegister(
				parseInt(destination.slice(1)),
				getOperand(source2) + getOperand(source1)
			);
		},
	},
	{
		opcode: "SUB",
		operands: [
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER, OPERANDS.IMMEDIATE],
		],
		execute: (operands) => {
			const [destination, source1, source2] = operands;

			writeRegister(
				parseInt(destination.slice(1)),
				getOperand(source2) - getOperand(source1)
			);
		},
	},
	{
		opcode: "MOV",
		operands: [
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER, OPERANDS.IMMEDIATE],
		],
		execute: (operands) => {
			const [destination, source] = operands;

			writeRegister(parseInt(destination.slice(1)), getOperand(source));
		},
	},
	{
		opcode: "AND",
		operands: [
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER, OPERANDS.IMMEDIATE],
		],
		execute: (operands) => {
			const [destination, source1, source2] = operands;

			writeRegister(
				parseInt(destination.slice(1)),
				getOperand(source2) & getOperand(source1)
			);
		},
	},
	{
		opcode: "ORR",
		operands: [
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER, OPERANDS.IMMEDIATE],
		],
		execute: (operands) => {
			const [destination, source1, source2] = operands;

			writeRegister(
				parseInt(destination.slice(1)),
				getOperand(source2) | getOperand(source1)
			);
		},
	},
	{
		opcode: "EOR",
		operands: [
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER, OPERANDS.IMMEDIATE],
		],
		execute: (operands) => {
			const [destination, source1, source2] = operands;

			writeRegister(
				parseInt(destination.slice(1)),
				getOperand(source2) ^ getOperand(source1)
			);
		},
	},
	{
		opcode: "LSL",
		operands: [
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER, OPERANDS.IMMEDIATE],
		],
		execute: (operands) => {
			const [destination, source1, source2] = operands;

			writeRegister(
				parseInt(destination.slice(1)),
				getOperand(source1) << getOperand(source2)
			);
		},
	},
	{
		opcode: "LSR",
		operands: [
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER, OPERANDS.IMMEDIATE],
		],
		execute: (operands) => {
			const [destination, source1, source2] = operands;

			writeRegister(
				parseInt(destination.slice(1)),
				getOperand(source1) >>> getOperand(source2)
			);
		},
	},
	{
		opcode: "MVN",
		operands: [
			[OPERANDS.REGISTER],
			[OPERANDS.REGISTER, OPERANDS.IMMEDIATE],
		],
		execute: (operands) => {
			const [destination, source] = operands;

			writeRegister(
				parseInt(destination.slice(1)),
				(getOperand(source) ^ maxWordValue) >>> 0
			);
		},
	},
];

const validateCommand = (command) => {
	const [opcode, ...rest] = command.split(" ");
	const operands = rest
		.join(" ")
		.split(",")
		.map((operand) => operand.trim());
	const commandDefinition = commands.find(
		(command) => command.opcode === opcode
	);

	if (!commandDefinition) {
		throw new Error(`Unknown command ${opcode}`);
	}

	if (commandDefinition.operands.length !== operands.length) {
		throw new Error(`Invalid number of operands for ${opcode}`);
	}

	operands.forEach((operand, i) => {
		const operandDefinition = commandDefinition.operands[i];

		if (
			operandDefinition.includes(OPERANDS.REGISTER) &&
			operand.startsWith("R")
		) {
			const register = Number(operand.slice(1));

			if (register < 0 || register > 15) {
				throw new Error(`Invalid register ${operand}`);
			}
		} else if (
			operandDefinition.includes(OPERANDS.IMMEDIATE) &&
			operand.startsWith("#")
		) {
			const immediate = Number(operand.slice(1));

			if (immediate < 0 || immediate > maxWordValue || isNaN(immediate)) {
				throw new Error(`Invalid immediate value ${operand}`);
			}
		} else {
			throw new Error(`Invalid operand ${operand}`);
		}
	});
};

const validate = (program) => {
	try {
		program = program
			.trim()
			.split("\n")
			.map((line) => line.trim());

		program.forEach((line, i) => {
			try {
				validateCommand(line);
			} catch (e) {
				throw new Error(
					`Error in line ${i + 1} (${line}): ${e.message}`
				);
			}
		});

		return [true, null];
	} catch (e) {
		return [false, e.message];
	}
};

const exectueCommand = (command) => {
	const [opcode, ...rest] = command.split(" ");
	const operands = rest
		.join(" ")
		.split(",")
		.map((operand) => operand.trim());
	const commandDefinition = commands.find(
		(command) => command.opcode === opcode
	);

	commandDefinition?.execute(operands);
};

export const execute = (program) => {
	const [valid, error] = validate(program);

	if (!valid) {
		return [false, error];
	}

	program = program
		.trim()
		.split("\n")
		.map((line) => line.trim());

	program.forEach((line, i) => {
		exectueCommand(line);
	});

	return [true, null];
};
