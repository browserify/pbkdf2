var crypto = require('crypto')
var fork = require('child_process').fork
var path = require('path')
var browser = require('./browser')

var isShimRequired = null
exports.isShimRequired = function () {
  if (isShimRequired === null) {
    var sha1 = '0c60c80f961f0e71f3a9b524af6012062fe037a6e0f0eb94fe8fc46bdc637164'
    isShimRequired = crypto.pbkdf2Sync('password', 'salt', 1, 32, 'sha256').toString('hex') === sha1
  }

  return isShimRequired
}

exports.pbkdf2Sync = function pbkdf2Sync (password, salt, iterations, keylen, digest) {
  digest = digest || 'sha1'
  if (digest === 'sha1') return crypto.pbkdf2Sync(password, salt, iterations, keylen)
  return browser.pbkdf2Sync(password, salt, iterations, keylen, digest)
}

exports.pbkdf2 = function pbkdf2 (password, salt, iterations, keylen, digest, callback) {
  if (typeof digest === 'function') {
    callback = digest
    digest = 'sha1'
  }

  if (digest === 'sha1') return crypto.pbkdf2(password, salt, iterations, keylen, callback)

  if (!Buffer.isBuffer(password)) password = new Buffer(password, 'binary')
  if (!Buffer.isBuffer(salt)) salt = new Buffer(salt, 'binary')

  browser._checkParameters(iterations, keylen)
  var child = fork(path.resolve(__dirname, 'async-shim.js'))

  child.on('message', function (result) {
    if (result.type === 'success') {
      callback(null, new Buffer(result.data, 'hex'))
    } else if (result.type === 'fail') {
      callback(new TypeError(result.data))
    }
  })

  child.send({
    password: password.toString('hex'),
    salt: salt.toString('hex'),
    iterations: iterations,
    keylen: keylen,
    digest: digest
  })
}
