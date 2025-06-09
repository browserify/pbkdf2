'use strict';

var Buffer = require('safe-buffer').Buffer;

module.exports = function (thing, encoding, name) {
	if (Buffer.isBuffer(thing)) {
		return thing;
	}
	if (typeof thing === 'string') {
		return Buffer.from(thing, encoding);
	}
	if (ArrayBuffer.isView(thing)) {
		return Buffer.from(thing.buffer);
	}
	throw new TypeError(name + ' must be a string, a Buffer, a typed array or a DataView');
};
