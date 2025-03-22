import "./chunk-HZHTRIIS.js";
import {
  TrackType
} from "./chunk-5QE6VSOR.js";
import {
  hasID3v1Header
} from "./chunk-W34ICT6R.js";
import {
  APEv2Parser
} from "./chunk-CDMSPHVA.js";
import "./chunk-WDQJ76UN.js";
import {
  fromBuffer,
  fromWebStream
} from "./chunk-2VWM7PRE.js";
import {
  LyricsContentType,
  TimestampFormat
} from "./chunk-C2MWTFNT.js";
import {
  decodeString,
  getUintBE,
  includes,
  indexOf,
  toRatio
} from "./chunk-JETKR7SS.js";
import {
  CouldNotDetermineFileTypeError,
  INT32_BE,
  InternalParserError,
  StringType,
  UINT16_BE,
  UINT16_LE,
  UINT32_BE,
  UINT32_LE,
  UINT64_LE,
  UINT8,
  UnsupportedFileTypeError,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import "./chunk-MULMZBSY.js";
import {
  __async,
  __commonJS,
  __spreadValues,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/content-type/index.js
var require_content_type = __commonJS({
  "node_modules/content-type/index.js"(exports) {
    "use strict";
    var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
    var TEXT_REGEXP = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/;
    var TOKEN_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
    var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;
    var QUOTE_REGEXP = /([\\"])/g;
    var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
    exports.format = format;
    exports.parse = parse;
    function format(obj) {
      if (!obj || typeof obj !== "object") {
        throw new TypeError("argument obj is required");
      }
      var parameters = obj.parameters;
      var type = obj.type;
      if (!type || !TYPE_REGEXP.test(type)) {
        throw new TypeError("invalid type");
      }
      var string = type;
      if (parameters && typeof parameters === "object") {
        var param;
        var params = Object.keys(parameters).sort();
        for (var i = 0; i < params.length; i++) {
          param = params[i];
          if (!TOKEN_REGEXP.test(param)) {
            throw new TypeError("invalid parameter name");
          }
          string += "; " + param + "=" + qstring(parameters[param]);
        }
      }
      return string;
    }
    function parse(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      var header = typeof string === "object" ? getcontenttype(string) : string;
      if (typeof header !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      var index = header.indexOf(";");
      var type = index !== -1 ? header.slice(0, index).trim() : header.trim();
      if (!TYPE_REGEXP.test(type)) {
        throw new TypeError("invalid media type");
      }
      var obj = new ContentType2(type.toLowerCase());
      if (index !== -1) {
        var key;
        var match;
        var value;
        PARAM_REGEXP.lastIndex = index;
        while (match = PARAM_REGEXP.exec(header)) {
          if (match.index !== index) {
            throw new TypeError("invalid parameter format");
          }
          index += match[0].length;
          key = match[1].toLowerCase();
          value = match[2];
          if (value.charCodeAt(0) === 34) {
            value = value.slice(1, -1);
            if (value.indexOf("\\") !== -1) {
              value = value.replace(QESC_REGEXP, "$1");
            }
          }
          obj.parameters[key] = value;
        }
        if (index !== header.length) {
          throw new TypeError("invalid parameter format");
        }
      }
      return obj;
    }
    function getcontenttype(obj) {
      var header;
      if (typeof obj.getHeader === "function") {
        header = obj.getHeader("content-type");
      } else if (typeof obj.headers === "object") {
        header = obj.headers && obj.headers["content-type"];
      }
      if (typeof header !== "string") {
        throw new TypeError("content-type header is missing from object");
      }
      return header;
    }
    function qstring(val) {
      var str = String(val);
      if (TOKEN_REGEXP.test(str)) {
        return str;
      }
      if (str.length > 0 && !TEXT_REGEXP.test(str)) {
        throw new TypeError("invalid parameter value");
      }
      return '"' + str.replace(QUOTE_REGEXP, "\\$1") + '"';
    }
    function ContentType2(type) {
      this.parameters = /* @__PURE__ */ Object.create(null);
      this.type = type;
    }
  }
});

// node_modules/music-metadata/node_modules/media-typer/index.js
var require_media_typer = __commonJS({
  "node_modules/music-metadata/node_modules/media-typer/index.js"(exports) {
    "use strict";
    var SUBTYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
    var TYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
    var TYPE_REGEXP = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
    exports.format = format;
    exports.parse = parse;
    exports.test = test;
    function format(obj) {
      if (!obj || typeof obj !== "object") {
        throw new TypeError("argument obj is required");
      }
      var subtype = obj.subtype;
      var suffix = obj.suffix;
      var type = obj.type;
      if (!type || !TYPE_NAME_REGEXP.test(type)) {
        throw new TypeError("invalid type");
      }
      if (!subtype || !SUBTYPE_NAME_REGEXP.test(subtype)) {
        throw new TypeError("invalid subtype");
      }
      var string = type + "/" + subtype;
      if (suffix) {
        if (!TYPE_NAME_REGEXP.test(suffix)) {
          throw new TypeError("invalid suffix");
        }
        string += "+" + suffix;
      }
      return string;
    }
    function test(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      if (typeof string !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      return TYPE_REGEXP.test(string.toLowerCase());
    }
    function parse(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      if (typeof string !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      var match = TYPE_REGEXP.exec(string.toLowerCase());
      if (!match) {
        throw new TypeError("invalid media type");
      }
      var type = match[1];
      var subtype = match[2];
      var suffix;
      var index = subtype.lastIndexOf("+");
      if (index !== -1) {
        suffix = subtype.substr(index + 1);
        subtype = subtype.substr(0, index);
      }
      return new MediaType(type, subtype, suffix);
    }
    function MediaType(type, subtype, suffix) {
      this.type = type;
      this.subtype = subtype;
      this.suffix = suffix;
    }
  }
});

// node_modules/file-type/node_modules/peek-readable/lib/EndOfStreamError.js
var defaultMessages = "End-Of-Stream";
var EndOfStreamError = class extends Error {
  constructor() {
    super(defaultMessages);
  }
};

// node_modules/file-type/node_modules/peek-readable/lib/AbstractStreamReader.js
var AbstractStreamReader = class {
  constructor() {
    this.maxStreamReadSize = 1 * 1024 * 1024;
    this.endOfStream = false;
    this.peekQueue = [];
  }
  peek(uint8Array, offset, length) {
    return __async(this, null, function* () {
      const bytesRead = yield this.read(uint8Array, offset, length);
      this.peekQueue.push(uint8Array.subarray(offset, offset + bytesRead));
      return bytesRead;
    });
  }
  read(buffer, offset, length) {
    return __async(this, null, function* () {
      if (length === 0) {
        return 0;
      }
      let bytesRead = this.readFromPeekBuffer(buffer, offset, length);
      bytesRead += yield this.readRemainderFromStream(buffer, offset + bytesRead, length - bytesRead);
      if (bytesRead === 0) {
        throw new EndOfStreamError();
      }
      return bytesRead;
    });
  }
  /**
   * Read chunk from stream
   * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
   * @param offset - Offset target
   * @param length - Number of bytes to read
   * @returns Number of bytes read
   */
  readFromPeekBuffer(buffer, offset, length) {
    let remaining = length;
    let bytesRead = 0;
    while (this.peekQueue.length > 0 && remaining > 0) {
      const peekData = this.peekQueue.pop();
      if (!peekData)
        throw new Error("peekData should be defined");
      const lenCopy = Math.min(peekData.length, remaining);
      buffer.set(peekData.subarray(0, lenCopy), offset + bytesRead);
      bytesRead += lenCopy;
      remaining -= lenCopy;
      if (lenCopy < peekData.length) {
        this.peekQueue.push(peekData.subarray(lenCopy));
      }
    }
    return bytesRead;
  }
  readRemainderFromStream(buffer, offset, initialRemaining) {
    return __async(this, null, function* () {
      let remaining = initialRemaining;
      let bytesRead = 0;
      while (remaining > 0 && !this.endOfStream) {
        const reqLen = Math.min(remaining, this.maxStreamReadSize);
        const chunkLen = yield this.readFromStream(buffer, offset + bytesRead, reqLen);
        if (chunkLen === 0)
          break;
        bytesRead += chunkLen;
        remaining -= chunkLen;
      }
      return bytesRead;
    });
  }
};

// node_modules/file-type/node_modules/peek-readable/lib/WebStreamReader.js
var WebStreamReader = class extends AbstractStreamReader {
  constructor(stream) {
    super();
    this.reader = stream.getReader({ mode: "byob" });
  }
  readFromStream(buffer, offset, length) {
    return __async(this, null, function* () {
      if (this.endOfStream) {
        throw new EndOfStreamError();
      }
      const result = yield this.reader.read(new Uint8Array(length));
      if (result.done) {
        this.endOfStream = result.done;
      }
      if (result.value) {
        buffer.set(result.value, offset);
        return result.value.byteLength;
      }
      return 0;
    });
  }
  abort() {
    return this.reader.cancel();
  }
  close() {
    return __async(this, null, function* () {
      yield this.abort();
      this.reader.releaseLock();
    });
  }
};

// node_modules/file-type/node_modules/strtok3/lib/AbstractTokenizer.js
var AbstractTokenizer = class {
  /**
   * Constructor
   * @param options Tokenizer options
   * @protected
   */
  constructor(options) {
    this.numBuffer = new Uint8Array(8);
    this.position = 0;
    this.onClose = options?.onClose;
    if (options?.abortSignal) {
      options.abortSignal.addEventListener("abort", () => {
        this.abort();
      });
    }
  }
  /**
   * Read a token from the tokenizer-stream
   * @param token - The token to read
   * @param position - If provided, the desired position in the tokenizer-stream
   * @returns Promise with token data
   */
  readToken(_0) {
    return __async(this, arguments, function* (token, position = this.position) {
      const uint8Array = new Uint8Array(token.len);
      const len = yield this.readBuffer(uint8Array, { position });
      if (len < token.len)
        throw new EndOfStreamError();
      return token.get(uint8Array, 0);
    });
  }
  /**
   * Peek a token from the tokenizer-stream.
   * @param token - Token to peek from the tokenizer-stream.
   * @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
   * @returns Promise with token data
   */
  peekToken(_0) {
    return __async(this, arguments, function* (token, position = this.position) {
      const uint8Array = new Uint8Array(token.len);
      const len = yield this.peekBuffer(uint8Array, { position });
      if (len < token.len)
        throw new EndOfStreamError();
      return token.get(uint8Array, 0);
    });
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  readNumber(token) {
    return __async(this, null, function* () {
      const len = yield this.readBuffer(this.numBuffer, { length: token.len });
      if (len < token.len)
        throw new EndOfStreamError();
      return token.get(this.numBuffer, 0);
    });
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  peekNumber(token) {
    return __async(this, null, function* () {
      const len = yield this.peekBuffer(this.numBuffer, { length: token.len });
      if (len < token.len)
        throw new EndOfStreamError();
      return token.get(this.numBuffer, 0);
    });
  }
  /**
   * Ignore number of bytes, advances the pointer in under tokenizer-stream.
   * @param length - Number of bytes to ignore
   * @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
   */
  ignore(length) {
    return __async(this, null, function* () {
      if (this.fileInfo.size !== void 0) {
        const bytesLeft = this.fileInfo.size - this.position;
        if (length > bytesLeft) {
          this.position += bytesLeft;
          return bytesLeft;
        }
      }
      this.position += length;
      return length;
    });
  }
  close() {
    return __async(this, null, function* () {
      yield this.abort();
      yield this.onClose?.();
    });
  }
  normalizeOptions(uint8Array, options) {
    if (options && options.position !== void 0 && options.position < this.position) {
      throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
    }
    if (options) {
      return {
        mayBeLess: options.mayBeLess === true,
        offset: options.offset ? options.offset : 0,
        length: options.length ? options.length : uint8Array.length - (options.offset ? options.offset : 0),
        position: options.position ? options.position : this.position
      };
    }
    return {
      mayBeLess: false,
      offset: 0,
      length: uint8Array.length,
      position: this.position
    };
  }
  abort() {
    return Promise.resolve();
  }
};

// node_modules/file-type/node_modules/strtok3/lib/ReadStreamTokenizer.js
var maxBufferSize = 256e3;
var ReadStreamTokenizer = class extends AbstractTokenizer {
  /**
   * Constructor
   * @param streamReader stream-reader to read from
   * @param options Tokenizer options
   */
  constructor(streamReader, options) {
    super(options);
    this.streamReader = streamReader;
    this.fileInfo = options?.fileInfo ?? {};
  }
  /**
   * Read buffer from tokenizer
   * @param uint8Array - Target Uint8Array to fill with data read from the tokenizer-stream
   * @param options - Read behaviour options
   * @returns Promise with number of bytes read
   */
  readBuffer(uint8Array, options) {
    return __async(this, null, function* () {
      const normOptions = this.normalizeOptions(uint8Array, options);
      const skipBytes = normOptions.position - this.position;
      if (skipBytes > 0) {
        yield this.ignore(skipBytes);
        return this.readBuffer(uint8Array, options);
      }
      if (skipBytes < 0) {
        throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
      }
      if (normOptions.length === 0) {
        return 0;
      }
      const bytesRead = yield this.streamReader.read(uint8Array, normOptions.offset, normOptions.length);
      this.position += bytesRead;
      if ((!options || !options.mayBeLess) && bytesRead < normOptions.length) {
        throw new EndOfStreamError();
      }
      return bytesRead;
    });
  }
  /**
   * Peek (read ahead) buffer from tokenizer
   * @param uint8Array - Uint8Array (or Buffer) to write data to
   * @param options - Read behaviour options
   * @returns Promise with number of bytes peeked
   */
  peekBuffer(uint8Array, options) {
    return __async(this, null, function* () {
      const normOptions = this.normalizeOptions(uint8Array, options);
      let bytesRead = 0;
      if (normOptions.position) {
        const skipBytes = normOptions.position - this.position;
        if (skipBytes > 0) {
          const skipBuffer = new Uint8Array(normOptions.length + skipBytes);
          bytesRead = yield this.peekBuffer(skipBuffer, { mayBeLess: normOptions.mayBeLess });
          uint8Array.set(skipBuffer.subarray(skipBytes), normOptions.offset);
          return bytesRead - skipBytes;
        }
        if (skipBytes < 0) {
          throw new Error("Cannot peek from a negative offset in a stream");
        }
      }
      if (normOptions.length > 0) {
        try {
          bytesRead = yield this.streamReader.peek(uint8Array, normOptions.offset, normOptions.length);
        } catch (err) {
          if (options?.mayBeLess && err instanceof EndOfStreamError) {
            return 0;
          }
          throw err;
        }
        if (!normOptions.mayBeLess && bytesRead < normOptions.length) {
          throw new EndOfStreamError();
        }
      }
      return bytesRead;
    });
  }
  ignore(length) {
    return __async(this, null, function* () {
      const bufSize = Math.min(maxBufferSize, length);
      const buf = new Uint8Array(bufSize);
      let totBytesRead = 0;
      while (totBytesRead < length) {
        const remaining = length - totBytesRead;
        const bytesRead = yield this.readBuffer(buf, { length: Math.min(bufSize, remaining) });
        if (bytesRead < 0) {
          return bytesRead;
        }
        totBytesRead += bytesRead;
      }
      return totBytesRead;
    });
  }
  abort() {
    return this.streamReader.abort();
  }
  supportsRandomAccess() {
    return false;
  }
};

// node_modules/file-type/node_modules/strtok3/lib/BufferTokenizer.js
var BufferTokenizer = class extends AbstractTokenizer {
  /**
   * Construct BufferTokenizer
   * @param uint8Array - Uint8Array to tokenize
   * @param options Tokenizer options
   */
  constructor(uint8Array, options) {
    super(options);
    this.uint8Array = uint8Array;
    this.fileInfo = __spreadValues(__spreadValues({}, options?.fileInfo ?? {}), { size: uint8Array.length });
  }
  /**
   * Read buffer from tokenizer
   * @param uint8Array - Uint8Array to tokenize
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  readBuffer(uint8Array, options) {
    return __async(this, null, function* () {
      if (options?.position) {
        if (options.position < this.position) {
          throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
        }
        this.position = options.position;
      }
      const bytesRead = yield this.peekBuffer(uint8Array, options);
      this.position += bytesRead;
      return bytesRead;
    });
  }
  /**
   * Peek (read ahead) buffer from tokenizer
   * @param uint8Array
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  peekBuffer(uint8Array, options) {
    return __async(this, null, function* () {
      const normOptions = this.normalizeOptions(uint8Array, options);
      const bytes2read = Math.min(this.uint8Array.length - normOptions.position, normOptions.length);
      if (!normOptions.mayBeLess && bytes2read < normOptions.length) {
        throw new EndOfStreamError();
      }
      uint8Array.set(this.uint8Array.subarray(normOptions.position, normOptions.position + bytes2read), normOptions.offset);
      return bytes2read;
    });
  }
  close() {
    return super.close();
  }
  supportsRandomAccess() {
    return true;
  }
  setPosition(position) {
    this.position = position;
  }
};

// node_modules/file-type/node_modules/strtok3/lib/core.js
function fromWebStream2(webStream, options) {
  return new ReadStreamTokenizer(new WebStreamReader(webStream), options);
}
function fromBuffer2(uint8Array, options) {
  return new BufferTokenizer(uint8Array, options);
}

// node_modules/file-type/util.js
function stringToBytes(string) {
  return [...string].map((character) => character.charCodeAt(0));
}
function tarHeaderChecksumMatches(arrayBuffer, offset = 0) {
  const readSum = Number.parseInt(new StringType(6).get(arrayBuffer, 148).replace(/\0.*$/, "").trim(), 8);
  if (Number.isNaN(readSum)) {
    return false;
  }
  let sum = 8 * 32;
  for (let index = offset; index < offset + 148; index++) {
    sum += arrayBuffer[index];
  }
  for (let index = offset + 156; index < offset + 512; index++) {
    sum += arrayBuffer[index];
  }
  return readSum === sum;
}
var uint32SyncSafeToken = {
  get: (buffer, offset) => buffer[offset + 3] & 127 | buffer[offset + 2] << 7 | buffer[offset + 1] << 14 | buffer[offset] << 21,
  len: 4
};

// node_modules/file-type/supported.js
var extensions = [
  "jpg",
  "png",
  "apng",
  "gif",
  "webp",
  "flif",
  "xcf",
  "cr2",
  "cr3",
  "orf",
  "arw",
  "dng",
  "nef",
  "rw2",
  "raf",
  "tif",
  "bmp",
  "icns",
  "jxr",
  "psd",
  "indd",
  "zip",
  "tar",
  "rar",
  "gz",
  "bz2",
  "7z",
  "dmg",
  "mp4",
  "mid",
  "mkv",
  "webm",
  "mov",
  "avi",
  "mpg",
  "mp2",
  "mp3",
  "m4a",
  "oga",
  "ogg",
  "ogv",
  "opus",
  "flac",
  "wav",
  "spx",
  "amr",
  "pdf",
  "epub",
  "elf",
  "macho",
  "exe",
  "swf",
  "rtf",
  "wasm",
  "woff",
  "woff2",
  "eot",
  "ttf",
  "otf",
  "ico",
  "flv",
  "ps",
  "xz",
  "sqlite",
  "nes",
  "crx",
  "xpi",
  "cab",
  "deb",
  "ar",
  "rpm",
  "Z",
  "lz",
  "cfb",
  "mxf",
  "mts",
  "blend",
  "bpg",
  "docx",
  "pptx",
  "xlsx",
  "3gp",
  "3g2",
  "j2c",
  "jp2",
  "jpm",
  "jpx",
  "mj2",
  "aif",
  "qcp",
  "odt",
  "ods",
  "odp",
  "xml",
  "mobi",
  "heic",
  "cur",
  "ktx",
  "ape",
  "wv",
  "dcm",
  "ics",
  "glb",
  "pcap",
  "dsf",
  "lnk",
  "alias",
  "voc",
  "ac3",
  "m4v",
  "m4p",
  "m4b",
  "f4v",
  "f4p",
  "f4b",
  "f4a",
  "mie",
  "asf",
  "ogm",
  "ogx",
  "mpc",
  "arrow",
  "shp",
  "aac",
  "mp1",
  "it",
  "s3m",
  "xm",
  "ai",
  "skp",
  "avif",
  "eps",
  "lzh",
  "pgp",
  "asar",
  "stl",
  "chm",
  "3mf",
  "zst",
  "jxl",
  "vcf",
  "jls",
  "pst",
  "dwg",
  "parquet",
  "class",
  "arj",
  "cpio",
  "ace",
  "avro",
  "icc",
  "fbx",
  "vsdx",
  "vtt",
  "apk"
];
var mimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/flif",
  "image/x-xcf",
  "image/x-canon-cr2",
  "image/x-canon-cr3",
  "image/tiff",
  "image/bmp",
  "image/vnd.ms-photo",
  "image/vnd.adobe.photoshop",
  "application/x-indesign",
  "application/epub+zip",
  "application/x-xpinstall",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-tar",
  "application/x-rar-compressed",
  "application/gzip",
  "application/x-bzip2",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-apache-arrow",
  "video/mp4",
  "audio/midi",
  "video/x-matroska",
  "video/webm",
  "video/quicktime",
  "video/vnd.avi",
  "audio/wav",
  "audio/qcelp",
  "audio/x-ms-asf",
  "video/x-ms-asf",
  "application/vnd.ms-asf",
  "video/mpeg",
  "video/3gpp",
  "audio/mpeg",
  "audio/mp4",
  // RFC 4337
  "video/ogg",
  "audio/ogg",
  "audio/ogg; codecs=opus",
  "application/ogg",
  "audio/x-flac",
  "audio/ape",
  "audio/wavpack",
  "audio/amr",
  "application/pdf",
  "application/x-elf",
  "application/x-mach-binary",
  "application/x-msdownload",
  "application/x-shockwave-flash",
  "application/rtf",
  "application/wasm",
  "font/woff",
  "font/woff2",
  "application/vnd.ms-fontobject",
  "font/ttf",
  "font/otf",
  "image/x-icon",
  "video/x-flv",
  "application/postscript",
  "application/eps",
  "application/x-xz",
  "application/x-sqlite3",
  "application/x-nintendo-nes-rom",
  "application/x-google-chrome-extension",
  "application/vnd.ms-cab-compressed",
  "application/x-deb",
  "application/x-unix-archive",
  "application/x-rpm",
  "application/x-compress",
  "application/x-lzip",
  "application/x-cfb",
  "application/x-mie",
  "application/mxf",
  "video/mp2t",
  "application/x-blender",
  "image/bpg",
  "image/j2c",
  "image/jp2",
  "image/jpx",
  "image/jpm",
  "image/mj2",
  "audio/aiff",
  "application/xml",
  "application/x-mobipocket-ebook",
  "image/heif",
  "image/heif-sequence",
  "image/heic",
  "image/heic-sequence",
  "image/icns",
  "image/ktx",
  "application/dicom",
  "audio/x-musepack",
  "text/calendar",
  "text/vcard",
  "text/vtt",
  "model/gltf-binary",
  "application/vnd.tcpdump.pcap",
  "audio/x-dsf",
  // Non-standard
  "application/x.ms.shortcut",
  // Invented by us
  "application/x.apple.alias",
  // Invented by us
  "audio/x-voc",
  "audio/vnd.dolby.dd-raw",
  "audio/x-m4a",
  "image/apng",
  "image/x-olympus-orf",
  "image/x-sony-arw",
  "image/x-adobe-dng",
  "image/x-nikon-nef",
  "image/x-panasonic-rw2",
  "image/x-fujifilm-raf",
  "video/x-m4v",
  "video/3gpp2",
  "application/x-esri-shape",
  "audio/aac",
  "audio/x-it",
  "audio/x-s3m",
  "audio/x-xm",
  "video/MP1S",
  "video/MP2P",
  "application/vnd.sketchup.skp",
  "image/avif",
  "application/x-lzh-compressed",
  "application/pgp-encrypted",
  "application/x-asar",
  "model/stl",
  "application/vnd.ms-htmlhelp",
  "model/3mf",
  "image/jxl",
  "application/zstd",
  "image/jls",
  "application/vnd.ms-outlook",
  "image/vnd.dwg",
  "application/x-parquet",
  "application/java-vm",
  "application/x-arj",
  "application/x-cpio",
  "application/x-ace-compressed",
  "application/avro",
  "application/vnd.iccprofile",
  "application/x.autodesk.fbx",
  // Invented by us
  "application/vnd.visio",
  "application/vnd.android.package-archive"
];

// node_modules/file-type/core.js
var reasonableDetectionSizeInBytes = 4100;
function fileTypeFromBuffer(input) {
  return __async(this, null, function* () {
    return new FileTypeParser().fromBuffer(input);
  });
}
function _check(buffer, headers, options) {
  options = __spreadValues({
    offset: 0
  }, options);
  for (const [index, header] of headers.entries()) {
    if (options.mask) {
      if (header !== (options.mask[index] & buffer[index + options.offset])) {
        return false;
      }
    } else if (header !== buffer[index + options.offset]) {
      return false;
    }
  }
  return true;
}
var FileTypeParser = class {
  constructor(options) {
    this.detectors = options?.customDetectors;
    this.tokenizerOptions = {
      abortSignal: options?.signal
    };
    this.fromTokenizer = this.fromTokenizer.bind(this);
    this.fromBuffer = this.fromBuffer.bind(this);
    this.parse = this.parse.bind(this);
  }
  fromTokenizer(tokenizer) {
    return __async(this, null, function* () {
      const initialPosition = tokenizer.position;
      for (const detector of this.detectors || []) {
        const fileType = yield detector(tokenizer);
        if (fileType) {
          return fileType;
        }
        if (initialPosition !== tokenizer.position) {
          return void 0;
        }
      }
      return this.parse(tokenizer);
    });
  }
  fromBuffer(input) {
    return __async(this, null, function* () {
      if (!(input instanceof Uint8Array || input instanceof ArrayBuffer)) {
        throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof input}\``);
      }
      const buffer = input instanceof Uint8Array ? input : new Uint8Array(input);
      if (!(buffer?.length > 1)) {
        return;
      }
      return this.fromTokenizer(fromBuffer2(buffer, this.tokenizerOptions));
    });
  }
  fromBlob(blob) {
    return __async(this, null, function* () {
      return this.fromStream(blob.stream());
    });
  }
  fromStream(stream) {
    return __async(this, null, function* () {
      const tokenizer = yield fromWebStream2(stream, this.tokenizerOptions);
      try {
        return yield this.fromTokenizer(tokenizer);
      } finally {
        yield tokenizer.close();
      }
    });
  }
  toDetectionStream(stream, options) {
    return __async(this, null, function* () {
      const { sampleSize = reasonableDetectionSizeInBytes } = options;
      let detectedFileType;
      let firstChunk;
      const reader = stream.getReader({ mode: "byob" });
      try {
        const { value: chunk, done } = yield reader.read(new Uint8Array(sampleSize));
        firstChunk = chunk;
        if (!done && chunk) {
          try {
            detectedFileType = yield this.fromBuffer(chunk.slice(0, sampleSize));
          } catch (error) {
            if (!(error instanceof EndOfStreamError)) {
              throw error;
            }
            detectedFileType = void 0;
          }
        }
        firstChunk = chunk;
      } finally {
        reader.releaseLock();
      }
      const transformStream = new TransformStream({
        start(controller) {
          return __async(this, null, function* () {
            controller.enqueue(firstChunk);
          });
        },
        transform(chunk, controller) {
          controller.enqueue(chunk);
        }
      });
      const newStream = stream.pipeThrough(transformStream);
      newStream.fileType = detectedFileType;
      return newStream;
    });
  }
  check(header, options) {
    return _check(this.buffer, header, options);
  }
  checkString(header, options) {
    return this.check(stringToBytes(header), options);
  }
  parse(tokenizer) {
    return __async(this, null, function* () {
      this.buffer = new Uint8Array(reasonableDetectionSizeInBytes);
      if (tokenizer.fileInfo.size === void 0) {
        tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
      }
      this.tokenizer = tokenizer;
      yield tokenizer.peekBuffer(this.buffer, { length: 12, mayBeLess: true });
      if (this.check([66, 77])) {
        return {
          ext: "bmp",
          mime: "image/bmp"
        };
      }
      if (this.check([11, 119])) {
        return {
          ext: "ac3",
          mime: "audio/vnd.dolby.dd-raw"
        };
      }
      if (this.check([120, 1])) {
        return {
          ext: "dmg",
          mime: "application/x-apple-diskimage"
        };
      }
      if (this.check([77, 90])) {
        return {
          ext: "exe",
          mime: "application/x-msdownload"
        };
      }
      if (this.check([37, 33])) {
        yield tokenizer.peekBuffer(this.buffer, { length: 24, mayBeLess: true });
        if (this.checkString("PS-Adobe-", { offset: 2 }) && this.checkString(" EPSF-", { offset: 14 })) {
          return {
            ext: "eps",
            mime: "application/eps"
          };
        }
        return {
          ext: "ps",
          mime: "application/postscript"
        };
      }
      if (this.check([31, 160]) || this.check([31, 157])) {
        return {
          ext: "Z",
          mime: "application/x-compress"
        };
      }
      if (this.check([199, 113])) {
        return {
          ext: "cpio",
          mime: "application/x-cpio"
        };
      }
      if (this.check([96, 234])) {
        return {
          ext: "arj",
          mime: "application/x-arj"
        };
      }
      if (this.check([239, 187, 191])) {
        this.tokenizer.ignore(3);
        return this.parse(tokenizer);
      }
      if (this.check([71, 73, 70])) {
        return {
          ext: "gif",
          mime: "image/gif"
        };
      }
      if (this.check([73, 73, 188])) {
        return {
          ext: "jxr",
          mime: "image/vnd.ms-photo"
        };
      }
      if (this.check([31, 139, 8])) {
        return {
          ext: "gz",
          mime: "application/gzip"
        };
      }
      if (this.check([66, 90, 104])) {
        return {
          ext: "bz2",
          mime: "application/x-bzip2"
        };
      }
      if (this.checkString("ID3")) {
        yield tokenizer.ignore(6);
        const id3HeaderLength = yield tokenizer.readToken(uint32SyncSafeToken);
        if (tokenizer.position + id3HeaderLength > tokenizer.fileInfo.size) {
          return {
            ext: "mp3",
            mime: "audio/mpeg"
          };
        }
        yield tokenizer.ignore(id3HeaderLength);
        return this.fromTokenizer(tokenizer);
      }
      if (this.checkString("MP+")) {
        return {
          ext: "mpc",
          mime: "audio/x-musepack"
        };
      }
      if ((this.buffer[0] === 67 || this.buffer[0] === 70) && this.check([87, 83], { offset: 1 })) {
        return {
          ext: "swf",
          mime: "application/x-shockwave-flash"
        };
      }
      if (this.check([255, 216, 255])) {
        if (this.check([247], { offset: 3 })) {
          return {
            ext: "jls",
            mime: "image/jls"
          };
        }
        return {
          ext: "jpg",
          mime: "image/jpeg"
        };
      }
      if (this.check([79, 98, 106, 1])) {
        return {
          ext: "avro",
          mime: "application/avro"
        };
      }
      if (this.checkString("FLIF")) {
        return {
          ext: "flif",
          mime: "image/flif"
        };
      }
      if (this.checkString("8BPS")) {
        return {
          ext: "psd",
          mime: "image/vnd.adobe.photoshop"
        };
      }
      if (this.checkString("WEBP", { offset: 8 })) {
        return {
          ext: "webp",
          mime: "image/webp"
        };
      }
      if (this.checkString("MPCK")) {
        return {
          ext: "mpc",
          mime: "audio/x-musepack"
        };
      }
      if (this.checkString("FORM")) {
        return {
          ext: "aif",
          mime: "audio/aiff"
        };
      }
      if (this.checkString("icns", { offset: 0 })) {
        return {
          ext: "icns",
          mime: "image/icns"
        };
      }
      if (this.check([80, 75, 3, 4])) {
        try {
          while (tokenizer.position + 30 < tokenizer.fileInfo.size) {
            yield tokenizer.readBuffer(this.buffer, { length: 30 });
            const view = new DataView(this.buffer.buffer);
            const zipHeader = {
              compressedSize: view.getUint32(18, true),
              uncompressedSize: view.getUint32(22, true),
              filenameLength: view.getUint16(26, true),
              extraFieldLength: view.getUint16(28, true)
            };
            zipHeader.filename = yield tokenizer.readToken(new StringType(zipHeader.filenameLength, "utf-8"));
            yield tokenizer.ignore(zipHeader.extraFieldLength);
            if (/classes\d*\.dex/.test(zipHeader.filename)) {
              return {
                ext: "apk",
                mime: "application/vnd.android.package-archive"
              };
            }
            if (zipHeader.filename === "META-INF/mozilla.rsa") {
              return {
                ext: "xpi",
                mime: "application/x-xpinstall"
              };
            }
            if (zipHeader.filename.endsWith(".rels") || zipHeader.filename.endsWith(".xml")) {
              const type = zipHeader.filename.split("/")[0];
              switch (type) {
                case "_rels":
                  break;
                case "word":
                  return {
                    ext: "docx",
                    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  };
                case "ppt":
                  return {
                    ext: "pptx",
                    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  };
                case "xl":
                  return {
                    ext: "xlsx",
                    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  };
                case "visio":
                  return {
                    ext: "vsdx",
                    mime: "application/vnd.visio"
                  };
                default:
                  break;
              }
            }
            if (zipHeader.filename.startsWith("xl/")) {
              return {
                ext: "xlsx",
                mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              };
            }
            if (zipHeader.filename.startsWith("3D/") && zipHeader.filename.endsWith(".model")) {
              return {
                ext: "3mf",
                mime: "model/3mf"
              };
            }
            if (zipHeader.filename === "mimetype" && zipHeader.compressedSize === zipHeader.uncompressedSize) {
              let mimeType = yield tokenizer.readToken(new StringType(zipHeader.compressedSize, "utf-8"));
              mimeType = mimeType.trim();
              switch (mimeType) {
                case "application/epub+zip":
                  return {
                    ext: "epub",
                    mime: "application/epub+zip"
                  };
                case "application/vnd.oasis.opendocument.text":
                  return {
                    ext: "odt",
                    mime: "application/vnd.oasis.opendocument.text"
                  };
                case "application/vnd.oasis.opendocument.spreadsheet":
                  return {
                    ext: "ods",
                    mime: "application/vnd.oasis.opendocument.spreadsheet"
                  };
                case "application/vnd.oasis.opendocument.presentation":
                  return {
                    ext: "odp",
                    mime: "application/vnd.oasis.opendocument.presentation"
                  };
                default:
              }
            }
            if (zipHeader.compressedSize === 0) {
              let nextHeaderIndex = -1;
              while (nextHeaderIndex < 0 && tokenizer.position < tokenizer.fileInfo.size) {
                yield tokenizer.peekBuffer(this.buffer, { mayBeLess: true });
                nextHeaderIndex = indexOf(this.buffer, new Uint8Array([80, 75, 3, 4]));
                yield tokenizer.ignore(nextHeaderIndex >= 0 ? nextHeaderIndex : this.buffer.length);
              }
            } else {
              yield tokenizer.ignore(zipHeader.compressedSize);
            }
          }
        } catch (error) {
          if (!(error instanceof EndOfStreamError)) {
            throw error;
          }
        }
        return {
          ext: "zip",
          mime: "application/zip"
        };
      }
      if (this.checkString("OggS")) {
        yield tokenizer.ignore(28);
        const type = new Uint8Array(8);
        yield tokenizer.readBuffer(type);
        if (_check(type, [79, 112, 117, 115, 72, 101, 97, 100])) {
          return {
            ext: "opus",
            mime: "audio/ogg; codecs=opus"
          };
        }
        if (_check(type, [128, 116, 104, 101, 111, 114, 97])) {
          return {
            ext: "ogv",
            mime: "video/ogg"
          };
        }
        if (_check(type, [1, 118, 105, 100, 101, 111, 0])) {
          return {
            ext: "ogm",
            mime: "video/ogg"
          };
        }
        if (_check(type, [127, 70, 76, 65, 67])) {
          return {
            ext: "oga",
            mime: "audio/ogg"
          };
        }
        if (_check(type, [83, 112, 101, 101, 120, 32, 32])) {
          return {
            ext: "spx",
            mime: "audio/ogg"
          };
        }
        if (_check(type, [1, 118, 111, 114, 98, 105, 115])) {
          return {
            ext: "ogg",
            mime: "audio/ogg"
          };
        }
        return {
          ext: "ogx",
          mime: "application/ogg"
        };
      }
      if (this.check([80, 75]) && (this.buffer[2] === 3 || this.buffer[2] === 5 || this.buffer[2] === 7) && (this.buffer[3] === 4 || this.buffer[3] === 6 || this.buffer[3] === 8)) {
        return {
          ext: "zip",
          mime: "application/zip"
        };
      }
      if (this.checkString("ftyp", { offset: 4 }) && (this.buffer[8] & 96) !== 0) {
        const brandMajor = new StringType(4, "latin1").get(this.buffer, 8).replace("\0", " ").trim();
        switch (brandMajor) {
          case "avif":
          case "avis":
            return { ext: "avif", mime: "image/avif" };
          case "mif1":
            return { ext: "heic", mime: "image/heif" };
          case "msf1":
            return { ext: "heic", mime: "image/heif-sequence" };
          case "heic":
          case "heix":
            return { ext: "heic", mime: "image/heic" };
          case "hevc":
          case "hevx":
            return { ext: "heic", mime: "image/heic-sequence" };
          case "qt":
            return { ext: "mov", mime: "video/quicktime" };
          case "M4V":
          case "M4VH":
          case "M4VP":
            return { ext: "m4v", mime: "video/x-m4v" };
          case "M4P":
            return { ext: "m4p", mime: "video/mp4" };
          case "M4B":
            return { ext: "m4b", mime: "audio/mp4" };
          case "M4A":
            return { ext: "m4a", mime: "audio/x-m4a" };
          case "F4V":
            return { ext: "f4v", mime: "video/mp4" };
          case "F4P":
            return { ext: "f4p", mime: "video/mp4" };
          case "F4A":
            return { ext: "f4a", mime: "audio/mp4" };
          case "F4B":
            return { ext: "f4b", mime: "audio/mp4" };
          case "crx":
            return { ext: "cr3", mime: "image/x-canon-cr3" };
          default:
            if (brandMajor.startsWith("3g")) {
              if (brandMajor.startsWith("3g2")) {
                return { ext: "3g2", mime: "video/3gpp2" };
              }
              return { ext: "3gp", mime: "video/3gpp" };
            }
            return { ext: "mp4", mime: "video/mp4" };
        }
      }
      if (this.checkString("MThd")) {
        return {
          ext: "mid",
          mime: "audio/midi"
        };
      }
      if (this.checkString("wOFF") && (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) {
        return {
          ext: "woff",
          mime: "font/woff"
        };
      }
      if (this.checkString("wOF2") && (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) {
        return {
          ext: "woff2",
          mime: "font/woff2"
        };
      }
      if (this.check([212, 195, 178, 161]) || this.check([161, 178, 195, 212])) {
        return {
          ext: "pcap",
          mime: "application/vnd.tcpdump.pcap"
        };
      }
      if (this.checkString("DSD ")) {
        return {
          ext: "dsf",
          mime: "audio/x-dsf"
          // Non-standard
        };
      }
      if (this.checkString("LZIP")) {
        return {
          ext: "lz",
          mime: "application/x-lzip"
        };
      }
      if (this.checkString("fLaC")) {
        return {
          ext: "flac",
          mime: "audio/x-flac"
        };
      }
      if (this.check([66, 80, 71, 251])) {
        return {
          ext: "bpg",
          mime: "image/bpg"
        };
      }
      if (this.checkString("wvpk")) {
        return {
          ext: "wv",
          mime: "audio/wavpack"
        };
      }
      if (this.checkString("%PDF")) {
        try {
          yield tokenizer.ignore(1350);
          const maxBufferSize2 = 10 * 1024 * 1024;
          const buffer = new Uint8Array(Math.min(maxBufferSize2, tokenizer.fileInfo.size));
          yield tokenizer.readBuffer(buffer, { mayBeLess: true });
          if (includes(buffer, new TextEncoder().encode("AIPrivateData"))) {
            return {
              ext: "ai",
              mime: "application/postscript"
            };
          }
        } catch (error) {
          if (!(error instanceof EndOfStreamError)) {
            throw error;
          }
        }
        return {
          ext: "pdf",
          mime: "application/pdf"
        };
      }
      if (this.check([0, 97, 115, 109])) {
        return {
          ext: "wasm",
          mime: "application/wasm"
        };
      }
      if (this.check([73, 73])) {
        const fileType = yield this.readTiffHeader(false);
        if (fileType) {
          return fileType;
        }
      }
      if (this.check([77, 77])) {
        const fileType = yield this.readTiffHeader(true);
        if (fileType) {
          return fileType;
        }
      }
      if (this.checkString("MAC ")) {
        return {
          ext: "ape",
          mime: "audio/ape"
        };
      }
      if (this.check([26, 69, 223, 163])) {
        function readField() {
          return __async(this, null, function* () {
            const msb = yield tokenizer.peekNumber(UINT8);
            let mask = 128;
            let ic = 0;
            while ((msb & mask) === 0 && mask !== 0) {
              ++ic;
              mask >>= 1;
            }
            const id = new Uint8Array(ic + 1);
            yield tokenizer.readBuffer(id);
            return id;
          });
        }
        function readElement() {
          return __async(this, null, function* () {
            const idField = yield readField();
            const lengthField = yield readField();
            lengthField[0] ^= 128 >> lengthField.length - 1;
            const nrLength = Math.min(6, lengthField.length);
            const idView = new DataView(idField.buffer);
            const lengthView = new DataView(lengthField.buffer, lengthField.length - nrLength, nrLength);
            return {
              id: getUintBE(idView),
              len: getUintBE(lengthView)
            };
          });
        }
        function readChildren(children) {
          return __async(this, null, function* () {
            while (children > 0) {
              const element = yield readElement();
              if (element.id === 17026) {
                const rawValue = yield tokenizer.readToken(new StringType(element.len));
                return rawValue.replaceAll(/\00.*$/g, "");
              }
              yield tokenizer.ignore(element.len);
              --children;
            }
          });
        }
        const re = yield readElement();
        const docType = yield readChildren(re.len);
        switch (docType) {
          case "webm":
            return {
              ext: "webm",
              mime: "video/webm"
            };
          case "matroska":
            return {
              ext: "mkv",
              mime: "video/x-matroska"
            };
          default:
            return;
        }
      }
      if (this.check([82, 73, 70, 70])) {
        if (this.check([65, 86, 73], { offset: 8 })) {
          return {
            ext: "avi",
            mime: "video/vnd.avi"
          };
        }
        if (this.check([87, 65, 86, 69], { offset: 8 })) {
          return {
            ext: "wav",
            mime: "audio/wav"
          };
        }
        if (this.check([81, 76, 67, 77], { offset: 8 })) {
          return {
            ext: "qcp",
            mime: "audio/qcelp"
          };
        }
      }
      if (this.checkString("SQLi")) {
        return {
          ext: "sqlite",
          mime: "application/x-sqlite3"
        };
      }
      if (this.check([78, 69, 83, 26])) {
        return {
          ext: "nes",
          mime: "application/x-nintendo-nes-rom"
        };
      }
      if (this.checkString("Cr24")) {
        return {
          ext: "crx",
          mime: "application/x-google-chrome-extension"
        };
      }
      if (this.checkString("MSCF") || this.checkString("ISc(")) {
        return {
          ext: "cab",
          mime: "application/vnd.ms-cab-compressed"
        };
      }
      if (this.check([237, 171, 238, 219])) {
        return {
          ext: "rpm",
          mime: "application/x-rpm"
        };
      }
      if (this.check([197, 208, 211, 198])) {
        return {
          ext: "eps",
          mime: "application/eps"
        };
      }
      if (this.check([40, 181, 47, 253])) {
        return {
          ext: "zst",
          mime: "application/zstd"
        };
      }
      if (this.check([127, 69, 76, 70])) {
        return {
          ext: "elf",
          mime: "application/x-elf"
        };
      }
      if (this.check([33, 66, 68, 78])) {
        return {
          ext: "pst",
          mime: "application/vnd.ms-outlook"
        };
      }
      if (this.checkString("PAR1")) {
        return {
          ext: "parquet",
          mime: "application/x-parquet"
        };
      }
      if (this.check([207, 250, 237, 254])) {
        return {
          ext: "macho",
          mime: "application/x-mach-binary"
        };
      }
      if (this.check([79, 84, 84, 79, 0])) {
        return {
          ext: "otf",
          mime: "font/otf"
        };
      }
      if (this.checkString("#!AMR")) {
        return {
          ext: "amr",
          mime: "audio/amr"
        };
      }
      if (this.checkString("{\\rtf")) {
        return {
          ext: "rtf",
          mime: "application/rtf"
        };
      }
      if (this.check([70, 76, 86, 1])) {
        return {
          ext: "flv",
          mime: "video/x-flv"
        };
      }
      if (this.checkString("IMPM")) {
        return {
          ext: "it",
          mime: "audio/x-it"
        };
      }
      if (this.checkString("-lh0-", { offset: 2 }) || this.checkString("-lh1-", { offset: 2 }) || this.checkString("-lh2-", { offset: 2 }) || this.checkString("-lh3-", { offset: 2 }) || this.checkString("-lh4-", { offset: 2 }) || this.checkString("-lh5-", { offset: 2 }) || this.checkString("-lh6-", { offset: 2 }) || this.checkString("-lh7-", { offset: 2 }) || this.checkString("-lzs-", { offset: 2 }) || this.checkString("-lz4-", { offset: 2 }) || this.checkString("-lz5-", { offset: 2 }) || this.checkString("-lhd-", { offset: 2 })) {
        return {
          ext: "lzh",
          mime: "application/x-lzh-compressed"
        };
      }
      if (this.check([0, 0, 1, 186])) {
        if (this.check([33], { offset: 4, mask: [241] })) {
          return {
            ext: "mpg",
            // May also be .ps, .mpeg
            mime: "video/MP1S"
          };
        }
        if (this.check([68], { offset: 4, mask: [196] })) {
          return {
            ext: "mpg",
            // May also be .mpg, .m2p, .vob or .sub
            mime: "video/MP2P"
          };
        }
      }
      if (this.checkString("ITSF")) {
        return {
          ext: "chm",
          mime: "application/vnd.ms-htmlhelp"
        };
      }
      if (this.check([202, 254, 186, 190])) {
        return {
          ext: "class",
          mime: "application/java-vm"
        };
      }
      if (this.check([253, 55, 122, 88, 90, 0])) {
        return {
          ext: "xz",
          mime: "application/x-xz"
        };
      }
      if (this.checkString("<?xml ")) {
        return {
          ext: "xml",
          mime: "application/xml"
        };
      }
      if (this.check([55, 122, 188, 175, 39, 28])) {
        return {
          ext: "7z",
          mime: "application/x-7z-compressed"
        };
      }
      if (this.check([82, 97, 114, 33, 26, 7]) && (this.buffer[6] === 0 || this.buffer[6] === 1)) {
        return {
          ext: "rar",
          mime: "application/x-rar-compressed"
        };
      }
      if (this.checkString("solid ")) {
        return {
          ext: "stl",
          mime: "model/stl"
        };
      }
      if (this.checkString("AC")) {
        const version = new StringType(4, "latin1").get(this.buffer, 2);
        if (version.match("^d*") && version >= 1e3 && version <= 1050) {
          return {
            ext: "dwg",
            mime: "image/vnd.dwg"
          };
        }
      }
      if (this.checkString("070707")) {
        return {
          ext: "cpio",
          mime: "application/x-cpio"
        };
      }
      if (this.checkString("BLENDER")) {
        return {
          ext: "blend",
          mime: "application/x-blender"
        };
      }
      if (this.checkString("!<arch>")) {
        yield tokenizer.ignore(8);
        const string = yield tokenizer.readToken(new StringType(13, "ascii"));
        if (string === "debian-binary") {
          return {
            ext: "deb",
            mime: "application/x-deb"
          };
        }
        return {
          ext: "ar",
          mime: "application/x-unix-archive"
        };
      }
      if (this.checkString("WEBVTT") && // One of LF, CR, tab, space, or end of file must follow "WEBVTT" per the spec (see `fixture/fixture-vtt-*.vtt` for examples). Note that `\0` is technically the null character (there is no such thing as an EOF character). However, checking for `\0` gives us the same result as checking for the end of the stream.
      ["\n", "\r", "	", " ", "\0"].some((char7) => this.checkString(char7, { offset: 6 }))) {
        return {
          ext: "vtt",
          mime: "text/vtt"
        };
      }
      if (this.check([137, 80, 78, 71, 13, 10, 26, 10])) {
        yield tokenizer.ignore(8);
        function readChunkHeader() {
          return __async(this, null, function* () {
            return {
              length: yield tokenizer.readToken(INT32_BE),
              type: yield tokenizer.readToken(new StringType(4, "latin1"))
            };
          });
        }
        do {
          const chunk = yield readChunkHeader();
          if (chunk.length < 0) {
            return;
          }
          switch (chunk.type) {
            case "IDAT":
              return {
                ext: "png",
                mime: "image/png"
              };
            case "acTL":
              return {
                ext: "apng",
                mime: "image/apng"
              };
            default:
              yield tokenizer.ignore(chunk.length + 4);
          }
        } while (tokenizer.position + 8 < tokenizer.fileInfo.size);
        return {
          ext: "png",
          mime: "image/png"
        };
      }
      if (this.check([65, 82, 82, 79, 87, 49, 0, 0])) {
        return {
          ext: "arrow",
          mime: "application/x-apache-arrow"
        };
      }
      if (this.check([103, 108, 84, 70, 2, 0, 0, 0])) {
        return {
          ext: "glb",
          mime: "model/gltf-binary"
        };
      }
      if (this.check([102, 114, 101, 101], { offset: 4 }) || this.check([109, 100, 97, 116], { offset: 4 }) || this.check([109, 111, 111, 118], { offset: 4 }) || this.check([119, 105, 100, 101], { offset: 4 })) {
        return {
          ext: "mov",
          mime: "video/quicktime"
        };
      }
      if (this.check([73, 73, 82, 79, 8, 0, 0, 0, 24])) {
        return {
          ext: "orf",
          mime: "image/x-olympus-orf"
        };
      }
      if (this.checkString("gimp xcf ")) {
        return {
          ext: "xcf",
          mime: "image/x-xcf"
        };
      }
      if (this.check([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216])) {
        return {
          ext: "rw2",
          mime: "image/x-panasonic-rw2"
        };
      }
      if (this.check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
        function readHeader() {
          return __async(this, null, function* () {
            const guid = new Uint8Array(16);
            yield tokenizer.readBuffer(guid);
            return {
              id: guid,
              size: Number(yield tokenizer.readToken(UINT64_LE))
            };
          });
        }
        yield tokenizer.ignore(30);
        while (tokenizer.position + 24 < tokenizer.fileInfo.size) {
          const header = yield readHeader();
          let payload = header.size - 24;
          if (_check(header.id, [145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101])) {
            const typeId = new Uint8Array(16);
            payload -= yield tokenizer.readBuffer(typeId);
            if (_check(typeId, [64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
              return {
                ext: "asf",
                mime: "audio/x-ms-asf"
              };
            }
            if (_check(typeId, [192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
              return {
                ext: "asf",
                mime: "video/x-ms-asf"
              };
            }
            break;
          }
          yield tokenizer.ignore(payload);
        }
        return {
          ext: "asf",
          mime: "application/vnd.ms-asf"
        };
      }
      if (this.check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10])) {
        return {
          ext: "ktx",
          mime: "image/ktx"
        };
      }
      if ((this.check([126, 16, 4]) || this.check([126, 24, 4])) && this.check([48, 77, 73, 69], { offset: 4 })) {
        return {
          ext: "mie",
          mime: "application/x-mie"
        };
      }
      if (this.check([39, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { offset: 2 })) {
        return {
          ext: "shp",
          mime: "application/x-esri-shape"
        };
      }
      if (this.check([255, 79, 255, 81])) {
        return {
          ext: "j2c",
          mime: "image/j2c"
        };
      }
      if (this.check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) {
        yield tokenizer.ignore(20);
        const type = yield tokenizer.readToken(new StringType(4, "ascii"));
        switch (type) {
          case "jp2 ":
            return {
              ext: "jp2",
              mime: "image/jp2"
            };
          case "jpx ":
            return {
              ext: "jpx",
              mime: "image/jpx"
            };
          case "jpm ":
            return {
              ext: "jpm",
              mime: "image/jpm"
            };
          case "mjp2":
            return {
              ext: "mj2",
              mime: "image/mj2"
            };
          default:
            return;
        }
      }
      if (this.check([255, 10]) || this.check([0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10])) {
        return {
          ext: "jxl",
          mime: "image/jxl"
        };
      }
      if (this.check([254, 255])) {
        if (this.check([0, 60, 0, 63, 0, 120, 0, 109, 0, 108], { offset: 2 })) {
          return {
            ext: "xml",
            mime: "application/xml"
          };
        }
        return void 0;
      }
      if (this.check([0, 0, 1, 186]) || this.check([0, 0, 1, 179])) {
        return {
          ext: "mpg",
          mime: "video/mpeg"
        };
      }
      if (this.check([0, 1, 0, 0, 0])) {
        return {
          ext: "ttf",
          mime: "font/ttf"
        };
      }
      if (this.check([0, 0, 1, 0])) {
        return {
          ext: "ico",
          mime: "image/x-icon"
        };
      }
      if (this.check([0, 0, 2, 0])) {
        return {
          ext: "cur",
          mime: "image/x-icon"
        };
      }
      if (this.check([208, 207, 17, 224, 161, 177, 26, 225])) {
        return {
          ext: "cfb",
          mime: "application/x-cfb"
        };
      }
      yield tokenizer.peekBuffer(this.buffer, { length: Math.min(256, tokenizer.fileInfo.size), mayBeLess: true });
      if (this.check([97, 99, 115, 112], { offset: 36 })) {
        return {
          ext: "icc",
          mime: "application/vnd.iccprofile"
        };
      }
      if (this.checkString("**ACE", { offset: 7 }) && this.checkString("**", { offset: 12 })) {
        return {
          ext: "ace",
          mime: "application/x-ace-compressed"
        };
      }
      if (this.checkString("BEGIN:")) {
        if (this.checkString("VCARD", { offset: 6 })) {
          return {
            ext: "vcf",
            mime: "text/vcard"
          };
        }
        if (this.checkString("VCALENDAR", { offset: 6 })) {
          return {
            ext: "ics",
            mime: "text/calendar"
          };
        }
      }
      if (this.checkString("FUJIFILMCCD-RAW")) {
        return {
          ext: "raf",
          mime: "image/x-fujifilm-raf"
        };
      }
      if (this.checkString("Extended Module:")) {
        return {
          ext: "xm",
          mime: "audio/x-xm"
        };
      }
      if (this.checkString("Creative Voice File")) {
        return {
          ext: "voc",
          mime: "audio/x-voc"
        };
      }
      if (this.check([4, 0, 0, 0]) && this.buffer.length >= 16) {
        const jsonSize = new DataView(this.buffer.buffer).getUint32(12, true);
        if (jsonSize > 12 && this.buffer.length >= jsonSize + 16) {
          try {
            const header = new TextDecoder().decode(this.buffer.slice(16, jsonSize + 16));
            const json = JSON.parse(header);
            if (json.files) {
              return {
                ext: "asar",
                mime: "application/x-asar"
              };
            }
          } catch {
          }
        }
      }
      if (this.check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
        return {
          ext: "mxf",
          mime: "application/mxf"
        };
      }
      if (this.checkString("SCRM", { offset: 44 })) {
        return {
          ext: "s3m",
          mime: "audio/x-s3m"
        };
      }
      if (this.check([71]) && this.check([71], { offset: 188 })) {
        return {
          ext: "mts",
          mime: "video/mp2t"
        };
      }
      if (this.check([71], { offset: 4 }) && this.check([71], { offset: 196 })) {
        return {
          ext: "mts",
          mime: "video/mp2t"
        };
      }
      if (this.check([66, 79, 79, 75, 77, 79, 66, 73], { offset: 60 })) {
        return {
          ext: "mobi",
          mime: "application/x-mobipocket-ebook"
        };
      }
      if (this.check([68, 73, 67, 77], { offset: 128 })) {
        return {
          ext: "dcm",
          mime: "application/dicom"
        };
      }
      if (this.check([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70])) {
        return {
          ext: "lnk",
          mime: "application/x.ms.shortcut"
          // Invented by us
        };
      }
      if (this.check([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0])) {
        return {
          ext: "alias",
          mime: "application/x.apple.alias"
          // Invented by us
        };
      }
      if (this.checkString("Kaydara FBX Binary  \0")) {
        return {
          ext: "fbx",
          mime: "application/x.autodesk.fbx"
          // Invented by us
        };
      }
      if (this.check([76, 80], { offset: 34 }) && (this.check([0, 0, 1], { offset: 8 }) || this.check([1, 0, 2], { offset: 8 }) || this.check([2, 0, 2], { offset: 8 }))) {
        return {
          ext: "eot",
          mime: "application/vnd.ms-fontobject"
        };
      }
      if (this.check([6, 6, 237, 245, 216, 29, 70, 229, 189, 49, 239, 231, 254, 116, 183, 29])) {
        return {
          ext: "indd",
          mime: "application/x-indesign"
        };
      }
      yield tokenizer.peekBuffer(this.buffer, { length: Math.min(512, tokenizer.fileInfo.size), mayBeLess: true });
      if (tarHeaderChecksumMatches(this.buffer)) {
        return {
          ext: "tar",
          mime: "application/x-tar"
        };
      }
      if (this.check([255, 254])) {
        if (this.check([60, 0, 63, 0, 120, 0, 109, 0, 108, 0], { offset: 2 })) {
          return {
            ext: "xml",
            mime: "application/xml"
          };
        }
        if (this.check([255, 14, 83, 0, 107, 0, 101, 0, 116, 0, 99, 0, 104, 0, 85, 0, 112, 0, 32, 0, 77, 0, 111, 0, 100, 0, 101, 0, 108, 0], { offset: 2 })) {
          return {
            ext: "skp",
            mime: "application/vnd.sketchup.skp"
          };
        }
        return void 0;
      }
      if (this.checkString("-----BEGIN PGP MESSAGE-----")) {
        return {
          ext: "pgp",
          mime: "application/pgp-encrypted"
        };
      }
      if (this.buffer.length >= 2 && this.check([255, 224], { offset: 0, mask: [255, 224] })) {
        if (this.check([16], { offset: 1, mask: [22] })) {
          if (this.check([8], { offset: 1, mask: [8] })) {
            return {
              ext: "aac",
              mime: "audio/aac"
            };
          }
          return {
            ext: "aac",
            mime: "audio/aac"
          };
        }
        if (this.check([2], { offset: 1, mask: [6] })) {
          return {
            ext: "mp3",
            mime: "audio/mpeg"
          };
        }
        if (this.check([4], { offset: 1, mask: [6] })) {
          return {
            ext: "mp2",
            mime: "audio/mpeg"
          };
        }
        if (this.check([6], { offset: 1, mask: [6] })) {
          return {
            ext: "mp1",
            mime: "audio/mpeg"
          };
        }
      }
    });
  }
  readTiffTag(bigEndian) {
    return __async(this, null, function* () {
      const tagId = yield this.tokenizer.readToken(bigEndian ? UINT16_BE : UINT16_LE);
      this.tokenizer.ignore(10);
      switch (tagId) {
        case 50341:
          return {
            ext: "arw",
            mime: "image/x-sony-arw"
          };
        case 50706:
          return {
            ext: "dng",
            mime: "image/x-adobe-dng"
          };
        default:
      }
    });
  }
  readTiffIFD(bigEndian) {
    return __async(this, null, function* () {
      const numberOfTags = yield this.tokenizer.readToken(bigEndian ? UINT16_BE : UINT16_LE);
      for (let n = 0; n < numberOfTags; ++n) {
        const fileType = yield this.readTiffTag(bigEndian);
        if (fileType) {
          return fileType;
        }
      }
    });
  }
  readTiffHeader(bigEndian) {
    return __async(this, null, function* () {
      const version = (bigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 2);
      const ifdOffset = (bigEndian ? UINT32_BE : UINT32_LE).get(this.buffer, 4);
      if (version === 42) {
        if (ifdOffset >= 6) {
          if (this.checkString("CR", { offset: 8 })) {
            return {
              ext: "cr2",
              mime: "image/x-canon-cr2"
            };
          }
          if (ifdOffset >= 8 && (this.check([28, 0, 254, 0], { offset: 8 }) || this.check([31, 0, 11, 0], { offset: 8 }))) {
            return {
              ext: "nef",
              mime: "image/x-nikon-nef"
            };
          }
        }
        yield this.tokenizer.ignore(ifdOffset);
        const fileType = yield this.readTiffIFD(bigEndian);
        return fileType ?? {
          ext: "tif",
          mime: "image/tiff"
        };
      }
      if (version === 43) {
        return {
          ext: "tif",
          mime: "image/tiff"
        };
      }
    });
  }
};
var supportedExtensions = new Set(extensions);
var supportedMimeTypes = new Set(mimeTypes);

// node_modules/music-metadata/lib/ParserFactory.js
var import_content_type = __toESM(require_content_type(), 1);
var import_media_typer = __toESM(require_media_typer(), 1);
var import_debug2 = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/common/MetadataCollector.js
var import_debug = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/common/GenericTagTypes.js
var commonTags = {
  year: { multiple: false },
  track: { multiple: false },
  disk: { multiple: false },
  title: { multiple: false },
  artist: { multiple: false },
  artists: { multiple: true, unique: true },
  albumartist: { multiple: false },
  album: { multiple: false },
  date: { multiple: false },
  originaldate: { multiple: false },
  originalyear: { multiple: false },
  releasedate: { multiple: false },
  comment: { multiple: true, unique: false },
  genre: { multiple: true, unique: true },
  picture: { multiple: true, unique: true },
  composer: { multiple: true, unique: true },
  lyrics: { multiple: true, unique: false },
  albumsort: { multiple: false, unique: true },
  titlesort: { multiple: false, unique: true },
  work: { multiple: false, unique: true },
  artistsort: { multiple: false, unique: true },
  albumartistsort: { multiple: false, unique: true },
  composersort: { multiple: false, unique: true },
  lyricist: { multiple: true, unique: true },
  writer: { multiple: true, unique: true },
  conductor: { multiple: true, unique: true },
  remixer: { multiple: true, unique: true },
  arranger: { multiple: true, unique: true },
  engineer: { multiple: true, unique: true },
  producer: { multiple: true, unique: true },
  technician: { multiple: true, unique: true },
  djmixer: { multiple: true, unique: true },
  mixer: { multiple: true, unique: true },
  label: { multiple: true, unique: true },
  grouping: { multiple: false },
  subtitle: { multiple: true },
  discsubtitle: { multiple: false },
  totaltracks: { multiple: false },
  totaldiscs: { multiple: false },
  compilation: { multiple: false },
  rating: { multiple: true },
  bpm: { multiple: false },
  mood: { multiple: false },
  media: { multiple: false },
  catalognumber: { multiple: true, unique: true },
  tvShow: { multiple: false },
  tvShowSort: { multiple: false },
  tvSeason: { multiple: false },
  tvEpisode: { multiple: false },
  tvEpisodeId: { multiple: false },
  tvNetwork: { multiple: false },
  podcast: { multiple: false },
  podcasturl: { multiple: false },
  releasestatus: { multiple: false },
  releasetype: { multiple: true },
  releasecountry: { multiple: false },
  script: { multiple: false },
  language: { multiple: false },
  copyright: { multiple: false },
  license: { multiple: false },
  encodedby: { multiple: false },
  encodersettings: { multiple: false },
  gapless: { multiple: false },
  barcode: { multiple: false },
  isrc: { multiple: true },
  asin: { multiple: false },
  musicbrainz_recordingid: { multiple: false },
  musicbrainz_trackid: { multiple: false },
  musicbrainz_albumid: { multiple: false },
  musicbrainz_artistid: { multiple: true },
  musicbrainz_albumartistid: { multiple: true },
  musicbrainz_releasegroupid: { multiple: false },
  musicbrainz_workid: { multiple: false },
  musicbrainz_trmid: { multiple: false },
  musicbrainz_discid: { multiple: false },
  acoustid_id: { multiple: false },
  acoustid_fingerprint: { multiple: false },
  musicip_puid: { multiple: false },
  musicip_fingerprint: { multiple: false },
  website: { multiple: false },
  "performer:instrument": { multiple: true, unique: true },
  averageLevel: { multiple: false },
  peakLevel: { multiple: false },
  notes: { multiple: true, unique: false },
  key: { multiple: false },
  originalalbum: { multiple: false },
  originalartist: { multiple: false },
  discogs_artist_id: { multiple: true, unique: true },
  discogs_release_id: { multiple: false },
  discogs_label_id: { multiple: false },
  discogs_master_release_id: { multiple: false },
  discogs_votes: { multiple: false },
  discogs_rating: { multiple: false },
  replaygain_track_peak: { multiple: false },
  replaygain_track_gain: { multiple: false },
  replaygain_album_peak: { multiple: false },
  replaygain_album_gain: { multiple: false },
  replaygain_track_minmax: { multiple: false },
  replaygain_album_minmax: { multiple: false },
  replaygain_undo: { multiple: false },
  description: { multiple: true },
  longDescription: { multiple: false },
  category: { multiple: true },
  hdVideo: { multiple: false },
  keywords: { multiple: true },
  movement: { multiple: false },
  movementIndex: { multiple: false },
  movementTotal: { multiple: false },
  podcastId: { multiple: false },
  showMovement: { multiple: false },
  stik: { multiple: false }
};
function isSingleton(alias) {
  return commonTags[alias] && !commonTags[alias].multiple;
}
function isUnique(alias) {
  return !commonTags[alias].multiple || commonTags[alias].unique || false;
}

// node_modules/music-metadata/lib/common/GenericTagMapper.js
var CommonTagMapper = class {
  static toIntOrNull(str) {
    const cleaned = Number.parseInt(str, 10);
    return Number.isNaN(cleaned) ? null : cleaned;
  }
  // TODO: a string of 1of1 would fail to be converted
  // converts 1/10 to no : 1, of : 10
  // or 1 to no : 1, of : 0
  static normalizeTrack(origVal) {
    const split = origVal.toString().split("/");
    return {
      no: Number.parseInt(split[0], 10) || null,
      of: Number.parseInt(split[1], 10) || null
    };
  }
  constructor(tagTypes, tagMap2) {
    this.tagTypes = tagTypes;
    this.tagMap = tagMap2;
  }
  /**
   * Process and set common tags
   * write common tags to
   * @param tag Native tag
   * @param warnings Register warnings
   * @return common name
   */
  mapGenericTag(tag, warnings) {
    tag = { id: tag.id, value: tag.value };
    this.postMap(tag, warnings);
    const id = this.getCommonName(tag.id);
    return id ? { id, value: tag.value } : null;
  }
  /**
   * Convert native tag key to common tag key
   * @param tag Native header tag
   * @return common tag name (alias)
   */
  getCommonName(tag) {
    return this.tagMap[tag];
  }
  /**
   * Handle post mapping exceptions / correction
   * @param tag Tag e.g. {"©alb", "Buena Vista Social Club")
   * @param warnings Used to register warnings
   */
  postMap(tag, warnings) {
    return;
  }
};
CommonTagMapper.maxRatingScore = 1;

// node_modules/music-metadata/lib/id3v1/ID3v1TagMap.js
var id3v1TagMap = {
  title: "title",
  artist: "artist",
  album: "album",
  year: "year",
  comment: "comment",
  track: "track",
  genre: "genre"
};
var ID3v1TagMapper = class extends CommonTagMapper {
  constructor() {
    super(["ID3v1"], id3v1TagMap);
  }
};

// node_modules/music-metadata/lib/common/CaseInsensitiveTagMap.js
var CaseInsensitiveTagMap = class extends CommonTagMapper {
  constructor(tagTypes, tagMap2) {
    const upperCaseMap = {};
    for (const tag of Object.keys(tagMap2)) {
      upperCaseMap[tag.toUpperCase()] = tagMap2[tag];
    }
    super(tagTypes, upperCaseMap);
  }
  /**
   * @tag  Native header tag
   * @return common tag name (alias)
   */
  getCommonName(tag) {
    return this.tagMap[tag.toUpperCase()];
  }
};

// node_modules/music-metadata/lib/id3v2/ID3v24TagMapper.js
var id3v24TagMap = {
  // id3v2.3
  TIT2: "title",
  TPE1: "artist",
  "TXXX:Artists": "artists",
  TPE2: "albumartist",
  TALB: "album",
  TDRV: "date",
  // [ 'date', 'year' ] ToDo: improve 'year' mapping
  /**
   * Original release year
   */
  TORY: "originalyear",
  TPOS: "disk",
  TCON: "genre",
  APIC: "picture",
  TCOM: "composer",
  USLT: "lyrics",
  TSOA: "albumsort",
  TSOT: "titlesort",
  TOAL: "originalalbum",
  TSOP: "artistsort",
  TSO2: "albumartistsort",
  TSOC: "composersort",
  TEXT: "lyricist",
  "TXXX:Writer": "writer",
  TPE3: "conductor",
  // 'IPLS:instrument': 'performer:instrument', // ToDo
  TPE4: "remixer",
  "IPLS:arranger": "arranger",
  "IPLS:engineer": "engineer",
  "IPLS:producer": "producer",
  "IPLS:DJ-mix": "djmixer",
  "IPLS:mix": "mixer",
  TPUB: "label",
  TIT1: "grouping",
  TIT3: "subtitle",
  TRCK: "track",
  TCMP: "compilation",
  POPM: "rating",
  TBPM: "bpm",
  TMED: "media",
  "TXXX:CATALOGNUMBER": "catalognumber",
  "TXXX:MusicBrainz Album Status": "releasestatus",
  "TXXX:MusicBrainz Album Type": "releasetype",
  /**
   * Release country as documented: https://picard.musicbrainz.org/docs/mappings/#cite_note-0
   */
  "TXXX:MusicBrainz Album Release Country": "releasecountry",
  /**
   * Release country as implemented // ToDo: report
   */
  "TXXX:RELEASECOUNTRY": "releasecountry",
  "TXXX:SCRIPT": "script",
  TLAN: "language",
  TCOP: "copyright",
  WCOP: "license",
  TENC: "encodedby",
  TSSE: "encodersettings",
  "TXXX:BARCODE": "barcode",
  "TXXX:ISRC": "isrc",
  TSRC: "isrc",
  "TXXX:ASIN": "asin",
  "TXXX:originalyear": "originalyear",
  "UFID:http://musicbrainz.org": "musicbrainz_recordingid",
  "TXXX:MusicBrainz Release Track Id": "musicbrainz_trackid",
  "TXXX:MusicBrainz Album Id": "musicbrainz_albumid",
  "TXXX:MusicBrainz Artist Id": "musicbrainz_artistid",
  "TXXX:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
  "TXXX:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
  "TXXX:MusicBrainz Work Id": "musicbrainz_workid",
  "TXXX:MusicBrainz TRM Id": "musicbrainz_trmid",
  "TXXX:MusicBrainz Disc Id": "musicbrainz_discid",
  "TXXX:ACOUSTID_ID": "acoustid_id",
  "TXXX:Acoustid Id": "acoustid_id",
  "TXXX:Acoustid Fingerprint": "acoustid_fingerprint",
  "TXXX:MusicIP PUID": "musicip_puid",
  "TXXX:MusicMagic Fingerprint": "musicip_fingerprint",
  WOAR: "website",
  // id3v2.4
  // ToDo: In same sequence as defined at http://id3.org/id3v2.4.0-frames
  TDRC: "date",
  // date YYYY-MM-DD
  TYER: "year",
  TDOR: "originaldate",
  // 'TMCL:instrument': 'performer:instrument',
  "TIPL:arranger": "arranger",
  "TIPL:engineer": "engineer",
  "TIPL:producer": "producer",
  "TIPL:DJ-mix": "djmixer",
  "TIPL:mix": "mixer",
  TMOO: "mood",
  // additional mappings:
  SYLT: "lyrics",
  TSST: "discsubtitle",
  TKEY: "key",
  COMM: "comment",
  TOPE: "originalartist",
  // Windows Media Player
  "PRIV:AverageLevel": "averageLevel",
  "PRIV:PeakLevel": "peakLevel",
  // Discogs
  "TXXX:DISCOGS_ARTIST_ID": "discogs_artist_id",
  "TXXX:DISCOGS_ARTISTS": "artists",
  "TXXX:DISCOGS_ARTIST_NAME": "artists",
  "TXXX:DISCOGS_ALBUM_ARTISTS": "albumartist",
  "TXXX:DISCOGS_CATALOG": "catalognumber",
  "TXXX:DISCOGS_COUNTRY": "releasecountry",
  "TXXX:DISCOGS_DATE": "originaldate",
  "TXXX:DISCOGS_LABEL": "label",
  "TXXX:DISCOGS_LABEL_ID": "discogs_label_id",
  "TXXX:DISCOGS_MASTER_RELEASE_ID": "discogs_master_release_id",
  "TXXX:DISCOGS_RATING": "discogs_rating",
  "TXXX:DISCOGS_RELEASED": "date",
  "TXXX:DISCOGS_RELEASE_ID": "discogs_release_id",
  "TXXX:DISCOGS_VOTES": "discogs_votes",
  "TXXX:CATALOGID": "catalognumber",
  "TXXX:STYLE": "genre",
  "TXXX:REPLAYGAIN_TRACK_PEAK": "replaygain_track_peak",
  "TXXX:REPLAYGAIN_TRACK_GAIN": "replaygain_track_gain",
  "TXXX:REPLAYGAIN_ALBUM_PEAK": "replaygain_album_peak",
  "TXXX:REPLAYGAIN_ALBUM_GAIN": "replaygain_album_gain",
  "TXXX:MP3GAIN_MINMAX": "replaygain_track_minmax",
  "TXXX:MP3GAIN_ALBUM_MINMAX": "replaygain_album_minmax",
  "TXXX:MP3GAIN_UNDO": "replaygain_undo",
  MVNM: "movement",
  MVIN: "movementIndex",
  PCST: "podcast",
  TCAT: "category",
  TDES: "description",
  TDRL: "releasedate",
  TGID: "podcastId",
  TKWD: "keywords",
  WFED: "podcasturl",
  GRP1: "grouping"
};
var ID3v24TagMapper = class _ID3v24TagMapper extends CaseInsensitiveTagMap {
  static toRating(popm) {
    return {
      source: popm.email,
      rating: popm.rating > 0 ? (popm.rating - 1) / 254 * CommonTagMapper.maxRatingScore : void 0
    };
  }
  constructor() {
    super(["ID3v2.3", "ID3v2.4"], id3v24TagMap);
  }
  /**
   * Handle post mapping exceptions / correction
   * @param tag to post map
   * @param warnings Wil be used to register (collect) warnings
   */
  postMap(tag, warnings) {
    switch (tag.id) {
      case "UFID":
        {
          const idTag = tag.value;
          if (idTag.owner_identifier === "http://musicbrainz.org") {
            tag.id += `:${idTag.owner_identifier}`;
            tag.value = decodeString(idTag.identifier, "latin1");
          }
        }
        break;
      case "PRIV":
        {
          const customTag = tag.value;
          switch (customTag.owner_identifier) {
            case "AverageLevel":
            case "PeakValue":
              tag.id += `:${customTag.owner_identifier}`;
              tag.value = customTag.data.length === 4 ? UINT32_LE.get(customTag.data, 0) : null;
              if (tag.value === null) {
                warnings.addWarning("Failed to parse PRIV:PeakValue");
              }
              break;
            default:
              warnings.addWarning(`Unknown PRIV owner-identifier: ${customTag.data}`);
          }
        }
        break;
      case "POPM":
        tag.value = _ID3v24TagMapper.toRating(tag.value);
        break;
      default:
        break;
    }
  }
};

// node_modules/music-metadata/lib/asf/AsfTagMapper.js
var asfTagMap = {
  Title: "title",
  Author: "artist",
  "WM/AlbumArtist": "albumartist",
  "WM/AlbumTitle": "album",
  "WM/Year": "date",
  // changed to 'year' to 'date' based on Picard mappings; ToDo: check me
  "WM/OriginalReleaseTime": "originaldate",
  "WM/OriginalReleaseYear": "originalyear",
  Description: "comment",
  "WM/TrackNumber": "track",
  "WM/PartOfSet": "disk",
  "WM/Genre": "genre",
  "WM/Composer": "composer",
  "WM/Lyrics": "lyrics",
  "WM/AlbumSortOrder": "albumsort",
  "WM/TitleSortOrder": "titlesort",
  "WM/ArtistSortOrder": "artistsort",
  "WM/AlbumArtistSortOrder": "albumartistsort",
  "WM/ComposerSortOrder": "composersort",
  "WM/Writer": "lyricist",
  "WM/Conductor": "conductor",
  "WM/ModifiedBy": "remixer",
  "WM/Engineer": "engineer",
  "WM/Producer": "producer",
  "WM/DJMixer": "djmixer",
  "WM/Mixer": "mixer",
  "WM/Publisher": "label",
  "WM/ContentGroupDescription": "grouping",
  "WM/SubTitle": "subtitle",
  "WM/SetSubTitle": "discsubtitle",
  // 'WM/PartOfSet': 'totaldiscs',
  "WM/IsCompilation": "compilation",
  "WM/SharedUserRating": "rating",
  "WM/BeatsPerMinute": "bpm",
  "WM/Mood": "mood",
  "WM/Media": "media",
  "WM/CatalogNo": "catalognumber",
  "MusicBrainz/Album Status": "releasestatus",
  "MusicBrainz/Album Type": "releasetype",
  "MusicBrainz/Album Release Country": "releasecountry",
  "WM/Script": "script",
  "WM/Language": "language",
  Copyright: "copyright",
  LICENSE: "license",
  "WM/EncodedBy": "encodedby",
  "WM/EncodingSettings": "encodersettings",
  "WM/Barcode": "barcode",
  "WM/ISRC": "isrc",
  "MusicBrainz/Track Id": "musicbrainz_recordingid",
  "MusicBrainz/Release Track Id": "musicbrainz_trackid",
  "MusicBrainz/Album Id": "musicbrainz_albumid",
  "MusicBrainz/Artist Id": "musicbrainz_artistid",
  "MusicBrainz/Album Artist Id": "musicbrainz_albumartistid",
  "MusicBrainz/Release Group Id": "musicbrainz_releasegroupid",
  "MusicBrainz/Work Id": "musicbrainz_workid",
  "MusicBrainz/TRM Id": "musicbrainz_trmid",
  "MusicBrainz/Disc Id": "musicbrainz_discid",
  "Acoustid/Id": "acoustid_id",
  "Acoustid/Fingerprint": "acoustid_fingerprint",
  "MusicIP/PUID": "musicip_puid",
  "WM/ARTISTS": "artists",
  "WM/InitialKey": "key",
  ASIN: "asin",
  "WM/Work": "work",
  "WM/AuthorURL": "website",
  "WM/Picture": "picture"
};
var AsfTagMapper = class _AsfTagMapper extends CommonTagMapper {
  static toRating(rating) {
    return {
      rating: Number.parseFloat(rating + 1) / 5
    };
  }
  constructor() {
    super(["asf"], asfTagMap);
  }
  postMap(tag) {
    switch (tag.id) {
      case "WM/SharedUserRating": {
        const keys = tag.id.split(":");
        tag.value = _AsfTagMapper.toRating(tag.value);
        tag.id = keys[0];
        break;
      }
    }
  }
};

// node_modules/music-metadata/lib/id3v2/ID3v22TagMapper.js
var id3v22TagMap = {
  TT2: "title",
  TP1: "artist",
  TP2: "albumartist",
  TAL: "album",
  TYE: "year",
  COM: "comment",
  TRK: "track",
  TPA: "disk",
  TCO: "genre",
  PIC: "picture",
  TCM: "composer",
  TOR: "originaldate",
  TOT: "originalalbum",
  TXT: "lyricist",
  TP3: "conductor",
  TPB: "label",
  TT1: "grouping",
  TT3: "subtitle",
  TLA: "language",
  TCR: "copyright",
  WCP: "license",
  TEN: "encodedby",
  TSS: "encodersettings",
  WAR: "website",
  PCS: "podcast",
  TCP: "compilation",
  TDR: "date",
  TS2: "albumartistsort",
  TSA: "albumsort",
  TSC: "composersort",
  TSP: "artistsort",
  TST: "titlesort",
  WFD: "podcasturl",
  TBP: "bpm"
};
var ID3v22TagMapper = class extends CaseInsensitiveTagMap {
  constructor() {
    super(["ID3v2.2"], id3v22TagMap);
  }
};

// node_modules/music-metadata/lib/apev2/APEv2TagMapper.js
var apev2TagMap = {
  Title: "title",
  Artist: "artist",
  Artists: "artists",
  "Album Artist": "albumartist",
  Album: "album",
  Year: "date",
  Originalyear: "originalyear",
  Originaldate: "originaldate",
  Releasedate: "releasedate",
  Comment: "comment",
  Track: "track",
  Disc: "disk",
  DISCNUMBER: "disk",
  // ToDo: backwards compatibility', valid tag?
  Genre: "genre",
  "Cover Art (Front)": "picture",
  "Cover Art (Back)": "picture",
  Composer: "composer",
  Lyrics: "lyrics",
  ALBUMSORT: "albumsort",
  TITLESORT: "titlesort",
  WORK: "work",
  ARTISTSORT: "artistsort",
  ALBUMARTISTSORT: "albumartistsort",
  COMPOSERSORT: "composersort",
  Lyricist: "lyricist",
  Writer: "writer",
  Conductor: "conductor",
  // 'Performer=artist (instrument)': 'performer:instrument',
  MixArtist: "remixer",
  Arranger: "arranger",
  Engineer: "engineer",
  Producer: "producer",
  DJMixer: "djmixer",
  Mixer: "mixer",
  Label: "label",
  Grouping: "grouping",
  Subtitle: "subtitle",
  DiscSubtitle: "discsubtitle",
  Compilation: "compilation",
  BPM: "bpm",
  Mood: "mood",
  Media: "media",
  CatalogNumber: "catalognumber",
  MUSICBRAINZ_ALBUMSTATUS: "releasestatus",
  MUSICBRAINZ_ALBUMTYPE: "releasetype",
  RELEASECOUNTRY: "releasecountry",
  Script: "script",
  Language: "language",
  Copyright: "copyright",
  LICENSE: "license",
  EncodedBy: "encodedby",
  EncoderSettings: "encodersettings",
  Barcode: "barcode",
  ISRC: "isrc",
  ASIN: "asin",
  musicbrainz_trackid: "musicbrainz_recordingid",
  musicbrainz_releasetrackid: "musicbrainz_trackid",
  MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
  MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
  MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
  MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
  MUSICBRAINZ_WORKID: "musicbrainz_workid",
  MUSICBRAINZ_TRMID: "musicbrainz_trmid",
  MUSICBRAINZ_DISCID: "musicbrainz_discid",
  Acoustid_Id: "acoustid_id",
  ACOUSTID_FINGERPRINT: "acoustid_fingerprint",
  MUSICIP_PUID: "musicip_puid",
  Weblink: "website",
  REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
  REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
  MP3GAIN_MINMAX: "replaygain_track_minmax",
  MP3GAIN_UNDO: "replaygain_undo"
};
var APEv2TagMapper = class extends CaseInsensitiveTagMap {
  constructor() {
    super(["APEv2"], apev2TagMap);
  }
};

// node_modules/music-metadata/lib/mp4/MP4TagMapper.js
var mp4TagMap = {
  "©nam": "title",
  "©ART": "artist",
  aART: "albumartist",
  /**
   * ToDo: Album artist seems to be stored here while Picard documentation says: aART
   */
  "----:com.apple.iTunes:Band": "albumartist",
  "©alb": "album",
  "©day": "date",
  "©cmt": "comment",
  "©com": "comment",
  trkn: "track",
  disk: "disk",
  "©gen": "genre",
  covr: "picture",
  "©wrt": "composer",
  "©lyr": "lyrics",
  soal: "albumsort",
  sonm: "titlesort",
  soar: "artistsort",
  soaa: "albumartistsort",
  soco: "composersort",
  "----:com.apple.iTunes:LYRICIST": "lyricist",
  "----:com.apple.iTunes:CONDUCTOR": "conductor",
  "----:com.apple.iTunes:REMIXER": "remixer",
  "----:com.apple.iTunes:ENGINEER": "engineer",
  "----:com.apple.iTunes:PRODUCER": "producer",
  "----:com.apple.iTunes:DJMIXER": "djmixer",
  "----:com.apple.iTunes:MIXER": "mixer",
  "----:com.apple.iTunes:LABEL": "label",
  "©grp": "grouping",
  "----:com.apple.iTunes:SUBTITLE": "subtitle",
  "----:com.apple.iTunes:DISCSUBTITLE": "discsubtitle",
  cpil: "compilation",
  tmpo: "bpm",
  "----:com.apple.iTunes:MOOD": "mood",
  "----:com.apple.iTunes:MEDIA": "media",
  "----:com.apple.iTunes:CATALOGNUMBER": "catalognumber",
  tvsh: "tvShow",
  tvsn: "tvSeason",
  tves: "tvEpisode",
  sosn: "tvShowSort",
  tven: "tvEpisodeId",
  tvnn: "tvNetwork",
  pcst: "podcast",
  purl: "podcasturl",
  "----:com.apple.iTunes:MusicBrainz Album Status": "releasestatus",
  "----:com.apple.iTunes:MusicBrainz Album Type": "releasetype",
  "----:com.apple.iTunes:MusicBrainz Album Release Country": "releasecountry",
  "----:com.apple.iTunes:SCRIPT": "script",
  "----:com.apple.iTunes:LANGUAGE": "language",
  cprt: "copyright",
  "©cpy": "copyright",
  "----:com.apple.iTunes:LICENSE": "license",
  "©too": "encodedby",
  pgap: "gapless",
  "----:com.apple.iTunes:BARCODE": "barcode",
  "----:com.apple.iTunes:ISRC": "isrc",
  "----:com.apple.iTunes:ASIN": "asin",
  "----:com.apple.iTunes:NOTES": "comment",
  "----:com.apple.iTunes:MusicBrainz Track Id": "musicbrainz_recordingid",
  "----:com.apple.iTunes:MusicBrainz Release Track Id": "musicbrainz_trackid",
  "----:com.apple.iTunes:MusicBrainz Album Id": "musicbrainz_albumid",
  "----:com.apple.iTunes:MusicBrainz Artist Id": "musicbrainz_artistid",
  "----:com.apple.iTunes:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
  "----:com.apple.iTunes:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
  "----:com.apple.iTunes:MusicBrainz Work Id": "musicbrainz_workid",
  "----:com.apple.iTunes:MusicBrainz TRM Id": "musicbrainz_trmid",
  "----:com.apple.iTunes:MusicBrainz Disc Id": "musicbrainz_discid",
  "----:com.apple.iTunes:Acoustid Id": "acoustid_id",
  "----:com.apple.iTunes:Acoustid Fingerprint": "acoustid_fingerprint",
  "----:com.apple.iTunes:MusicIP PUID": "musicip_puid",
  "----:com.apple.iTunes:fingerprint": "musicip_fingerprint",
  "----:com.apple.iTunes:replaygain_track_gain": "replaygain_track_gain",
  "----:com.apple.iTunes:replaygain_track_peak": "replaygain_track_peak",
  "----:com.apple.iTunes:replaygain_album_gain": "replaygain_album_gain",
  "----:com.apple.iTunes:replaygain_album_peak": "replaygain_album_peak",
  "----:com.apple.iTunes:replaygain_track_minmax": "replaygain_track_minmax",
  "----:com.apple.iTunes:replaygain_album_minmax": "replaygain_album_minmax",
  "----:com.apple.iTunes:replaygain_undo": "replaygain_undo",
  // Additional mappings:
  gnre: "genre",
  // ToDo: check mapping
  "----:com.apple.iTunes:ALBUMARTISTSORT": "albumartistsort",
  "----:com.apple.iTunes:ARTISTS": "artists",
  "----:com.apple.iTunes:ORIGINALDATE": "originaldate",
  "----:com.apple.iTunes:ORIGINALYEAR": "originalyear",
  "----:com.apple.iTunes:RELEASEDATE": "releasedate",
  // '----:com.apple.iTunes:PERFORMER': 'performer'
  desc: "description",
  ldes: "longDescription",
  "©mvn": "movement",
  "©mvi": "movementIndex",
  "©mvc": "movementTotal",
  "©wrk": "work",
  catg: "category",
  egid: "podcastId",
  hdvd: "hdVideo",
  keyw: "keywords",
  shwm: "showMovement",
  stik: "stik",
  rate: "rating"
};
var tagType = "iTunes";
var MP4TagMapper = class extends CaseInsensitiveTagMap {
  constructor() {
    super([tagType], mp4TagMap);
  }
  postMap(tag, warnings) {
    switch (tag.id) {
      case "rate":
        tag.value = {
          source: void 0,
          rating: Number.parseFloat(tag.value) / 100
        };
        break;
    }
  }
};

// node_modules/music-metadata/lib/ogg/vorbis/VorbisTagMapper.js
var vorbisTagMap = {
  TITLE: "title",
  ARTIST: "artist",
  ARTISTS: "artists",
  ALBUMARTIST: "albumartist",
  "ALBUM ARTIST": "albumartist",
  ALBUM: "album",
  DATE: "date",
  ORIGINALDATE: "originaldate",
  ORIGINALYEAR: "originalyear",
  RELEASEDATE: "releasedate",
  COMMENT: "comment",
  TRACKNUMBER: "track",
  DISCNUMBER: "disk",
  GENRE: "genre",
  METADATA_BLOCK_PICTURE: "picture",
  COMPOSER: "composer",
  LYRICS: "lyrics",
  ALBUMSORT: "albumsort",
  TITLESORT: "titlesort",
  WORK: "work",
  ARTISTSORT: "artistsort",
  ALBUMARTISTSORT: "albumartistsort",
  COMPOSERSORT: "composersort",
  LYRICIST: "lyricist",
  WRITER: "writer",
  CONDUCTOR: "conductor",
  // 'PERFORMER=artist (instrument)': 'performer:instrument', // ToDo
  REMIXER: "remixer",
  ARRANGER: "arranger",
  ENGINEER: "engineer",
  PRODUCER: "producer",
  DJMIXER: "djmixer",
  MIXER: "mixer",
  LABEL: "label",
  GROUPING: "grouping",
  SUBTITLE: "subtitle",
  DISCSUBTITLE: "discsubtitle",
  TRACKTOTAL: "totaltracks",
  DISCTOTAL: "totaldiscs",
  COMPILATION: "compilation",
  RATING: "rating",
  BPM: "bpm",
  KEY: "key",
  MOOD: "mood",
  MEDIA: "media",
  CATALOGNUMBER: "catalognumber",
  RELEASESTATUS: "releasestatus",
  RELEASETYPE: "releasetype",
  RELEASECOUNTRY: "releasecountry",
  SCRIPT: "script",
  LANGUAGE: "language",
  COPYRIGHT: "copyright",
  LICENSE: "license",
  ENCODEDBY: "encodedby",
  ENCODERSETTINGS: "encodersettings",
  BARCODE: "barcode",
  ISRC: "isrc",
  ASIN: "asin",
  MUSICBRAINZ_TRACKID: "musicbrainz_recordingid",
  MUSICBRAINZ_RELEASETRACKID: "musicbrainz_trackid",
  MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
  MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
  MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
  MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
  MUSICBRAINZ_WORKID: "musicbrainz_workid",
  MUSICBRAINZ_TRMID: "musicbrainz_trmid",
  MUSICBRAINZ_DISCID: "musicbrainz_discid",
  ACOUSTID_ID: "acoustid_id",
  ACOUSTID_ID_FINGERPRINT: "acoustid_fingerprint",
  MUSICIP_PUID: "musicip_puid",
  // 'FINGERPRINT=MusicMagic Fingerprint {fingerprint}': 'musicip_fingerprint', // ToDo
  WEBSITE: "website",
  NOTES: "notes",
  TOTALTRACKS: "totaltracks",
  TOTALDISCS: "totaldiscs",
  // Discogs
  DISCOGS_ARTIST_ID: "discogs_artist_id",
  DISCOGS_ARTISTS: "artists",
  DISCOGS_ARTIST_NAME: "artists",
  DISCOGS_ALBUM_ARTISTS: "albumartist",
  DISCOGS_CATALOG: "catalognumber",
  DISCOGS_COUNTRY: "releasecountry",
  DISCOGS_DATE: "originaldate",
  DISCOGS_LABEL: "label",
  DISCOGS_LABEL_ID: "discogs_label_id",
  DISCOGS_MASTER_RELEASE_ID: "discogs_master_release_id",
  DISCOGS_RATING: "discogs_rating",
  DISCOGS_RELEASED: "date",
  DISCOGS_RELEASE_ID: "discogs_release_id",
  DISCOGS_VOTES: "discogs_votes",
  CATALOGID: "catalognumber",
  STYLE: "genre",
  //
  REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
  REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
  REPLAYGAIN_ALBUM_GAIN: "replaygain_album_gain",
  REPLAYGAIN_ALBUM_PEAK: "replaygain_album_peak",
  // To Sure if these (REPLAYGAIN_MINMAX, REPLAYGAIN_ALBUM_MINMAX & REPLAYGAIN_UNDO) are used for Vorbis:
  REPLAYGAIN_MINMAX: "replaygain_track_minmax",
  REPLAYGAIN_ALBUM_MINMAX: "replaygain_album_minmax",
  REPLAYGAIN_UNDO: "replaygain_undo"
};
var VorbisTagMapper = class _VorbisTagMapper extends CommonTagMapper {
  static toRating(email, rating, maxScore) {
    return {
      source: email ? email.toLowerCase() : void 0,
      rating: Number.parseFloat(rating) / maxScore * CommonTagMapper.maxRatingScore
    };
  }
  constructor() {
    super(["vorbis"], vorbisTagMap);
  }
  postMap(tag) {
    if (tag.id === "RATING") {
      tag.value = _VorbisTagMapper.toRating(void 0, tag.value, 100);
    } else if (tag.id.indexOf("RATING:") === 0) {
      const keys = tag.id.split(":");
      tag.value = _VorbisTagMapper.toRating(keys[1], tag.value, 1);
      tag.id = keys[0];
    }
  }
};

// node_modules/music-metadata/lib/riff/RiffInfoTagMap.js
var riffInfoTagMap = {
  IART: "artist",
  // Artist
  ICRD: "date",
  // DateCreated
  INAM: "title",
  // Title
  TITL: "title",
  IPRD: "album",
  // Product
  ITRK: "track",
  IPRT: "track",
  // Additional tag for track index
  COMM: "comment",
  // Comments
  ICMT: "comment",
  // Country
  ICNT: "releasecountry",
  GNRE: "genre",
  // Genre
  IWRI: "writer",
  // WrittenBy
  RATE: "rating",
  YEAR: "year",
  ISFT: "encodedby",
  // Software
  CODE: "encodedby",
  // EncodedBy
  TURL: "website",
  // URL,
  IGNR: "genre",
  // Genre
  IENG: "engineer",
  // Engineer
  ITCH: "technician",
  // Technician
  IMED: "media",
  // Original Media
  IRPD: "album"
  // Product, where the file was intended for
};
var RiffInfoTagMapper = class extends CommonTagMapper {
  constructor() {
    super(["exif"], riffInfoTagMap);
  }
};

// node_modules/music-metadata/lib/matroska/MatroskaTagMapper.js
var ebmlTagMap = {
  "segment:title": "title",
  "album:ARTIST": "albumartist",
  "album:ARTISTSORT": "albumartistsort",
  "album:TITLE": "album",
  "album:DATE_RECORDED": "originaldate",
  "album:DATE_RELEASED": "releasedate",
  "album:PART_NUMBER": "disk",
  "album:TOTAL_PARTS": "totaltracks",
  "track:ARTIST": "artist",
  "track:ARTISTSORT": "artistsort",
  "track:TITLE": "title",
  "track:PART_NUMBER": "track",
  "track:MUSICBRAINZ_TRACKID": "musicbrainz_recordingid",
  "track:MUSICBRAINZ_ALBUMID": "musicbrainz_albumid",
  "track:MUSICBRAINZ_ARTISTID": "musicbrainz_artistid",
  "track:PUBLISHER": "label",
  "track:GENRE": "genre",
  "track:ENCODER": "encodedby",
  "track:ENCODER_OPTIONS": "encodersettings",
  "edition:TOTAL_PARTS": "totaldiscs",
  picture: "picture"
};
var MatroskaTagMapper = class extends CaseInsensitiveTagMap {
  constructor() {
    super(["matroska"], ebmlTagMap);
  }
};

// node_modules/music-metadata/lib/aiff/AiffTagMap.js
var tagMap = {
  NAME: "title",
  AUTH: "artist",
  "(c) ": "copyright",
  ANNO: "comment"
};
var AiffTagMapper = class extends CommonTagMapper {
  constructor() {
    super(["AIFF"], tagMap);
  }
};

// node_modules/music-metadata/lib/common/CombinedTagMapper.js
var CombinedTagMapper = class {
  constructor() {
    this.tagMappers = {};
    [
      new ID3v1TagMapper(),
      new ID3v22TagMapper(),
      new ID3v24TagMapper(),
      new MP4TagMapper(),
      new MP4TagMapper(),
      new VorbisTagMapper(),
      new APEv2TagMapper(),
      new AsfTagMapper(),
      new RiffInfoTagMapper(),
      new MatroskaTagMapper(),
      new AiffTagMapper()
    ].forEach((mapper) => {
      this.registerTagMapper(mapper);
    });
  }
  /**
   * Convert native to generic (common) tags
   * @param tagType Originating tag format
   * @param tag     Native tag to map to a generic tag id
   * @param warnings
   * @return Generic tag result (output of this function)
   */
  mapTag(tagType2, tag, warnings) {
    const tagMapper = this.tagMappers[tagType2];
    if (tagMapper) {
      return this.tagMappers[tagType2].mapGenericTag(tag, warnings);
    }
    throw new InternalParserError(`No generic tag mapper defined for tag-format: ${tagType2}`);
  }
  registerTagMapper(genericTagMapper) {
    for (const tagType2 of genericTagMapper.tagTypes) {
      this.tagMappers[tagType2] = genericTagMapper;
    }
  }
};

// node_modules/music-metadata/lib/lrc/LyricsParser.js
function parseLrc(lrcString) {
  const lines = lrcString.split("\n");
  const syncText = [];
  const timestampRegex = /\[(\d{2}):(\d{2})\.(\d{2})\]/;
  for (const line of lines) {
    const match = line.match(timestampRegex);
    if (match) {
      const minutes = Number.parseInt(match[1], 10);
      const seconds = Number.parseInt(match[2], 10);
      const hundredths = Number.parseInt(match[3], 10);
      const timestamp = (minutes * 60 + seconds) * 1e3 + hundredths * 10;
      const text = line.replace(timestampRegex, "").trim();
      syncText.push({ timestamp, text });
    }
  }
  return {
    contentType: LyricsContentType.lyrics,
    timeStampFormat: TimestampFormat.milliseconds,
    syncText
  };
}

// node_modules/music-metadata/lib/common/MetadataCollector.js
var debug = (0, import_debug.default)("music-metadata:collector");
var TagPriority = ["matroska", "APEv2", "vorbis", "ID3v2.4", "ID3v2.3", "ID3v2.2", "exif", "asf", "iTunes", "AIFF", "ID3v1"];
var MetadataCollector = class {
  constructor(opts) {
    this.opts = opts;
    this.format = {
      tagTypes: [],
      trackInfo: []
    };
    this.native = {};
    this.common = {
      track: { no: null, of: null },
      disk: { no: null, of: null },
      movementIndex: { no: null, of: null }
    };
    this.quality = {
      warnings: []
    };
    this.commonOrigin = {};
    this.originPriority = {};
    this.tagMapper = new CombinedTagMapper();
    let priority = 1;
    for (const tagType2 of TagPriority) {
      this.originPriority[tagType2] = priority++;
    }
    this.originPriority.artificial = 500;
    this.originPriority.id3v1 = 600;
  }
  /**
   * @returns {boolean} true if one or more tags have been found
   */
  hasAny() {
    return Object.keys(this.native).length > 0;
  }
  addStreamInfo(streamInfo) {
    debug(`streamInfo: type=${streamInfo.type ? TrackType[streamInfo.type] : "?"}, codec=${streamInfo.codecName}`);
    this.format.trackInfo.push(streamInfo);
  }
  setFormat(key, value) {
    debug(`format: ${key} = ${value}`);
    this.format[key] = value;
    if (this.opts?.observer) {
      this.opts.observer({ metadata: this, tag: { type: "format", id: key, value } });
    }
  }
  addTag(tagType2, tagId, value) {
    return __async(this, null, function* () {
      debug(`tag ${tagType2}.${tagId} = ${value}`);
      if (!this.native[tagType2]) {
        this.format.tagTypes.push(tagType2);
        this.native[tagType2] = [];
      }
      this.native[tagType2].push({ id: tagId, value });
      yield this.toCommon(tagType2, tagId, value);
    });
  }
  addWarning(warning) {
    this.quality.warnings.push({ message: warning });
  }
  postMap(tagType2, tag) {
    return __async(this, null, function* () {
      switch (tag.id) {
        case "artist":
          if (this.commonOrigin.artist === this.originPriority[tagType2]) {
            return this.postMap("artificial", { id: "artists", value: tag.value });
          }
          if (!this.common.artists) {
            this.setGenericTag("artificial", { id: "artists", value: tag.value });
          }
          break;
        case "artists":
          if (!this.common.artist || this.commonOrigin.artist === this.originPriority.artificial) {
            if (!this.common.artists || this.common.artists.indexOf(tag.value) === -1) {
              const artists = (this.common.artists || []).concat([tag.value]);
              const value = joinArtists(artists);
              const artistTag = { id: "artist", value };
              this.setGenericTag("artificial", artistTag);
            }
          }
          break;
        case "picture":
          return this.postFixPicture(tag.value).then((picture) => {
            if (picture !== null) {
              tag.value = picture;
              this.setGenericTag(tagType2, tag);
            }
          });
        case "totaltracks":
          this.common.track.of = CommonTagMapper.toIntOrNull(tag.value);
          return;
        case "totaldiscs":
          this.common.disk.of = CommonTagMapper.toIntOrNull(tag.value);
          return;
        case "movementTotal":
          this.common.movementIndex.of = CommonTagMapper.toIntOrNull(tag.value);
          return;
        case "track":
        case "disk":
        case "movementIndex": {
          const of = this.common[tag.id].of;
          this.common[tag.id] = CommonTagMapper.normalizeTrack(tag.value);
          this.common[tag.id].of = of != null ? of : this.common[tag.id].of;
          return;
        }
        case "bpm":
        case "year":
        case "originalyear":
          tag.value = Number.parseInt(tag.value, 10);
          break;
        case "date": {
          const year = Number.parseInt(tag.value.substr(0, 4), 10);
          if (!Number.isNaN(year)) {
            this.common.year = year;
          }
          break;
        }
        case "discogs_label_id":
        case "discogs_release_id":
        case "discogs_master_release_id":
        case "discogs_artist_id":
        case "discogs_votes":
          tag.value = typeof tag.value === "string" ? Number.parseInt(tag.value, 10) : tag.value;
          break;
        case "replaygain_track_gain":
        case "replaygain_track_peak":
        case "replaygain_album_gain":
        case "replaygain_album_peak":
          tag.value = toRatio(tag.value);
          break;
        case "replaygain_track_minmax":
          tag.value = tag.value.split(",").map((v) => Number.parseInt(v, 10));
          break;
        case "replaygain_undo": {
          const minMix = tag.value.split(",").map((v) => Number.parseInt(v, 10));
          tag.value = {
            leftChannel: minMix[0],
            rightChannel: minMix[1]
          };
          break;
        }
        case "gapless":
        case "compilation":
        case "podcast":
        case "showMovement":
          tag.value = tag.value === "1" || tag.value === 1;
          break;
        case "isrc": {
          const commonTag = this.common[tag.id];
          if (commonTag && commonTag.indexOf(tag.value) !== -1)
            return;
          break;
        }
        case "comment":
          if (typeof tag.value === "string") {
            tag.value = { text: tag.value };
          }
          if (tag.value.descriptor === "iTunPGAP") {
            this.setGenericTag(tagType2, { id: "gapless", value: tag.value.text === "1" });
          }
          break;
        case "lyrics":
          if (typeof tag.value === "string") {
            tag.value = parseLrc(tag.value);
          }
          break;
        default:
      }
      if (tag.value !== null) {
        this.setGenericTag(tagType2, tag);
      }
    });
  }
  /**
   * Convert native tags to common tags
   * @returns {IAudioMetadata} Native + common tags
   */
  toCommonMetadata() {
    return {
      format: this.format,
      native: this.native,
      quality: this.quality,
      common: this.common
    };
  }
  /**
   * Fix some common issues with picture object
   * @param picture Picture
   */
  postFixPicture(picture) {
    return __async(this, null, function* () {
      if (picture.data && picture.data.length > 0) {
        if (!picture.format) {
          const fileType = yield fileTypeFromBuffer(Uint8Array.from(picture.data));
          if (fileType) {
            picture.format = fileType.mime;
          } else {
            return null;
          }
        }
        picture.format = picture.format.toLocaleLowerCase();
        switch (picture.format) {
          case "image/jpg":
            picture.format = "image/jpeg";
        }
        return picture;
      }
      this.addWarning("Empty picture tag found");
      return null;
    });
  }
  /**
   * Convert native tag to common tags
   */
  toCommon(tagType2, tagId, value) {
    return __async(this, null, function* () {
      const tag = { id: tagId, value };
      const genericTag = this.tagMapper.mapTag(tagType2, tag, this);
      if (genericTag) {
        yield this.postMap(tagType2, genericTag);
      }
    });
  }
  /**
   * Set generic tag
   */
  setGenericTag(tagType2, tag) {
    debug(`common.${tag.id} = ${tag.value}`);
    const prio0 = this.commonOrigin[tag.id] || 1e3;
    const prio1 = this.originPriority[tagType2];
    if (isSingleton(tag.id)) {
      if (prio1 <= prio0) {
        this.common[tag.id] = tag.value;
        this.commonOrigin[tag.id] = prio1;
      } else {
        return debug(`Ignore native tag (singleton): ${tagType2}.${tag.id} = ${tag.value}`);
      }
    } else {
      if (prio1 === prio0) {
        if (!isUnique(tag.id) || this.common[tag.id].indexOf(tag.value) === -1) {
          this.common[tag.id].push(tag.value);
        } else {
          debug(`Ignore duplicate value: ${tagType2}.${tag.id} = ${tag.value}`);
        }
      } else if (prio1 < prio0) {
        this.common[tag.id] = [tag.value];
        this.commonOrigin[tag.id] = prio1;
      } else {
        return debug(`Ignore native tag (list): ${tagType2}.${tag.id} = ${tag.value}`);
      }
    }
    if (this.opts?.observer) {
      this.opts.observer({ metadata: this, tag: { type: "common", id: tag.id, value: tag.value } });
    }
  }
};
function joinArtists(artists) {
  if (artists.length > 2) {
    return `${artists.slice(0, artists.length - 1).join(", ")} & ${artists[artists.length - 1]}`;
  }
  return artists.join(" & ");
}

// node_modules/music-metadata/lib/mpeg/MpegLoader.js
var mpegParserLoader = {
  parserType: "mpeg",
  extensions: [".mp2", ".mp3", ".m2a", ".aac", "aacp"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./MpegParser-DLNCVUJE.js")).MpegParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/apev2/Apev2Loader.js
var apeParserLoader = {
  parserType: "apev2",
  extensions: [".ape"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./APEv2Parser-KDQMADQR.js")).APEv2Parser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/asf/AsfLoader.js
var asfParserLoader = {
  parserType: "asf",
  extensions: [".asf"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./AsfParser-H4ZAVMYN.js")).AsfParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/dsdiff/DsdiffLoader.js
var dsdiffParserLoader = {
  parserType: "dsdiff",
  extensions: [".dff"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./DsdiffParser-QSHGHDXC.js")).DsdiffParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/aiff/AiffLoader.js
var aiffParserLoader = {
  parserType: "aiff",
  extensions: [".aif", "aiff", "aifc"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./AiffParser-JH3TKCUX.js")).AIFFParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/dsf/DsfLoader.js
var dsfParserLoader = {
  parserType: "dsf",
  extensions: [".dsf"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./DsfParser-44U7JPZO.js")).DsfParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/flac/FlacLoader.js
var flacParserLoader = {
  parserType: "flac",
  extensions: [".flac"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./FlacParser-XGJE5UD2.js")).FlacParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/matroska/MatroskaLoader.js
var matroskaParserLoader = {
  parserType: "matroska",
  extensions: [".mka", ".mkv", ".mk3d", ".mks", "webm"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./MatroskaParser-LBIJM37W.js")).MatroskaParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/mp4/Mp4Loader.js
var mp4ParserLoader = {
  parserType: "mp4",
  extensions: [".mp4", ".m4a", ".m4b", ".m4pa", "m4v", "m4r", "3gp"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./MP4Parser-QQIVZOGZ.js")).MP4Parser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/musepack/MusepackLoader.js
var musepackParserLoader = {
  parserType: "musepack",
  extensions: [".mpc"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./MusepackParser-N67MYPHN.js")).MusepackParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/ogg/OggLoader.js
var oggParserLoader = {
  parserType: "ogg",
  extensions: [".ogg", ".ogv", ".oga", ".ogm", ".ogx", ".opus", ".spx"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./OggParser-WL7LLPLA.js")).OggParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/wavpack/WavPackLoader.js
var wavpackParserLoader = {
  parserType: "wavpack",
  extensions: [".wv", ".wvp"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./WavPackParser-F75LNAFE.js")).WavPackParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/wav/WaveLoader.js
var riffParserLoader = {
  parserType: "riff",
  extensions: [".wav", "wave", ".bwf"],
  load(metadata, tokenizer, options) {
    return __async(this, null, function* () {
      return new (yield import("./WaveParser-RL7T3FJY.js")).WaveParser(metadata, tokenizer, options);
    });
  }
};

// node_modules/music-metadata/lib/ParserFactory.js
var debug2 = (0, import_debug2.default)("music-metadata:parser:factory");
function parseHttpContentType(contentType) {
  const type = import_content_type.default.parse(contentType);
  const mime = (0, import_media_typer.parse)(type.type);
  return {
    type: mime.type,
    subtype: mime.subtype,
    suffix: mime.suffix,
    parameters: type.parameters
  };
}
var ParserFactory = class {
  constructor() {
    this.parsers = [];
    [
      flacParserLoader,
      mpegParserLoader,
      apeParserLoader,
      mp4ParserLoader,
      matroskaParserLoader,
      riffParserLoader,
      oggParserLoader,
      asfParserLoader,
      aiffParserLoader,
      wavpackParserLoader,
      musepackParserLoader,
      dsfParserLoader,
      dsdiffParserLoader
    ].forEach((parser) => this.registerParser(parser));
  }
  registerParser(parser) {
    this.parsers.push(parser);
  }
  parse(tokenizer, parserLoader, opts) {
    return __async(this, null, function* () {
      if (tokenizer.supportsRandomAccess()) {
        debug2("tokenizer supports random-access, scanning for appending headers");
        yield scanAppendingHeaders(tokenizer, opts);
      } else {
        debug2("tokenizer does not support random-access, cannot scan for appending headers");
      }
      if (!parserLoader) {
        const buf = new Uint8Array(4100);
        if (tokenizer.fileInfo.mimeType) {
          parserLoader = this.findLoaderForType(getParserIdForMimeType(tokenizer.fileInfo.mimeType));
        }
        if (!parserLoader && tokenizer.fileInfo.path) {
          parserLoader = this.findLoaderForExtension(tokenizer.fileInfo.path);
        }
        if (!parserLoader) {
          debug2("Guess parser on content...");
          yield tokenizer.peekBuffer(buf, { mayBeLess: true });
          const guessedType = yield fileTypeFromBuffer(buf);
          if (!guessedType || !guessedType.mime) {
            throw new CouldNotDetermineFileTypeError("Failed to determine audio format");
          }
          debug2(`Guessed file type is mime=${guessedType.mime}, extension=${guessedType.ext}`);
          parserLoader = this.findLoaderForType(getParserIdForMimeType(guessedType.mime));
          if (!parserLoader) {
            throw new UnsupportedFileTypeError(`Guessed MIME-type not supported: ${guessedType.mime}`);
          }
        }
      }
      debug2(`Loading ${parserLoader.parserType} parser...`);
      const metadata = new MetadataCollector(opts);
      const parser = yield parserLoader.load(metadata, tokenizer, opts ?? {});
      debug2(`Parser ${parserLoader.parserType} loaded`);
      yield parser.parse();
      return metadata.toCommonMetadata();
    });
  }
  /**
   * @param filePath - Path, filename or extension to audio file
   * @return Parser submodule name
   */
  findLoaderForExtension(filePath) {
    if (!filePath)
      return;
    const extension = getExtension(filePath).toLocaleLowerCase() || filePath;
    return this.parsers.find((parser) => parser.extensions.indexOf(extension) !== -1);
  }
  findLoaderForType(moduleName) {
    return moduleName ? this.parsers.find((parser) => parser.parserType === moduleName) : void 0;
  }
};
function getExtension(fname) {
  const i = fname.lastIndexOf(".");
  return i === -1 ? "" : fname.slice(i);
}
function getParserIdForMimeType(httpContentType) {
  let mime;
  if (!httpContentType)
    return;
  try {
    mime = parseHttpContentType(httpContentType);
  } catch (err) {
    debug2(`Invalid HTTP Content-Type header value: ${httpContentType}`);
    return;
  }
  const subType = mime.subtype.indexOf("x-") === 0 ? mime.subtype.substring(2) : mime.subtype;
  switch (mime.type) {
    case "audio":
      switch (subType) {
        case "mp3":
        case "mpeg":
          return "mpeg";
        case "aac":
        case "aacp":
          return "mpeg";
        case "flac":
          return "flac";
        case "ape":
        case "monkeys-audio":
          return "apev2";
        case "mp4":
        case "m4a":
          return "mp4";
        case "ogg":
        case "opus":
        case "speex":
          return "ogg";
        case "ms-wma":
        case "ms-wmv":
        case "ms-asf":
          return "asf";
        case "aiff":
        case "aif":
        case "aifc":
          return "aiff";
        case "vnd.wave":
        case "wav":
        case "wave":
          return "riff";
        case "wavpack":
          return "wavpack";
        case "musepack":
          return "musepack";
        case "matroska":
        case "webm":
          return "matroska";
        case "dsf":
          return "dsf";
        case "amr":
          return "amr";
      }
      break;
    case "video":
      switch (subType) {
        case "ms-asf":
        case "ms-wmv":
          return "asf";
        case "m4v":
        case "mp4":
          return "mp4";
        case "ogg":
          return "ogg";
        case "matroska":
        case "webm":
          return "matroska";
      }
      break;
    case "application":
      switch (subType) {
        case "vnd.ms-asf":
          return "asf";
        case "ogg":
          return "ogg";
      }
      break;
  }
}

// node_modules/music-metadata/lib/lyrics3/Lyrics3.js
var endTag2 = "LYRICS200";
function getLyricsHeaderLength(tokenizer) {
  return __async(this, null, function* () {
    const fileSize = tokenizer.fileInfo.size;
    if (fileSize >= 143) {
      const buf = new Uint8Array(15);
      const position = tokenizer.position;
      yield tokenizer.readBuffer(buf, { position: fileSize - 143 });
      tokenizer.setPosition(position);
      const txt = new TextDecoder("latin1").decode(buf);
      const tag = txt.slice(6);
      if (tag === endTag2) {
        return Number.parseInt(txt.slice(0, 6), 10) + 15;
      }
    }
    return 0;
  });
}

// node_modules/music-metadata/lib/core.js
function parseBlob(_0) {
  return __async(this, arguments, function* (blob, options = {}) {
    const fileInfo = { mimeType: blob.type, size: blob.size };
    if (blob instanceof File) {
      fileInfo.path = blob.name;
    }
    return parseWebStream(blob.stream(), fileInfo, options);
  });
}
function parseWebStream(_0, _1) {
  return __async(this, arguments, function* (webStream, fileInfo, options = {}) {
    const tokenizer = fromWebStream(webStream, { fileInfo: typeof fileInfo === "string" ? { mimeType: fileInfo } : fileInfo });
    try {
      return yield parseFromTokenizer(tokenizer, options);
    } finally {
      yield tokenizer.close();
    }
  });
}
function parseBuffer(_0, _1) {
  return __async(this, arguments, function* (uint8Array, fileInfo, options = {}) {
    const tokenizer = fromBuffer(uint8Array, { fileInfo: typeof fileInfo === "string" ? { mimeType: fileInfo } : fileInfo });
    return parseFromTokenizer(tokenizer, options);
  });
}
function parseFromTokenizer(tokenizer, options) {
  const parserFactory = new ParserFactory();
  return parserFactory.parse(tokenizer, void 0, options);
}
function orderTags(nativeTags) {
  const tags = {};
  for (const { id, value } of nativeTags) {
    if (!tags[id]) {
      tags[id] = [];
    }
    tags[id].push(value);
  }
  return tags;
}
function ratingToStars(rating) {
  return rating === void 0 ? 0 : 1 + Math.round(rating * 4);
}
function selectCover(pictures) {
  return pictures ? pictures.reduce((acc, cur) => {
    if (cur.name && cur.name.toLowerCase() in ["front", "cover", "cover (front)"])
      return cur;
    return acc;
  }) : null;
}
function scanAppendingHeaders(_0) {
  return __async(this, arguments, function* (tokenizer, options = {}) {
    let apeOffset = tokenizer.fileInfo.size;
    if (yield hasID3v1Header(tokenizer)) {
      apeOffset -= 128;
      const lyricsLen = yield getLyricsHeaderLength(tokenizer);
      apeOffset -= lyricsLen;
    }
    options.apeHeader = yield APEv2Parser.findApeFooterOffset(tokenizer, apeOffset);
  });
}
export {
  LyricsContentType,
  TimestampFormat,
  orderTags,
  parseBlob,
  parseBuffer,
  parseFromTokenizer,
  parseWebStream,
  ratingToStars,
  scanAppendingHeaders,
  selectCover
};
/*! Bundled license information:

content-type/index.js:
  (*!
   * content-type
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

media-typer/index.js:
  (*!
   * media-typer
   * Copyright(c) 2014-2017 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=music-metadata.js.map
