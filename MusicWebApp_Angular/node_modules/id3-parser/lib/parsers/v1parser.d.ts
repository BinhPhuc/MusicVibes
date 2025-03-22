import { IBytes, IID3V1Tag } from '../interface';
/**
 * Parse ID3v1 metadata from binary bytes.
 * @description
 * ID3v1 tag occupies 128 bytes, beginning with the string TAG 128 bytes
 * from the end of the file.
 *
 * And the format is like: header(3) + title(30) + artist(30) +
 * album(30) + year(4) + comment(30) + genre(1).
 *
 * And extended tag is only supported by few programs, so we ignore it.
 * @param bytes binary bytes.
 */
export default function parseV1Data(bytes: IBytes): false | IID3V1Tag;
