import {
  __async,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// node_modules/peek-readable/lib/Errors.js
var defaultMessages = "End-Of-Stream";
var EndOfStreamError = class extends Error {
  constructor() {
    super(defaultMessages);
    this.name = "EndOfStreamError";
  }
};
var AbortError = class extends Error {
  constructor(message = "The operation was aborted") {
    super(message);
    this.name = "AbortError";
  }
};

// node_modules/peek-readable/lib/AbstractStreamReader.js
var AbstractStreamReader = class {
  constructor() {
    this.endOfStream = false;
    this.interrupted = false;
    this.peekQueue = [];
  }
  peek(uint8Array, mayBeLess = false) {
    return __async(this, null, function* () {
      const bytesRead = yield this.read(uint8Array, mayBeLess);
      this.peekQueue.push(uint8Array.subarray(0, bytesRead));
      return bytesRead;
    });
  }
  read(buffer, mayBeLess = false) {
    return __async(this, null, function* () {
      if (buffer.length === 0) {
        return 0;
      }
      let bytesRead = this.readFromPeekBuffer(buffer);
      if (!this.endOfStream) {
        bytesRead += yield this.readRemainderFromStream(buffer.subarray(bytesRead), mayBeLess);
      }
      if (bytesRead === 0) {
        throw new EndOfStreamError();
      }
      return bytesRead;
    });
  }
  /**
   * Read chunk from stream
   * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
   * @returns Number of bytes read
   */
  readFromPeekBuffer(buffer) {
    let remaining = buffer.length;
    let bytesRead = 0;
    while (this.peekQueue.length > 0 && remaining > 0) {
      const peekData = this.peekQueue.pop();
      if (!peekData)
        throw new Error("peekData should be defined");
      const lenCopy = Math.min(peekData.length, remaining);
      buffer.set(peekData.subarray(0, lenCopy), bytesRead);
      bytesRead += lenCopy;
      remaining -= lenCopy;
      if (lenCopy < peekData.length) {
        this.peekQueue.push(peekData.subarray(lenCopy));
      }
    }
    return bytesRead;
  }
  readRemainderFromStream(buffer, mayBeLess) {
    return __async(this, null, function* () {
      let bytesRead = 0;
      while (bytesRead < buffer.length && !this.endOfStream) {
        if (this.interrupted) {
          throw new AbortError();
        }
        const chunkLen = yield this.readFromStream(buffer.subarray(bytesRead), mayBeLess);
        if (chunkLen === 0)
          break;
        bytesRead += chunkLen;
      }
      if (!mayBeLess && bytesRead < buffer.length) {
        throw new EndOfStreamError();
      }
      return bytesRead;
    });
  }
};

// node_modules/peek-readable/lib/WebStreamReader.js
var WebStreamReader = class extends AbstractStreamReader {
  constructor(reader) {
    super();
    this.reader = reader;
  }
  abort() {
    return __async(this, null, function* () {
      return this.close();
    });
  }
  close() {
    return __async(this, null, function* () {
      this.reader.releaseLock();
    });
  }
};

// node_modules/peek-readable/lib/WebStreamByobReader.js
var WebStreamByobReader = class extends WebStreamReader {
  /**
   * Read from stream
   * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
   * @param mayBeLess - If true, may fill the buffer partially
   * @protected Bytes read
   */
  readFromStream(buffer, mayBeLess) {
    return __async(this, null, function* () {
      if (buffer.length === 0)
        return 0;
      const result = yield this.reader.read(new Uint8Array(buffer.length), { min: mayBeLess ? void 0 : buffer.length });
      if (result.done) {
        this.endOfStream = result.done;
      }
      if (result.value) {
        buffer.set(result.value);
        return result.value.length;
      }
      return 0;
    });
  }
};

// node_modules/peek-readable/lib/WebStreamDefaultReader.js
var WebStreamDefaultReader = class extends AbstractStreamReader {
  constructor(reader) {
    super();
    this.reader = reader;
    this.buffer = null;
  }
  /**
   * Copy chunk to target, and store the remainder in this.buffer
   */
  writeChunk(target, chunk) {
    const written = Math.min(chunk.length, target.length);
    target.set(chunk.subarray(0, written));
    if (written < chunk.length) {
      this.buffer = chunk.subarray(written);
    } else {
      this.buffer = null;
    }
    return written;
  }
  /**
   * Read from stream
   * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
   * @param mayBeLess - If true, may fill the buffer partially
   * @protected Bytes read
   */
  readFromStream(buffer, mayBeLess) {
    return __async(this, null, function* () {
      if (buffer.length === 0)
        return 0;
      let totalBytesRead = 0;
      if (this.buffer) {
        totalBytesRead += this.writeChunk(buffer, this.buffer);
      }
      while (totalBytesRead < buffer.length && !this.endOfStream) {
        const result = yield this.reader.read();
        if (result.done) {
          this.endOfStream = true;
          break;
        }
        if (result.value) {
          totalBytesRead += this.writeChunk(buffer.subarray(totalBytesRead), result.value);
        }
      }
      if (totalBytesRead === 0 && this.endOfStream) {
        throw new EndOfStreamError();
      }
      return totalBytesRead;
    });
  }
  abort() {
    this.interrupted = true;
    return this.reader.cancel();
  }
  close() {
    return __async(this, null, function* () {
      yield this.abort();
      this.reader.releaseLock();
    });
  }
};

// node_modules/peek-readable/lib/WebStreamReaderFactory.js
function makeWebStreamReader(stream) {
  try {
    const reader = stream.getReader({ mode: "byob" });
    if (reader instanceof ReadableStreamDefaultReader) {
      return new WebStreamDefaultReader(reader);
    }
    return new WebStreamByobReader(reader);
  } catch (error) {
    if (error instanceof TypeError) {
      return new WebStreamDefaultReader(stream.getReader());
    }
    throw error;
  }
}

// node_modules/strtok3/lib/AbstractTokenizer.js
var AbstractTokenizer = class {
  /**
   * Constructor
   * @param options Tokenizer options
   * @protected
   */
  constructor(options) {
    this.numBuffer = new Uint8Array(8);
    this.position = 0;
    this.onClose = options?.onClose;
    if (options?.abortSignal) {
      options.abortSignal.addEventListener("abort", () => {
        this.abort();
      });
    }
  }
  /**
   * Read a token from the tokenizer-stream
   * @param token - The token to read
   * @param position - If provided, the desired position in the tokenizer-stream
   * @returns Promise with token data
   */
  readToken(_0) {
    return __async(this, arguments, function* (token, position = this.position) {
      const uint8Array = new Uint8Array(token.len);
      const len = yield this.readBuffer(uint8Array, { position });
      if (len < token.len)
        throw new EndOfStreamError();
      return token.get(uint8Array, 0);
    });
  }
  /**
   * Peek a token from the tokenizer-stream.
   * @param token - Token to peek from the tokenizer-stream.
   * @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
   * @returns Promise with token data
   */
  peekToken(_0) {
    return __async(this, arguments, function* (token, position = this.position) {
      const uint8Array = new Uint8Array(token.len);
      const len = yield this.peekBuffer(uint8Array, { position });
      if (len < token.len)
        throw new EndOfStreamError();
      return token.get(uint8Array, 0);
    });
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  readNumber(token) {
    return __async(this, null, function* () {
      const len = yield this.readBuffer(this.numBuffer, { length: token.len });
      if (len < token.len)
        throw new EndOfStreamError();
      return token.get(this.numBuffer, 0);
    });
  }
  /**
   * Read a numeric token from the stream
   * @param token - Numeric token
   * @returns Promise with number
   */
  peekNumber(token) {
    return __async(this, null, function* () {
      const len = yield this.peekBuffer(this.numBuffer, { length: token.len });
      if (len < token.len)
        throw new EndOfStreamError();
      return token.get(this.numBuffer, 0);
    });
  }
  /**
   * Ignore number of bytes, advances the pointer in under tokenizer-stream.
   * @param length - Number of bytes to ignore
   * @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
   */
  ignore(length) {
    return __async(this, null, function* () {
      if (this.fileInfo.size !== void 0) {
        const bytesLeft = this.fileInfo.size - this.position;
        if (length > bytesLeft) {
          this.position += bytesLeft;
          return bytesLeft;
        }
      }
      this.position += length;
      return length;
    });
  }
  close() {
    return __async(this, null, function* () {
      yield this.abort();
      yield this.onClose?.();
    });
  }
  normalizeOptions(uint8Array, options) {
    if (!this.supportsRandomAccess() && options && options.position !== void 0 && options.position < this.position) {
      throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
    }
    return __spreadValues(__spreadValues({}, {
      mayBeLess: false,
      offset: 0,
      length: uint8Array.length,
      position: this.position
    }), options);
  }
  abort() {
    return Promise.resolve();
  }
};

// node_modules/strtok3/lib/ReadStreamTokenizer.js
var maxBufferSize = 256e3;
var ReadStreamTokenizer = class extends AbstractTokenizer {
  /**
   * Constructor
   * @param streamReader stream-reader to read from
   * @param options Tokenizer options
   */
  constructor(streamReader, options) {
    super(options);
    this.streamReader = streamReader;
    this.fileInfo = options?.fileInfo ?? {};
  }
  /**
   * Read buffer from tokenizer
   * @param uint8Array - Target Uint8Array to fill with data read from the tokenizer-stream
   * @param options - Read behaviour options
   * @returns Promise with number of bytes read
   */
  readBuffer(uint8Array, options) {
    return __async(this, null, function* () {
      const normOptions = this.normalizeOptions(uint8Array, options);
      const skipBytes = normOptions.position - this.position;
      if (skipBytes > 0) {
        yield this.ignore(skipBytes);
        return this.readBuffer(uint8Array, options);
      }
      if (skipBytes < 0) {
        throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
      }
      if (normOptions.length === 0) {
        return 0;
      }
      const bytesRead = yield this.streamReader.read(uint8Array.subarray(0, normOptions.length), normOptions.mayBeLess);
      this.position += bytesRead;
      if ((!options || !options.mayBeLess) && bytesRead < normOptions.length) {
        throw new EndOfStreamError();
      }
      return bytesRead;
    });
  }
  /**
   * Peek (read ahead) buffer from tokenizer
   * @param uint8Array - Uint8Array (or Buffer) to write data to
   * @param options - Read behaviour options
   * @returns Promise with number of bytes peeked
   */
  peekBuffer(uint8Array, options) {
    return __async(this, null, function* () {
      const normOptions = this.normalizeOptions(uint8Array, options);
      let bytesRead = 0;
      if (normOptions.position) {
        const skipBytes = normOptions.position - this.position;
        if (skipBytes > 0) {
          const skipBuffer = new Uint8Array(normOptions.length + skipBytes);
          bytesRead = yield this.peekBuffer(skipBuffer, { mayBeLess: normOptions.mayBeLess });
          uint8Array.set(skipBuffer.subarray(skipBytes));
          return bytesRead - skipBytes;
        }
        if (skipBytes < 0) {
          throw new Error("Cannot peek from a negative offset in a stream");
        }
      }
      if (normOptions.length > 0) {
        try {
          bytesRead = yield this.streamReader.peek(uint8Array.subarray(0, normOptions.length), normOptions.mayBeLess);
        } catch (err) {
          if (options?.mayBeLess && err instanceof EndOfStreamError) {
            return 0;
          }
          throw err;
        }
        if (!normOptions.mayBeLess && bytesRead < normOptions.length) {
          throw new EndOfStreamError();
        }
      }
      return bytesRead;
    });
  }
  ignore(length) {
    return __async(this, null, function* () {
      const bufSize = Math.min(maxBufferSize, length);
      const buf = new Uint8Array(bufSize);
      let totBytesRead = 0;
      while (totBytesRead < length) {
        const remaining = length - totBytesRead;
        const bytesRead = yield this.readBuffer(buf, { length: Math.min(bufSize, remaining) });
        if (bytesRead < 0) {
          return bytesRead;
        }
        totBytesRead += bytesRead;
      }
      return totBytesRead;
    });
  }
  abort() {
    return this.streamReader.abort();
  }
  close() {
    return __async(this, null, function* () {
      return this.streamReader.close();
    });
  }
  supportsRandomAccess() {
    return false;
  }
};

// node_modules/strtok3/lib/BufferTokenizer.js
var BufferTokenizer = class extends AbstractTokenizer {
  /**
   * Construct BufferTokenizer
   * @param uint8Array - Uint8Array to tokenize
   * @param options Tokenizer options
   */
  constructor(uint8Array, options) {
    super(options);
    this.uint8Array = uint8Array;
    this.fileInfo = __spreadValues(__spreadValues({}, options?.fileInfo ?? {}), { size: uint8Array.length });
  }
  /**
   * Read buffer from tokenizer
   * @param uint8Array - Uint8Array to tokenize
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  readBuffer(uint8Array, options) {
    return __async(this, null, function* () {
      if (options?.position) {
        this.position = options.position;
      }
      const bytesRead = yield this.peekBuffer(uint8Array, options);
      this.position += bytesRead;
      return bytesRead;
    });
  }
  /**
   * Peek (read ahead) buffer from tokenizer
   * @param uint8Array
   * @param options - Read behaviour options
   * @returns {Promise<number>}
   */
  peekBuffer(uint8Array, options) {
    return __async(this, null, function* () {
      const normOptions = this.normalizeOptions(uint8Array, options);
      const bytes2read = Math.min(this.uint8Array.length - normOptions.position, normOptions.length);
      if (!normOptions.mayBeLess && bytes2read < normOptions.length) {
        throw new EndOfStreamError();
      }
      uint8Array.set(this.uint8Array.subarray(normOptions.position, normOptions.position + bytes2read));
      return bytes2read;
    });
  }
  close() {
    return super.close();
  }
  supportsRandomAccess() {
    return true;
  }
  setPosition(position) {
    this.position = position;
  }
};

// node_modules/strtok3/lib/core.js
function fromWebStream(webStream, options) {
  const webStreamReader = makeWebStreamReader(webStream);
  const _options = options ?? {};
  const chainedClose = _options.onClose;
  _options.onClose = () => __async(this, null, function* () {
    yield webStreamReader.close();
    if (chainedClose) {
      return chainedClose();
    }
  });
  return new ReadStreamTokenizer(webStreamReader, _options);
}
function fromBuffer(uint8Array, options) {
  return new BufferTokenizer(uint8Array, options);
}

export {
  EndOfStreamError,
  fromWebStream,
  fromBuffer
};
//# sourceMappingURL=chunk-2VWM7PRE.js.map
