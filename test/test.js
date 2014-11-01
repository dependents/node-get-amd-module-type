var getType = require('../');
var esprima = require('esprima');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

var expected = {
    './factory.js': 'factory',
    './nodep.js': 'nodeps',
    './named.js': 'named',
    './dep.js': 'deps',
    './rem.js': 'rem',
    './empty.js': null,
    './driver.js': 'driver'
};

function testMethodAgainstExpected(method) {
    Object.keys(expected).forEach(function(file) {
      method(file, expected[file]);
    });
}

function asyncTest(filename, result) {
    it('returns `' + result + '` for ' + filename, function(done) {
        getType(path.resolve(__dirname, filename), function (error, type) {
            assert.strictEqual(error, null, error);
            assert.equal(type, result);
            done();
        });
    });
}

function syncTest(filename, result) {
    it('returns `' + result + '` for ' + filename, function() {
        var type = getType.sync(path.resolve(__dirname, filename));
        assert.equal(type, result);
    });
}

function sourceTest(filename, result) {
    it('returns `' + result + '` for ' + filename, function() {
        var source = fs.readFileSync(path.resolve(__dirname, filename));
        var type = getType.fromSource(source);
        assert.equal(type, result);
    });
}

describe('get-amd-module-type', function() {
  describe('Async tests', function() {
    testMethodAgainstExpected(asyncTest);

    it('reports an error for non-existing file', function(done) {
        getType("no_such_file", function (error, type) {
            assert.notStrictEqual(error, null);
            // ENOENT errors always contains filename
            assert.notEqual(error.toString().indexOf("no_such_file"), -1, error);
            done();
        });
    });

    it('reports an error for file with syntax error', function(done) {
        getType(path.resolve(__dirname, 'invalid.js'), function (error, type) {
            assert.notStrictEqual(error, null);
            // Check error not to be ENOENT
            assert.equal(error.toString().indexOf("invalid.js"), -1, error);
            done();
        });
    });
  });

  describe('Sync tests', function() {
    testMethodAgainstExpected(syncTest);
  });

  describe('From source tests', function() {
    testMethodAgainstExpected(sourceTest);
  });
});
