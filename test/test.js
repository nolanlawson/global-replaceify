'use strict';

var browserify = require('browserify');
var transform = require('../');
var assert = require('assert');
var stream2promise = require('stream-to-promise');
var derequire = require('derequire');

describe('main test', function () {

  it('replaces global "process" variable', function () {
    var b = browserify(require.resolve('./module.js'), {
      standalone: 'module'
    }).transform(transform, {replacements: {process: '"replacedContent"'}}).bundle();
    return stream2promise(b).then(function (buff) {
      var code = derequire(buff.toString('utf8'));
      var yolo;
      eval(code);
      assert.equal(yolo, 'replacedContent');
    });
  });
});
