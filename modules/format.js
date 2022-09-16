export const decToBin = (dec, length = 16) => {
	const bin = dec.toString(2);
	const padding = length - bin.length;

	return "0".repeat(padding) + bin;
};

export const binToDec = (bin) => {
	return parseInt(bin, 2);
};

export const hexToBin = (hex, length = 16) => {
	return decToBin(parseInt(hex, length));
};

export const binToHex = (bin, length = 16) => {
	const hex = binToDec(bin).toString(16);

	return "0".repeat(length - hex.length) + hex;
};

export const hexToDec = (hex) => {
	return parseInt(hex, 16);
};

export const decToHex = (dec, length = 16) => {
	const hex = dec.toString(16);

	return "0".repeat(length - hex.length) + hex;
};
