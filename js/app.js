
var ipc  = require('ipc'),
    fs   = require('fs'),
    data = [],
     $   = require('jQuery'),
    md5File  = require('md5-file'),
    fileHash = {},
    badFilenames = ['.DS_Store'],
    fileData = [];

  testUpload = function() {
    // var badFilenames = ['.DS_Store', '.DS_Store'],
    var fullPath    = null,
        initialDir  = $("#uploadTarget").data("path"),
        requestData = { path: $("#uploadTarget").data("path") };

    traverseFileSystem(initialDir, function(fullPath, fileStats) {
      md5File(fullPath, function (error, md5) {
        if (error) return console.log(error)
        filename = fullPath.split('/').reverse()[0];
        console.log(filename)
        fileData.push({ fullPath: fullPath, md5: md5, filename: filename, size: fileStats.size })
        $('<tr id="' + md5 + '"><td>' + filename + '</td><td>' + fileStats.size + '</td><<td>' + md5 + '</td><td>Queued</td></tr>').appendTo('table#fileData tbody');
      });//end md5File
    });//end traverse

    ipc.send('requestForTestFn', requestData);
  },
  traverseFileSystem = function(currentPath, callback) {
    var files = fs.readdirSync(currentPath);
    var list = []
    for (var i in files) {
      var currentFile = currentPath + '/' + files[i];
      var stats = fs.statSync(currentFile);
      if (stats.isFile()) {

        filename = currentFile.split('/').reverse()[0];

        list.push(currentFile);
        // if (callback != null) {
        if (badFilenames.indexOf(filename) == -1) {
          callback(currentFile, stats);
        }
        // console.log(currentFile);
      } else if (stats.isDirectory()) {
        list.push(traverseFileSystem(currentFile, callback));
      }
    }
    return list;
  },
  assignDataPath = function(e) {
    //due to security reasons the value of a file input can not be set, so we will assign a data-path attribute and the code will use that
    $("#uploadTarget").data("path", e.target.files[0].path)
  };
ipc.on('responseFromTestFn', function(responseArgument){
  // console.log(responseArgument.output.data);
  $("#outputWindow").html(responseArgument.output.data);
});