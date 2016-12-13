"use strict";
var through = require('through2');
var acornGlobals = require('acorn-globals');
var MagicString = require('magic-string');

/*
 * Convenience method for turning a through2 stream
 * into a full string. Otherwise we may just get chunks,
 * because Node buffers are chunked based on file size.
 */
function streamToString(callback) {
  var contents = '';

  return through(
    function (chunk, enc, next) {
      contents += chunk.toString('utf8');
      next();
    },
    function (next) { // flush function
      callback.bind(this)(contents, next);
    }
  );
}

function replaceify(filename, opts) {
  var replacements = opts.replacements || {};
  return streamToString(function (contents, next) {
    try {
      var globals = acornGlobals(contents);
      var magicString = new MagicString(contents);
      globals.forEach(function (theGlobal) {
        if (theGlobal.name in replacements && replacements.hasOwnProperty(theGlobal.name)) {
          theGlobal.nodes.forEach(function (node) {
            magicString.overwrite(node.start, node.end, replacements[theGlobal.name]);
          });
        }
      });
      contents = magicString.toString();
    } catch (e) {}
    debugger;
    this.push(contents);
    next();
  });
}

module.exports = replaceify;
