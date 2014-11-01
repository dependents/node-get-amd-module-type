var Walker = require('node-source-walk');
var types = require('ast-module-types');
var fs = require('fs');
var esprima = require('esprima');

/**
 * Identifies the AMD module type
 *
 * @param {Object|String} node - An AST node or a filename
 *
 * @example
 * define('name', [deps], func)    'named'
 * define([deps], func)            'deps'
 * define(func(require))           'factory'
 * define({})                      'nodeps'
 *
 * @returns {String|null} the type of module syntax used, or null if it's an unsupported form
 */

function fromAST(node) {
  if (types.isNamedForm(node))        return 'named';
  if (types.isDependencyForm(node))   return 'deps';
  if (types.isREMForm(node))          return 'rem';
  if (types.isFactoryForm(node))      return 'factory';
  if (types.isNoDependencyForm(node)) return 'nodeps';
  if (types.isAMDDriverScriptRequire(node)) return 'driver';

  return null;
}

function fromSource(source) {
  if (typeof source === 'undefined') throw new Error('source not supplied');

  var type;
  var walker = new Walker();

  walker.walk(source, function(node) {
    if (type = fromAST(node)) {
      walker.stopWalking();
    }
  });

  return type;
}

function sync(file) {
  if (! file) throw new Error('filename missing');

  var source = fs.readFileSync(file);
  return fromSource(source);
}

module.exports = function(file, cb) {
  if (! file) throw new Error('filename missing');
  if (! cb)   throw new Error('callback missing');

  fs.readFile(file, { encoding: "utf8" }, function (err, data) {
    if (err) {
      return cb(err);
    }

    var type;

    try {
      type = fromSource(data);
    } catch(error) {
      return cb(error);
    }

    cb(null, type);
  });
}

module.exports.fromAST = fromAST;
module.exports.fromSource = fromSource;
module.exports.sync = sync;
