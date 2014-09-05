# pbkdf2-compat

[![build status](https://secure.travis-ci.org/dcousens/pbkdf2-compat.png)](http://travis-ci.org/dcousens/pbkdf2-compat)
[![Coverage Status](https://img.shields.io/coveralls/dcousens/pbkdf2-compat.svg)](https://coveralls.io/r/dcousens/pbkdf2-compat)
[![Version](http://img.shields.io/npm/v/pbkdf2-compat.svg)](https://www.npmjs.org/package/pbkdf2-compat)

This library provides the functionality of PBKDF2 with the ability to use an toy supported hashing algorithm.
It mimics the API of `pbkdf2Sync` from Node.


## Usage

```
var pbkdf2 = require('pbkd2f-compat')
var derivedKey = pbkdf2('password', 'salt', 1, 32, 'sha512')

...
```


## Credits

This module is a derivative of https://github.com/cryptocoinjs/pbkdf2-sha256/, so thanks to [JP Richardson](https://github.com/cryptocoinjs/pbkdf2-sha256/) for laying the ground work.
