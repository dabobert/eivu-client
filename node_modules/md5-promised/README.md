# md5-promised
Handle file hashing from the promise framework.
- Provide a hashEncoding or use the default 'hex'.

## Getting Started

```shell
npm install md5-promised --save
```

## Example hashing a the md5-promised index.js (v1.0.1)
```js
var hash = require('md5-promised');
hash('md5-promised/index.js').then(function(md5) {
  console.log('md5-promised hash is:', md5);//7980f46d7ca2160c68fcc72f6ad286fa
}).fail(function(err) {
  console.log('Could not hash', err, err.stack);
});
```