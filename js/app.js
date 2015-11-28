
var ipc  = require('ipc'),
    data = [],
     $   = require('jQuery'),
    md5File  = require('md5-file'),
    filewalker = require('filewalker'),
    fileHash = {},
    fileData = [];

  testUpload = function() {
    var badFilenames = ['.DS_Store', '.DS_Store'],
        fullPath     = null,
        initialDir   = $("#uploadTarget").data("path");

    var requestData = { path: $("#uploadTarget").data("path") };

    filewalker(initialDir)
      // .on('dir', function(p) {
      //   console.log('dir:  %s', p);
      // })
      .on('file', function(fileLastPath, fileStats) {
        filename = fileLastPath.split("/").reverse()[0];
        console.log('raw => ' + filename);
        fullPath = initialDir + '/' + fileLastPath;
        if (badFilenames.indexOf(filename) == -1) {


md5File(fullPath, function (error, md5) {
  if (error) {
    return console.log(error);
  } else {

    console.log('inside filename => ' + filename);
    console.log('fullPath => ' + fullPath);
    console.log('md5 => ' + md5);
    fileData.push({ fullPath: fullPath, md5: md5, filename: filename, size: fileStats.size })
    $('<tr id="' + md5 + '"><td>' + filename + '</td><td>' + fileStats.size + '</td><<td>' + md5 + '</td><td>Queued</td></tr>').appendTo('table#fileData tbody');
    debugger
  }
});





        }//ends if badfilename
        // console.log('file: %s, %d bytes', p, s.size);
      })
      .on('error', function(err) {
        console.error(err);
      })
      .on('done', function() {
        console.log(window.fileData);
      })
    .walk();

    ipc.send('requestForTestFn', requestData);
  },
   assignDataPath = function(e) {
    //due to security reasons the value of a file input can not be set, so we will assign a data-path attribute and the code will use that
    $("#uploadTarget").data("path", e.target.files[0].path)
  };
ipc.on('responseFromTestFn', function(responseArgument){
  console.log(responseArgument.output.data);
  $("#outputWindow").html(responseArgument.output.data);
});