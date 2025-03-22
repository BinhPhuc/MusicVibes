import {
  VorbisDecoder,
  VorbisParser,
  VorbisPictureToken
} from "./chunk-6E2HXDQG.js";
import {
  AbstractID3Parser
} from "./chunk-XV75UFK5.js";
import "./chunk-PUCFEEIN.js";
import "./chunk-W34ICT6R.js";
import "./chunk-CDMSPHVA.js";
import {
  FourCcToken
} from "./chunk-WDQJ76UN.js";
import "./chunk-2VWM7PRE.js";
import "./chunk-C2MWTFNT.js";
import {
  getBit,
  getBitAllignedNumber
} from "./chunk-JETKR7SS.js";
import {
  UINT16_BE,
  UINT24_BE,
  Uint8ArrayType,
  makeUnexpectedFileContentError,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import "./chunk-MULMZBSY.js";
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/flac/FlacParser.js
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("music-metadata:parser:FLAC");
var FlacContentError = class extends makeUnexpectedFileContentError("FLAC") {
};
var BlockType;
(function(BlockType2) {
  BlockType2[BlockType2["STREAMINFO"] = 0] = "STREAMINFO";
  BlockType2[BlockType2["PADDING"] = 1] = "PADDING";
  BlockType2[BlockType2["APPLICATION"] = 2] = "APPLICATION";
  BlockType2[BlockType2["SEEKTABLE"] = 3] = "SEEKTABLE";
  BlockType2[BlockType2["VORBIS_COMMENT"] = 4] = "VORBIS_COMMENT";
  BlockType2[BlockType2["CUESHEET"] = 5] = "CUESHEET";
  BlockType2[BlockType2["PICTURE"] = 6] = "PICTURE";
})(BlockType || (BlockType = {}));
var FlacParser = class extends AbstractID3Parser {
  constructor() {
    super(...arguments);
    this.vorbisParser = new VorbisParser(this.metadata, this.options);
    this.padding = 0;
  }
  postId3v2Parse() {
    return __async(this, null, function* () {
      const fourCC = yield this.tokenizer.readToken(FourCcToken);
      if (fourCC.toString() !== "fLaC") {
        throw new FlacContentError("Invalid FLAC preamble");
      }
      let blockHeader;
      do {
        blockHeader = yield this.tokenizer.readToken(BlockHeader);
        yield this.parseDataBlock(blockHeader);
      } while (!blockHeader.lastBlock);
      if (this.tokenizer.fileInfo.size && this.metadata.format.duration) {
        const dataSize = this.tokenizer.fileInfo.size - this.tokenizer.position;
        this.metadata.setFormat("bitrate", 8 * dataSize / this.metadata.format.duration);
      }
    });
  }
  parseDataBlock(blockHeader) {
    return __async(this, null, function* () {
      debug(`blockHeader type=${blockHeader.type}, length=${blockHeader.length}`);
      switch (blockHeader.type) {
        case BlockType.STREAMINFO:
          return this.parseBlockStreamInfo(blockHeader.length);
        case BlockType.PADDING:
          this.padding += blockHeader.length;
          break;
        case BlockType.APPLICATION:
          break;
        case BlockType.SEEKTABLE:
          break;
        case BlockType.VORBIS_COMMENT:
          return this.parseComment(blockHeader.length);
        case BlockType.CUESHEET:
          break;
        case BlockType.PICTURE:
          yield this.parsePicture(blockHeader.length);
          return;
        default:
          this.metadata.addWarning(`Unknown block type: ${blockHeader.type}`);
      }
      return this.tokenizer.ignore(blockHeader.length).then();
    });
  }
  /**
   * Parse STREAMINFO
   */
  parseBlockStreamInfo(dataLen) {
    return __async(this, null, function* () {
      if (dataLen !== BlockStreamInfo.len)
        throw new FlacContentError("Unexpected block-stream-info length");
      const streamInfo = yield this.tokenizer.readToken(BlockStreamInfo);
      this.metadata.setFormat("container", "FLAC");
      this.metadata.setFormat("codec", "FLAC");
      this.metadata.setFormat("lossless", true);
      this.metadata.setFormat("numberOfChannels", streamInfo.channels);
      this.metadata.setFormat("bitsPerSample", streamInfo.bitsPerSample);
      this.metadata.setFormat("sampleRate", streamInfo.sampleRate);
      if (streamInfo.totalSamples > 0) {
        this.metadata.setFormat("duration", streamInfo.totalSamples / streamInfo.sampleRate);
      }
    });
  }
  /**
   * Parse VORBIS_COMMENT
   * Ref: https://www.xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-640004.2.3
   */
  parseComment(dataLen) {
    return __async(this, null, function* () {
      const data = yield this.tokenizer.readToken(new Uint8ArrayType(dataLen));
      const decoder = new VorbisDecoder(data, 0);
      decoder.readStringUtf8();
      const commentListLength = decoder.readInt32();
      const tags = new Array(commentListLength);
      for (let i = 0; i < commentListLength; i++) {
        tags[i] = decoder.parseUserComment();
      }
      yield Promise.all(tags.map((tag) => this.vorbisParser.addTag(tag.key, tag.value)));
    });
  }
  parsePicture(dataLen) {
    return __async(this, null, function* () {
      if (this.options.skipCovers) {
        return this.tokenizer.ignore(dataLen);
      }
      const picture = yield this.tokenizer.readToken(new VorbisPictureToken(dataLen));
      this.vorbisParser.addTag("METADATA_BLOCK_PICTURE", picture);
    });
  }
};
var BlockHeader = {
  len: 4,
  get: (buf, off) => {
    return {
      lastBlock: getBit(buf, off, 7),
      type: getBitAllignedNumber(buf, off, 1, 7),
      length: UINT24_BE.get(buf, off + 1)
    };
  }
};
var BlockStreamInfo = {
  len: 34,
  get: (buf, off) => {
    return {
      // The minimum block size (in samples) used in the stream.
      minimumBlockSize: UINT16_BE.get(buf, off),
      // The maximum block size (in samples) used in the stream.
      // (Minimum blocksize == maximum blocksize) implies a fixed-blocksize stream.
      maximumBlockSize: UINT16_BE.get(buf, off + 2) / 1e3,
      // The minimum frame size (in bytes) used in the stream.
      // May be 0 to imply the value is not known.
      minimumFrameSize: UINT24_BE.get(buf, off + 4),
      // The maximum frame size (in bytes) used in the stream.
      // May be 0 to imply the value is not known.
      maximumFrameSize: UINT24_BE.get(buf, off + 7),
      // Sample rate in Hz. Though 20 bits are available,
      // the maximum sample rate is limited by the structure of frame headers to 655350Hz.
      // Also, a value of 0 is invalid.
      sampleRate: UINT24_BE.get(buf, off + 10) >> 4,
      // probably slower: sampleRate: common.getBitAllignedNumber(buf, off + 10, 0, 20),
      // (number of channels)-1. FLAC supports from 1 to 8 channels
      channels: getBitAllignedNumber(buf, off + 12, 4, 3) + 1,
      // bits per sample)-1.
      // FLAC supports from 4 to 32 bits per sample. Currently the reference encoder and decoders only support up to 24 bits per sample.
      bitsPerSample: getBitAllignedNumber(buf, off + 12, 7, 5) + 1,
      // Total samples in stream.
      // 'Samples' means inter-channel sample, i.e. one second of 44.1Khz audio will have 44100 samples regardless of the number of channels.
      // A value of zero here means the number of total samples is unknown.
      totalSamples: getBitAllignedNumber(buf, off + 13, 4, 36),
      // the MD5 hash of the file (see notes for usage... it's a littly tricky)
      fileMD5: new Uint8ArrayType(16).get(buf, off + 18)
    };
  }
};
export {
  FlacParser
};
//# sourceMappingURL=FlacParser-XGJE5UD2.js.map
