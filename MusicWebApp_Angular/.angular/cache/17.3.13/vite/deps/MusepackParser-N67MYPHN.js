import {
  AbstractID3Parser
} from "./chunk-XV75UFK5.js";
import "./chunk-PUCFEEIN.js";
import "./chunk-W34ICT6R.js";
import {
  APEv2Parser
} from "./chunk-CDMSPHVA.js";
import {
  FourCcToken
} from "./chunk-WDQJ76UN.js";
import "./chunk-2VWM7PRE.js";
import "./chunk-C2MWTFNT.js";
import {
  getBitAllignedNumber,
  isBitSet
} from "./chunk-JETKR7SS.js";
import {
  BasicParser,
  StringType,
  UINT16_LE,
  UINT32_LE,
  UINT8,
  makeUnexpectedFileContentError,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import "./chunk-MULMZBSY.js";
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/musepack/MusepackParser.js
var import_debug4 = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/musepack/sv8/MpcSv8Parser.js
var import_debug2 = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/musepack/sv8/StreamVersion8.js
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("music-metadata:parser:musepack:sv8");
var PacketKey = new StringType(2, "latin1");
var SH_part1 = {
  len: 5,
  get: (buf, off) => {
    return {
      crc: UINT32_LE.get(buf, off),
      streamVersion: UINT8.get(buf, off + 4)
    };
  }
};
var SH_part3 = {
  len: 2,
  get: (buf, off) => {
    return {
      sampleFrequency: [44100, 48e3, 37800, 32e3][getBitAllignedNumber(buf, off, 0, 3)],
      maxUsedBands: getBitAllignedNumber(buf, off, 3, 5),
      channelCount: getBitAllignedNumber(buf, off + 1, 0, 4) + 1,
      msUsed: isBitSet(buf, off + 1, 4),
      audioBlockFrames: getBitAllignedNumber(buf, off + 1, 5, 3)
    };
  }
};
var StreamReader = class {
  constructor(tokenizer) {
    this.tokenizer = tokenizer;
  }
  readPacketHeader() {
    return __async(this, null, function* () {
      const key = yield this.tokenizer.readToken(PacketKey);
      const size = yield this.readVariableSizeField();
      return {
        key,
        payloadLength: size.value - 2 - size.len
      };
    });
  }
  readStreamHeader(size) {
    return __async(this, null, function* () {
      const streamHeader = {};
      debug(`Reading SH at offset=${this.tokenizer.position}`);
      const part1 = yield this.tokenizer.readToken(SH_part1);
      size -= SH_part1.len;
      Object.assign(streamHeader, part1);
      debug(`SH.streamVersion = ${part1.streamVersion}`);
      const sampleCount = yield this.readVariableSizeField();
      size -= sampleCount.len;
      streamHeader.sampleCount = sampleCount.value;
      const bs = yield this.readVariableSizeField();
      size -= bs.len;
      streamHeader.beginningOfSilence = bs.value;
      const part3 = yield this.tokenizer.readToken(SH_part3);
      size -= SH_part3.len;
      Object.assign(streamHeader, part3);
      yield this.tokenizer.ignore(size);
      return streamHeader;
    });
  }
  readVariableSizeField(len = 1, hb = 0) {
    return __async(this, null, function* () {
      let n = yield this.tokenizer.readNumber(UINT8);
      if ((n & 128) === 0) {
        return { len, value: hb + n };
      }
      n &= 127;
      n += hb;
      return this.readVariableSizeField(len + 1, n << 7);
    });
  }
};

// node_modules/music-metadata/lib/musepack/MusepackConentError.js
var MusepackContentError = class extends makeUnexpectedFileContentError("Musepack") {
};

// node_modules/music-metadata/lib/musepack/sv8/MpcSv8Parser.js
var debug2 = (0, import_debug2.default)("music-metadata:parser:musepack");
var MpcSv8Parser = class extends BasicParser {
  constructor() {
    super(...arguments);
    this.audioLength = 0;
  }
  parse() {
    return __async(this, null, function* () {
      const signature = yield this.tokenizer.readToken(FourCcToken);
      if (signature !== "MPCK")
        throw new MusepackContentError("Invalid Magic number");
      this.metadata.setFormat("container", "Musepack, SV8");
      return this.parsePacket();
    });
  }
  parsePacket() {
    return __async(this, null, function* () {
      const sv8reader = new StreamReader(this.tokenizer);
      do {
        const header = yield sv8reader.readPacketHeader();
        debug2(`packet-header key=${header.key}, payloadLength=${header.payloadLength}`);
        switch (header.key) {
          case "SH": {
            const sh = yield sv8reader.readStreamHeader(header.payloadLength);
            this.metadata.setFormat("numberOfSamples", sh.sampleCount);
            this.metadata.setFormat("sampleRate", sh.sampleFrequency);
            this.metadata.setFormat("duration", sh.sampleCount / sh.sampleFrequency);
            this.metadata.setFormat("numberOfChannels", sh.channelCount);
            break;
          }
          case "AP":
            this.audioLength += header.payloadLength;
            yield this.tokenizer.ignore(header.payloadLength);
            break;
          case "RG":
          case "EI":
          case "SO":
          case "ST":
          case "CT":
            yield this.tokenizer.ignore(header.payloadLength);
            break;
          case "SE":
            if (this.metadata.format.duration) {
              this.metadata.setFormat("bitrate", this.audioLength * 8 / this.metadata.format.duration);
            }
            return APEv2Parser.tryParseApeHeader(this.metadata, this.tokenizer, this.options);
          default:
            throw new MusepackContentError(`Unexpected header: ${header.key}`);
        }
      } while (true);
    });
  }
};

// node_modules/music-metadata/lib/musepack/sv7/MpcSv7Parser.js
var import_debug3 = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/musepack/sv7/BitReader.js
var BitReader = class {
  constructor(tokenizer) {
    this.tokenizer = tokenizer;
    this.pos = 0;
    this.dword = null;
  }
  /**
   *
   * @param bits 1..30 bits
   */
  read(bits) {
    return __async(this, null, function* () {
      while (this.dword === null) {
        this.dword = yield this.tokenizer.readToken(UINT32_LE);
      }
      let out = this.dword;
      this.pos += bits;
      if (this.pos < 32) {
        out >>>= 32 - this.pos;
        return out & (1 << bits) - 1;
      }
      this.pos -= 32;
      if (this.pos === 0) {
        this.dword = null;
        return out & (1 << bits) - 1;
      }
      this.dword = yield this.tokenizer.readToken(UINT32_LE);
      if (this.pos) {
        out <<= this.pos;
        out |= this.dword >>> 32 - this.pos;
      }
      return out & (1 << bits) - 1;
    });
  }
  ignore(bits) {
    return __async(this, null, function* () {
      if (this.pos > 0) {
        const remaining = 32 - this.pos;
        this.dword = null;
        bits -= remaining;
        this.pos = 0;
      }
      const remainder = bits % 32;
      const numOfWords = (bits - remainder) / 32;
      yield this.tokenizer.ignore(numOfWords * 4);
      return this.read(remainder);
    });
  }
};

// node_modules/music-metadata/lib/musepack/sv7/StreamVersion7.js
var Header = {
  len: 6 * 4,
  get: (buf, off) => {
    const header = {
      // word 0
      signature: new TextDecoder("latin1").decode(buf.subarray(off, off + 3)),
      // versionIndex number * 1000 (3.81 = 3810) (remember that 4-byte alignment causes this to take 4-bytes)
      streamMinorVersion: getBitAllignedNumber(buf, off + 3, 0, 4),
      streamMajorVersion: getBitAllignedNumber(buf, off + 3, 4, 4),
      // word 1
      frameCount: UINT32_LE.get(buf, off + 4),
      // word 2
      maxLevel: UINT16_LE.get(buf, off + 8),
      sampleFrequency: [44100, 48e3, 37800, 32e3][getBitAllignedNumber(buf, off + 10, 0, 2)],
      link: getBitAllignedNumber(buf, off + 10, 2, 2),
      profile: getBitAllignedNumber(buf, off + 10, 4, 4),
      maxBand: getBitAllignedNumber(buf, off + 11, 0, 6),
      intensityStereo: isBitSet(buf, off + 11, 6),
      midSideStereo: isBitSet(buf, off + 11, 7),
      // word 3
      titlePeak: UINT16_LE.get(buf, off + 12),
      titleGain: UINT16_LE.get(buf, off + 14),
      // word 4
      albumPeak: UINT16_LE.get(buf, off + 16),
      albumGain: UINT16_LE.get(buf, off + 18),
      // word
      lastFrameLength: UINT32_LE.get(buf, off + 20) >>> 20 & 2047,
      trueGapless: isBitSet(buf, off + 23, 0)
    };
    header.lastFrameLength = header.trueGapless ? UINT32_LE.get(buf, 20) >>> 20 & 2047 : 0;
    return header;
  }
};

// node_modules/music-metadata/lib/musepack/sv7/MpcSv7Parser.js
var debug3 = (0, import_debug3.default)("music-metadata:parser:musepack");
var MpcSv7Parser = class extends BasicParser {
  constructor() {
    super(...arguments);
    this.bitreader = null;
    this.audioLength = 0;
    this.duration = null;
  }
  parse() {
    return __async(this, null, function* () {
      const header = yield this.tokenizer.readToken(Header);
      if (header.signature !== "MP+")
        throw new MusepackContentError("Unexpected magic number");
      debug3(`stream-version=${header.streamMajorVersion}.${header.streamMinorVersion}`);
      this.metadata.setFormat("container", "Musepack, SV7");
      this.metadata.setFormat("sampleRate", header.sampleFrequency);
      const numberOfSamples = 1152 * (header.frameCount - 1) + header.lastFrameLength;
      this.metadata.setFormat("numberOfSamples", numberOfSamples);
      this.duration = numberOfSamples / header.sampleFrequency;
      this.metadata.setFormat("duration", this.duration);
      this.bitreader = new BitReader(this.tokenizer);
      this.metadata.setFormat("numberOfChannels", header.midSideStereo || header.intensityStereo ? 2 : 1);
      const version = yield this.bitreader.read(8);
      this.metadata.setFormat("codec", (version / 100).toFixed(2));
      yield this.skipAudioData(header.frameCount);
      debug3(`End of audio stream, switching to APEv2, offset=${this.tokenizer.position}`);
      return APEv2Parser.tryParseApeHeader(this.metadata, this.tokenizer, this.options);
    });
  }
  skipAudioData(frameCount) {
    return __async(this, null, function* () {
      while (frameCount-- > 0) {
        const frameLength = yield this.bitreader.read(20);
        this.audioLength += 20 + frameLength;
        yield this.bitreader.ignore(frameLength);
      }
      const lastFrameLength = yield this.bitreader.read(11);
      this.audioLength += lastFrameLength;
      if (this.duration !== null) {
        this.metadata.setFormat("bitrate", this.audioLength / this.duration);
      }
    });
  }
};

// node_modules/music-metadata/lib/musepack/MusepackParser.js
var debug4 = (0, import_debug4.default)("music-metadata:parser:musepack");
var MusepackParser = class extends AbstractID3Parser {
  postId3v2Parse() {
    return __async(this, null, function* () {
      const signature = yield this.tokenizer.peekToken(new StringType(3, "latin1"));
      let mpcParser;
      switch (signature) {
        case "MP+": {
          debug4("Stream-version 7");
          mpcParser = new MpcSv7Parser(this.metadata, this.tokenizer, this.options);
          break;
        }
        case "MPC": {
          debug4("Stream-version 8");
          mpcParser = new MpcSv8Parser(this.metadata, this.tokenizer, this.options);
          break;
        }
        default: {
          throw new MusepackContentError("Invalid signature prefix");
        }
      }
      return mpcParser.parse();
    });
  }
};
export {
  MusepackParser
};
//# sourceMappingURL=MusepackParser-N67MYPHN.js.map
