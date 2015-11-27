
var ipc  = require('ipc'),
    data = [],
     $   = require('jQuery'),
    md5File  = require('md5-file'),
    filewalker = require('filewalker'),
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
      .on('file', function(filename, s) {
        if (badFilenames.indexOf(filename) == -1) {
          fullPath = initialDir + '/' + filename;
          md5  = md5File(fullPath);
          console.log(fullPath);
          console.log(md5);
          fileData.push({ fullPath: fullPath, md5: md5, filename: filewalker})
          $('<tr><td>' + filename + '</td><td>' + md5 + '</td><td>Queued</td></tr>').appendTo('table#fileData tbody');
        }
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