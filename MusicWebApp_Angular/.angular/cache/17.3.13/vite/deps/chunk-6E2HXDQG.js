import {
  AttachedPictureType
} from "./chunk-C2MWTFNT.js";
import {
  StringType,
  UINT32_BE,
  UINT32_LE,
  UINT8,
  makeUnexpectedFileContentError,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/ogg/vorbis/Vorbis.js
var VorbisPictureToken = class _VorbisPictureToken {
  static fromBase64(base64str) {
    return _VorbisPictureToken.fromBuffer(Uint8Array.from(atob(base64str), (c) => c.charCodeAt(0)));
  }
  static fromBuffer(buffer) {
    const pic = new _VorbisPictureToken(buffer.length);
    return pic.get(buffer, 0);
  }
  constructor(len) {
    this.len = len;
  }
  get(buffer, offset) {
    const type = AttachedPictureType[UINT32_BE.get(buffer, offset)];
    offset += 4;
    const mimeLen = UINT32_BE.get(buffer, offset);
    offset += 4;
    const format = new StringType(mimeLen, "utf-8").get(buffer, offset);
    offset += mimeLen;
    const descLen = UINT32_BE.get(buffer, offset);
    offset += 4;
    const description = new StringType(descLen, "utf-8").get(buffer, offset);
    offset += descLen;
    const width = UINT32_BE.get(buffer, offset);
    offset += 4;
    const height = UINT32_BE.get(buffer, offset);
    offset += 4;
    const colour_depth = UINT32_BE.get(buffer, offset);
    offset += 4;
    const indexed_color = UINT32_BE.get(buffer, offset);
    offset += 4;
    const picDataLen = UINT32_BE.get(buffer, offset);
    offset += 4;
    const data = Uint8Array.from(buffer.slice(offset, offset + picDataLen));
    return {
      type,
      format,
      description,
      width,
      height,
      colour_depth,
      indexed_color,
      data
    };
  }
};
var CommonHeader = {
  len: 7,
  get: (buf, off) => {
    return {
      packetType: UINT8.get(buf, off),
      vorbis: new StringType(6, "ascii").get(buf, off + 1)
    };
  }
};
var IdentificationHeader = {
  len: 23,
  get: (uint8Array, off) => {
    return {
      version: UINT32_LE.get(uint8Array, off + 0),
      channelMode: UINT8.get(uint8Array, off + 4),
      sampleRate: UINT32_LE.get(uint8Array, off + 5),
      bitrateMax: UINT32_LE.get(uint8Array, off + 9),
      bitrateNominal: UINT32_LE.get(uint8Array, off + 13),
      bitrateMin: UINT32_LE.get(uint8Array, off + 17)
    };
  }
};

// node_modules/music-metadata/lib/ogg/vorbis/VorbisDecoder.js
var VorbisDecoder = class {
  constructor(data, offset) {
    this.data = data;
    this.offset = offset;
  }
  readInt32() {
    const value = UINT32_LE.get(this.data, this.offset);
    this.offset += 4;
    return value;
  }
  readStringUtf8() {
    const len = this.readInt32();
    const value = new TextDecoder("utf-8").decode(this.data.subarray(this.offset, this.offset + len));
    this.offset += len;
    return value;
  }
  parseUserComment() {
    const offset0 = this.offset;
    const v = this.readStringUtf8();
    const idx = v.indexOf("=");
    return {
      key: v.slice(0, idx).toUpperCase(),
      value: v.slice(idx + 1),
      len: this.offset - offset0
    };
  }
};

// node_modules/music-metadata/lib/ogg/vorbis/VorbisParser.js
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("music-metadata:parser:ogg:vorbis1");
var VorbisContentError = class extends makeUnexpectedFileContentError("Vorbis") {
};
var VorbisParser = class _VorbisParser {
  constructor(metadata, options) {
    this.metadata = metadata;
    this.options = options;
    this.pageSegments = [];
  }
  /**
   * Vorbis 1 parser
   * @param header Ogg Page Header
   * @param pageData Page data
   */
  parsePage(header, pageData) {
    return __async(this, null, function* () {
      if (header.headerType.firstPage) {
        this.parseFirstPage(header, pageData);
      } else {
        if (header.headerType.continued) {
          if (this.pageSegments.length === 0) {
            throw new VorbisContentError("Cannot continue on previous page");
          }
          this.pageSegments.push(pageData);
        }
        if (header.headerType.lastPage || !header.headerType.continued) {
          if (this.pageSegments.length > 0) {
            const fullPage = _VorbisParser.mergeUint8Arrays(this.pageSegments);
            yield this.parseFullPage(fullPage);
          }
          this.pageSegments = header.headerType.lastPage ? [] : [pageData];
        }
      }
      if (header.headerType.lastPage) {
        this.calculateDuration(header);
      }
    });
  }
  static mergeUint8Arrays(arrays) {
    const totalSize = arrays.reduce((acc, e) => acc + e.length, 0);
    const merged = new Uint8Array(totalSize);
    arrays.forEach((array, i, _arrays) => {
      const offset = _arrays.slice(0, i).reduce((acc, e) => acc + e.length, 0);
      merged.set(array, offset);
    });
    return merged;
  }
  flush() {
    return __async(this, null, function* () {
      yield this.parseFullPage(_VorbisParser.mergeUint8Arrays(this.pageSegments));
    });
  }
  parseUserComment(pageData, offset) {
    return __async(this, null, function* () {
      const decoder = new VorbisDecoder(pageData, offset);
      const tag = decoder.parseUserComment();
      yield this.addTag(tag.key, tag.value);
      return tag.len;
    });
  }
  addTag(id, value) {
    return __async(this, null, function* () {
      if (id === "METADATA_BLOCK_PICTURE" && typeof value === "string") {
        if (this.options.skipCovers) {
          debug("Ignore picture");
          return;
        }
        value = VorbisPictureToken.fromBase64(value);
        debug(`Push picture: id=${id}, format=${value.format}`);
      } else {
        debug(`Push tag: id=${id}, value=${value}`);
      }
      yield this.metadata.addTag("vorbis", id, value);
    });
  }
  calculateDuration(header) {
    if (this.metadata.format.sampleRate && header.absoluteGranulePosition >= 0) {
      this.metadata.setFormat("numberOfSamples", header.absoluteGranulePosition);
      this.metadata.setFormat("duration", header.absoluteGranulePosition / this.metadata.format.sampleRate);
    }
  }
  /**
   * Parse first Ogg/Vorbis page
   * @param header
   * @param pageData
   */
  parseFirstPage(header, pageData) {
    this.metadata.setFormat("codec", "Vorbis I");
    debug("Parse first page");
    const commonHeader = CommonHeader.get(pageData, 0);
    if (commonHeader.vorbis !== "vorbis")
      throw new VorbisContentError("Metadata does not look like Vorbis");
    if (commonHeader.packetType === 1) {
      const idHeader = IdentificationHeader.get(pageData, CommonHeader.len);
      this.metadata.setFormat("sampleRate", idHeader.sampleRate);
      this.metadata.setFormat("bitrate", idHeader.bitrateNominal);
      this.metadata.setFormat("numberOfChannels", idHeader.channelMode);
      debug("sample-rate=%s[hz], bitrate=%s[b/s], channel-mode=%s", idHeader.sampleRate, idHeader.bitrateNominal, idHeader.channelMode);
    } else
      throw new VorbisContentError("First Ogg page should be type 1: the identification header");
  }
  parseFullPage(pageData) {
    return __async(this, null, function* () {
      const commonHeader = CommonHeader.get(pageData, 0);
      debug("Parse full page: type=%s, byteLength=%s", commonHeader.packetType, pageData.byteLength);
      switch (commonHeader.packetType) {
        case 3:
          return this.parseUserCommentList(pageData, CommonHeader.len);
        case 1:
        case 5:
          break;
      }
    });
  }
  /**
   * Ref: https://xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-840005.2
   */
  parseUserCommentList(pageData, offset) {
    return __async(this, null, function* () {
      const strLen = UINT32_LE.get(pageData, offset);
      offset += 4;
      offset += strLen;
      let userCommentListLength = UINT32_LE.get(pageData, offset);
      offset += 4;
      while (userCommentListLength-- > 0) {
        offset += yield this.parseUserComment(pageData, offset);
      }
    });
  }
};

export {
  VorbisPictureToken,
  VorbisDecoder,
  VorbisParser
};
//# sourceMappingURL=chunk-6E2HXDQG.js.map
