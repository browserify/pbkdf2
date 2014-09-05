var assert = require('assert')
var crypto = require('crypto')

module.exports = function pbkdf2(password, salt, iterations, keylen, algo) {
  algo = algo || 'sha1'

  if (!Buffer.isBuffer(password)) password = new Buffer(password)
  if (!Buffer.isBuffer(salt)) salt = new Buffer(salt)

  var DK = new Buffer(keylen)
  var block1 = new Buffer(salt.length + 4)
  salt.copy(block1, 0, 0, salt.length)

  // TODO: assumed 1 is acceptable...
  var hLen, l = 1, r, T

  for (var i = 1; i <= l; i++) {
    block1.writeUInt32BE(i, salt.length)

    var U = crypto.createHmac(algo, password).update(block1).digest()

    if (!hLen) {
      hLen = U.length
      T = new Buffer(hLen)
      l = Math.ceil(keylen / hLen)
      r = keylen - (l - 1) * hLen

      assert(keylen <= (Math.pow(2, 32) - 1) * hLen, 'keylen exceeds maximum length')
    }

    U.copy(T, 0, 0, hLen)

    for (var j = 1; j < iterations; j++) {
      U = crypto.createHmac(algo, password).update(U).digest()

      for (var k = 0; k < hLen; k++) {
        T[k] ^= U[k]
      }
    }

    var destPos = (i - 1) * hLen
    var len = (i == l ? r : hLen)
    T.copy(DK, destPos, 0, len)
  }

  return DK
}
