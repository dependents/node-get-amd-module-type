'use strict';

const fs = require('node:fs');
const Walker = require('node-source-walk');
const types = require('ast-module-types');

/**
 * Asynchronously identifies the AMD module type of the given file.
 *
 * @param {string} filename
 * @param {Function} callback - Called with (error, type)
 *
 * @example
 * define('name', [deps], func)   // 'named'
 * define([deps], func)           // 'deps'
 * define(func(require))          // 'factory'
 * define({})                     // 'nodeps'
 */
module.exports = function(filename, callback) {
  if (!filename) throw new Error('filename missing');
  if (!callback) throw new Error('callback missing');

  // eslint-disable-next-line n/prefer-promises/fs
  fs.readFile(filename, 'utf8', (error, data) => {
    if (error) return callback(error);

    let type;

    try {
      type = fromSource(data);
    } catch(error) {
      return callback(error);
    }

    callback(null, type);
  });
};

/**
 * Determines the AMD module type from an AST node.
 *
 * @param {Object} node
 * @returns {string|null}
 */
function fromAST(node) {
  if (types.isNamedForm(node)) return 'named';
  if (types.isDependencyForm(node)) return 'deps';
  if (types.isREMForm(node)) return 'rem';
  if (types.isFactoryForm(node)) return 'factory';
  if (types.isNoDependencyForm(node)) return 'nodeps';
  if (types.isAMDDriverScriptRequire(node)) return 'driver';

  return null;
}

/**
 * Determines the AMD module type by walking the given source code's AST.
 *
 * @param {string} source
 * @returns {string|null}
 */
function fromSource(source) {
  if (source === undefined) throw new Error('source missing');

  const walker = new Walker();
  let type;

  walker.walk(source, node => {
    type = fromAST(node);

    if (type) {
      walker.stopWalking();
    }
  });

  return type;
}

/**
 * Synchronously determines the AMD module type of the given file.
 *
 * @param {string} filename
 * @returns {string|null}
 */
function sync(filename) {
  if (!filename) throw new Error('filename missing');

  const source = fs.readFileSync(filename, 'utf8');

  return fromSource(source);
}

module.exports.fromAST = fromAST;
module.exports.fromSource = fromSource;
module.exports.sync = sync;
