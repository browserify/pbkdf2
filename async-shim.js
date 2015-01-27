var compat = require('./browser');
process.on('message', function(m) {
  process.send(compat.pbkdf2Sync(m.password, m.salt, m.iterations, m.keylen, m.digest).toString('hex'));
});