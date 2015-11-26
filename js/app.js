var ipc = require('ipc'),
     $  = require('jQuery'),
  testUpload = function() {
    var requestData = { canvas: "black" };
    debugger;
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