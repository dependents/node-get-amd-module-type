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

const fixture = file => path.resolve(__dirname, 'fixtures', file);

describe('get-amd-module-type', () => {
  const cases = Object.entries(expected);

  describe('Async tests', () => {
    for (const [file, result] of cases) {
      it(`returns "${result}" for ${file}`, async() => {
        const type = await getTypeAsync(fixture(file));
        assert.equal(type, result);
      });
    }

    it('reports an error for non-existing file', async() => {
      await assert.rejects(
        getTypeAsync('no_such_file'),
        { code: 'ENOENT' }
      );
    });

    it('reports an error for file with syntax error', async() => {
      await assert.rejects(
        getTypeAsync(fixture('invalid.js')),
        { name: 'SyntaxError' }
      );
    });

    it('should throw an error if argument is missing', () => {
      assert.throws(() => {
        getType(fixture('dep.js'));
      }, /^Error: callback missing$/);
      assert.throws(() => {
        getType();
      }, /^Error: filename missing$/);
    });
  });

  describe('Sync tests', () => {
    for (const [file, result] of cases) {
      it(`returns "${result}" for ${file}`, () => {
        const type = getType.sync(fixture(file));
        assert.equal(type, result);
      });
    }

    it('should throw an error if an argument is missing', () => {
      assert.throws(() => {
        getType.sync();
      }, /^Error: filename missing$/);
    });
  });

  describe('From source tests', () => {
    for (const [file, result] of cases) {
      it(`returns "${result}" for ${file}`, () => {
        const source = fs.readFileSync(fixture(file), 'utf8');
        const type = getType.fromSource(source);
        assert.equal(type, result);
      });
    }

    it('should throw an error if an argument is missing', () => {
      assert.throws(() => {
        getType.fromSource();
      }, /^Error: source missing$/);
    });
  });
});
