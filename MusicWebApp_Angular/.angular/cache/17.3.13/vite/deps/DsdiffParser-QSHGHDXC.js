import {
  ID3v2Parser
} from "./chunk-PUCFEEIN.js";
import "./chunk-W34ICT6R.js";
import "./chunk-CDMSPHVA.js";
import {
  FourCcToken
} from "./chunk-WDQJ76UN.js";
import {
  fromBuffer
} from "./chunk-2VWM7PRE.js";
import "./chunk-C2MWTFNT.js";
import "./chunk-JETKR7SS.js";
import {
  BasicParser,
  INT64_BE,
  StringType,
  UINT16_BE,
  UINT32_BE,
  UINT32_LE,
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

// node_modules/music-metadata/lib/dsdiff/DsdiffParser.js
var import_debug = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/dsdiff/DsdiffToken.js
var ChunkHeader64 = {
  len: 12,
  get: (buf, off) => {
    return {
      // Group-ID
      chunkID: FourCcToken.get(buf, off),
      // Size
      chunkSize: INT64_BE.get(buf, off + 4)
    };
  }
};

// node_modules/music-metadata/lib/dsdiff/DsdiffParser.js
var debug = (0, import_debug.default)("music-metadata:parser:aiff");
var DsdiffContentParseError = class extends makeUnexpectedFileContentError("DSDIFF") {
};
var DsdiffParser = class extends BasicParser {
  parse() {
    return __async(this, null, function* () {
      const header = yield this.tokenizer.readToken(ChunkHeader64);
      if (header.chunkID !== "FRM8")
        throw new DsdiffContentParseError("Unexpected chunk-ID");
      const type = (yield this.tokenizer.readToken(FourCcToken)).trim();
      switch (type) {
        case "DSD":
          this.metadata.setFormat("container", `DSDIFF/${type}`);
          this.metadata.setFormat("lossless", true);
          return this.readFmt8Chunks(header.chunkSize - BigInt(FourCcToken.len));
        default:
          throw new DsdiffContentParseError(`Unsupported DSDIFF type: ${type}`);
      }
    });
  }
  readFmt8Chunks(remainingSize) {
    return __async(this, null, function* () {
      while (remainingSize >= ChunkHeader64.len) {
        const chunkHeader = yield this.tokenizer.readToken(ChunkHeader64);
        debug(`Chunk id=${chunkHeader.chunkID}`);
        yield this.readData(chunkHeader);
        remainingSize -= BigInt(ChunkHeader64.len) + chunkHeader.chunkSize;
      }
    });
  }
  readData(header) {
    return __async(this, null, function* () {
      debug(`Reading data of chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
      const p0 = this.tokenizer.position;
      switch (header.chunkID.trim()) {
        case "FVER": {
          const version = yield this.tokenizer.readToken(UINT32_LE);
          debug(`DSDIFF version=${version}`);
          break;
        }
        case "PROP": {
          const propType = yield this.tokenizer.readToken(FourCcToken);
          if (propType !== "SND ")
            throw new DsdiffContentParseError("Unexpected PROP-chunk ID");
          yield this.handleSoundPropertyChunks(header.chunkSize - BigInt(FourCcToken.len));
          break;
        }
        case "ID3": {
          const id3_data = yield this.tokenizer.readToken(new Uint8ArrayType(Number(header.chunkSize)));
          const rst = fromBuffer(id3_data);
          yield new ID3v2Parser().parse(this.metadata, rst, this.options);
          break;
        }
        case "DSD":
          if (this.metadata.format.numberOfChannels) {
            this.metadata.setFormat("numberOfSamples", Number(header.chunkSize * BigInt(8) / BigInt(this.metadata.format.numberOfChannels)));
          }
          if (this.metadata.format.numberOfSamples && this.metadata.format.sampleRate) {
            this.metadata.setFormat("duration", this.metadata.format.numberOfSamples / this.metadata.format.sampleRate);
          }
          break;
        default:
          debug(`Ignore chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
          break;
      }
      const remaining = header.chunkSize - BigInt(this.tokenizer.position - p0);
      if (remaining > 0) {
        debug(`After Parsing chunk, remaining ${remaining} bytes`);
        yield this.tokenizer.ignore(Number(remaining));
      }
    });
  }
  handleSoundPropertyChunks(remainingSize) {
    return __async(this, null, function* () {
      debug(`Parsing sound-property-chunks, remainingSize=${remainingSize}`);
      while (remainingSize > 0) {
        const sndPropHeader = yield this.tokenizer.readToken(ChunkHeader64);
        debug(`Sound-property-chunk[ID=${sndPropHeader.chunkID}, size=${sndPropHeader.chunkSize}]`);
        const p0 = this.tokenizer.position;
        switch (sndPropHeader.chunkID.trim()) {
          case "FS": {
            const sampleRate = yield this.tokenizer.readToken(UINT32_BE);
            this.metadata.setFormat("sampleRate", sampleRate);
            break;
          }
          case "CHNL": {
            const numChannels = yield this.tokenizer.readToken(UINT16_BE);
            this.metadata.setFormat("numberOfChannels", numChannels);
            yield this.handleChannelChunks(sndPropHeader.chunkSize - BigInt(UINT16_BE.len));
            break;
          }
          case "CMPR": {
            const compressionIdCode = (yield this.tokenizer.readToken(FourCcToken)).trim();
            const count = yield this.tokenizer.readToken(UINT8);
            const compressionName = yield this.tokenizer.readToken(new StringType(count, "ascii"));
            if (compressionIdCode === "DSD") {
              this.metadata.setFormat("lossless", true);
              this.metadata.setFormat("bitsPerSample", 1);
            }
            this.metadata.setFormat("codec", `${compressionIdCode} (${compressionName})`);
            break;
          }
          case "ABSS": {
            const hours = yield this.tokenizer.readToken(UINT16_BE);
            const minutes = yield this.tokenizer.readToken(UINT8);
            const seconds = yield this.tokenizer.readToken(UINT8);
            const samples = yield this.tokenizer.readToken(UINT32_BE);
            debug(`ABSS ${hours}:${minutes}:${seconds}.${samples}`);
            break;
          }
          case "LSCO": {
            const lsConfig = yield this.tokenizer.readToken(UINT16_BE);
            debug(`LSCO lsConfig=${lsConfig}`);
            break;
          }
          default:
            debug(`Unknown sound-property-chunk[ID=${sndPropHeader.chunkID}, size=${sndPropHeader.chunkSize}]`);
            yield this.tokenizer.ignore(Number(sndPropHeader.chunkSize));
        }
        const remaining = sndPropHeader.chunkSize - BigInt(this.tokenizer.position - p0);
        if (remaining > 0) {
          debug(`After Parsing sound-property-chunk ${sndPropHeader.chunkSize}, remaining ${remaining} bytes`);
          yield this.tokenizer.ignore(Number(remaining));
        }
        remainingSize -= BigInt(ChunkHeader64.len) + sndPropHeader.chunkSize;
        debug(`Parsing sound-property-chunks, remainingSize=${remainingSize}`);
      }
      if (this.metadata.format.lossless && this.metadata.format.sampleRate && this.metadata.format.numberOfChannels && this.metadata.format.bitsPerSample) {
        const bitrate = this.metadata.format.sampleRate * this.metadata.format.numberOfChannels * this.metadata.format.bitsPerSample;
        this.metadata.setFormat("bitrate", bitrate);
      }
    });
  }
  handleChannelChunks(remainingSize) {
    return __async(this, null, function* () {
      debug(`Parsing channel-chunks, remainingSize=${remainingSize}`);
      const channels = [];
      while (remainingSize >= FourCcToken.len) {
        const channelId = yield this.tokenizer.readToken(FourCcToken);
        debug(`Channel[ID=${channelId}]`);
        channels.push(channelId);
        remainingSize -= BigInt(FourCcToken.len);
      }
      debug(`Channels: ${channels.join(", ")}`);
      return channels;
    });
  }
};
export {
  DsdiffContentParseError,
  DsdiffParser
};
//# sourceMappingURL=DsdiffParser-QSHGHDXC.js.map
