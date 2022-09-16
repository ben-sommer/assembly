import { maxRegisterAddress, maxWordValue } from "./constants.js";
import { decToHex } from "./format.js";

const validateRegisterAddress = (register) => {
	if (typeof register !== "number") {
		return [false, new Error(`Invalid register ${register}`).message];
	}

	if (register < 0 || register > maxRegisterAddress) {
		return [false, new Error(`Invalid register ${register}`).message];
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

export const readRegister = (register) => {
	const [valid, error] = validateRegisterAddress(register);

	if (error) {
		throw new Error(error);
	} else {
		const value = localStorage.getItem(`register-${decToHex(register, 1)}`);

		return value;
	}
};

export const writeRegister = (register, value) => {
	const [valid, error] = validateRegisterAddress(register);

	if (error) {
		throw new Error(error);
	} else {
		const [valid2, error2] = validateWordValue(value);

		if (error2) {
			throw new Error(error2);
		}

		localStorage.setItem(`register-${decToHex(register, 1)}`, value);
	}
};
