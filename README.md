# pbkdf2

[![NPM Package](https://img.shields.io/npm/v/pbkdf2.svg?style=flat-square)](https://www.npmjs.org/package/pbkdf2)
[![Build Status](https://img.shields.io/travis/crypto-browserify/pbkdf2.svg?branch=master&style=flat-square)](https://travis-ci.org/crypto-browserify/pbkdf2)
[![Dependency status](https://img.shields.io/david/crypto-browserify/pbkdf2.svg?style=flat-square)](https://david-dm.org/crypto-browserify/pbkdf2#info=dependencies)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This library provides the functionality of PBKDF2 with the ability to use any supported hashing algorithm returned from `crypto.getHashes()`


## Usage

Require:
```js
var pbkdf2 = require('pbkdf2')
```

Functions:

`pbkdf2.pbkdf2Sync(password, salt, iterations, keylen, digest)` - Synchronously returns a `Buffer` object containing the resulting derived key.  
`pbkdf2.pbkdf2(password, salt, iterations, keylen, digest, errback)` - Asynchronous version. When done, the errback is called with a potential error as the first argument, and the result as the second argument.  
* `password` - The password to derive the key from.
* `salt` - A string containing a [salt][1] value.
* `iterations`- The number of times to feed the result of the HMAC function back into itself
* `keylen` - The number of bytes the derived key will be.

## Credits

This module is a derivative of [cryptocoinjs/pbkdf2-sha256](https://github.com/cryptocoinjs/pbkdf2-sha256/), so thanks to [JP Richardson](https://github.com/jprichardson/) for laying the ground work.

Thank you to [FangDun Cai](https://github.com/fundon) for donating the package name on npm, if you're looking for his previous module it is located at [fundon/pbkdf2](https://github.com/fundon/pbkdf2).

  [1]: https://en.wikipedia.org/wiki/Salt_(cryptography)
