export const wordSizeBytes = 0x4; // 4 bytes per word
export const wordSizeBits = wordSizeBytes * 0x8; // 32 bits per word
export const maxWordValue = 2 ** wordSizeBits - 1; // 2^32 - 1
export const memorySizeBytes = 0xfffff; // 1 MB total memory
export const memorySizeBits = memorySizeBytes * 0x8; // 8,388,608 bits
export const maxRegisterAddress = 0xf; // 16 registers
