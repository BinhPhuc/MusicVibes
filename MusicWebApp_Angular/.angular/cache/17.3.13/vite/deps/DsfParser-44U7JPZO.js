import {
  AbstractID3Parser
} from "./chunk-XV75UFK5.js";
import {
  ID3v2Parser
} from "./chunk-PUCFEEIN.js";
import "./chunk-W34ICT6R.js";
import "./chunk-CDMSPHVA.js";
import {
  FourCcToken
} from "./chunk-WDQJ76UN.js";
import "./chunk-2VWM7PRE.js";
import "./chunk-C2MWTFNT.js";
import "./chunk-JETKR7SS.js";
import {
  INT32_LE,
  INT64_LE,
  UINT64_LE,
  makeUnexpectedFileContentError,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import "./chunk-MULMZBSY.js";
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/dsf/DsfParser.js
var import_debug = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/dsf/DsfChunk.js
var ChunkHeader = {
  len: 12,
  get: (buf, off) => {
    return { id: FourCcToken.get(buf, off), size: UINT64_LE.get(buf, off + 4) };
  }
};
var DsdChunk = {
  len: 16,
  get: (buf, off) => {
    return {
      fileSize: INT64_LE.get(buf, off),
      metadataPointer: INT64_LE.get(buf, off + 8)
    };
  }
};
var ChannelType;
(function(ChannelType2) {
  ChannelType2[ChannelType2["mono"] = 1] = "mono";
  ChannelType2[ChannelType2["stereo"] = 2] = "stereo";
  ChannelType2[ChannelType2["channels"] = 3] = "channels";
  ChannelType2[ChannelType2["quad"] = 4] = "quad";
  ChannelType2[ChannelType2["4 channels"] = 5] = "4 channels";
  ChannelType2[ChannelType2["5 channels"] = 6] = "5 channels";
  ChannelType2[ChannelType2["5.1 channels"] = 7] = "5.1 channels";
})(ChannelType || (ChannelType = {}));
var FormatChunk = {
  len: 40,
  get: (buf, off) => {
    return {
      formatVersion: INT32_LE.get(buf, off),
      formatID: INT32_LE.get(buf, off + 4),
      channelType: INT32_LE.get(buf, off + 8),
      channelNum: INT32_LE.get(buf, off + 12),
      samplingFrequency: INT32_LE.get(buf, off + 16),
      bitsPerSample: INT32_LE.get(buf, off + 20),
      sampleCount: INT64_LE.get(buf, off + 24),
      blockSizePerChannel: INT32_LE.get(buf, off + 32)
    };
  }
};

// node_modules/music-metadata/lib/dsf/DsfParser.js
var debug = (0, import_debug.default)("music-metadata:parser:DSF");
var DsdContentParseError = class extends makeUnexpectedFileContentError("DSD") {
};
var DsfParser = class extends AbstractID3Parser {
  postId3v2Parse() {
    return __async(this, null, function* () {
      const p0 = this.tokenizer.position;
      const chunkHeader = yield this.tokenizer.readToken(ChunkHeader);
      if (chunkHeader.id !== "DSD ")
        throw new DsdContentParseError("Invalid chunk signature");
      this.metadata.setFormat("container", "DSF");
      this.metadata.setFormat("lossless", true);
      const dsdChunk = yield this.tokenizer.readToken(DsdChunk);
      if (dsdChunk.metadataPointer === BigInt(0)) {
        debug("No ID3v2 tag present");
      } else {
        debug(`expect ID3v2 at offset=${dsdChunk.metadataPointer}`);
        yield this.parseChunks(dsdChunk.fileSize - chunkHeader.size);
        yield this.tokenizer.ignore(Number(dsdChunk.metadataPointer) - this.tokenizer.position - p0);
        return new ID3v2Parser().parse(this.metadata, this.tokenizer, this.options);
      }
    });
  }
  parseChunks(bytesRemaining) {
    return __async(this, null, function* () {
      while (bytesRemaining >= ChunkHeader.len) {
        const chunkHeader = yield this.tokenizer.readToken(ChunkHeader);
        debug(`Parsing chunk name=${chunkHeader.id} size=${chunkHeader.size}`);
        switch (chunkHeader.id) {
          case "fmt ": {
            const formatChunk = yield this.tokenizer.readToken(FormatChunk);
            this.metadata.setFormat("numberOfChannels", formatChunk.channelNum);
            this.metadata.setFormat("sampleRate", formatChunk.samplingFrequency);
            this.metadata.setFormat("bitsPerSample", formatChunk.bitsPerSample);
            this.metadata.setFormat("numberOfSamples", formatChunk.sampleCount);
            this.metadata.setFormat("duration", Number(formatChunk.sampleCount) / formatChunk.samplingFrequency);
            const bitrate = formatChunk.bitsPerSample * formatChunk.samplingFrequency * formatChunk.channelNum;
            this.metadata.setFormat("bitrate", bitrate);
            return;
          }
          default:
            this.tokenizer.ignore(Number(chunkHeader.size) - ChunkHeader.len);
            break;
        }
        bytesRemaining -= chunkHeader.size;
      }
    });
  }
};
export {
  DsdContentParseError,
  DsfParser
};
//# sourceMappingURL=DsfParser-44U7JPZO.js.map
