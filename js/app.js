// var $ = require('jQuery');
var ipc = require('ipc'),
  testUpload = function() {
    var requestData = { canvas: "black" };
    // debugger;
    ipc.send('requestForTestFn', requestData);
  };
ipc.on('responseFromTestFn', function(responseArgument){
  console.log("hey");
  console.log(responseArgument);
  // debugger;
  // $("#outputWindow").innerHTML = responseArgument.output.data;
})    

// var accessKeyId     = process.env.EIVU_AWS_ACCESS_KEY_ID;
// var secretAccessKey = process.env.EIVU_AWS_SECRET_ACCESS_KEY;

// var AWS = require('aws-sdk'),
//     fs = require('fs');
// var pathToFile = '/Users/jinx/Dropbox/eBooks/Electron/electron-quick-start-master.zip'
// var bucketName = 'eivutest';

// // For dev purposes only
// AWS.config.update({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });

// // Read in the file, convert it to base64, store to S3
// var fileStream = fs.createReadStream(pathToFile);
// fileStream.on('error', function (err) {
//   if (err) { throw err; }
// });

// fileStream.on('open', function () {
//   var s3 = new AWS.S3();
//   s3.putObject({
//     Bucket: bucketName,
//     Key: 'electro-quick-start-master3.zip',
//     Body: fileStream
//   }, function (err) {
//     if (err) { throw err; }
//   });
// });