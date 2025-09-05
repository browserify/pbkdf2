'use strict';

var test = require('tape');
var pbkdf2 = require('..');
var precondition = require('../lib/precondition');
var nodeCrypto = require('crypto');

var password = Buffer.from('password');
var salt = Buffer.from('salt');
var keylen = 32;
var digest = 'sha256';

var hasBigInt = typeof BigInt === 'function';
var makeBigInt = function (x) { return hasBigInt ? BigInt(x) : undefined; };

var RE_NOT_NUMBER = /(iterations?|rounds?)\s*(not a number|must be a number|invalid)/i;
var RE_BAD_ITER = /(bad iterations?|iterations?\s*(must be finite|must be positive|non[-\s]?finite|>=?\s*0))/i;

test('precondition: rejects non-number iterations', function (t) {
	var badNotNumber = [
		'100',
		true,
		false,
		null,
		undefined,
		[],
		{},
		function () {},
		Object(10),
		Object(NaN)
	];
	var maybeBig = makeBigInt(10);
	if (typeof maybeBig !== 'undefined') { badNotNumber.push(maybeBig); }

	t.plan(badNotNumber.length);

	badNotNumber.forEach(function (v) {
		t['throws'](
			function () { precondition(v, keylen); },
			RE_NOT_NUMBER,
			'precondition: non-number (' + String(v) + ') rejected'
		);
	});
});

test('precondition: rejects non-finite and negative iterations', function (t) {
	var vals = [Infinity, -Infinity, NaN, -1, -0.5];
	t.plan(vals.length);

	vals.forEach(function (v) {
		t['throws'](
			function () { precondition(v, keylen); },
			RE_BAD_ITER,
			'precondition: ' + String(v) + ' rejected as bad iterations'
		);
	});
});

test('precondition: accepts very large finite numbers (no KDF run here)', function (t) {
	t.plan(2);
	t.doesNotThrow(
		function () { precondition(Number.MAX_SAFE_INTEGER, keylen); },
		'MAX_SAFE_INTEGER passes precondition'
	);
	t.doesNotThrow(
		function () { precondition(Number.MAX_VALUE, keylen); },
		'MAX_VALUE passes precondition'
	);
});

test('API: rejects non-finite iterations (no infinite loop possible)', function (t) {
	t.plan(6);

	t['throws'](
		function () { pbkdf2.pbkdf2(password, salt, Infinity, keylen, digest, function () {}); },
		RE_BAD_ITER,
		'async: Infinity rejected'
	);
	t['throws'](
		function () { pbkdf2.pbkdf2(password, salt, -Infinity, keylen, digest, function () {}); },
		RE_BAD_ITER,
		'async: -Infinity rejected'
	);
	t['throws'](
		function () { pbkdf2.pbkdf2(password, salt, NaN, keylen, digest, function () {}); },
		RE_BAD_ITER,
		'async: NaN rejected'
	);

	t['throws'](
		function () { pbkdf2.pbkdf2Sync(password, salt, Infinity, keylen, digest); },
		RE_BAD_ITER,
		'sync: Infinity rejected'
	);
	t['throws'](
		function () { pbkdf2.pbkdf2Sync(password, salt, -Infinity, keylen, digest); },
		RE_BAD_ITER,
		'sync: -Infinity rejected'
	);
	t['throws'](
		function () { pbkdf2.pbkdf2Sync(password, salt, NaN, keylen, digest); },
		RE_BAD_ITER,
		'sync: NaN rejected'
	);
});

test('API: rejects other unwanted iteration values', function (t) {
	var notNumberCases = [
		'"100"',
		undefined,
		null,
		true,
		Object(7)
	];
	var badNumberCases = [-1, -0.25];

	if (hasBigInt) { notNumberCases.push(makeBigInt(10)); }

	t.plan((notNumberCases.length + badNumberCases.length) * 2);

	notNumberCases.forEach(function (val) {
		t['throws'](
			function () { pbkdf2.pbkdf2(password, salt, val, keylen, digest, function () {}); },
			RE_NOT_NUMBER,
			'async: ' + String(val) + ' rejected (not a number)'
		);
		t['throws'](
			function () { pbkdf2.pbkdf2Sync(password, salt, val, keylen, digest); },
			RE_NOT_NUMBER,
			'sync: ' + String(val) + ' rejected (not a number)'
		);
	});

	badNumberCases.forEach(function (val) {
		t['throws'](
			function () { pbkdf2.pbkdf2(password, salt, val, keylen, digest, function () {}); },
			RE_BAD_ITER,
			'async: ' + String(val) + ' rejected (bad iterations)'
		);
		t['throws'](
			function () { pbkdf2.pbkdf2Sync(password, salt, val, keylen, digest); },
			RE_BAD_ITER,
			'sync: ' + String(val) + ' rejected (bad iterations)'
		);
	});
});

test('sanity: small finite iterations still match Node crypto', function (t) {
	t.plan(2);
	var iterations = 2;
	var expected = nodeCrypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
	var actual = pbkdf2.pbkdf2Sync(password, salt, iterations, keylen, digest);
	t.deepEqual(actual, expected, 'sync derived key matches Node for finite iterations');

	pbkdf2.pbkdf2(password, salt, iterations, keylen, digest, function (err) {
		t.error(err, 'async derived key succeeds for finite iterations');
	});
});
