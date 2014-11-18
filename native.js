function pbkdf2(password, salt, iterations, keylen) {
  if (!Buffer.isBuffer(password)) {
    password = new Buffer(password);
  }
  if (!Buffer.isBuffer(salt)) {
    salt = new Buffer(salt);
  }
  return crypto.subtle.importKey('raw', password, {name:'PBKDF2'}, true, ['deriveBits']).then(function (key) {
    return crypto.subtle.deriveBits({
      name: 'PBKDF2',
      iterations: iterations,
      salt: salt,
      hash: 'SHA-1'
    }, key, keylen);
  }).then(function (result) {
    return new Buffer(new Uint8Array(result));
  });
}
module.exports = pbkdf2;