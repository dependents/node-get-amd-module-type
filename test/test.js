'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { suite } = require('uvu');
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

const cases = Object.entries(expected);

const asyncTests = suite('Async tests');

for (const [file, result] of cases) {
  asyncTests(`returns "${result}" for ${file}`, async() => {
    const type = await getTypeAsync(fixture(file));
    assert.equal(type, result);
  });
}

asyncTests('reports an error for non-existing file', async() => {
  await assert.rejects(
    getTypeAsync('no_such_file'),
    { code: 'ENOENT' }
  );
});

asyncTests('reports an error for file with syntax error', async() => {
  await assert.rejects(
    getTypeAsync(fixture('invalid.js')),
    { name: 'SyntaxError' }
  );
});

asyncTests('should throw an error if argument is missing', () => {
  assert.throws(() => {
    getType(fixture('dep.js'));
  }, /^Error: callback missing$/);
  assert.throws(() => {
    getType();
  }, /^Error: filename missing$/);
});

asyncTests.run();

const syncTests = suite('Sync tests');

for (const [file, result] of cases) {
  syncTests(`returns "${result}" for ${file}`, () => {
    const type = getType.sync(fixture(file));
    assert.equal(type, result);
  });
}

syncTests('should throw an error if an argument is missing', () => {
  assert.throws(() => {
    getType.sync();
  }, /^Error: filename missing$/);
});

syncTests.run();

const fromSourceTests = suite('From source tests');

for (const [file, result] of cases) {
  fromSourceTests(`returns "${result}" for ${file}`, () => {
    const source = fs.readFileSync(fixture(file), 'utf8');
    const type = getType.fromSource(source);
    assert.equal(type, result);
  });
}

fromSourceTests('should throw an error if an argument is missing', () => {
  assert.throws(() => {
    getType.fromSource();
  }, /^Error: source missing$/);
});

fromSourceTests.run();
