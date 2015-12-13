
var ipc  = require('ipc'),
    fs   = require('fs'),
    async= require("async"),
    hash = require('md5-promised'),
     $   = require('jQuery'),
    allFilesInfo = [];
    


var traverseQueue = async.queue(function(singleFileInfo, callback) {
  /* 
    Using a promise md5 function to grab the md5.  This prevents the app from seizing (preventing user input) without using setTimeout 0 and means we don't 
    means we don't have to dive into callback hell
  */
  hash(singleFileInfo.fullPath).then(function(md5) {
    var data, filename = CloudFile.toFilename(singleFileInfo.fullPath);
    data = { fullPath: singleFileInfo.fullPath, md5: md5, filename: filename, size: singleFileInfo.fileStats.size }
    //add the current file to the files table
    Painter.addRow(data);
    //add currnet file to global array of all files that are traversed.  this array will be used to upload data
    allFilesInfo.push( data );
    //tell the queue we have finished with this row, and perform "cleanup" tasks
    callback(null, data);
  }).fail(function(err) {
    console.log('Could not hash', err, err.stack);
  });
}, 3); //Only allow 20 copy requests at a time


// assign a callback
traverseQueue.drain = function() {
  $('div#alertBox').html("done");
  console.log(allFilesInfo.length)
  async.each(allFilesInfo, function(singleFileInfo, callback) {

  //add file to upload queue
  uploadQueue.push(singleFileInfo,function(error, data){
    //in current implementation callback is triggered too early, ie before md5file callback is done
    //ie we are failing a race condition
    console.log("in post upload callback")
    if (error) return console.log(error);
    console.log(`not sure what to do here: ${singleFileInfo.filename}`)
    // console.log(data.filename + " ==> " + data.md5)
  });



    callback();
  }, function(err){
      // if any of the file processing produced an error, err would equal that error
      if( err ) {
        // One of the iterations produced an error.
        // All processing will now stop.
        console.log('A file failed to process');
      } else {
        console.log('All files have been processed successfully');
      }
  });



};


var uploadQueue = async.queue(function(singleFileInfo, callback) {
  // var jqxhr = $.ajax( "example.php" )
  // $.ajax({
  //     url: Config.baseUrl+"/ajax/favourites/set-favourite.ajax",
  //     dataType: "json",
  //     data: attrs,
  //     type: "POST",
  //     beforeSend: function(){
  //       console.log(`${singleFileInfo.md5}: ajax beforeSend`);
  //       Painter.mark(singleFileInfo.md5, "Uploading");
  //     };
  //   })
  // .done(function() {
  //   console.log(`${singleFileInfo.md5}: ajax done`);
    //using setTimeout 0 to queue the events after
    setTimeout(function(){
      remotePath = `${CloudFile.remoteFolder(singleFileInfo.md5)}${singleFileInfo.filename}`;
      CloudFile.upload(singleFileInfo.fullPath,remotePath,function(){
        //touch the eivu server endpoint to create a cloudfile within the db
        // $.ajax({
        //     url: Config.baseUrl+"/ajax/favourites/set-favourite.ajax",
        //     dataType: "json",
        //     data: attrs,
        //     type: "POST",
        //     beforeSend: function(){
        //       console.log(`${singleFileInfo.md5}: upload complete beforeSend`);
        //       Painter.mark(singleFileInfo.md5, "Uploaded");
        //     };
        //   })
        // .done(function() {
        //   console.log(`${singleFileInfo.md5}: upload complete done`);
        // })    
        // .fail(function() {
        //   Painter.mark(singleFileInfo.md5, "Complete");
        // })    
        // .always(function() {
        //   alert("complete");
        // })
Painter.mark(singleFileInfo.md5, "Uploaded");
        console.log(`uploaded ${singleFileInfo.filename}`
      )});//ends CloudFile upload callback
    }, 0); //end setTimeout
  // })    
  // .fail(function() {
  //   Painter.mark(singleFileInfo.md5, "Failed");
  // })    
  // .always(function() {
  //   alert("complete");
  // })







  //$.post send request for upload to the server

  //.onComplete add the file to the queue
    //update the 



}, 10); //number of simulatenous things in queue, end queue




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
      traverseQueue.push({fullPath: fullPath, fileStats: fileStats },function(error, data){
        //in current implementation callback is triggered too early, ie before md5file callback is done
        //ie we are failing a race condition
        console.log("in post traverse callback")
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