var Buffer = require('safe-buffer').Buffer

function swapBytes(buf, size) {
  var bytes = new Uint8Array(buf.slice());
  var len = bytes.length;
  var holder;

  if (size == 2) {
    //16 bit
    for (var i = 0; i<len; i+=2) {
        holder = bytes[i];
        bytes[i] = bytes[i+1];
        bytes[i+1] = holder;
    }
  } else if (size == 4) {
    //32 bit
    for (var i = 0; i<len; i+=4) {
      holder = bytes[i];
      bytes[i] = bytes[i+3];
      bytes[i+3] = holder;
      holder = bytes[i+1];
      bytes[i+1] = bytes[i+2];
      bytes[i+2] = holder;
    }
  } else if (size == 8) {
    //32 bit
    for (var i = 0; i<len; i+=8) {
      holder = bytes[i];
      bytes[i] = bytes[i+7];
      bytes[i+7] = holder;
      holder = bytes[i+1];
      bytes[i+1] = bytes[i+6];
      bytes[i+6] = holder;
      holder = bytes[i+2];
      bytes[i+2] = bytes[i+5];
      bytes[i+5] = holder;
      holder = bytes[i+3];
      bytes[i+3] = bytes[i+4];
      bytes[i+4] = holder;
    }
  }
  return Buffer.from(bytes);
}

function checkEndian() {
  var arrayBuffer = new ArrayBuffer(2);
  var uint8Array = new Uint8Array(arrayBuffer);
  var uint16array = new Uint16Array(arrayBuffer);
  uint8Array[0] = 0xAA; //set first byte
  uint8Array[1] = 0xBB; //set second byte
  if(uint16array[0] === 0xBBAA) return false;
  if(uint16array[0] === 0xAABB) return true;
}

module.exports = function (thing, encoding, name) {
  if (Buffer.isBuffer(thing)) {
    return thing
  } else if (typeof thing === 'string') {
    return Buffer.from(thing, encoding)
  } else if (ArrayBuffer.isView(thing)) {
    return checkEndian() ? swapBytes(thing.buffer,thing.BYTES_PER_ELEMENT) : Buffer.from(thing.buffer);
  } else {
    throw new TypeError(name + ' must be a string, a Buffer, a typed array or a DataView')
  }
}
