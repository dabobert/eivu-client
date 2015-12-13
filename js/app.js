
var ipc  = require('ipc'),
    fs   = require('fs'),
    async= require("async"),
    hash = require('md5-promised'),
     $   = require('jQuery'),
    fileInfo = [];
    


var queue = async.queue(function(singleFileInfo, callback) {
  /* 
    Using a promise md5 function to grab the md5.  This prevents the app from seizing (preventing user input) without using setTimeout 0 and means we don't 
    means we don't have to dive into callback hell
  */
  hash(singleFileInfo.fullPath).then(function(md5) {
    var data, filename = CloudFile.toFilename(singleFileInfo.fullPath);
    data = { fullPath: singleFileInfo.fullPath, md5: md5, filename: filename, size: singleFileInfo.fileStats.size }
    //add the current file to the files table
    addRowToStatusTable(data);
    //add currnet file to global array of all files that are traversed.  this array will be used to upload data
    fileInfo.push( data );
    //tell the queue we have finished with this row, and perform "cleanup" tasks
    callback(null, data);
  }).fail(function(err) {
    console.log('Could not hash', err, err.stack);
  });
}, 20); //Only allow 20 copy requests at a time

function addRowToStatusTable(data) {
  $('<tr id="' + data.md5 + '"><td class="filename">' + data.filename.substring(0,50) + '</td><td class="size">' + data.size + '</td><td class="md5">' + data.md5 + '</td><td class="status">Queued</td></tr>').appendTo('table#fileData tbody');
}


// assign a callback
queue.drain = function() {
  console.log(fileInfo.length)
  alert("done!")
  console.log(fileInfo.length)
}


testUpload = function() {
  // var badFilenames = ['.DS_Store', '.DS_Store'],
  var initialDir  = $("#uploadTarget").data("path"),
      requestData = { path: $("#uploadTarget").data("path") };

  //traverse the directory chosen by the user
  Folder.traverse(initialDir, function(fullPath, fileStats) {
    //proceed if the current file is playable in a browser
    if (CloudFile.playable(fullPath)) {
      console.log(fullPath)
      //add file to processing queue
      queue.push({fullPath: fullPath, fileStats: fileStats },function(error, data){
        //in current implementation callback is triggered too early, ie before md5file callback is done
        //ie we are failing a race condition
        console.log("in callback")
        if (error) return console.log(error);
        console.log(data.filename + " ==> " + data.md5)
      });
    } else {
      console.log('Not cloud playable. skipping: ' + fullPath);
    }
  });//end traverse

  ipc.send('requestForTestFn', requestData);
},
assignDataPath = function(e) {
  //due to security reasons the value of a file input can not be set, so we will assign a data-path attribute and the code will use that
  $("#uploadTarget").data("path", e.target.files[0].path)
};

ipc.on('responseFromTestFn', function(responseArgument){
  $("#outputWindow").html(responseArgument.output.data);
});