'use strict';

var test = require('tape');
var SafeBuffer = require('safe-buffer').Buffer;

var toBuffer = require('../lib/to-buffer');

test('toBuffer', function (t) {
	var nodeBuffer = new Buffer([1, 2, 3]);
	var safeBuffer = new SafeBuffer([4, 5, 6]);

	t.equal(toBuffer(nodeBuffer, 'utf-8', 'bob'), nodeBuffer, 'should return the Buffer when given a Buffer');
	t.equal(toBuffer(safeBuffer, 'utf-8', 'bob'), safeBuffer, 'should return the Buffer when given a Buffer');

	t.deepEqual(toBuffer('abc', 'utf-8', 'bob'), new Buffer('abc'), 'converts string to Buffer');

	t.end();
});
