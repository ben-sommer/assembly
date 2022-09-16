import { memorySizeBytes, maxWordValue, wordSizeBytes } from "./constants.js";
import { decToHex, hexToDec } from "./format.js";

const validateByteAddress = (address) => {
	if (typeof address !== "number") {
		return [false, new Error(`Invalid address ${address}`).message];
	}

	if (address < 0 || address > memorySizeBytes) {
		return [false, new Error(`Invalid address ${address}`).message];
	}

	return [true, null];
};

const validateWordAddress = (address) => {
	if (typeof address !== "number") {
		return [false, new Error(`Invalid address ${address}`).message];
	}

	if (
		address < 0 ||
		address > memorySizeBytes ||
		address % wordSizeBytes !== 0
	) {
		return [false, new Error(`Invalid address ${address}`).message];
	}

	return [true, null];
};

const validateByteValue = (value) => {
	if (typeof value !== "number") {
		return [false, new Error(`Invalid value ${value}`).message];
	}

	if (value < 0 || value > 0xff) {
		return [false, new Error(`Invalid value ${value}`).message];
	}

	return [true, null];
};

const validateWordValue = (value) => {
	if (typeof value !== "number") {
		return [false, new Error(`Invalid value ${value}`).message];
	}

	if (value < 0 || value > maxWordValue) {
		return [false, new Error(`Invalid value ${value}`).message];
	}

	return [true, null];
};

export const readMemoryByte = (address) => {
	const [valid, error] = validateByteAddress(address);

	if (error) {
		throw new Error(error);
	} else {
		const value = localStorage.getItem(`memory-${decToHex(address, 5)}`);

		return value;
	}
};

export const readMemoryWord = (address) => {
	const [valid, error] = validateWordAddress(address);

	if (error) {
		throw new Error(error);
	} else {
		let value = 0;

		for (let i = 0; i < wordSizeBytes; i++) {
			const byte = readMemoryByte(address + i);
			value += byte * 0x100 ** i;
		}

		return value;
	}
};

export const writeMemoryByte = (address, value) => {
	const [valid, error] = validateByteAddress(address);

	if (error) {
		throw new Error(error);
	} else {
		const [valid2, error2] = validateByteValue(value);

		if (error2) {
			throw new Error(error2);
		}

		localStorage.setItem(`memory-${decToHex(address, 5)}`, value);
	}
};

export const writeMemoryWord = (address, value) => {
	const [valid, error] = validateWordAddress(address);

	if (error) {
		throw new Error(error);
	} else {
		const [valid2, error2] = validateWordValue(value);

		if (error2) {
			throw new Error(error2);
		}

		const hexWord = decToHex(value, 8);

		for (let i = 0; i < wordSizeBytes; i++) {
			writeMemoryByte(
				address + i,
				hexToDec(hexWord.slice(i * 2, i * 2 + 2))
			);
		}
	}
};
