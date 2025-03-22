import {
  Genres
} from "./chunk-W34ICT6R.js";
import {
  AttachedPictureType,
  ExtendedHeader,
  ID3v2Header,
  SyncTextHeader,
  TextEncodingToken,
  TextHeader,
  UINT32SYNCSAFE
} from "./chunk-C2MWTFNT.js";
import {
  decodeString,
  findZero,
  getBit
} from "./chunk-JETKR7SS.js";
import {
  UINT24_BE,
  UINT32_BE,
  UINT8,
  Uint8ArrayType,
  makeUnexpectedFileContentError,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/id3v2/FrameParser.js
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("music-metadata:id3v2:frame-parser");
var defaultEnc = "latin1";
function parseGenre(origVal) {
  const genres = [];
  let code;
  let word = "";
  for (const c of origVal) {
    if (typeof code === "string") {
      if (c === "(" && code === "") {
        word += "(";
        code = void 0;
      } else if (c === ")") {
        if (word !== "") {
          genres.push(word);
          word = "";
        }
        const genre = parseGenreCode(code);
        if (genre) {
          genres.push(genre);
        }
        code = void 0;
      } else
        code += c;
    } else if (c === "(") {
      code = "";
    } else {
      word += c;
    }
  }
  if (word) {
    if (genres.length === 0 && word.match(/^\d*$/)) {
      word = parseGenreCode(word);
    }
    if (word) {
      genres.push(word);
    }
  }
  return genres;
}
function parseGenreCode(code) {
  if (code === "RX")
    return "Remix";
  if (code === "CR")
    return "Cover";
  if (code.match(/^\d*$/)) {
    return Genres[Number.parseInt(code)];
  }
}
var FrameParser = class _FrameParser {
  /**
   * Create id3v2 frame parser
   * @param major - Major version, e.g. (4) for  id3v2.4
   * @param warningCollector - Used to collect decode issue
   */
  constructor(major, warningCollector) {
    this.major = major;
    this.warningCollector = warningCollector;
  }
  readData(uint8Array, type, includeCovers) {
    if (uint8Array.length === 0) {
      this.warningCollector.addWarning(`id3v2.${this.major} header has empty tag type=${type}`);
      return;
    }
    const { encoding, bom } = TextEncodingToken.get(uint8Array, 0);
    const length = uint8Array.length;
    let offset = 0;
    let output = [];
    const nullTerminatorLength = _FrameParser.getNullTerminatorLength(encoding);
    let fzero;
    debug(`Parsing tag type=${type}, encoding=${encoding}, bom=${bom}`);
    switch (type !== "TXXX" && type[0] === "T" ? "T*" : type) {
      case "T*":
      case "GRP1":
      case "IPLS":
      case "MVIN":
      case "MVNM":
      case "PCS":
      case "PCST": {
        let text;
        try {
          text = decodeString(uint8Array.slice(1), encoding).replace(/\x00+$/, "");
        } catch (error) {
          if (error instanceof Error) {
            this.warningCollector.addWarning(`id3v2.${this.major} type=${type} header has invalid string value: ${error.message}`);
            break;
          }
          throw error;
        }
        switch (type) {
          case "TMCL":
          case "TIPL":
          case "IPLS":
            output = _FrameParser.functionList(this.splitValue(type, text));
            break;
          case "TRK":
          case "TRCK":
          case "TPOS":
            output = text;
            break;
          case "TCOM":
          case "TEXT":
          case "TOLY":
          case "TOPE":
          case "TPE1":
          case "TSRC":
            output = this.splitValue(type, text);
            break;
          case "TCO":
          case "TCON":
            output = this.splitValue(type, text).map((v) => parseGenre(v)).reduce((acc, val) => acc.concat(val), []);
            break;
          case "PCS":
          case "PCST":
            output = this.major >= 4 ? this.splitValue(type, text) : [text];
            output = Array.isArray(output) && output[0] === "" ? 1 : 0;
            break;
          default:
            output = this.major >= 4 ? this.splitValue(type, text) : [text];
        }
        break;
      }
      case "TXXX": {
        const idAndData = _FrameParser.readIdentifierAndData(uint8Array, offset + 1, length, encoding);
        const textTag = {
          description: idAndData.id,
          text: this.splitValue(type, decodeString(idAndData.data, encoding).replace(/\x00+$/, ""))
        };
        output = textTag;
        break;
      }
      case "PIC":
      case "APIC":
        if (includeCovers) {
          const pic = {};
          offset += 1;
          switch (this.major) {
            case 2:
              pic.format = decodeString(uint8Array.slice(offset, offset + 3), "latin1");
              offset += 3;
              break;
            case 3:
            case 4:
              fzero = findZero(uint8Array, offset, length, defaultEnc);
              pic.format = decodeString(uint8Array.slice(offset, fzero), defaultEnc);
              offset = fzero + 1;
              break;
            default:
              throw makeUnexpectedMajorVersionError(this.major);
          }
          pic.format = _FrameParser.fixPictureMimeType(pic.format);
          pic.type = AttachedPictureType[uint8Array[offset]];
          offset += 1;
          fzero = findZero(uint8Array, offset, length, encoding);
          pic.description = decodeString(uint8Array.slice(offset, fzero), encoding);
          offset = fzero + nullTerminatorLength;
          pic.data = uint8Array.slice(offset, length);
          output = pic;
        }
        break;
      case "CNT":
      case "PCNT":
        output = UINT32_BE.get(uint8Array, 0);
        break;
      case "SYLT": {
        const syltHeader = SyncTextHeader.get(uint8Array, 0);
        offset += SyncTextHeader.len;
        const result = {
          descriptor: "",
          language: syltHeader.language,
          contentType: syltHeader.contentType,
          timeStampFormat: syltHeader.timeStampFormat,
          syncText: []
        };
        let readSyllables = false;
        while (offset < length) {
          const nullStr = _FrameParser.readNullTerminatedString(uint8Array.subarray(offset), syltHeader.encoding);
          offset += nullStr.len;
          if (readSyllables) {
            const timestamp = UINT32_BE.get(uint8Array, offset);
            offset += UINT32_BE.len;
            result.syncText.push({
              text: nullStr.text,
              timestamp
            });
          } else {
            result.descriptor = nullStr.text;
            readSyllables = true;
          }
        }
        output = result;
        break;
      }
      case "ULT":
      case "USLT":
      case "COM":
      case "COMM": {
        const textHeader = TextHeader.get(uint8Array, offset);
        offset += TextHeader.len;
        const descriptorStr = _FrameParser.readNullTerminatedString(uint8Array.subarray(offset), textHeader.encoding);
        offset += descriptorStr.len;
        const textStr = _FrameParser.readNullTerminatedString(uint8Array.subarray(offset), textHeader.encoding);
        const comment = {
          language: textHeader.language,
          descriptor: descriptorStr.text,
          text: textStr.text
        };
        output = comment;
        break;
      }
      case "UFID": {
        const ufid = _FrameParser.readIdentifierAndData(uint8Array, offset, length, defaultEnc);
        output = { owner_identifier: ufid.id, identifier: ufid.data };
        break;
      }
      case "PRIV": {
        const priv = _FrameParser.readIdentifierAndData(uint8Array, offset, length, defaultEnc);
        output = { owner_identifier: priv.id, data: priv.data };
        break;
      }
      case "POPM": {
        fzero = findZero(uint8Array, offset, length, defaultEnc);
        const email = decodeString(uint8Array.slice(offset, fzero), defaultEnc);
        offset = fzero + 1;
        const dataLen = length - offset;
        output = {
          email,
          rating: UINT8.get(uint8Array, offset),
          counter: dataLen >= 5 ? UINT32_BE.get(uint8Array, offset + 1) : void 0
        };
        break;
      }
      case "GEOB": {
        fzero = findZero(uint8Array, offset + 1, length, encoding);
        const mimeType = decodeString(uint8Array.slice(offset + 1, fzero), defaultEnc);
        offset = fzero + 1;
        fzero = findZero(uint8Array, offset, length, encoding);
        const filename = decodeString(uint8Array.slice(offset, fzero), defaultEnc);
        offset = fzero + 1;
        fzero = findZero(uint8Array, offset, length, encoding);
        const description = decodeString(uint8Array.slice(offset, fzero), defaultEnc);
        offset = fzero + 1;
        const geob = {
          type: mimeType,
          filename,
          description,
          data: uint8Array.slice(offset, length)
        };
        output = geob;
        break;
      }
      case "WCOM":
      case "WCOP":
      case "WOAF":
      case "WOAR":
      case "WOAS":
      case "WORS":
      case "WPAY":
      case "WPUB":
        fzero = findZero(uint8Array, offset + 1, length, encoding);
        output = decodeString(uint8Array.slice(offset, fzero), defaultEnc);
        break;
      case "WXXX": {
        fzero = findZero(uint8Array, offset + 1, length, encoding);
        const description = decodeString(uint8Array.slice(offset + 1, fzero), encoding);
        offset = fzero + (encoding === "utf-16le" ? 2 : 1);
        output = { description, url: decodeString(uint8Array.slice(offset, length), defaultEnc) };
        break;
      }
      case "WFD":
      case "WFED":
        output = decodeString(uint8Array.slice(offset + 1, findZero(uint8Array, offset + 1, length, encoding)), encoding);
        break;
      case "MCDI": {
        output = uint8Array.slice(0, length);
        break;
      }
      default:
        debug(`Warning: unsupported id3v2-tag-type: ${type}`);
        break;
    }
    return output;
  }
  static readNullTerminatedString(uint8Array, encoding) {
    let offset = encoding.bom ? 2 : 0;
    const zeroIndex = findZero(uint8Array, offset, uint8Array.length, encoding.encoding);
    const txt = uint8Array.slice(offset, zeroIndex);
    if (encoding.encoding === "utf-16le") {
      offset = zeroIndex + 2;
    } else {
      offset = zeroIndex + 1;
    }
    return {
      text: decodeString(txt, encoding.encoding),
      len: offset
    };
  }
  static fixPictureMimeType(pictureType) {
    pictureType = pictureType.toLocaleLowerCase();
    switch (pictureType) {
      case "jpg":
        return "image/jpeg";
      case "png":
        return "image/png";
    }
    return pictureType;
  }
  /**
   * Converts TMCL (Musician credits list) or TIPL (Involved people list)
   * @param entries
   */
  static functionList(entries) {
    const res = {};
    for (let i = 0; i + 1 < entries.length; i += 2) {
      const names = entries[i + 1].split(",");
      res[entries[i]] = res[entries[i]] ? res[entries[i]].concat(names) : names;
    }
    return res;
  }
  /**
   * id3v2.4 defines that multiple T* values are separated by 0x00
   * id3v2.3 defines that TCOM, TEXT, TOLY, TOPE & TPE1 values are separated by /
   * @param tag - Tag name
   * @param text - Concatenated tag value
   * @returns Split tag value
   */
  splitValue(tag, text) {
    let values;
    if (this.major < 4) {
      values = text.split(/\x00/g);
      if (values.length > 1) {
        this.warningCollector.addWarning(`ID3v2.${this.major} ${tag} uses non standard null-separator.`);
      } else {
        values = text.split(/\//g);
      }
    } else {
      values = text.split(/\x00/g);
    }
    return _FrameParser.trimArray(values);
  }
  static trimArray(values) {
    return values.map((value) => value.replace(/\x00+$/, "").trim());
  }
  static readIdentifierAndData(uint8Array, offset, length, encoding) {
    const fzero = findZero(uint8Array, offset, length, encoding);
    const id = decodeString(uint8Array.slice(offset, fzero), encoding);
    offset = fzero + _FrameParser.getNullTerminatorLength(encoding);
    return { id, data: uint8Array.slice(offset, length) };
  }
  static getNullTerminatorLength(enc) {
    return enc === "utf-16le" ? 2 : 1;
  }
};
var Id3v2ContentError = class extends makeUnexpectedFileContentError("id3v2") {
};
function makeUnexpectedMajorVersionError(majorVer) {
  throw new Id3v2ContentError(`Unexpected majorVer: ${majorVer}`);
}

// node_modules/music-metadata/lib/id3v2/ID3v2Parser.js
var asciiDecoder = new TextDecoder("ascii");
var ID3v2Parser = class _ID3v2Parser {
  constructor() {
    this.tokenizer = void 0;
    this.id3Header = void 0;
    this.metadata = void 0;
    this.headerType = void 0;
    this.options = void 0;
  }
  static removeUnsyncBytes(buffer) {
    let readI = 0;
    let writeI = 0;
    while (readI < buffer.length - 1) {
      if (readI !== writeI) {
        buffer[writeI] = buffer[readI];
      }
      readI += buffer[readI] === 255 && buffer[readI + 1] === 0 ? 2 : 1;
      writeI++;
    }
    if (readI < buffer.length) {
      buffer[writeI++] = buffer[readI];
    }
    return buffer.slice(0, writeI);
  }
  static getFrameHeaderLength(majorVer) {
    switch (majorVer) {
      case 2:
        return 6;
      case 3:
      case 4:
        return 10;
      default:
        throw makeUnexpectedMajorVersionError2(majorVer);
    }
  }
  static readFrameFlags(b) {
    return {
      status: {
        tag_alter_preservation: getBit(b, 0, 6),
        file_alter_preservation: getBit(b, 0, 5),
        read_only: getBit(b, 0, 4)
      },
      format: {
        grouping_identity: getBit(b, 1, 7),
        compression: getBit(b, 1, 3),
        encryption: getBit(b, 1, 2),
        unsynchronisation: getBit(b, 1, 1),
        data_length_indicator: getBit(b, 1, 0)
      }
    };
  }
  static readFrameData(uint8Array, frameHeader, majorVer, includeCovers, warningCollector) {
    const frameParser = new FrameParser(majorVer, warningCollector);
    switch (majorVer) {
      case 2:
        return frameParser.readData(uint8Array, frameHeader.id, includeCovers);
      case 3:
      case 4:
        if (frameHeader.flags?.format.unsynchronisation) {
          uint8Array = _ID3v2Parser.removeUnsyncBytes(uint8Array);
        }
        if (frameHeader.flags?.format.data_length_indicator) {
          uint8Array = uint8Array.slice(4, uint8Array.length);
        }
        return frameParser.readData(uint8Array, frameHeader.id, includeCovers);
      default:
        throw makeUnexpectedMajorVersionError2(majorVer);
    }
  }
  /**
   * Create a combined tag key, of tag & description
   * @param tag e.g.: COM
   * @param description e.g. iTunPGAP
   * @returns string e.g. COM:iTunPGAP
   */
  static makeDescriptionTagName(tag, description) {
    return tag + (description ? `:${description}` : "");
  }
  parse(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      this.tokenizer = tokenizer;
      this.metadata = metadata;
      this.options = options;
      const id3Header = yield this.tokenizer.readToken(ID3v2Header);
      if (id3Header.fileIdentifier !== "ID3") {
        throw new Id3v2ContentError("expected ID3-header file-identifier 'ID3' was not found");
      }
      this.id3Header = id3Header;
      this.headerType = `ID3v2.${id3Header.version.major}`;
      return id3Header.flags.isExtendedHeader ? this.parseExtendedHeader() : this.parseId3Data(id3Header.size);
    });
  }
  parseExtendedHeader() {
    return __async(this, null, function* () {
      const extendedHeader = yield this.tokenizer.readToken(ExtendedHeader);
      const dataRemaining = extendedHeader.size - ExtendedHeader.len;
      return dataRemaining > 0 ? this.parseExtendedHeaderData(dataRemaining, extendedHeader.size) : this.parseId3Data(this.id3Header.size - extendedHeader.size);
    });
  }
  parseExtendedHeaderData(dataRemaining, extendedHeaderSize) {
    return __async(this, null, function* () {
      yield this.tokenizer.ignore(dataRemaining);
      return this.parseId3Data(this.id3Header.size - extendedHeaderSize);
    });
  }
  parseId3Data(dataLen) {
    return __async(this, null, function* () {
      const uint8Array = yield this.tokenizer.readToken(new Uint8ArrayType(dataLen));
      for (const tag of this.parseMetadata(uint8Array)) {
        switch (tag.id) {
          case "TXXX":
            if (tag.value) {
              yield this.handleTag(tag, tag.value.text, () => tag.value.description);
            }
            break;
          default:
            yield Array.isArray(tag.value) ? Promise.all(tag.value.map((value) => this.addTag(tag.id, value))) : this.addTag(tag.id, tag.value);
        }
      }
    });
  }
  handleTag(tag, values, descriptor, resolveValue = (value) => value) {
    return __async(this, null, function* () {
      yield Promise.all(values.map((value) => this.addTag(_ID3v2Parser.makeDescriptionTagName(tag.id, descriptor(value)), resolveValue(value))));
    });
  }
  addTag(id, value) {
    return __async(this, null, function* () {
      yield this.metadata.addTag(this.headerType, id, value);
    });
  }
  parseMetadata(data) {
    let offset = 0;
    const tags = [];
    while (true) {
      if (offset === data.length)
        break;
      const frameHeaderLength = _ID3v2Parser.getFrameHeaderLength(this.id3Header.version.major);
      if (offset + frameHeaderLength > data.length) {
        this.metadata.addWarning("Illegal ID3v2 tag length");
        break;
      }
      const frameHeaderBytes = data.slice(offset, offset + frameHeaderLength);
      offset += frameHeaderLength;
      const frameHeader = this.readFrameHeader(frameHeaderBytes, this.id3Header.version.major);
      const frameDataBytes = data.slice(offset, offset + frameHeader.length);
      offset += frameHeader.length;
      const values = _ID3v2Parser.readFrameData(frameDataBytes, frameHeader, this.id3Header.version.major, !this.options.skipCovers, this.metadata);
      if (values) {
        tags.push({ id: frameHeader.id, value: values });
      }
    }
    return tags;
  }
  readFrameHeader(uint8Array, majorVer) {
    let header;
    switch (majorVer) {
      case 2:
        header = {
          id: asciiDecoder.decode(uint8Array.slice(0, 3)),
          length: UINT24_BE.get(uint8Array, 3)
        };
        if (!header.id.match(/[A-Z0-9]{3}/g)) {
          this.metadata.addWarning(`Invalid ID3v2.${this.id3Header.version.major} frame-header-ID: ${header.id}`);
        }
        break;
      case 3:
      case 4:
        header = {
          id: asciiDecoder.decode(uint8Array.slice(0, 4)),
          length: (majorVer === 4 ? UINT32SYNCSAFE : UINT32_BE).get(uint8Array, 4),
          flags: _ID3v2Parser.readFrameFlags(uint8Array.slice(8, 10))
        };
        if (!header.id.match(/[A-Z0-9]{4}/g)) {
          this.metadata.addWarning(`Invalid ID3v2.${this.id3Header.version.major} frame-header-ID: ${header.id}`);
        }
        break;
      default:
        throw makeUnexpectedMajorVersionError2(majorVer);
    }
    return header;
  }
};
function makeUnexpectedMajorVersionError2(majorVer) {
  throw new Id3v2ContentError(`Unexpected majorVer: ${majorVer}`);
}

export {
  ID3v2Parser
};
//# sourceMappingURL=chunk-PUCFEEIN.js.map
