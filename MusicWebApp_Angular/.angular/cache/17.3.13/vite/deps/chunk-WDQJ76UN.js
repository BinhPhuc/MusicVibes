import {
  a2hex,
  stringToUint8Array,
  uint8ArrayToString
} from "./chunk-JETKR7SS.js";
import {
  FieldDecodingError,
  InternalParserError
} from "./chunk-GBEQQQUJ.js";

// node_modules/music-metadata/lib/common/FourCC.js
var validFourCC = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/;
var FourCcToken = {
  len: 4,
  get: (buf, off) => {
    const id = uint8ArrayToString(buf.slice(off, off + FourCcToken.len), "latin1");
    if (!id.match(validFourCC)) {
      throw new FieldDecodingError(`FourCC contains invalid characters: ${a2hex(id)} "${id}"`);
    }
    return id;
  },
  put: (buffer, offset, id) => {
    const str = stringToUint8Array(id);
    if (str.length !== 4)
      throw new InternalParserError("Invalid length");
    buffer.set(str, offset);
    return offset + 4;
  }
};

export {
  FourCcToken
};
//# sourceMappingURL=chunk-WDQJ76UN.js.map
