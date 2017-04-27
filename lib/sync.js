var md5 = require('create-hash/md5')
var rmd160 = require('ripemd160')
var sha = require('sha.js')

var checkParameters = require('./precondition')
var defaultEncoding = require('./default-encoding')
var Buffer = require('safe-buffer').Buffer
var ZEROS = Buffer.alloc(128)
var sizes = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
}
function computePad (alg, key) {
  var hash = getDigest(alg)
  var blocksize = (alg === 'sha512' || alg === 'sha384') ? 128 : 64
  if (key.length > blocksize) {
    key = hash(key)
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }
  var ipad = Buffer.allocUnsafe(blocksize)
  var opad = Buffer.alloc(blocksize + sizes[alg])

  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }
  return {
    ipad: ipad,
    opad: opad,
    alg: alg,
    blocksize: blocksize,
    hash: hash
  }
}
function hmac (pad, data) {
  var h = pad.hash(Buffer.concat([pad.ipad, data]))
  h.copy(pad.opad, pad.blocksize)
  return pad.hash(pad.opad)
}
function getDigest (alg) {
  if (alg === 'rmd160' || alg === 'ripemd160') {
    return rmd160
  }
  if (alg === 'md5') {
    return md5
  }
  return shaFunc

  function shaFunc (data) {
    return sha(alg).update(data).digest()
  }
}
module.exports = function (password, salt, iterations, keylen, digest) {
  if (!Buffer.isBuffer(password)) password = Buffer.from(password, defaultEncoding)
  if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, defaultEncoding)

  checkParameters(iterations, keylen)

  digest = digest || 'sha1'

  var pad = computePad(digest, password)

  var hLen
  var l = 1
  var DK = Buffer.allocUnsafe(keylen)
  var block1 = Buffer.allocUnsafe(salt.length + 4)
  salt.copy(block1, 0, 0, salt.length)

  var r
  var T

  for (var i = 1; i <= l; i++) {
    block1.writeUInt32BE(i, salt.length)
    var U = hmac(pad, block1)

    if (!hLen) {
      hLen = U.length
      T = Buffer.allocUnsafe(hLen)
      l = Math.ceil(keylen / hLen)
      r = keylen - (l - 1) * hLen
    }

    U.copy(T, 0, 0, hLen)

    for (var j = 1; j < iterations; j++) {
      U = hmac(pad, U)
      for (var k = 0; k < hLen; k++) T[k] ^= U[k]
    }

    var destPos = (i - 1) * hLen
    var len = (i === l ? r : hLen)
    T.copy(DK, destPos, 0, len)
  }

  return DK
}
