# pbkdf2

[![build status](https://secure.travis-ci.org/crypto-browserify/pbkdf2-compat.png)](http://travis-ci.org/crypto-browserify/pbkdf2-compat)
[![Coverage Status](https://img.shields.io/coveralls/crypto-browserify/pbkdf2-compat.svg)](https://coveralls.io/r/crypto-browserify/pbkdf2-compat)
[![Version](http://img.shields.io/npm/v/pbkdf2-compat.svg)](https://www.npmjs.org/package/pbkdf2-compat)

This library provides the functionality of PBKDF2 with the ability to use any supported hashing algorithm returned from `crypto.getHashes()`


## Usage

```
var pbkd2f = require('pbkd2f')
var derivedKey = pbkd2f.pbkdf2Sync('password', 'salt', 1, 32, 'sha512')

...
```


## Credits

This module is a derivative of https://github.com/cryptocoinjs/pbkdf2-sha256/, so thanks to [JP Richardson](https://github.com/cryptocoinjs/pbkdf2-sha256/) for laying the ground work.

Thank you to [FangDun Cai](https://github.com/fundon) for donating the package name on npm, if you're looking for his previous module it is located at [fundon/pbkdf2](https://github.com/fundon/pbkdf2).