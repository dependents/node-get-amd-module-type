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
            assert.equal(error, null, error);
            assert.equal(type, result);
            done();
        });
    });
}

describe('get-amd-module-type', function() {
  describe('Async tests', function() {
    testMethodAgainstExpected(asyncTest);
  });
});
