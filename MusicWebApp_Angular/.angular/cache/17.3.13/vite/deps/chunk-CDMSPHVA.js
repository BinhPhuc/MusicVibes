import {
  FourCcToken
} from "./chunk-WDQJ76UN.js";
import {
  fromBuffer
} from "./chunk-2VWM7PRE.js";
import {
  findZero,
  uint8ArrayToString
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
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/apev2/APEv2Parser.js
var import_debug = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/apev2/APEv2Token.js
var DataType;
(function(DataType2) {
  DataType2[DataType2["text_utf8"] = 0] = "text_utf8";
  DataType2[DataType2["binary"] = 1] = "binary";
  DataType2[DataType2["external_info"] = 2] = "external_info";
  DataType2[DataType2["reserved"] = 3] = "reserved";
})(DataType || (DataType = {}));
var DescriptorParser = {
  len: 52,
  get: (buf, off) => {
    return {
      // should equal 'MAC '
      ID: FourCcToken.get(buf, off),
      // versionIndex number * 1000 (3.81 = 3810) (remember that 4-byte alignment causes this to take 4-bytes)
      version: UINT32_LE.get(buf, off + 4) / 1e3,
      // the number of descriptor bytes (allows later expansion of this header)
      descriptorBytes: UINT32_LE.get(buf, off + 8),
      // the number of header APE_HEADER bytes
      headerBytes: UINT32_LE.get(buf, off + 12),
      // the number of header APE_HEADER bytes
      seekTableBytes: UINT32_LE.get(buf, off + 16),
      // the number of header data bytes (from original file)
      headerDataBytes: UINT32_LE.get(buf, off + 20),
      // the number of bytes of APE frame data
      apeFrameDataBytes: UINT32_LE.get(buf, off + 24),
      // the high order number of APE frame data bytes
      apeFrameDataBytesHigh: UINT32_LE.get(buf, off + 28),
      // the terminating data of the file (not including tag data)
      terminatingDataBytes: UINT32_LE.get(buf, off + 32),
      // the MD5 hash of the file (see notes for usage... it's a little tricky)
      fileMD5: new Uint8ArrayType(16).get(buf, off + 36)
    };
  }
};
var Header = {
  len: 24,
  get: (buf, off) => {
    return {
      // the compression level (see defines I.E. COMPRESSION_LEVEL_FAST)
      compressionLevel: UINT16_LE.get(buf, off),
      // any format flags (for future use)
      formatFlags: UINT16_LE.get(buf, off + 2),
      // the number of audio blocks in one frame
      blocksPerFrame: UINT32_LE.get(buf, off + 4),
      // the number of audio blocks in the final frame
      finalFrameBlocks: UINT32_LE.get(buf, off + 8),
      // the total number of frames
      totalFrames: UINT32_LE.get(buf, off + 12),
      // the bits per sample (typically 16)
      bitsPerSample: UINT16_LE.get(buf, off + 16),
      // the number of channels (1 or 2)
      channel: UINT16_LE.get(buf, off + 18),
      // the sample rate (typically 44100)
      sampleRate: UINT32_LE.get(buf, off + 20)
    };
  }
};
var TagFooter = {
  len: 32,
  get: (buf, off) => {
    return {
      // should equal 'APETAGEX'
      ID: new StringType(8, "ascii").get(buf, off),
      // equals CURRENT_APE_TAG_VERSION
      version: UINT32_LE.get(buf, off + 8),
      // the complete size of the tag, including this footer (excludes header)
      size: UINT32_LE.get(buf, off + 12),
      // the number of fields in the tag
      fields: UINT32_LE.get(buf, off + 16),
      // reserved for later use (must be zero),
      flags: parseTagFlags(UINT32_LE.get(buf, off + 20))
    };
  }
};
var TagItemHeader = {
  len: 8,
  get: (buf, off) => {
    return {
      // Length of assigned value in bytes
      size: UINT32_LE.get(buf, off),
      // reserved for later use (must be zero),
      flags: parseTagFlags(UINT32_LE.get(buf, off + 4))
    };
  }
};
function parseTagFlags(flags) {
  return {
    containsHeader: isBitSet(flags, 31),
    containsFooter: isBitSet(flags, 30),
    isHeader: isBitSet(flags, 29),
    readOnly: isBitSet(flags, 0),
    dataType: (flags & 6) >> 1
  };
}
function isBitSet(num, bit) {
  return (num & 1 << bit) !== 0;
}

// node_modules/music-metadata/lib/apev2/APEv2Parser.js
var debug = (0, import_debug.default)("music-metadata:parser:APEv2");
var tagFormat = "APEv2";
var preamble = "APETAGEX";
var ApeContentError = class extends makeUnexpectedFileContentError("APEv2") {
};
var APEv2Parser = class _APEv2Parser extends BasicParser {
  constructor() {
    super(...arguments);
    this.ape = {};
  }
  static tryParseApeHeader(metadata, tokenizer, options) {
    const apeParser = new _APEv2Parser(metadata, tokenizer, options);
    return apeParser.tryParseApeHeader();
  }
  /**
   * Calculate the media file duration
   * @param ah ApeHeader
   * @return {number} duration in seconds
   */
  static calculateDuration(ah) {
    let duration = ah.totalFrames > 1 ? ah.blocksPerFrame * (ah.totalFrames - 1) : 0;
    duration += ah.finalFrameBlocks;
    return duration / ah.sampleRate;
  }
  /**
   * Calculates the APEv1 / APEv2 first field offset
   * @param tokenizer
   * @param offset
   */
  static findApeFooterOffset(tokenizer, offset) {
    return __async(this, null, function* () {
      const apeBuf = new Uint8Array(TagFooter.len);
      const position = tokenizer.position;
      yield tokenizer.readBuffer(apeBuf, { position: offset - TagFooter.len });
      tokenizer.setPosition(position);
      const tagFooter = TagFooter.get(apeBuf, 0);
      if (tagFooter.ID === "APETAGEX") {
        if (tagFooter.flags.isHeader) {
          debug(`APE Header found at offset=${offset - TagFooter.len}`);
        } else {
          debug(`APE Footer found at offset=${offset - TagFooter.len}`);
          offset -= tagFooter.size;
        }
        return { footer: tagFooter, offset };
      }
    });
  }
  static parseTagFooter(metadata, buffer, options) {
    const footer = TagFooter.get(buffer, buffer.length - TagFooter.len);
    if (footer.ID !== preamble)
      throw new ApeContentError("Unexpected APEv2 Footer ID preamble value");
    fromBuffer(buffer);
    const apeParser = new _APEv2Parser(metadata, fromBuffer(buffer), options);
    return apeParser.parseTags(footer);
  }
  /**
   * Parse APEv1 / APEv2 header if header signature found
   */
  tryParseApeHeader() {
    return __async(this, null, function* () {
      if (this.tokenizer.fileInfo.size && this.tokenizer.fileInfo.size - this.tokenizer.position < TagFooter.len) {
        debug("No APEv2 header found, end-of-file reached");
        return;
      }
      const footer = yield this.tokenizer.peekToken(TagFooter);
      if (footer.ID === preamble) {
        yield this.tokenizer.ignore(TagFooter.len);
        return this.parseTags(footer);
      }
      debug(`APEv2 header not found at offset=${this.tokenizer.position}`);
      if (this.tokenizer.fileInfo.size) {
        const remaining = this.tokenizer.fileInfo.size - this.tokenizer.position;
        const buffer = new Uint8Array(remaining);
        yield this.tokenizer.readBuffer(buffer);
        return _APEv2Parser.parseTagFooter(this.metadata, buffer, this.options);
      }
    });
  }
  parse() {
    return __async(this, null, function* () {
      const descriptor = yield this.tokenizer.readToken(DescriptorParser);
      if (descriptor.ID !== "MAC ")
        throw new ApeContentError("Unexpected descriptor ID");
      this.ape.descriptor = descriptor;
      const lenExp = descriptor.descriptorBytes - DescriptorParser.len;
      const header = yield lenExp > 0 ? this.parseDescriptorExpansion(lenExp) : this.parseHeader();
      yield this.tokenizer.ignore(header.forwardBytes);
      return this.tryParseApeHeader();
    });
  }
  parseTags(footer) {
    return __async(this, null, function* () {
      const keyBuffer = new Uint8Array(256);
      let bytesRemaining = footer.size - TagFooter.len;
      debug(`Parse APE tags at offset=${this.tokenizer.position}, size=${bytesRemaining}`);
      for (let i = 0; i < footer.fields; i++) {
        if (bytesRemaining < TagItemHeader.len) {
          this.metadata.addWarning(`APEv2 Tag-header: ${footer.fields - i} items remaining, but no more tag data to read.`);
          break;
        }
        const tagItemHeader = yield this.tokenizer.readToken(TagItemHeader);
        bytesRemaining -= TagItemHeader.len + tagItemHeader.size;
        yield this.tokenizer.peekBuffer(keyBuffer, { length: Math.min(keyBuffer.length, bytesRemaining) });
        let zero = findZero(keyBuffer, 0, keyBuffer.length);
        const key = yield this.tokenizer.readToken(new StringType(zero, "ascii"));
        yield this.tokenizer.ignore(1);
        bytesRemaining -= key.length + 1;
        switch (tagItemHeader.flags.dataType) {
          case DataType.text_utf8: {
            const value = yield this.tokenizer.readToken(new StringType(tagItemHeader.size, "utf8"));
            const values = value.split(/\x00/g);
            yield Promise.all(values.map((val) => this.metadata.addTag(tagFormat, key, val)));
            break;
          }
          case DataType.binary:
            if (this.options.skipCovers) {
              yield this.tokenizer.ignore(tagItemHeader.size);
            } else {
              const picData = new Uint8Array(tagItemHeader.size);
              yield this.tokenizer.readBuffer(picData);
              zero = findZero(picData, 0, picData.length);
              const description = uint8ArrayToString(picData.slice(0, zero));
              const data = picData.slice(zero + 1);
              yield this.metadata.addTag(tagFormat, key, {
                description,
                data
              });
            }
            break;
          case DataType.external_info:
            debug(`Ignore external info ${key}`);
            yield this.tokenizer.ignore(tagItemHeader.size);
            break;
          case DataType.reserved:
            debug(`Ignore external info ${key}`);
            this.metadata.addWarning(`APEv2 header declares a reserved datatype for "${key}"`);
            yield this.tokenizer.ignore(tagItemHeader.size);
            break;
        }
      }
    });
  }
  parseDescriptorExpansion(lenExp) {
    return __async(this, null, function* () {
      yield this.tokenizer.ignore(lenExp);
      return this.parseHeader();
    });
  }
  parseHeader() {
    return __async(this, null, function* () {
      const header = yield this.tokenizer.readToken(Header);
      this.metadata.setFormat("lossless", true);
      this.metadata.setFormat("container", "Monkey's Audio");
      this.metadata.setFormat("bitsPerSample", header.bitsPerSample);
      this.metadata.setFormat("sampleRate", header.sampleRate);
      this.metadata.setFormat("numberOfChannels", header.channel);
      this.metadata.setFormat("duration", _APEv2Parser.calculateDuration(header));
      if (!this.ape.descriptor) {
        throw new ApeContentError("Missing APE descriptor");
      }
      return {
        forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes
      };
    });
  }
};

export {
  ApeContentError,
  APEv2Parser
};
//# sourceMappingURL=chunk-CDMSPHVA.js.map
