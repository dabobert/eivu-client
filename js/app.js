var ipc = require('ipc'),
     $  = require('jQuery'),
  testUpload = function() {
    var requestData = { canvas: "black" };
    // debugger;
    ipc.send('requestForTestFn', requestData);
  };

ipc.on('responseFromTestFn', function(responseArgument){
  console.log(responseArgument.output.data);
  $("#outputWindow").html(responseArgument.output.data);
});