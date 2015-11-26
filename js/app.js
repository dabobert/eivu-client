var ipc = require('ipc'),
     $  = require('jQuery'),
  testUpload = function() {
    var requestData = { canvas: "black" };
    // debugger;
    ipc.send('requestForTestFn', requestData);
  },
   selectFolder = function(e) {
    var theFiles = e.target.files;
    var relativePath = theFiles[0].webkitRelativePath;
    var folder = relativePath.split("/");
    debugger;
    alert(folder[0]);
  };
ipc.on('responseFromTestFn', function(responseArgument){
  console.log(responseArgument.output.data);
  $("#outputWindow").html(responseArgument.output.data);
});