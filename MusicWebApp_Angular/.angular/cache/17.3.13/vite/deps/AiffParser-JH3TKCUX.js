import {
  ID3v2Parser
} from "./chunk-PUCFEEIN.js";
import "./chunk-W34ICT6R.js";
import "./chunk-CDMSPHVA.js";
import {
  FourCcToken
} from "./chunk-WDQJ76UN.js";
import {
  EndOfStreamError,
  fromBuffer
} from "./chunk-2VWM7PRE.js";
import "./chunk-C2MWTFNT.js";
import "./chunk-JETKR7SS.js";
import {
  BasicParser,
  StringType,
  UINT16_BE,
  UINT32_BE,
  UINT8,
  Uint8ArrayType,
  makeUnexpectedFileContentError,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import "./chunk-MULMZBSY.js";
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/aiff/AiffParser.js
var import_debug = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/aiff/AiffToken.js
var compressionTypes = {
  NONE: "not compressed	PCM	Apple Computer",
  sowt: "PCM (byte swapped)",
  fl32: "32-bit floating point IEEE 32-bit float",
  fl64: "64-bit floating point IEEE 64-bit float	Apple Computer",
  alaw: "ALaw 2:1	8-bit ITU-T G.711 A-law",
  ulaw: "µLaw 2:1	8-bit ITU-T G.711 µ-law	Apple Computer",
  ULAW: "CCITT G.711 u-law 8-bit ITU-T G.711 µ-law",
  ALAW: "CCITT G.711 A-law 8-bit ITU-T G.711 A-law",
  FL32: "Float 32	IEEE 32-bit float "
};
var AiffContentError = class extends makeUnexpectedFileContentError("AIFF") {
};
var Common = class {
  constructor(header, isAifc) {
    this.isAifc = isAifc;
    const minimumChunkSize = isAifc ? 22 : 18;
    if (header.chunkSize < minimumChunkSize)
      throw new AiffContentError(`COMMON CHUNK size should always be at least ${minimumChunkSize}`);
    this.len = header.chunkSize;
  }
  get(buf, off) {
    const shift = UINT16_BE.get(buf, off + 8) - 16398;
    const baseSampleRate = UINT16_BE.get(buf, off + 8 + 2);
    const res = {
      numChannels: UINT16_BE.get(buf, off),
      numSampleFrames: UINT32_BE.get(buf, off + 2),
      sampleSize: UINT16_BE.get(buf, off + 6),
      sampleRate: shift < 0 ? baseSampleRate >> Math.abs(shift) : baseSampleRate << shift
    };
    if (this.isAifc) {
      res.compressionType = FourCcToken.get(buf, off + 18);
      if (this.len > 22) {
        const strLen = UINT8.get(buf, off + 22);
        if (strLen > 0) {
          const padding = (strLen + 1) % 2;
          if (23 + strLen + padding === this.len) {
            res.compressionName = new StringType(strLen, "latin1").get(buf, off + 23);
          } else {
            throw new AiffContentError("Illegal pstring length");
          }
        } else {
          res.compressionName = void 0;
        }
      }
    } else {
      res.compressionName = "PCM";
    }
    return res;
  }
};

// node_modules/music-metadata/lib/iff/index.js
var Header = {
  len: 8,
  get: (buf, off) => {
    return {
      // Chunk type ID
      chunkID: FourCcToken.get(buf, off),
      // Chunk size
      chunkSize: Number(BigInt(UINT32_BE.get(buf, off + 4)))
    };
  }
};

// node_modules/music-metadata/lib/aiff/AiffParser.js
var debug = (0, import_debug.default)("music-metadata:parser:aiff");
var AIFFParser = class extends BasicParser {
  constructor() {
    super(...arguments);
    this.isCompressed = null;
  }
  parse() {
    return __async(this, null, function* () {
      const header = yield this.tokenizer.readToken(Header);
      if (header.chunkID !== "FORM")
        throw new AiffContentError("Invalid Chunk-ID, expected 'FORM'");
      const type = yield this.tokenizer.readToken(FourCcToken);
      switch (type) {
        case "AIFF":
          this.metadata.setFormat("container", type);
          this.isCompressed = false;
          break;
        case "AIFC":
          this.metadata.setFormat("container", "AIFF-C");
          this.isCompressed = true;
          break;
        default:
          throw new AiffContentError(`Unsupported AIFF type: ${type}`);
      }
      this.metadata.setFormat("lossless", !this.isCompressed);
      try {
        while (!this.tokenizer.fileInfo.size || this.tokenizer.fileInfo.size - this.tokenizer.position >= Header.len) {
          debug(`Reading AIFF chunk at offset=${this.tokenizer.position}`);
          const chunkHeader = yield this.tokenizer.readToken(Header);
          const nextChunk = 2 * Math.round(chunkHeader.chunkSize / 2);
          const bytesRead = yield this.readData(chunkHeader);
          yield this.tokenizer.ignore(nextChunk - bytesRead);
        }
      } catch (err) {
        if (err instanceof EndOfStreamError) {
          debug("End-of-stream");
        } else {
          throw err;
        }
      }
    });
  }
  readData(header) {
    return __async(this, null, function* () {
      switch (header.chunkID) {
        case "COMM": {
          if (this.isCompressed === null) {
            throw new AiffContentError("Failed to parse AIFF.COMM chunk when compression type is unknown");
          }
          const common = yield this.tokenizer.readToken(new Common(header, this.isCompressed));
          this.metadata.setFormat("bitsPerSample", common.sampleSize);
          this.metadata.setFormat("sampleRate", common.sampleRate);
          this.metadata.setFormat("numberOfChannels", common.numChannels);
          this.metadata.setFormat("numberOfSamples", common.numSampleFrames);
          this.metadata.setFormat("duration", common.numSampleFrames / common.sampleRate);
          if (common.compressionName || common.compressionType) {
            this.metadata.setFormat("codec", common.compressionName ?? compressionTypes[common.compressionType]);
          }
          return header.chunkSize;
        }
        case "ID3 ": {
          const id3_data = yield this.tokenizer.readToken(new Uint8ArrayType(header.chunkSize));
          const rst = fromBuffer(id3_data);
          yield new ID3v2Parser().parse(this.metadata, rst, this.options);
          return header.chunkSize;
        }
        case "SSND":
          if (this.metadata.format.duration) {
            this.metadata.setFormat("bitrate", 8 * header.chunkSize / this.metadata.format.duration);
          }
          return 0;
        case "NAME":
        case "AUTH":
        case "(c) ":
        case "ANNO":
          return this.readTextChunk(header);
        default:
          debug(`Ignore chunk id=${header.chunkID}, size=${header.chunkSize}`);
          return 0;
      }
    });
  }
  readTextChunk(header) {
    return __async(this, null, function* () {
      const value = yield this.tokenizer.readToken(new StringType(header.chunkSize, "ascii"));
      const values = value.split("\0").map((v) => v.trim()).filter((v) => v?.length);
      yield Promise.all(values.map((v) => this.metadata.addTag("AIFF", header.chunkID, v)));
      return header.chunkSize;
    });
  }
};
export {
  AIFFParser
};
//# sourceMappingURL=AiffParser-JH3TKCUX.js.map
