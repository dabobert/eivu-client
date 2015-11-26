function CloudFile() {
  this.name = null;
  this.asset = null;
  this.md5 = null;
  this.contentType = null;
  this.filesize  = null;
  this.description = null;
  this.rating = null;
  this.nsfw  = null;
  this.adult = null;
  this.folderId = null;
  this.infoUrl = null;
  this.bucketId = null;


  // class << self

  //   def online?(uri) #bool
  //   end

  //   def upload!(path_to_file, bucket, options={}) #cloudfile
  //   end

  //   def upload(path_to_file, bucket, options={}) #cloudfile - use transation if possible
  //   end
  // end

  // def visit #string - "open #{self.url}"
  // end

  // def url #string 
  // end

  // def filename #string
  // end

  // def path #string
  // end

  // def delete_remote
  // end
}

Class.upload = function(event, pathToFile) {

//check to makre sure the md5 doens't exist, if it does exist exist
  var accessKeyId     = process.env.EIVU_AWS_ACCESS_KEY_ID;
  var secretAccessKey = process.env.EIVU_AWS_SECRET_ACCESS_KEY;

  var AWS = require('aws-sdk'),
      fs = require('fs');
  var pathToFile = '/Users/jinx/Dropbox/eBooks/Electron/electron-quick-start-master.zip'
  var bucketName = 'eivutest';
  var filename   = 'electro-quick-start-master'+(new Date).getTime()+'.zip';

  // For dev purposes only
  AWS.config.update({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });

  // Read in the file, convert it to base64, store to S3
  var fileStream = fs.createReadStream(pathToFile);
  fileStream.on('error', function (err) {
    if (err) { throw err; }
  });

  fileStream.on('open', function () {
    var s3 = new AWS.S3();
    event.sender.send('responseFromTestFn', { output: { data: ("starting to upload" + filename) }});
    s3.putObject({
      Bucket: bucketName,
      Key: filename,
      Body: fileStream
    }, function (err) {
      if (err) {
        throw err;
      } else {
        console.log("done!")
        event.sender.send('responseFromTestFn', { output: { data: (filename + " uploaded!") }});
      }
    });
  });


}