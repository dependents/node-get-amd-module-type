### get-amd-module-type [![CI](https://github.com/dependents/node-get-amd-module-type/actions/workflows/ci.yml/badge.svg)](https://github.com/dependents/node-get-amd-module-type/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/get-amd-module-type)](https://www.npmjs.com/package/get-amd-module-type) [![npm](https://img.shields.io/npm/dm/get-amd-module-type)](https://www.npmjs.com/package/get-amd-module-type)

> Get the type of AMD module used for an AST node or within a file

`npm install get-amd-module-type`

### Usage

```js
const getType = require('get-amd-module-type');

// Async
getType('my/file.js', (err, type) => {

});

let type;

// Sync
type = getType.sync('my/file.js');

// From source code
type = getType.fromSource('define() {}');

// From an AST node
type = getType.fromAST(node);
```

The returned `type` will be any of the following:

* 'named': `define('name', [deps], func)`
* 'deps': `define([deps], func)`
* 'rem': `define(function(require, exports, module){});`
* 'factory': `define(function(require){})`
* 'nodeps': `define({})`
* 'driver': `require([deps], function)`
