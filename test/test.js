'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const getType = require('../index.js');

const getTypeAsync = promisify(getType);

const expected = {
  './factory.js': 'factory',
  './nodep.js': 'nodeps',
  './named.js': 'named',
  './dep.js': 'deps',
  './dynamicRequire.js': 'deps',
  './rem.js': 'rem',
  './empty.js': null,
  './driver.js': 'driver'
};

function testMethodAgainstExpected(method) {
  for (const file of Object.keys(expected)) {
    method(file, expected[file]);
  }
}

function asyncTest(filename, result) {
  it(`returns "${result}" for ${filename}`, async() => {
    const type = await getTypeAsync(path.resolve(__dirname, 'fixtures', filename));
    assert.equal(type, result);
  });
}

function syncTest(filename, result) {
  it(`returns "${result}" for ${filename}`, () => {
    const type = getType.sync(path.resolve(__dirname, 'fixtures', filename));
    assert.equal(type, result);
  });
}

function sourceTest(filename, result) {
  it(`returns "${result}" for ${filename}`, () => {
    const source = fs.readFileSync(path.resolve(__dirname, 'fixtures', filename), 'utf8');
    const type = getType.fromSource(source);
    assert.equal(type, result);
  });
}

describe('get-amd-module-type', () => {
  describe('Async tests', () => {
    testMethodAgainstExpected(asyncTest);

    it('reports an error for non-existing file', async() => {
      await assert.rejects(
        getTypeAsync('no_such_file'),
        { code: 'ENOENT' }
      );
    });

    it('reports an error for file with syntax error', async() => {
      await assert.rejects(
        getTypeAsync(path.resolve(__dirname, 'fixtures', 'invalid.js')),
        { name: 'SyntaxError' }
      );
    });

    it('should throw an error if argument is missing', () => {
      assert.throws(() => {
        getType(path.resolve(__dirname, 'fixtures', 'dep.js'));
      }, /^Error: callback missing$/);
      assert.throws(() => {
        getType();
      }, /^Error: filename missing$/);
    });
  });

  describe('Sync tests', () => {
    testMethodAgainstExpected(syncTest);

    it('should throw an error if an argument is missing', () => {
      assert.throws(() => {
        getType.sync();
      }, /^Error: filename missing$/);
    });
  });

  describe('From source tests', () => {
    testMethodAgainstExpected(sourceTest);

    it('should throw an error if an argument is missing', () => {
      assert.throws(() => {
        getType.fromSource();
      }, /^Error: source missing$/);
    });
  });
});
