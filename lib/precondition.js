var MAX_ALLOC = Math.pow(2, 30) - 1 // default in iojs

function checkType (variable, name) {
  // checks whether the type of 'variable' is one string or Uint8Array (including Buffer)
  if (typeof variable !== 'string' && Object.prototype.toString.call(variable) !== '[object Uint8Array]') {
    throw new TypeError(name + ' must be a Buffer, Uint8Array or string')
  }
}

module.exports = function (password, salt, iterations, keylen) {
  checkType(password, 'Password')
  checkType(salt, 'Salt')

  if (typeof iterations !== 'number') {
    throw new TypeError('Iterations not a number')
  }

  if (iterations < 0) {
    throw new TypeError('Bad iterations')
  }

  if (typeof keylen !== 'number') {
    throw new TypeError('Key length not a number')
  }

  if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen) { /* eslint no-self-compare: 0 */
    throw new TypeError('Bad key length')
  }
}
