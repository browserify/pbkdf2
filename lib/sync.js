var createHash = require('create-hash/browser')

var checkParameters = require('./precondition')
var defaultEncoding = require('./default-encoding')
var Buffer = require('safe-buffer').Buffer
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

function copy (digest, B) {
  var A = createHash(digest)
  var a = A._hash._block
  var w = A._hash._w
  var wl = w.length
  var bw = B._hash._w
  for (var i = 0; i < wl; ++i) {
    w[i] = bw[i]
  }
  Object.assign(A._hash, B._hash)
  B._hash._block.copy(a)
  A._hash._block = a
  A._hash._w = w
  return A
}

module.exports = function (password, salt, iterations, keylen, digest) {
  if (!Buffer.isBuffer(password)) password = Buffer.from(password, defaultEncoding)
  if (!Buffer.isBuffer(salt)) salt = Buffer.from(salt, defaultEncoding)

  checkParameters(iterations, keylen)
  digest = digest || 'sha1'

  // pre-compute
  var blockSize = (digest === 'sha512' || digest === 'sha384') ? 128 : 64
  if (password.length > blockSize) {
    password = createHash(digest).update(password).digest()
  }

  var hLen = sizes[digest]
  var ipad = Buffer.alloc(blockSize, 0x36)
  var opad = Buffer.alloc(blockSize, 0x5C)
  for (var ii = 0; ii < password.length; ii++) {
    ipad[ii] ^= password[ii]
    opad[ii] ^= password[ii]
  }
  var ictx = createHash(digest).update(ipad)
  var octx = createHash(digest).update(opad)

  var DK = Buffer.allocUnsafe(keylen)
  var T = Buffer.allocUnsafe(hLen)
  var l = Math.ceil(keylen / hLen)
  var r = keylen - ((l - 1) * hLen)
  var block1 = Buffer.allocUnsafe(salt.length + 4)
  salt.copy(block1, 0, 0, salt.length)

  for (var i = 1; i <= l; i++) {
    block1.writeUInt32BE(i, salt.length)

//     var U = createHmac(digest, password).update(block1).digest()
    var U = copy(digest, ictx).update(block1).digest()
    U = copy(digest, octx).update(U).digest()

    U.copy(T, 0, 0, hLen)

    for (var j = 1; j < iterations; j++) {
//       U = createHmac(digest, password).update(U).digest()
      U = copy(digest, ictx).update(U).digest()
      U = copy(digest, octx).update(U).digest()

      for (var k = 0; k < hLen; k++) T[k] ^= U[k]
    }

    destPos = (i - 1) * hLen
    len = (i === l ? r : hLen)
    T.copy(DK, destPos, 0, len)
  }

  return DK
}
