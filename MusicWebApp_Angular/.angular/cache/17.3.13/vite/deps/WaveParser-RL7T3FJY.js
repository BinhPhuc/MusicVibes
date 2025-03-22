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
import {
  stripNulls
} from "./chunk-JETKR7SS.js";
import {
  BasicParser,
  StringType,
  UINT16_LE,
  UINT32_LE,
  Uint8ArrayType,
  makeUnexpectedFileContentError,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import "./chunk-MULMZBSY.js";
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/wav/WaveParser.js
var import_debug = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/riff/RiffChunk.js
var Header = {
  len: 8,
  get: (buf, off) => {
    return {
      // Group-ID
      chunkID: new StringType(4, "latin1").get(buf, off),
      // Size
      chunkSize: UINT32_LE.get(buf, off + 4)
    };
  }
};
var ListInfoTagValue = class {
  constructor(tagHeader) {
    this.tagHeader = tagHeader;
    this.len = tagHeader.chunkSize;
    this.len += this.len & 1;
  }
  get(buf, off) {
    return new StringType(this.tagHeader.chunkSize, "ascii").get(buf, off);
  }
};

// node_modules/music-metadata/lib/wav/WaveChunk.js
var WaveContentError = class extends makeUnexpectedFileContentError("Wave") {
};
var WaveFormat;
(function(WaveFormat2) {
  WaveFormat2[WaveFormat2["PCM"] = 1] = "PCM";
  WaveFormat2[WaveFormat2["ADPCM"] = 2] = "ADPCM";
  WaveFormat2[WaveFormat2["IEEE_FLOAT"] = 3] = "IEEE_FLOAT";
  WaveFormat2[WaveFormat2["MPEG_ADTS_AAC"] = 5632] = "MPEG_ADTS_AAC";
  WaveFormat2[WaveFormat2["MPEG_LOAS"] = 5634] = "MPEG_LOAS";
  WaveFormat2[WaveFormat2["RAW_AAC1"] = 255] = "RAW_AAC1";
  WaveFormat2[WaveFormat2["DOLBY_AC3_SPDIF"] = 146] = "DOLBY_AC3_SPDIF";
  WaveFormat2[WaveFormat2["DVM"] = 8192] = "DVM";
  WaveFormat2[WaveFormat2["RAW_SPORT"] = 576] = "RAW_SPORT";
  WaveFormat2[WaveFormat2["ESST_AC3"] = 577] = "ESST_AC3";
  WaveFormat2[WaveFormat2["DRM"] = 9] = "DRM";
  WaveFormat2[WaveFormat2["DTS2"] = 8193] = "DTS2";
  WaveFormat2[WaveFormat2["MPEG"] = 80] = "MPEG";
})(WaveFormat || (WaveFormat = {}));
var Format = class {
  constructor(header) {
    if (header.chunkSize < 16)
      throw new WaveContentError("Invalid chunk size");
    this.len = header.chunkSize;
  }
  get(buf, off) {
    return {
      wFormatTag: UINT16_LE.get(buf, off),
      nChannels: UINT16_LE.get(buf, off + 2),
      nSamplesPerSec: UINT32_LE.get(buf, off + 4),
      nAvgBytesPerSec: UINT32_LE.get(buf, off + 8),
      nBlockAlign: UINT16_LE.get(buf, off + 12),
      wBitsPerSample: UINT16_LE.get(buf, off + 14)
    };
  }
};
var FactChunk = class {
  constructor(header) {
    if (header.chunkSize < 4) {
      throw new WaveContentError("Invalid fact chunk size.");
    }
    this.len = header.chunkSize;
  }
  get(buf, off) {
    return {
      dwSampleLength: UINT32_LE.get(buf, off)
    };
  }
};

// node_modules/music-metadata/lib/wav/BwfChunk.js
var BroadcastAudioExtensionChunk = {
  len: 420,
  get: (uint8array, off) => {
    return {
      description: stripNulls(new StringType(256, "ascii").get(uint8array, off)).trim(),
      originator: stripNulls(new StringType(32, "ascii").get(uint8array, off + 256)).trim(),
      originatorReference: stripNulls(new StringType(32, "ascii").get(uint8array, off + 288)).trim(),
      originationDate: stripNulls(new StringType(10, "ascii").get(uint8array, off + 320)).trim(),
      originationTime: stripNulls(new StringType(8, "ascii").get(uint8array, off + 330)).trim(),
      timeReferenceLow: UINT32_LE.get(uint8array, off + 338),
      timeReferenceHigh: UINT32_LE.get(uint8array, off + 342),
      version: UINT16_LE.get(uint8array, off + 346),
      umid: new Uint8ArrayType(64).get(uint8array, off + 348),
      loudnessValue: UINT16_LE.get(uint8array, off + 412),
      maxTruePeakLevel: UINT16_LE.get(uint8array, off + 414),
      maxMomentaryLoudness: UINT16_LE.get(uint8array, off + 416),
      maxShortTermLoudness: UINT16_LE.get(uint8array, off + 418)
    };
  }
};

// node_modules/music-metadata/lib/wav/WaveParser.js
var debug = (0, import_debug.default)("music-metadata:parser:RIFF");
var WaveParser = class extends BasicParser {
  constructor() {
    super(...arguments);
    this.blockAlign = 0;
  }
  parse() {
    return __async(this, null, function* () {
      const riffHeader = yield this.tokenizer.readToken(Header);
      debug(`pos=${this.tokenizer.position}, parse: chunkID=${riffHeader.chunkID}`);
      if (riffHeader.chunkID !== "RIFF")
        return;
      return this.parseRiffChunk(riffHeader.chunkSize).catch((err) => {
        if (!(err instanceof EndOfStreamError)) {
          throw err;
        }
      });
    });
  }
  parseRiffChunk(chunkSize) {
    return __async(this, null, function* () {
      const type = yield this.tokenizer.readToken(FourCcToken);
      this.metadata.setFormat("container", type);
      switch (type) {
        case "WAVE":
          return this.readWaveChunk(chunkSize - FourCcToken.len);
        default:
          throw new WaveContentError(`Unsupported RIFF format: RIFF/${type}`);
      }
    });
  }
  readWaveChunk(remaining) {
    return __async(this, null, function* () {
      while (remaining >= Header.len) {
        const header = yield this.tokenizer.readToken(Header);
        remaining -= Header.len + header.chunkSize;
        if (header.chunkSize > remaining) {
          this.metadata.addWarning("Data chunk size exceeds file size");
        }
        this.header = header;
        debug(`pos=${this.tokenizer.position}, readChunk: chunkID=RIFF/WAVE/${header.chunkID}`);
        switch (header.chunkID) {
          case "LIST":
            yield this.parseListTag(header);
            break;
          case "fact":
            this.metadata.setFormat("lossless", false);
            this.fact = yield this.tokenizer.readToken(new FactChunk(header));
            break;
          case "fmt ": {
            const fmt = yield this.tokenizer.readToken(new Format(header));
            let subFormat = WaveFormat[fmt.wFormatTag];
            if (!subFormat) {
              debug(`WAVE/non-PCM format=${fmt.wFormatTag}`);
              subFormat = `non-PCM (${fmt.wFormatTag})`;
            }
            this.metadata.setFormat("codec", subFormat);
            this.metadata.setFormat("bitsPerSample", fmt.wBitsPerSample);
            this.metadata.setFormat("sampleRate", fmt.nSamplesPerSec);
            this.metadata.setFormat("numberOfChannels", fmt.nChannels);
            this.metadata.setFormat("bitrate", fmt.nBlockAlign * fmt.nSamplesPerSec * 8);
            this.blockAlign = fmt.nBlockAlign;
            break;
          }
          case "id3 ":
          case "ID3 ": {
            const id3_data = yield this.tokenizer.readToken(new Uint8ArrayType(header.chunkSize));
            const rst = fromBuffer(id3_data);
            yield new ID3v2Parser().parse(this.metadata, rst, this.options);
            break;
          }
          case "data": {
            if (this.metadata.format.lossless !== false) {
              this.metadata.setFormat("lossless", true);
            }
            let chunkSize = header.chunkSize;
            if (this.tokenizer.fileInfo.size) {
              const calcRemaining = this.tokenizer.fileInfo.size - this.tokenizer.position;
              if (calcRemaining < chunkSize) {
                this.metadata.addWarning("data chunk length exceeding file length");
                chunkSize = calcRemaining;
              }
            }
            const numberOfSamples = this.fact ? this.fact.dwSampleLength : chunkSize === 4294967295 ? void 0 : chunkSize / this.blockAlign;
            if (numberOfSamples) {
              this.metadata.setFormat("numberOfSamples", numberOfSamples);
              if (this.metadata.format.sampleRate) {
                this.metadata.setFormat("duration", numberOfSamples / this.metadata.format.sampleRate);
              }
            }
            if (this.metadata.format.codec === "ADPCM") {
              this.metadata.setFormat("bitrate", 352e3);
            } else if (this.metadata.format.sampleRate) {
              this.metadata.setFormat("bitrate", this.blockAlign * this.metadata.format.sampleRate * 8);
            }
            yield this.tokenizer.ignore(header.chunkSize);
            break;
          }
          case "bext": {
            const bext = yield this.tokenizer.readToken(BroadcastAudioExtensionChunk);
            Object.keys(bext).forEach((key) => {
              this.metadata.addTag("exif", `bext.${key}`, bext[key]);
            });
            const bextRemaining = header.chunkSize - BroadcastAudioExtensionChunk.len;
            yield this.tokenizer.ignore(bextRemaining);
            break;
          }
          case "\0\0\0\0":
            debug(`Ignore padding chunk: RIFF/${header.chunkID} of ${header.chunkSize} bytes`);
            this.metadata.addWarning(`Ignore chunk: RIFF/${header.chunkID}`);
            yield this.tokenizer.ignore(header.chunkSize);
            break;
          default:
            debug(`Ignore chunk: RIFF/${header.chunkID} of ${header.chunkSize} bytes`);
            this.metadata.addWarning(`Ignore chunk: RIFF/${header.chunkID}`);
            yield this.tokenizer.ignore(header.chunkSize);
        }
        if (this.header.chunkSize % 2 === 1) {
          debug("Read odd padding byte");
          yield this.tokenizer.ignore(1);
        }
      }
    });
  }
  parseListTag(listHeader) {
    return __async(this, null, function* () {
      const listType = yield this.tokenizer.readToken(new StringType(4, "latin1"));
      debug("pos=%s, parseListTag: chunkID=RIFF/WAVE/LIST/%s", this.tokenizer.position, listType);
      switch (listType) {
        case "INFO":
          return this.parseRiffInfoTags(listHeader.chunkSize - 4);
        default:
          this.metadata.addWarning(`Ignore chunk: RIFF/WAVE/LIST/${listType}`);
          debug(`Ignoring chunkID=RIFF/WAVE/LIST/${listType}`);
          return this.tokenizer.ignore(listHeader.chunkSize - 4).then();
      }
    });
  }
  parseRiffInfoTags(chunkSize) {
    return __async(this, null, function* () {
      while (chunkSize >= 8) {
        const header = yield this.tokenizer.readToken(Header);
        const valueToken = new ListInfoTagValue(header);
        const value = yield this.tokenizer.readToken(valueToken);
        this.addTag(header.chunkID, stripNulls(value));
        chunkSize -= 8 + valueToken.len;
      }
      if (chunkSize !== 0) {
        throw new WaveContentError(`Illegal remaining size: ${chunkSize}`);
      }
    });
  }
  addTag(id, value) {
    this.metadata.addTag("exif", id, value);
  }
};
export {
  WaveParser
};
//# sourceMappingURL=WaveParser-RL7T3FJY.js.map
