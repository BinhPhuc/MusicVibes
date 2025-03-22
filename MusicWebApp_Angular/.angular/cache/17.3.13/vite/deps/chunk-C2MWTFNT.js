import {
  getBit
} from "./chunk-JETKR7SS.js";
import {
  INT8,
  StringType,
  UINT16_BE,
  UINT32_BE,
  UINT8
} from "./chunk-GBEQQQUJ.js";

// node_modules/music-metadata/lib/id3v2/ID3v2Token.js
var AttachedPictureType;
(function(AttachedPictureType2) {
  AttachedPictureType2[AttachedPictureType2["Other"] = 0] = "Other";
  AttachedPictureType2[AttachedPictureType2["32x32 pixels 'file icon' (PNG only)"] = 1] = "32x32 pixels 'file icon' (PNG only)";
  AttachedPictureType2[AttachedPictureType2["Other file icon"] = 2] = "Other file icon";
  AttachedPictureType2[AttachedPictureType2["Cover (front)"] = 3] = "Cover (front)";
  AttachedPictureType2[AttachedPictureType2["Cover (back)"] = 4] = "Cover (back)";
  AttachedPictureType2[AttachedPictureType2["Leaflet page"] = 5] = "Leaflet page";
  AttachedPictureType2[AttachedPictureType2["Media (e.g. label side of CD)"] = 6] = "Media (e.g. label side of CD)";
  AttachedPictureType2[AttachedPictureType2["Lead artist/lead performer/soloist"] = 7] = "Lead artist/lead performer/soloist";
  AttachedPictureType2[AttachedPictureType2["Artist/performer"] = 8] = "Artist/performer";
  AttachedPictureType2[AttachedPictureType2["Conductor"] = 9] = "Conductor";
  AttachedPictureType2[AttachedPictureType2["Band/Orchestra"] = 10] = "Band/Orchestra";
  AttachedPictureType2[AttachedPictureType2["Composer"] = 11] = "Composer";
  AttachedPictureType2[AttachedPictureType2["Lyricist/text writer"] = 12] = "Lyricist/text writer";
  AttachedPictureType2[AttachedPictureType2["Recording Location"] = 13] = "Recording Location";
  AttachedPictureType2[AttachedPictureType2["During recording"] = 14] = "During recording";
  AttachedPictureType2[AttachedPictureType2["During performance"] = 15] = "During performance";
  AttachedPictureType2[AttachedPictureType2["Movie/video screen capture"] = 16] = "Movie/video screen capture";
  AttachedPictureType2[AttachedPictureType2["A bright coloured fish"] = 17] = "A bright coloured fish";
  AttachedPictureType2[AttachedPictureType2["Illustration"] = 18] = "Illustration";
  AttachedPictureType2[AttachedPictureType2["Band/artist logotype"] = 19] = "Band/artist logotype";
  AttachedPictureType2[AttachedPictureType2["Publisher/Studio logotype"] = 20] = "Publisher/Studio logotype";
})(AttachedPictureType || (AttachedPictureType = {}));
var LyricsContentType;
(function(LyricsContentType2) {
  LyricsContentType2[LyricsContentType2["other"] = 0] = "other";
  LyricsContentType2[LyricsContentType2["lyrics"] = 1] = "lyrics";
  LyricsContentType2[LyricsContentType2["text"] = 2] = "text";
  LyricsContentType2[LyricsContentType2["movement_part"] = 3] = "movement_part";
  LyricsContentType2[LyricsContentType2["events"] = 4] = "events";
  LyricsContentType2[LyricsContentType2["chord"] = 5] = "chord";
  LyricsContentType2[LyricsContentType2["trivia_pop"] = 6] = "trivia_pop";
})(LyricsContentType || (LyricsContentType = {}));
var TimestampFormat;
(function(TimestampFormat2) {
  TimestampFormat2[TimestampFormat2["notSynchronized0"] = 0] = "notSynchronized0";
  TimestampFormat2[TimestampFormat2["mpegFrameNumber"] = 1] = "mpegFrameNumber";
  TimestampFormat2[TimestampFormat2["milliseconds"] = 2] = "milliseconds";
})(TimestampFormat || (TimestampFormat = {}));
var UINT32SYNCSAFE = {
  get: (buf, off) => {
    return buf[off + 3] & 127 | buf[off + 2] << 7 | buf[off + 1] << 14 | buf[off] << 21;
  },
  len: 4
};
var ID3v2Header = {
  len: 10,
  get: (buf, off) => {
    return {
      // ID3v2/file identifier   "ID3"
      fileIdentifier: new StringType(3, "ascii").get(buf, off),
      // ID3v2 versionIndex
      version: {
        major: INT8.get(buf, off + 3),
        revision: INT8.get(buf, off + 4)
      },
      // ID3v2 flags
      flags: {
        // Unsynchronisation
        unsynchronisation: getBit(buf, off + 5, 7),
        // Extended header
        isExtendedHeader: getBit(buf, off + 5, 6),
        // Experimental indicator
        expIndicator: getBit(buf, off + 5, 5),
        footer: getBit(buf, off + 5, 4)
      },
      size: UINT32SYNCSAFE.get(buf, off + 6)
    };
  }
};
var ExtendedHeader = {
  len: 10,
  get: (buf, off) => {
    return {
      // Extended header size
      size: UINT32_BE.get(buf, off),
      // Extended Flags
      extendedFlags: UINT16_BE.get(buf, off + 4),
      // Size of padding
      sizeOfPadding: UINT32_BE.get(buf, off + 6),
      // CRC data present
      crcDataPresent: getBit(buf, off + 4, 31)
    };
  }
};
var TextEncodingToken = {
  len: 1,
  get: (uint8Array, off) => {
    switch (uint8Array[off]) {
      case 0:
        return { encoding: "latin1" };
      case 1:
        return { encoding: "utf-16le", bom: true };
      case 2:
        return { encoding: "utf-16le", bom: false };
      case 3:
        return { encoding: "utf8", bom: false };
      default:
        return { encoding: "utf8", bom: false };
    }
  }
};
var TextHeader = {
  len: 4,
  get: (uint8Array, off) => {
    return {
      encoding: TextEncodingToken.get(uint8Array, off),
      language: new StringType(3, "latin1").get(uint8Array, off + 1)
    };
  }
};
var SyncTextHeader = {
  len: 6,
  get: (uint8Array, off) => {
    const text = TextHeader.get(uint8Array, off);
    return {
      encoding: text.encoding,
      language: text.language,
      timeStampFormat: UINT8.get(uint8Array, off + 4),
      contentType: UINT8.get(uint8Array, off + 5)
    };
  }
};

export {
  AttachedPictureType,
  LyricsContentType,
  TimestampFormat,
  UINT32SYNCSAFE,
  ID3v2Header,
  ExtendedHeader,
  TextEncodingToken,
  TextHeader,
  SyncTextHeader
};
//# sourceMappingURL=chunk-C2MWTFNT.js.map
