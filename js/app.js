
var ipc  = require('ipc'),
    fs   = require('fs'),
    async= require("async"),
     $   = require('jQuery'),
    fileInfo = [],
    md5File  = require('md5-file'),
    md5Promises = [];






// var queue = async.queue(createMd5, 10); // Run ten simultaneous uploads
var queue = async.queue(function(singleFileInfo, callback) {
// var queue = async.queue(function(fullPath, fileStats, callback) {
  var data={}, promise = new Promise((resolve, reject) => md5File(singleFileInfo.fullPath, function (error, md5) {
    if (error) return console.log(error);

    var filename = CloudFile.toFilename(singleFileInfo.fullPath);

    if (Folder.badFilenames().indexOf(filename) != -1) return console.log('skipping ' + filename);

    $('<tr id="' + md5 + '"><td class="filename">' + filename.substring(0,50) + '</td><td class="size">' + singleFileInfo.fileStats.size + '</td><td class="md5">' + md5 + '</td><td class="status">Queued</td></tr>').appendTo('table#fileData tbody');
    data = { fullPath: singleFileInfo.fullPath, md5: md5, filename: filename, size: singleFileInfo.fileStats.size }
    fileInfo.push( data );
    resolve( data );
  }));//end md5File
  
  //store value for promise
  md5Promises.push(promise);
  callback(null, data);


}, 20); //Only allow 20 copy requests at a time




  testUpload = function() {
    // var badFilenames = ['.DS_Store', '.DS_Store'],
    var initialDir  = $("#uploadTarget").data("path"),
        requestData = { path: $("#uploadTarget").data("path") };

    Folder.traverse(initialDir, function(fullPath, fileStats) {
      console.log(fullPath)
      queue.push({fullPath: fullPath, fileStats: fileStats },function(error, data){
        console.log("in callback")
        // debugger;
        if (error) return console.log(error);
        // $('<tr id="' + data.md5 + '"><td class="filename">' + data.filename.substring(0,50) + '</td><td class="size">' + data.size + '</td><td class="md5">' + md5 + '</td><td class="status">Queued</td></tr>').appendTo('table#fileData tbody');
        console.log(data.filename + " ==> " + data.md5)
      });



    });//end traverse

    Promise.all(md5Promises).then(function(value) {
      console.log(value);
      alert("done");
    });

    ipc.send('requestForTestFn', requestData);
  },
  assignDataPath = function(e) {
    //due to security reasons the value of a file input can not be set, so we will assign a data-path attribute and the code will use that
    $("#uploadTarget").data("path", e.target.files[0].path)
  };

ipc.on('responseFromTestFn', function(responseArgument){
  // console.log(responseArgument.output.data);
  $("#outputWindow").html(responseArgument.output.data);
});