function pbkdf2(password, salt, iterations, keylen, digest) {
  if (!Buffer.isBuffer(password)) {
    password = new Buffer(password);
  }
  if (!Buffer.isBuffer(salt)) {
    salt = new Buffer(salt);
  }
  digest = digest || 'sha1';
  digest = digest.toLowerCase().replace(/sha(\d\d?\d?)/, 'sha-$1').toUpperCase();
  return crypto.subtle.importKey('raw', password, {name:'PBKDF2'}, true, ['deriveBits']).then(function (key) {
    return crypto.subtle.deriveBits({
      name: 'PBKDF2',
      iterations: iterations,
      salt: salt,
      hash: digest
    }, key, keylen);
  }).then(function (result) {
    return new Buffer(new Uint8Array(result));
  });
}
module.exports = pbkdf2;