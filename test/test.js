/**
 * Usage: node test.js
 */

var assert = require('assert');

var MimeLookup = require('../mime-lookup');
var mime = new MimeLookup(require('mime-db'));

//
// Test mime lookups
//

assert.equal('text/plain', mime.lookup('text.txt'));     // normal file
assert.equal('text/plain', mime.lookup('TEXT.TXT'));     // uppercase
assert.equal('text/plain', mime.lookup('dir/text.txt')); // dir + file
assert.equal('text/plain', mime.lookup('.text.txt'));    // hidden file
assert.equal('text/plain', mime.lookup('.txt'));         // nameless
assert.equal('text/plain', mime.lookup('txt'));          // extension-only
assert.equal('text/plain', mime.lookup('/txt'));         // extension-less ()
assert.equal('text/plain', mime.lookup('\\txt'));        // Windows, extension-less
assert.equal('application/octet-stream', mime.lookup('text.nope')); // unrecognized
assert.equal('fallback', mime.lookup('text.fallback', 'fallback')); // alternate default

//
// Test extensions
//

assert.equal('txt', mime.extension(mime.types.text));
assert.equal('html', mime.extension(mime.types.htm));
assert.equal('bin', mime.extension('application/octet-stream'));
assert.equal('bin', mime.extension('application/octet-stream '));
assert.equal('html', mime.extension(' text/html; charset=UTF-8'));
assert.equal('html', mime.extension('text/html; charset=UTF-8 '));
assert.equal('html', mime.extension('text/html; charset=UTF-8'));
assert.equal('html', mime.extension('text/html ; charset=UTF-8'));
assert.equal('html', mime.extension('text/html;charset=UTF-8'));
assert.equal('html', mime.extension('text/Html;charset=UTF-8'));
assert.equal(undefined, mime.extension('unrecognized'));

//
// Test glob
//

assert.deepEqual(['application/octet-stream'], mime.glob('*/*'));
assert.notEqual(mime.glob('application/*').indexOf('application/json'), -1);
assert.deepEqual([], mime.glob('qwerty/*'));
assert.deepEqual(['qwerty/qwerty'], mime.glob('qwerty/qwerty'));

//
// Test node.types lookups
//

assert.equal('application/font-woff', mime.lookup('file.woff'));
assert.equal('application/octet-stream', mime.lookup('file.buffer'));
assert.equal('audio/x-m4a', mime.lookup('file.m4a'));
assert.equal('font/opentype', mime.lookup('file.otf'));

//
// Test charsets
//

assert.equal('UTF-8', mime.charsets.lookup('text/plain'));
assert.equal(undefined, mime.charsets.lookup(mime.types.js));
assert.equal('fallback', mime.charsets.lookup('application/octet-stream', 'fallback'));

// Test without defaults

mime = new MimeLookup();

assert.deepEqual(mime.types, {});
assert.deepEqual(mime.extensions, {});

console.log('\nAll tests passed');
