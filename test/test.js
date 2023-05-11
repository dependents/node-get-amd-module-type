/* eslint-env mocha */

'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const getType = require('../index.js');

const expected = {
  './factory.js': 'factory',
  './nodep.js': 'nodeps',
  './named.js': 'named',
  './dep.js': 'deps',
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
  it(`returns "${result}" for ${filename}`, done => {
    getType(path.resolve(__dirname, 'fixtures', filename), (error, type) => {
      assert.equal(error, null);
      assert.equal(type, result);
      done();
    });
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

    it('reports an error for non-existing file', done => {
      getType('no_such_file', error => {
        assert.notEqual(error, null);
        // ENOENT errors always contains filename
        assert.notEqual(error.toString().indexOf('no_such_file'), -1, error);
        done();
      });
    });

    it('reports an error for file with syntax error', done => {
      getType(path.resolve(__dirname, 'fixtures', 'invalid.js'), error => {
        assert.notEqual(error, null);
        // Check error not to be ENOENT
        assert.equal(error.toString().includes('invalid.js'), false, error);
        done();
      });
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
