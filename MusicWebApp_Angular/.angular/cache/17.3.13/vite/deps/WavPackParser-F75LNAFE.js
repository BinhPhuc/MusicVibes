import {
  APEv2Parser
} from "./chunk-CDMSPHVA.js";
import {
  FourCcToken
} from "./chunk-WDQJ76UN.js";
import "./chunk-2VWM7PRE.js";
import {
  uint8ArrayToHex
} from "./chunk-JETKR7SS.js";
import {
  BasicParser,
  UINT16_LE,
  UINT24_LE,
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

// node_modules/music-metadata/lib/wavpack/WavPackToken.js
var SampleRates = [
  6e3,
  8e3,
  9600,
  11025,
  12e3,
  16e3,
  22050,
  24e3,
  32e3,
  44100,
  48e3,
  64e3,
  88200,
  96e3,
  192e3,
  -1
];
var BlockHeaderToken = {
  len: 32,
  get: (buf, off) => {
    const flags = UINT32_LE.get(buf, off + 24);
    const res = {
      // should equal 'wvpk'
      BlockID: FourCcToken.get(buf, off),
      //  0x402 to 0x410 are valid for decode
      blockSize: UINT32_LE.get(buf, off + 4),
      //  0x402 (1026) to 0x410 are valid for decode
      version: UINT16_LE.get(buf, off + 8),
      //  40-bit total samples for entire file (if block_index == 0 and a value of -1 indicates an unknown length)
      totalSamples: (
        /* replace with bigint? (Token.UINT8.get(buf, off + 11) << 32) + */
        UINT32_LE.get(buf, off + 12)
      ),
      // 40-bit block_index
      blockIndex: (
        /* replace with bigint? (Token.UINT8.get(buf, off + 10) << 32) + */
        UINT32_LE.get(buf, off + 16)
      ),
      // 40-bit total samples for entire file (if block_index == 0 and a value of -1 indicates an unknown length)
      blockSamples: UINT32_LE.get(buf, off + 20),
      // various flags for id and decoding
      flags: {
        bitsPerSample: (1 + getBitAllignedNumber(flags, 0, 2)) * 8,
        isMono: isBitSet(flags, 2),
        isHybrid: isBitSet(flags, 3),
        isJointStereo: isBitSet(flags, 4),
        crossChannel: isBitSet(flags, 5),
        hybridNoiseShaping: isBitSet(flags, 6),
        floatingPoint: isBitSet(flags, 7),
        samplingRate: SampleRates[getBitAllignedNumber(flags, 23, 4)],
        isDSD: isBitSet(flags, 31)
      },
      // crc for actual decoded data
      crc: new Uint8ArrayType(4).get(buf, off + 28)
    };
    if (res.flags.isDSD) {
      res.totalSamples *= 8;
    }
    return res;
  }
};
var MetadataIdToken = {
  len: 1,
  get: (buf, off) => {
    return {
      functionId: getBitAllignedNumber(buf[off], 0, 6),
      // functionId overlaps with isOptional flag
      isOptional: isBitSet(buf[off], 5),
      isOddSize: isBitSet(buf[off], 6),
      largeBlock: isBitSet(buf[off], 7)
    };
  }
};
function isBitSet(flags, bitOffset) {
  return getBitAllignedNumber(flags, bitOffset, 1) === 1;
}
function getBitAllignedNumber(flags, bitOffset, len) {
  return flags >>> bitOffset & 4294967295 >>> 32 - len;
}

// node_modules/music-metadata/lib/wavpack/WavPackParser.js
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("music-metadata:parser:WavPack");
var WavPackContentError = class extends makeUnexpectedFileContentError("WavPack") {
};
var WavPackParser = class extends BasicParser {
  constructor() {
    super(...arguments);
    this.audioDataSize = 0;
  }
  parse() {
    return __async(this, null, function* () {
      this.audioDataSize = 0;
      yield this.parseWavPackBlocks();
      return APEv2Parser.tryParseApeHeader(this.metadata, this.tokenizer, this.options);
    });
  }
  parseWavPackBlocks() {
    return __async(this, null, function* () {
      do {
        const blockId = yield this.tokenizer.peekToken(FourCcToken);
        if (blockId !== "wvpk")
          break;
        const header = yield this.tokenizer.readToken(BlockHeaderToken);
        if (header.BlockID !== "wvpk")
          throw new WavPackContentError("Invalid WavPack Block-ID");
        debug(`WavPack header blockIndex=${header.blockIndex}, len=${BlockHeaderToken.len}`);
        if (header.blockIndex === 0 && !this.metadata.format.container) {
          this.metadata.setFormat("container", "WavPack");
          this.metadata.setFormat("lossless", !header.flags.isHybrid);
          this.metadata.setFormat("bitsPerSample", header.flags.bitsPerSample);
          if (!header.flags.isDSD) {
            this.metadata.setFormat("sampleRate", header.flags.samplingRate);
            this.metadata.setFormat("duration", header.totalSamples / header.flags.samplingRate);
          }
          this.metadata.setFormat("numberOfChannels", header.flags.isMono ? 1 : 2);
          this.metadata.setFormat("numberOfSamples", header.totalSamples);
          this.metadata.setFormat("codec", header.flags.isDSD ? "DSD" : "PCM");
        }
        const ignoreBytes = header.blockSize - (BlockHeaderToken.len - 8);
        yield header.blockIndex === 0 ? this.parseMetadataSubBlock(header, ignoreBytes) : this.tokenizer.ignore(ignoreBytes);
        if (header.blockSamples > 0) {
          this.audioDataSize += header.blockSize;
        }
      } while (!this.tokenizer.fileInfo.size || this.tokenizer.fileInfo.size - this.tokenizer.position >= BlockHeaderToken.len);
      if (this.metadata.format.duration) {
        this.metadata.setFormat("bitrate", this.audioDataSize * 8 / this.metadata.format.duration);
      }
    });
  }
  /**
   * Ref: http://www.wavpack.com/WavPack5FileFormat.pdf, 3.0 Metadata Sub-blocks
   * @param header Header
   * @param remainingLength Remaining length
   */
  parseMetadataSubBlock(header, remainingLength) {
    return __async(this, null, function* () {
      let remaining = remainingLength;
      while (remaining > MetadataIdToken.len) {
        const id = yield this.tokenizer.readToken(MetadataIdToken);
        const dataSizeInWords = yield this.tokenizer.readNumber(id.largeBlock ? UINT24_LE : UINT8);
        const data = new Uint8Array(dataSizeInWords * 2 - (id.isOddSize ? 1 : 0));
        yield this.tokenizer.readBuffer(data);
        debug(`Metadata Sub-Blocks functionId=0x${id.functionId.toString(16)}, id.largeBlock=${id.largeBlock},data-size=${data.length}`);
        switch (id.functionId) {
          case 0:
            break;
          case 14: {
            debug("ID_DSD_BLOCK");
            const mp = 1 << UINT8.get(data, 0);
            const samplingRate = header.flags.samplingRate * mp * 8;
            if (!header.flags.isDSD)
              throw new WavPackContentError("Only expect DSD block if DSD-flag is set");
            this.metadata.setFormat("sampleRate", samplingRate);
            this.metadata.setFormat("duration", header.totalSamples / samplingRate);
            break;
          }
          case 36:
            debug("ID_ALT_TRAILER: trailer for non-wav files");
            break;
          case 38:
            this.metadata.setFormat("audioMD5", data);
            break;
          case 47:
            debug(`ID_BLOCK_CHECKSUM: checksum=${uint8ArrayToHex(data)}`);
            break;
          default:
            debug(`Ignore unsupported meta-sub-block-id functionId=0x${id.functionId.toString(16)}`);
            break;
        }
        remaining -= MetadataIdToken.len + (id.largeBlock ? UINT24_LE.len : UINT8.len) + dataSizeInWords * 2;
        debug(`remainingLength=${remaining}`);
        if (id.isOddSize)
          this.tokenizer.ignore(1);
      }
      if (remaining !== 0)
        throw new WavPackContentError("metadata-sub-block should fit it remaining length");
    });
  }
};
export {
  WavPackContentError,
  WavPackParser
};
//# sourceMappingURL=WavPackParser-F75LNAFE.js.map
