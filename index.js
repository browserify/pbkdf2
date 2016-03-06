var crypto = require('crypto')
var shim = require('./node-shim')

exports.pbkdf2Sync = function pbkdf2Sync (password, salt, iterations, keylen, digest) {
  digest = digest || 'sha1'

  var pbkdf2Sync = shim.isShimRequired() ? shim.pbkdf2Sync : crypto.pbkdf2Sync
  return pbkdf2Sync(password, salt, iterations, keylen, digest)
}

exports.pbkdf2 = function pbkdf2 (password, salt, iterations, keylen, digest, callback) {
  if (typeof digest === 'function') {
    callback = digest
    digest = 'sha1'
  }

  var pbkdf2 = shim.isShimRequired() ? shim.pbkdf2 : crypto.pbkdf2
  return pbkdf2(password, salt, iterations, keylen, digest, callback)
}
