# MD5 File Promise [![Build Status](https://travis-ci.org/cjsaylor/md5-file-promise.svg?branch=master)](https://travis-ci.org/cjsaylor/md5-file-promise)

The purpose of this library is to allow for files to have their md5 hash computed
via modern nodejs streams and is promised based instead of callback based.

## Example Usage

```javascript
var md5 = require('md5-file-promise');

md5.computeFromFile('/path/to/file').then(console.log);
// console logs the computed hash
```
