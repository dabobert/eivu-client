
var ipc  = require('ipc'),
    fs   = require('fs'),
    data = [],
     $   = require('jQuery'),
    md5File  = require('md5-file'),
    fileHash = {},
    promises = [], //folder class
    fileData = [];

  testUpload = function() {
    // var badFilenames = ['.DS_Store', '.DS_Store'],
    var initialDir  = $("#uploadTarget").data("path"),
        requestData = { path: $("#uploadTarget").data("path") };

    Folder.traverse(initialDir, function(fullPath, fileStats) {
      var md5Promise = new Promise((resolve, reject) => md5File(fullPath, function (error, md5) {
        if (error) return console.log(error)
        var filename = CloudFile.toFilename(fullPath);
        console.log(filename)
        fileData.push({ fullPath: fullPath, md5: md5, filename: filename, size: fileStats.size })
        $('<tr id="' + md5 + '"><td>' + filename + '</td><td>' + fileStats.size + '</td><<td>' + md5 + '</td><td>Queued</td></tr>').appendTo('table#fileData tbody');
      resolve(md5);
      }));//end md5File
      
      //store value for promise
      promises.push(md5Promise);
    });//end traverse

    Promise.all(promises).then(function(value) {
      // console.log(value); //one, two
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