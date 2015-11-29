
var ipc  = require('ipc'),
    fs   = require('fs'),
     $   = require('jQuery'),
    fileInfo = [],
    md5File  = require('md5-file'),
    md5Promises = [];

  testUpload = function() {
    // var badFilenames = ['.DS_Store', '.DS_Store'],
    var initialDir  = $("#uploadTarget").data("path"),
        requestData = { path: $("#uploadTarget").data("path") };

    Folder.traverse(initialDir, function(fullPath, fileStats) {
      var promise = new Promise((resolve, reject) => md5File(fullPath, function (error, md5) {
        if (error) return console.log(error);

        var filename = CloudFile.toFilename(fullPath);

        if (Folder.badFilenames().indexOf(filename) != -1) return console.log('skipping ' + filename);

        $('<tr id="' + md5 + '"><td>' + filename + '</td><td>' + fileStats.size + '</td><<td>' + md5 + '</td><td>Queued</td></tr>').appendTo('table#fileData tbody');
        data = { fullPath: fullPath, md5: md5, filename: filename, size: fileStats.size }
        fileInfo.push( data );
        resolve( data );
      }));//end md5File
      
      //store value for promise
      md5Promises.push(promise);
    });//end traverse

    Promise.all(md5Promises).then(function(value) {
      // console.log(fileInfo);
      console.log(1);
      console.log(2);
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