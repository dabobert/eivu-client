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


  static upload(fullPath,remotePath) {

    //check to makre sure the md5 doens't exist, if it does exist exist
    var accessKeyId     = process.env.EIVU_AWS_ACCESS_KEY_ID;
    var secretAccessKey = process.env.EIVU_AWS_SECRET_ACCESS_KEY;
    var fullPath = '/Users/jinx/Dropbox/eBooks/Electron/electron-quick-start-master.zip'
    var bucketName = 'eivutest';
    var filename   = 'electro-quick-start-master'+(new Date).getTime()+'.zip';

    if (!remotePath) {
      remotePath = fullPath
    }

    // For dev purposes only
    AWS.config.update({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });

    // Read in the file, convert it to base64, store to S3
    var fileStream = fs.createReadStream(fullPath);
    fileStream.on('error', function (err) {
      if (err) { throw err; }
    });

    fileStream.on('open', function () {
      var s3 = new AWS.S3();
      s3.putObject({
        Bucket: bucketName,
        Key: filename,
        Body: fileStream
      }, function (err) {
        if (err) {
          throw err;
        } else {
          console.log('uploaded' + fullPath)
        }
      });
    });
  }

}
