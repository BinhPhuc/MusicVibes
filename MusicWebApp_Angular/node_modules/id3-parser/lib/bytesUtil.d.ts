/**
 * Convert utf8 bytes to string.
 * @description
 * According to utf8 spec, char is encoded to [1,4] byte.
 * 1. 1 byte, 0 - 0x7f, the same as Ascii chars.
 * 2. 2 bytes, 110xxxxx 10xxxxxx.
 * 3. 3 bytes, 1110xxxx 10xxxxxx 10xxxxxx.
 * 4. 4 bytes, 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx.
 * For 2-4 bytes, remove leading 10/110/1110/11110 and get final codepoint.
 * @param bytes Utf8 binary bytes, usually array of numbers.
 * @param maxToRead Max number of bytes to read.
 */
export declare function readBytesToUTF8(bytes: ArrayLike<number>, maxToRead?: number): string;
/**
 * Convert utf16 bytes to string.
 * @description
 * Utf16 represents char with one or two 16-bit code units per code point.
 * 1. Range 0 - 0xFFFF (i.e. the BMP), can be represented with one 16-bit.
 * 2. Range 0x10000 - 0x10FFFF (i.e. outside the BMP), can only be encoded using two 16-bit code units.
 *
 * The two 16-bit is called a surrogate pair.
 * - The first code unit of a surrogate pair is always in the range from 0xD800 to 0xDBFF,
 *   and is called a high surrogate or a lead surrogate.
 * - The second code unit of a surrogate pair is always in the range from 0xDC00 to 0xDFFF,
 *   and is called a low surrogate or a trail surrogate.
 *
 * A codepoint `C` greater than 0xFFFF corresponds to a surrogate pair <H, L>:
 * H = Math.floor((C - 0x10000) / 0x400) + 0xD800
 * L = (C - 0x10000) % 0x400 + 0xDC00
 * C = (H - 0xD800) * 0x400 + L - 0xDC00 + 0x10000
 * @param bytes Utf16 binary bytes, usually array of numbers.
 * @param isBigEndian Specify whether utf16 bytes big-endian or little-endian.
 * @param maxToRead Max number of bytes to read.
 */
export declare function readBytesToUTF16(bytes: ArrayLike<number>, isBigEndian?: boolean, maxToRead?: number): string;
export declare function readBytesToISO8859(bytes: ArrayLike<number>, maxToRead?: number): string;
/**
 * Convert bytes to string according to encoding.
 * @param bytes Binary bytes.
 * @param encoding id3v2 tag encoding, always 0/1/2/3.
 * @param maxToRead Max number of bytes to read.
 */
export declare function readBytesToString(bytes: ArrayLike<number>, encoding: number, maxToRead?: number): string | null;
export declare function getEndpointOfBytes(bytes: ArrayLike<number>, encoding: number, start?: number): number;
export declare function skipPaddingZeros(bytes: ArrayLike<number>, start: number): number;
