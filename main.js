var app = require('app'),  // Module to control application life.
    BrowserWindow = require('browser-window'),  // Module to create native browser window.
    ipc = require('ipc'),
    cf  = require('/Users/jinx/projects/eivu/electron/starter-app/js/cloud-file.js');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  //ipc stuff?
  ipc.on('requestForTestFn', function(event, argument){
// var accessKeyId     = process.env.EIVU_AWS_ACCESS_KEY_ID;
// var secretAccessKey = process.env.EIVU_AWS_SECRET_ACCESS_KEY;

// var AWS = require('aws-sdk'),
//     fs = require('fs');
// var pathToFile = '/Users/jinx/Dropbox/eBooks/Electron/electron-quick-start-master.zip'
// var bucketName = 'eivutest';
// var filename   = 'electro-quick-start-master'+(new Date).getTime()+'.zip';

// // For dev purposes only
// AWS.config.update({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });

// // Read in the file, convert it to base64, store to S3
// var fileStream = fs.createReadStream(pathToFile);
// fileStream.on('error', function (err) {
//   if (err) { throw err; }
// });

// fileStream.on('open', function () {
//   var s3 = new AWS.S3();
//   event.sender.send('responseFromTestFn', { output: { data: ("starting to upload" + filename) }});
//   s3.putObject({
//     Bucket: bucketName,
//     Key: filename,
//     Body: fileStream
//   }, function (err) {
//     if (err) {
//       throw err;
//     } else {
//       console.log("done!")
//       event.sender.send('responseFromTestFn', { output: { data: (filename + " uploaded!") }});
//     }
//   });
// });




  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
