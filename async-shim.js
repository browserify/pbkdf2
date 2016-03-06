var compat = require('./browser')

process.on('message', function (m) {
  try {
    var password = new Buffer(m.password, 'hex')
    var salt = new Buffer(m.salt, 'hex')
    var result = compat.pbkdf2Sync(password, salt, m.iterations, m.keylen, m.digest)

    process.send({ data: result.toString('hex'), type: 'success' })
  } catch (e) {
    process.send({ data: e && e.message, type: 'fail' })
  } finally {
    process.exit()
  }
})
