'use strict';
var AWS  = require('aws-sdk'),
    mime = require('mime'),
    hash = require('md5-promised'),
     fs  = require('fs');

class CloudFile {

  constructor(data) {
    this.accessKeyId     = process.env.EIVU_AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.EIVU_AWS_SECRET_ACCESS_KEY;

    if (data.md5) {
      this.md5 = data.md5;
    }

    if (data.fullPath) {
      this.localFilename = data.fullPath;
    }

    if (data.bucketName) {
      this.bucketName = data.bucketName;
    }
      // var folder,
      // bucket,
      // user,
      // name ,
      // asset ,
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

  url() {
    return 'http://www.google.com'
  }


  remotePath() {
   return `${CloudFile.remoteFolder(this.md5)}${this.filename}`
  }

  static playable(fullPath) {
    var format = CloudFile.detectMime(fullPath);
    return CloudFile.playableFormats().indexOf(format) != -1
  }

  static playableFormats() {
    return ['video/mp4', 'audio/mp3', 'video/x-flv']
  }

  static detectMime(fullPath) {
    var format = mime.lookup(fullPath);
    switch (format) {
      case 'application/mp4':
        format = 'video/mp4';
        break;
      // case 'video/x-flv':
      //   format = 'video/x-flv';
      //   break;
      case 'audio/mpeg3':
      case 'audio/x-mpeg-3':
      // case 'video/mpeg':
      case 'video/x-mpeg':
      case 'audio/mpeg':
        format = 'audio/mp3';
        break;
      default:
        format; //use original value
    }
    return format;
  }

  static online() { //#bool
    return true;
  }

  static toFilename(fullPath) {
    return fullPath.split('/').reverse()[0];
  }


   static remoteFolder(md5) {
    return md5.replace(/(\S{2})/g,"$1/");
  }


  delete_remote() {
    return false;
  }


  static test(remote) {
    var fullPath = '/Users/jinx/Dropbox/eBooks/Electron/electron-quick-start-master.zip'

    hash(fullPath).then(function(md5) {
      var filename = CloudFile.toFilename(fullPath);
      remote = `${md5.replace(/(\S{2})/g,"$1/")}${filename}`
      CloudFile.upload('/Users/jinx/Dropbox/eBooks/Electron/electron-quick-start-master.zip', remote,function(){
        console.log("all done!!!")
        alert("bang")
      });
    }).fail(function(err) {
      console.log('Could not hash', err, err.stack);
    });
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
          console.log(`uploaded ${fullPath} to ${remotePath}`)
          //run the callback if one is defined
          // debugger
          if (callback) callback();
        }
      });
    });
  }

}
