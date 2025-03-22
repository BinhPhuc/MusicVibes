import "./chunk-HZHTRIIS.js";
import {
  TrackType
} from "./chunk-5QE6VSOR.js";
import {
  Genres
} from "./chunk-W34ICT6R.js";
import "./chunk-CDMSPHVA.js";
import {
  FourCcToken
} from "./chunk-WDQJ76UN.js";
import "./chunk-2VWM7PRE.js";
import "./chunk-C2MWTFNT.js";
import {
  uint8ArrayToHex,
  uint8ArrayToString
} from "./chunk-JETKR7SS.js";
import {
  BasicParser,
  INT16_BE,
  INT24_BE,
  INT32_BE,
  INT8,
  StringType,
  UINT16_BE,
  UINT24_BE,
  UINT32_BE,
  UINT64_BE,
  UINT8,
  Uint8ArrayType,
  lib_exports,
  makeUnexpectedFileContentError,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import "./chunk-MULMZBSY.js";
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/mp4/MP4Parser.js
var import_debug3 = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/mp4/Atom.js
var import_debug2 = __toESM(require_browser(), 1);

// node_modules/music-metadata/lib/mp4/AtomToken.js
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("music-metadata:parser:MP4:atom");
var Mp4ContentError = class extends makeUnexpectedFileContentError("MP4") {
};
var Header = {
  len: 8,
  get: (buf, off) => {
    const length = UINT32_BE.get(buf, off);
    if (length < 0)
      throw new Mp4ContentError("Invalid atom header length");
    return {
      length: BigInt(length),
      name: new StringType(4, "latin1").get(buf, off + 4)
    };
  },
  put: (buf, off, hdr) => {
    UINT32_BE.put(buf, off, Number(hdr.length));
    return FourCcToken.put(buf, off + 4, hdr.name);
  }
};
var ExtendedSize = UINT64_BE;
var ftyp = {
  len: 4,
  get: (buf, off) => {
    return {
      type: new StringType(4, "ascii").get(buf, off)
    };
  }
};
var FixedLengthAtom = class {
  /**
   *
   * @param {number} len Length as specified in the size field
   * @param {number} expLen Total length of sum of specified fields in the standard
   * @param atomId Atom ID
   */
  constructor(len, expLen, atomId) {
    this.len = len;
    if (len < expLen) {
      throw new Mp4ContentError(`Atom ${atomId} expected to be ${expLen}, but specifies ${len} bytes long.`);
    }
    if (len > expLen) {
      debug(`Warning: atom ${atomId} expected to be ${expLen}, but was actually ${len} bytes long.`);
    }
  }
};
var SecondsSinceMacEpoch = {
  len: 4,
  get: (buf, off) => {
    const secondsSinceUnixEpoch = UINT32_BE.get(buf, off) - 2082844800;
    return new Date(secondsSinceUnixEpoch * 1e3);
  }
};
var MdhdAtom = class extends FixedLengthAtom {
  constructor(len) {
    super(len, 24, "mdhd");
    this.len = len;
  }
  get(buf, off) {
    return {
      version: UINT8.get(buf, off + 0),
      flags: UINT24_BE.get(buf, off + 1),
      creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
      modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
      timeScale: UINT32_BE.get(buf, off + 12),
      duration: UINT32_BE.get(buf, off + 16),
      language: UINT16_BE.get(buf, off + 20),
      quality: UINT16_BE.get(buf, off + 22)
    };
  }
};
var MvhdAtom = class extends FixedLengthAtom {
  constructor(len) {
    super(len, 100, "mvhd");
    this.len = len;
  }
  get(buf, off) {
    return {
      version: UINT8.get(buf, off),
      flags: UINT24_BE.get(buf, off + 1),
      creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
      modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
      timeScale: UINT32_BE.get(buf, off + 12),
      duration: UINT32_BE.get(buf, off + 16),
      preferredRate: UINT32_BE.get(buf, off + 20),
      preferredVolume: UINT16_BE.get(buf, off + 24),
      // ignore reserver: 10 bytes
      // ignore matrix structure: 36 bytes
      previewTime: UINT32_BE.get(buf, off + 72),
      previewDuration: UINT32_BE.get(buf, off + 76),
      posterTime: UINT32_BE.get(buf, off + 80),
      selectionTime: UINT32_BE.get(buf, off + 84),
      selectionDuration: UINT32_BE.get(buf, off + 88),
      currentTime: UINT32_BE.get(buf, off + 92),
      nextTrackID: UINT32_BE.get(buf, off + 96)
    };
  }
};
var DataAtom = class {
  constructor(len) {
    this.len = len;
  }
  get(buf, off) {
    return {
      type: {
        set: UINT8.get(buf, off + 0),
        type: UINT24_BE.get(buf, off + 1)
      },
      locale: UINT24_BE.get(buf, off + 4),
      value: new Uint8ArrayType(this.len - 8).get(buf, off + 8)
    };
  }
};
var NameAtom = class {
  constructor(len) {
    this.len = len;
  }
  get(buf, off) {
    return {
      version: UINT8.get(buf, off),
      flags: UINT24_BE.get(buf, off + 1),
      name: new StringType(this.len - 4, "utf-8").get(buf, off + 4)
    };
  }
};
var TrackHeaderAtom = class {
  constructor(len) {
    this.len = len;
  }
  get(buf, off) {
    return {
      version: UINT8.get(buf, off),
      flags: UINT24_BE.get(buf, off + 1),
      creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
      modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
      trackId: UINT32_BE.get(buf, off + 12),
      // reserved 4 bytes
      duration: UINT32_BE.get(buf, off + 20),
      layer: UINT16_BE.get(buf, off + 24),
      alternateGroup: UINT16_BE.get(buf, off + 26),
      volume: UINT16_BE.get(buf, off + 28)
      // ToDo: fixed point
      // ToDo: add remaining fields
    };
  }
};
var stsdHeader = {
  len: 8,
  get: (buf, off) => {
    return {
      version: UINT8.get(buf, off),
      flags: UINT24_BE.get(buf, off + 1),
      numberOfEntries: UINT32_BE.get(buf, off + 4)
    };
  }
};
var SampleDescriptionTable = class {
  constructor(len) {
    this.len = len;
  }
  get(buf, off) {
    const descrLen = this.len - 12;
    return {
      dataFormat: FourCcToken.get(buf, off),
      dataReferenceIndex: UINT16_BE.get(buf, off + 10),
      description: descrLen > 0 ? new Uint8ArrayType(descrLen).get(buf, off + 12) : void 0
    };
  }
};
var StsdAtom = class {
  constructor(len) {
    this.len = len;
  }
  get(buf, off) {
    const header = stsdHeader.get(buf, off);
    off += stsdHeader.len;
    const table = [];
    for (let n = 0; n < header.numberOfEntries; ++n) {
      const size = UINT32_BE.get(buf, off);
      off += UINT32_BE.len;
      table.push(new SampleDescriptionTable(size - UINT32_BE.len).get(buf, off));
      off += size;
    }
    return {
      header,
      table
    };
  }
};
var SoundSampleDescriptionVersion = {
  len: 8,
  get(buf, off) {
    return {
      version: INT16_BE.get(buf, off),
      revision: INT16_BE.get(buf, off + 2),
      vendor: INT32_BE.get(buf, off + 4)
    };
  }
};
var SoundSampleDescriptionV0 = {
  len: 12,
  get(buf, off) {
    return {
      numAudioChannels: INT16_BE.get(buf, off + 0),
      sampleSize: INT16_BE.get(buf, off + 2),
      compressionId: INT16_BE.get(buf, off + 4),
      packetSize: INT16_BE.get(buf, off + 6),
      sampleRate: UINT16_BE.get(buf, off + 8) + UINT16_BE.get(buf, off + 10) / 1e4
    };
  }
};
var SimpleTableAtom = class {
  constructor(len, token) {
    this.len = len;
    this.token = token;
  }
  get(buf, off) {
    const nrOfEntries = INT32_BE.get(buf, off + 4);
    return {
      version: INT8.get(buf, off + 0),
      flags: INT24_BE.get(buf, off + 1),
      numberOfEntries: nrOfEntries,
      entries: readTokenTable(buf, this.token, off + 8, this.len - 8, nrOfEntries)
    };
  }
};
var TimeToSampleToken = {
  len: 8,
  get(buf, off) {
    return {
      count: INT32_BE.get(buf, off + 0),
      duration: INT32_BE.get(buf, off + 4)
    };
  }
};
var SttsAtom = class extends SimpleTableAtom {
  constructor(len) {
    super(len, TimeToSampleToken);
    this.len = len;
  }
};
var SampleToChunkToken = {
  len: 12,
  get(buf, off) {
    return {
      firstChunk: INT32_BE.get(buf, off),
      samplesPerChunk: INT32_BE.get(buf, off + 4),
      sampleDescriptionId: INT32_BE.get(buf, off + 8)
    };
  }
};
var StscAtom = class extends SimpleTableAtom {
  constructor(len) {
    super(len, SampleToChunkToken);
    this.len = len;
  }
};
var StszAtom = class {
  constructor(len) {
    this.len = len;
  }
  get(buf, off) {
    const nrOfEntries = INT32_BE.get(buf, off + 8);
    return {
      version: INT8.get(buf, off),
      flags: INT24_BE.get(buf, off + 1),
      sampleSize: INT32_BE.get(buf, off + 4),
      numberOfEntries: nrOfEntries,
      entries: readTokenTable(buf, INT32_BE, off + 12, this.len - 12, nrOfEntries)
    };
  }
};
var StcoAtom = class extends SimpleTableAtom {
  constructor(len) {
    super(len, INT32_BE);
    this.len = len;
  }
};
var ChapterText = class {
  constructor(len) {
    this.len = len;
  }
  get(buf, off) {
    const titleLen = INT16_BE.get(buf, off + 0);
    const str = new StringType(titleLen, "utf-8");
    return str.get(buf, off + 2);
  }
};
function readTokenTable(buf, token, off, remainingLen, numberOfEntries) {
  debug(`remainingLen=${remainingLen}, numberOfEntries=${numberOfEntries} * token-len=${token.len}`);
  if (remainingLen === 0)
    return [];
  if (remainingLen !== numberOfEntries * token.len)
    throw new Mp4ContentError("mismatch number-of-entries with remaining atom-length");
  const entries = [];
  for (let n = 0; n < numberOfEntries; ++n) {
    entries.push(token.get(buf, off));
    off += token.len;
  }
  return entries;
}

// node_modules/music-metadata/lib/mp4/Atom.js
var debug2 = (0, import_debug2.default)("music-metadata:parser:MP4:Atom");
var Atom = class _Atom {
  static readAtom(tokenizer, dataHandler, parent, remaining) {
    return __async(this, null, function* () {
      const offset = tokenizer.position;
      debug2(`Reading next token on offset=${offset}...`);
      const header = yield tokenizer.readToken(Header);
      const extended = header.length === 1n;
      if (extended) {
        header.length = yield tokenizer.readToken(ExtendedSize);
      }
      const atomBean = new _Atom(header, extended, parent);
      const payloadLength = atomBean.getPayloadLength(remaining);
      debug2(`parse atom name=${atomBean.atomPath}, extended=${atomBean.extended}, offset=${offset}, len=${atomBean.header.length}`);
      yield atomBean.readData(tokenizer, dataHandler, payloadLength);
      return atomBean;
    });
  }
  constructor(header, extended, parent) {
    this.header = header;
    this.extended = extended;
    this.parent = parent;
    this.children = [];
    this.atomPath = (this.parent ? `${this.parent.atomPath}.` : "") + this.header.name;
  }
  getHeaderLength() {
    return this.extended ? 16 : 8;
  }
  getPayloadLength(remaining) {
    return (this.header.length === 0n ? remaining : Number(this.header.length)) - this.getHeaderLength();
  }
  readAtoms(tokenizer, dataHandler, size) {
    return __async(this, null, function* () {
      while (size > 0) {
        const atomBean = yield _Atom.readAtom(tokenizer, dataHandler, this, size);
        this.children.push(atomBean);
        size -= atomBean.header.length === 0n ? size : Number(atomBean.header.length);
      }
    });
  }
  readData(tokenizer, dataHandler, remaining) {
    return __async(this, null, function* () {
      switch (this.header.name) {
        case "moov":
        case "udta":
        case "trak":
        case "mdia":
        case "minf":
        case "stbl":
        case "<id>":
        case "ilst":
        case "tref":
          return this.readAtoms(tokenizer, dataHandler, this.getPayloadLength(remaining));
        case "meta": {
          const peekHeader = yield tokenizer.peekToken(Header);
          const paddingLength = peekHeader.name === "hdlr" ? 0 : 4;
          yield tokenizer.ignore(paddingLength);
          return this.readAtoms(tokenizer, dataHandler, this.getPayloadLength(remaining) - paddingLength);
        }
        default:
          return dataHandler(this, remaining);
      }
    });
  }
};

// node_modules/music-metadata/lib/mp4/MP4Parser.js
var debug3 = (0, import_debug3.default)("music-metadata:parser:MP4");
var tagFormat = "iTunes";
var encoderDict = {
  raw: {
    lossy: false,
    format: "raw"
  },
  MAC3: {
    lossy: true,
    format: "MACE 3:1"
  },
  MAC6: {
    lossy: true,
    format: "MACE 6:1"
  },
  ima4: {
    lossy: true,
    format: "IMA 4:1"
  },
  ulaw: {
    lossy: true,
    format: "uLaw 2:1"
  },
  alaw: {
    lossy: true,
    format: "uLaw 2:1"
  },
  Qclp: {
    lossy: true,
    format: "QUALCOMM PureVoice"
  },
  ".mp3": {
    lossy: true,
    format: "MPEG-1 layer 3"
  },
  alac: {
    lossy: false,
    format: "ALAC"
  },
  "ac-3": {
    lossy: true,
    format: "AC-3"
  },
  mp4a: {
    lossy: true,
    format: "MPEG-4/AAC"
  },
  mp4s: {
    lossy: true,
    format: "MP4S"
  },
  // Closed Captioning Media, https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap3/qtff3.html#//apple_ref/doc/uid/TP40000939-CH205-SW87
  c608: {
    lossy: true,
    format: "CEA-608"
  },
  c708: {
    lossy: true,
    format: "CEA-708"
  }
};
function distinct(value, index, self) {
  return self.indexOf(value) === index;
}
var MP4Parser = class _MP4Parser extends BasicParser {
  constructor() {
    super(...arguments);
    this.tracks = [];
    this.atomParsers = {
      /**
       * Parse movie header (mvhd) atom
       * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-56313
       */
      mvhd: (len) => __async(this, null, function* () {
        const mvhd = yield this.tokenizer.readToken(new MvhdAtom(len));
        this.metadata.setFormat("creationTime", mvhd.creationTime);
        this.metadata.setFormat("modificationTime", mvhd.modificationTime);
      }),
      /**
       * Parse media header (mdhd) atom
       * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-25615
       */
      mdhd: (len) => __async(this, null, function* () {
        const mdhd_data = yield this.tokenizer.readToken(new MdhdAtom(len));
        const td = this.getTrackDescription();
        td.creationTime = mdhd_data.creationTime;
        td.modificationTime = mdhd_data.modificationTime;
        td.timeScale = mdhd_data.timeScale;
        td.duration = mdhd_data.duration;
      }),
      chap: (len) => __async(this, null, function* () {
        const td = this.getTrackDescription();
        const trackIds = [];
        while (len >= UINT32_BE.len) {
          trackIds.push(yield this.tokenizer.readNumber(UINT32_BE));
          len -= UINT32_BE.len;
        }
        td.chapterList = trackIds;
      }),
      tkhd: (len) => __async(this, null, function* () {
        const track = yield this.tokenizer.readToken(new TrackHeaderAtom(len));
        this.tracks.push(track);
      }),
      /**
       * Parse mdat atom.
       * Will scan for chapters
       */
      mdat: (len) => __async(this, null, function* () {
        this.audioLengthInBytes = len;
        this.calculateBitRate();
        if (this.options.includeChapters) {
          const trackWithChapters = this.tracks.filter((track) => track.chapterList);
          if (trackWithChapters.length === 1) {
            const chapterTrackIds = trackWithChapters[0].chapterList;
            const chapterTracks = this.tracks.filter((track) => chapterTrackIds.indexOf(track.trackId) !== -1);
            if (chapterTracks.length === 1) {
              return this.parseChapterTrack(chapterTracks[0], trackWithChapters[0], len);
            }
          }
        }
        yield this.tokenizer.ignore(len);
      }),
      ftyp: (len) => __async(this, null, function* () {
        const types = [];
        while (len > 0) {
          const ftype = yield this.tokenizer.readToken(ftyp);
          len -= ftyp.len;
          const value = ftype.type.replace(/\W/g, "");
          if (value.length > 0) {
            types.push(value);
          }
        }
        debug3(`ftyp: ${types.join("/")}`);
        const x = types.filter(distinct).join("/");
        this.metadata.setFormat("container", x);
      }),
      /**
       * Parse sample description atom
       */
      stsd: (len) => __async(this, null, function* () {
        const stsd = yield this.tokenizer.readToken(new StsdAtom(len));
        const trackDescription = this.getTrackDescription();
        trackDescription.soundSampleDescription = stsd.table.map((dfEntry) => this.parseSoundSampleDescription(dfEntry));
      }),
      /**
       * sample-to-Chunk Atoms
       */
      stsc: (len) => __async(this, null, function* () {
        const stsc = yield this.tokenizer.readToken(new StscAtom(len));
        this.getTrackDescription().sampleToChunkTable = stsc.entries;
      }),
      /**
       * time-to-sample table
       */
      stts: (len) => __async(this, null, function* () {
        const stts = yield this.tokenizer.readToken(new SttsAtom(len));
        this.getTrackDescription().timeToSampleTable = stts.entries;
      }),
      /**
       * Parse sample-sizes atom ('stsz')
       */
      stsz: (len) => __async(this, null, function* () {
        const stsz = yield this.tokenizer.readToken(new StszAtom(len));
        const td = this.getTrackDescription();
        td.sampleSize = stsz.sampleSize;
        td.sampleSizeTable = stsz.entries;
      }),
      /**
       * Parse chunk-offset atom ('stco')
       */
      stco: (len) => __async(this, null, function* () {
        const stco = yield this.tokenizer.readToken(new StcoAtom(len));
        this.getTrackDescription().chunkOffsetTable = stco.entries;
      }),
      date: (len) => __async(this, null, function* () {
        const date = yield this.tokenizer.readToken(new StringType(len, "utf-8"));
        yield this.addTag("date", date);
      })
    };
  }
  static read_BE_Integer(array, signed) {
    const integerType = (signed ? "INT" : "UINT") + array.length * 8 + (array.length > 1 ? "_BE" : "");
    const token = lib_exports[integerType];
    if (!token) {
      throw new Mp4ContentError(`Token for integer type not found: "${integerType}"`);
    }
    return Number(token.get(array, 0));
  }
  parse() {
    return __async(this, null, function* () {
      this.tracks = [];
      let remainingFileSize = this.tokenizer.fileInfo.size || 0;
      while (!this.tokenizer.fileInfo.size || remainingFileSize > 0) {
        try {
          const token = yield this.tokenizer.peekToken(Header);
          if (token.name === "\0\0\0\0") {
            const errMsg = `Error at offset=${this.tokenizer.position}: box.id=0`;
            debug3(errMsg);
            this.addWarning(errMsg);
            break;
          }
        } catch (error) {
          if (error instanceof Error) {
            const errMsg = `Error at offset=${this.tokenizer.position}: ${error.message}`;
            debug3(errMsg);
            this.addWarning(errMsg);
          } else
            throw error;
          break;
        }
        const rootAtom = yield Atom.readAtom(this.tokenizer, (atom, remaining) => this.handleAtom(atom, remaining), null, remainingFileSize);
        remainingFileSize -= rootAtom.header.length === BigInt(0) ? remainingFileSize : Number(rootAtom.header.length);
      }
      const formatList = [];
      this.tracks.forEach((track) => {
        const trackFormats = [];
        track.soundSampleDescription.forEach((ssd) => {
          const streamInfo = {};
          const encoderInfo = encoderDict[ssd.dataFormat];
          if (encoderInfo) {
            trackFormats.push(encoderInfo.format);
            streamInfo.codecName = encoderInfo.format;
          } else {
            streamInfo.codecName = `<${ssd.dataFormat}>`;
          }
          if (ssd.description) {
            const { description } = ssd;
            if (description.sampleRate > 0) {
              streamInfo.type = TrackType.audio;
              streamInfo.audio = {
                samplingFrequency: description.sampleRate,
                bitDepth: description.sampleSize,
                channels: description.numAudioChannels
              };
            }
          }
          this.metadata.addStreamInfo(streamInfo);
        });
        if (trackFormats.length >= 1) {
          formatList.push(trackFormats.join("/"));
        }
      });
      if (formatList.length > 0) {
        this.metadata.setFormat("codec", formatList.filter(distinct).join("+"));
      }
      const audioTracks = this.tracks.filter((track) => {
        return track.soundSampleDescription.length >= 1 && track.soundSampleDescription[0].description && track.soundSampleDescription[0].description.numAudioChannels > 0;
      });
      if (audioTracks.length >= 1) {
        const audioTrack = audioTracks[0];
        if (audioTrack.timeScale > 0) {
          const duration = audioTrack.duration / audioTrack.timeScale;
          this.metadata.setFormat("duration", duration);
        }
        const ssd = audioTrack.soundSampleDescription[0];
        if (ssd.description) {
          this.metadata.setFormat("sampleRate", ssd.description.sampleRate);
          this.metadata.setFormat("bitsPerSample", ssd.description.sampleSize);
          this.metadata.setFormat("numberOfChannels", ssd.description.numAudioChannels);
          if (audioTrack.timeScale === 0 && audioTrack.timeToSampleTable.length > 0) {
            const totalSampleSize = audioTrack.timeToSampleTable.map((ttstEntry) => ttstEntry.count * ttstEntry.duration).reduce((total, sampleSize) => total + sampleSize);
            const duration = totalSampleSize / ssd.description.sampleRate;
            this.metadata.setFormat("duration", duration);
          }
        }
        const encoderInfo = encoderDict[ssd.dataFormat];
        if (encoderInfo) {
          this.metadata.setFormat("lossless", !encoderInfo.lossy);
        }
        this.calculateBitRate();
      }
    });
  }
  handleAtom(atom, remaining) {
    return __async(this, null, function* () {
      if (atom.parent) {
        switch (atom.parent.header.name) {
          case "ilst":
          case "<id>":
            return this.parseMetadataItemData(atom);
        }
      }
      if (this.atomParsers[atom.header.name]) {
        return this.atomParsers[atom.header.name](remaining);
      }
      debug3(`No parser for atom path=${atom.atomPath}, payload-len=${remaining}, ignoring atom`);
      yield this.tokenizer.ignore(remaining);
    });
  }
  getTrackDescription() {
    return this.tracks[this.tracks.length - 1];
  }
  calculateBitRate() {
    if (this.audioLengthInBytes && this.metadata.format.duration) {
      this.metadata.setFormat("bitrate", 8 * this.audioLengthInBytes / this.metadata.format.duration);
    }
  }
  addTag(id, value) {
    return __async(this, null, function* () {
      yield this.metadata.addTag(tagFormat, id, value);
    });
  }
  addWarning(message) {
    debug3(`Warning: ${message}`);
    this.metadata.addWarning(message);
  }
  /**
   * Parse data of Meta-item-list-atom (item of 'ilst' atom)
   * @param metaAtom
   * Ref: https://developer.apple.com/library/content/documentation/QuickTime/QTFF/Metadata/Metadata.html#//apple_ref/doc/uid/TP40000939-CH1-SW8
   */
  parseMetadataItemData(metaAtom) {
    let tagKey = metaAtom.header.name;
    return metaAtom.readAtoms(this.tokenizer, (child, remaining) => __async(this, null, function* () {
      const payLoadLength = child.getPayloadLength(remaining);
      switch (child.header.name) {
        case "data":
          return this.parseValueAtom(tagKey, child);
        case "name":
        case "mean":
        case "rate": {
          const name = yield this.tokenizer.readToken(new NameAtom(payLoadLength));
          tagKey += `:${name.name}`;
          break;
        }
        default: {
          const uint8Array = yield this.tokenizer.readToken(new Uint8ArrayType(payLoadLength));
          this.addWarning(`Unsupported meta-item: ${tagKey}[${child.header.name}] => value=${uint8ArrayToHex(uint8Array)} ascii=${uint8ArrayToString(uint8Array, "ascii")}`);
        }
      }
    }), metaAtom.getPayloadLength(0));
  }
  parseValueAtom(tagKey, metaAtom) {
    return __async(this, null, function* () {
      const dataAtom = yield this.tokenizer.readToken(new DataAtom(Number(metaAtom.header.length) - Header.len));
      if (dataAtom.type.set !== 0) {
        throw new Mp4ContentError(`Unsupported type-set != 0: ${dataAtom.type.set}`);
      }
      switch (dataAtom.type.type) {
        case 0:
          switch (tagKey) {
            case "trkn":
            case "disk": {
              const num = UINT8.get(dataAtom.value, 3);
              const of = UINT8.get(dataAtom.value, 5);
              yield this.addTag(tagKey, `${num}/${of}`);
              break;
            }
            case "gnre": {
              const genreInt = UINT8.get(dataAtom.value, 1);
              const genreStr = Genres[genreInt - 1];
              yield this.addTag(tagKey, genreStr);
              break;
            }
            case "rate": {
              const rate = new TextDecoder("ascii").decode(dataAtom.value);
              yield this.addTag(tagKey, rate);
              break;
            }
            default:
              debug3(`unknown proprietary value type for: ${metaAtom.atomPath}`);
          }
          break;
        case 1:
        case 18:
          yield this.addTag(tagKey, new TextDecoder("utf-8").decode(dataAtom.value));
          break;
        case 13:
          if (this.options.skipCovers)
            break;
          yield this.addTag(tagKey, {
            format: "image/jpeg",
            data: Uint8Array.from(dataAtom.value)
          });
          break;
        case 14:
          if (this.options.skipCovers)
            break;
          yield this.addTag(tagKey, {
            format: "image/png",
            data: Uint8Array.from(dataAtom.value)
          });
          break;
        case 21:
          yield this.addTag(tagKey, _MP4Parser.read_BE_Integer(dataAtom.value, true));
          break;
        case 22:
          yield this.addTag(tagKey, _MP4Parser.read_BE_Integer(dataAtom.value, false));
          break;
        case 65:
          yield this.addTag(tagKey, UINT8.get(dataAtom.value, 0));
          break;
        case 66:
          yield this.addTag(tagKey, UINT16_BE.get(dataAtom.value, 0));
          break;
        case 67:
          yield this.addTag(tagKey, UINT32_BE.get(dataAtom.value, 0));
          break;
        default:
          this.addWarning(`atom key=${tagKey}, has unknown well-known-type (data-type): ${dataAtom.type.type}`);
      }
    });
  }
  /**
   * @param sampleDescription
   * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap3/qtff3.html#//apple_ref/doc/uid/TP40000939-CH205-128916
   */
  parseSoundSampleDescription(sampleDescription) {
    const ssd = {
      dataFormat: sampleDescription.dataFormat,
      dataReferenceIndex: sampleDescription.dataReferenceIndex
    };
    let offset = 0;
    if (sampleDescription.description) {
      const version = SoundSampleDescriptionVersion.get(sampleDescription.description, offset);
      offset += SoundSampleDescriptionVersion.len;
      if (version.version === 0 || version.version === 1) {
        ssd.description = SoundSampleDescriptionV0.get(sampleDescription.description, offset);
      } else {
        debug3(`Warning: sound-sample-description ${version} not implemented`);
      }
    }
    return ssd;
  }
  parseChapterTrack(chapterTrack, track, len) {
    return __async(this, null, function* () {
      if (!chapterTrack.sampleSize) {
        if (chapterTrack.chunkOffsetTable.length !== chapterTrack.sampleSizeTable.length)
          throw new Error("Expected equal chunk-offset-table & sample-size-table length.");
      }
      const chapters = [];
      for (let i = 0; i < chapterTrack.chunkOffsetTable.length && len > 0; ++i) {
        const chunkOffset = chapterTrack.chunkOffsetTable[i];
        const nextChunkLen = chunkOffset - this.tokenizer.position;
        const sampleSize = chapterTrack.sampleSize > 0 ? chapterTrack.sampleSize : chapterTrack.sampleSizeTable[i];
        len -= nextChunkLen + sampleSize;
        if (len < 0)
          throw new Mp4ContentError("Chapter chunk exceeding token length");
        yield this.tokenizer.ignore(nextChunkLen);
        const title = yield this.tokenizer.readToken(new ChapterText(sampleSize));
        debug3(`Chapter ${i + 1}: ${title}`);
        const chapter = {
          title,
          sampleOffset: this.findSampleOffset(track, this.tokenizer.position)
        };
        debug3(`Chapter title=${chapter.title}, offset=${chapter.sampleOffset}/${this.tracks[0].duration}`);
        chapters.push(chapter);
      }
      this.metadata.setFormat("chapters", chapters);
      yield this.tokenizer.ignore(len);
    });
  }
  findSampleOffset(track, chapterOffset) {
    let totalDuration = 0;
    track.timeToSampleTable.forEach((e) => {
      totalDuration += e.count * e.duration;
    });
    debug3(`Total duration=${totalDuration}`);
    let chunkIndex = 0;
    while (chunkIndex < track.chunkOffsetTable.length && track.chunkOffsetTable[chunkIndex] < chapterOffset) {
      ++chunkIndex;
    }
    return this.getChunkDuration(chunkIndex + 1, track);
  }
  getChunkDuration(chunkId, track) {
    let ttsi = 0;
    let ttsc = track.timeToSampleTable[ttsi].count;
    let ttsd = track.timeToSampleTable[ttsi].duration;
    let curChunkId = 1;
    let samplesPerChunk = this.getSamplesPerChunk(curChunkId, track.sampleToChunkTable);
    let totalDuration = 0;
    while (curChunkId < chunkId) {
      const nrOfSamples = Math.min(ttsc, samplesPerChunk);
      totalDuration += nrOfSamples * ttsd;
      ttsc -= nrOfSamples;
      samplesPerChunk -= nrOfSamples;
      if (samplesPerChunk === 0) {
        ++curChunkId;
        samplesPerChunk = this.getSamplesPerChunk(curChunkId, track.sampleToChunkTable);
      } else {
        ++ttsi;
        ttsc = track.timeToSampleTable[ttsi].count;
        ttsd = track.timeToSampleTable[ttsi].duration;
      }
    }
    return totalDuration;
  }
  getSamplesPerChunk(chunkId, stcTable) {
    for (let i = 0; i < stcTable.length - 1; ++i) {
      if (chunkId >= stcTable[i].firstChunk && chunkId < stcTable[i + 1].firstChunk) {
        return stcTable[i].samplesPerChunk;
      }
    }
    return stcTable[stcTable.length - 1].samplesPerChunk;
  }
};
export {
  MP4Parser
};
//# sourceMappingURL=MP4Parser-QQIVZOGZ.js.map
