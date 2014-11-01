### get-amd-module-type

`npm install get-amd-module-type`

### Usage

```js
var getType = require('get-amd-module-type');

// Async
getType('my/file.js', function(err, type) {

});

// Sync
var type = getType.sync('my/file.js');

// From source code
var type = getType.fromSource('define() {}');

// From an AST node
var type = getType.fromAST(node);
```
