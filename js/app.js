
var ipc  = require('ipc'),
    data = [],
     $   = require('jQuery'),
    md5File  = require('md5-file'),
    filewalker = require('filewalker'),
    fileHash = {},
    fileData = [];

var fs = require('fs');



  testUpload = function() {
    var badFilenames = ['.DS_Store', '.DS_Store'],
        fullPath     = null,
        initialDir   = $("#uploadTarget").data("path");

    var requestData = { path: $("#uploadTarget").data("path") };


    traverseFileSystem(initialDir, function(file) {
      console.log(file);
    });

    ipc.send('requestForTestFn', requestData);
  },
  traverseFileSystem = function(currentPath, callback) {
  // traverseFileSystem = function(currentPath, callback=null) {
    //logging for 
    //console.log(currentPath);
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var currentFile = currentPath + '/' + files[i];
      var stats = fs.statSync(currentFile);
      if (stats.isFile()) {
        if (callback != null) {
          callback(currentFile);
        }
        // console.log(currentFile);
      } else if (stats.isDirectory()) {
        traverseFileSystem(currentFile, callback);
      }
    }
  },
  assignDataPath = function(e) {
    //due to security reasons the value of a file input can not be set, so we will assign a data-path attribute and the code will use that
    $("#uploadTarget").data("path", e.target.files[0].path)
  };
ipc.on('responseFromTestFn', function(responseArgument){
  console.log(responseArgument.output.data);
  $("#outputWindow").html(responseArgument.output.data);
});