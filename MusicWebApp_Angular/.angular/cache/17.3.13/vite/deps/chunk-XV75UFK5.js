import {
  ID3v2Parser
} from "./chunk-PUCFEEIN.js";
import {
  ID3v1Parser
} from "./chunk-W34ICT6R.js";
import {
  EndOfStreamError
} from "./chunk-2VWM7PRE.js";
import {
  ID3v2Header
} from "./chunk-C2MWTFNT.js";
import {
  BasicParser,
  require_browser
} from "./chunk-GBEQQQUJ.js";
import {
  __async,
  __toESM
} from "./chunk-4MWRP73S.js";

// node_modules/music-metadata/lib/id3v2/AbstractID3Parser.js
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("music-metadata:parser:ID3");
var AbstractID3Parser = class extends BasicParser {
  constructor() {
    super(...arguments);
    this.id3parser = new ID3v2Parser();
  }
  static startsWithID3v2Header(tokenizer) {
    return __async(this, null, function* () {
      return (yield tokenizer.peekToken(ID3v2Header)).fileIdentifier === "ID3";
    });
  }
  parse() {
    return __async(this, null, function* () {
      try {
        yield this.parseID3v2();
      } catch (err) {
        if (err instanceof EndOfStreamError) {
          debug("End-of-stream");
        } else {
          throw err;
        }
      }
    });
  }
  finalize() {
    return;
  }
  parseID3v2() {
    return __async(this, null, function* () {
      yield this.tryReadId3v2Headers();
      debug("End of ID3v2 header, go to MPEG-parser: pos=%s", this.tokenizer.position);
      yield this.postId3v2Parse();
      if (this.options.skipPostHeaders && this.metadata.hasAny()) {
        this.finalize();
      } else {
        const id3v1parser = new ID3v1Parser(this.metadata, this.tokenizer, this.options);
        yield id3v1parser.parse();
        this.finalize();
      }
    });
  }
  tryReadId3v2Headers() {
    return __async(this, null, function* () {
      const id3Header = yield this.tokenizer.peekToken(ID3v2Header);
      if (id3Header.fileIdentifier === "ID3") {
        debug("Found ID3v2 header, pos=%s", this.tokenizer.position);
        yield this.id3parser.parse(this.metadata, this.tokenizer, this.options);
        return this.tryReadId3v2Headers();
      }
    });
  }
};

export {
  AbstractID3Parser
};
//# sourceMappingURL=chunk-XV75UFK5.js.map
