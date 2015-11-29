'use strict';
var AWS = require('aws-sdk'),
     fs = require('fs');

class CloudFile {

  constructor() {
    this.accessKeyId     = process.env.EIVU_AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.EIVU_AWS_SECRET_ACCESS_KEY;
      // var folder,
      // bucket,
      // user,
      // name ,
      // asset ,
      // md5 ,
      // contentType ,
      // filesize  ,
      // description ,
      // rating ,
      // nsfw  ,
      // adult ,
      // folderId ,
      // infoUrl ,
      // bucketId;
  }

  static online() { //#bool
    return true;
  }

  static toFilename(fullPath) {
    return fullPath.split('/').reverse()[0];
  }

  url() {
    return 'http://www.google.com'
  }


  delete_remote() {
    return false;
  }

  static test(remote) {
    var fullPath = '/Users/jinx/Dropbox/eBooks/Electron/electron-quick-start-master.zip'

    md5File(fullPath, function (error, md5) {
      if (error) return console.log(error);

      var filename = CloudFile.toFilename(fullPath);

      remote = `${md5.replace(/(\S{2})/g,"$1/")}${filename}`

      CloudFile.upload('/Users/jinx/Dropbox/eBooks/Electron/electron-quick-start-master.zip', remote,function(){
        console.log("all done!!!")
        alert("bang")
      });
    });//end md5File
  }

  static upload(fullPath,remotePath,callback) {

    if (!fullPath) throw 'fullPath is undefined';
    if (!remotePath) throw 'remotePath is undefined';

    //check to makre sure the md5 doens't exist, if it does exist exist
    var accessKeyId     = process.env.EIVU_AWS_ACCESS_KEY_ID;
    var secretAccessKey = process.env.EIVU_AWS_SECRET_ACCESS_KEY;
    var bucketName      = 'eivutest';
    var fileStream      = fs.createReadStream(fullPath);
/*
    if (!remotePath) {
      remotePath = CloudFile.toFilename(fullPath)
    }

    remotePath = `${(new Date).getTime()}-${remotePath}`;
*/
    // For dev purposes only
    AWS.config.update({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });

    // Read in the file, convert it to base64, store to S3
    fileStream.on('error', function (err) {
      if (err) { throw err; }
    });

    fileStream.on('open', function () {
      var s3 = new AWS.S3();
      s3.putObject({
        Bucket: bucketName,
        Key: remotePath,
        Body: fileStream
      }, function (err) {
        if (err) {
          throw err;
        } else {
          console.log(`uploaded to ${remotePath}`)
          //run the callback if one is defined
          if (callback) callback();
        }
      });
    });
  }

}
