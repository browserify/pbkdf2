var Buffer = require('safe-buffer').Buffer

module.exports = (thing, encoding) => {
  if (Buffer.isBuffer(thing)) {
    return thing
  }
  if (typeof thing === 'string') {
    return Buffer.from(thing, encoding)
  }
  if (ArrayBuffer.isView(thing)) {
    return Buffer.from(thing.buffer)
  }
}
