'use strict';
var AWS  = require('aws-sdk'),
    mp4  = require('mp4-parser'),
    mime = require('mime'),
    hash = require('md5-promised'),
    path = require('path'),
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


  static readMediaInfo(fileInfo, callback) {
    if (fileInfo.mime == "application/eivu")
      CloudFile.createDummyEivuData(fileInfo.fullPath, callback);
    else if (fileInfo.mime == "video/mp4")
      CloudFile.readMp4Tags(fileInfo.fullPath, callback);
    else
      callback({})
  }


  static createDummyEivuData(fileInfo, callback) {
    info = {}
    info.duration  = Math.ceil(Math.random() * 2700)
    info.metadata  = []
    info.metadata.performer = faker.name.findName();
    info.metadata.album     = faker.commerce.productName();
    callback(info);
  }


  static readMp4Tags(path, callback) {
    var stream = require('fs').createReadStream(path),
    parser = stream.pipe(new mp4());
    stream.info = {};

    parser.on('data', function(tag){
      stream.info[tag.type] = tag.value
      console.log(`${tag.type} => ${tag.value}`)  // => 'aART'
    })

    parser.on('finish', function () {
      var extended_info = {
        duration: stream.info.duration,
        title: stream.info["\uFFFDnam"],
        metadata: {
          artist: [],
          tags: []
        }
      }

      var translation_hash = { title: "\uFFFDnam", show: "tvsh", network: "tvnn", episode_id: "tven" };
      var translation_hash_multi = { artist: "\uFFFDART", tags: "desc" };

      $.each(translation_hash, function( new_key, orig_key ) {
        if (stream.info[orig_key]) {
          extended_info.metadata[new_key] = stream.info[orig_key];
        }
      });

      //add multi values if they exist
      $.each(translation_hash_multi, function( new_key, orig_key ) {
        if (stream.info[orig_key]) {
          //removes spaces around commas, and splits result into an array
          extended_info.metadata[new_key] = extended_info.metadata[new_key].concat(stream.info[orig_key].toLowerCase().match( /(?=\S)[^,]+?(?=\s*(,|$))/g ))
        }
      });

      //add all artists to tags
      extended_info.metadata.tags = extended_info.metadata.tags.concat(extended_info.metadata.artist)
      //only keep unique values
      extended_info.metadata.tags = extended_info.metadata.tags.filter(function(itm,i,a){
        return i==a.indexOf(itm);
      });

      //move tags out of metadata. we want both DRY code (ie to use translation_hash_multi) and tags at the root
      extended_info.tags = extended_info.metadata.tags;
      delete extended_info.metadata.tags

      callback(extended_info)
    });
  }


  static playable(fullPath) {
    var format = CloudFile.detectMime(fullPath);
    return CloudFile.playableFormats().indexOf(format) != -1
  }


  static playableFormats() {
    return ['video/mp4', 'audio/mp3', 'video/x-flv', 'application/eivu']
  }


  static detectMime(fullPath) {
    if (path.extname(fullPath) == ".eivu")
      return "application/eivu";

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


  static upload(fullPath, remotePath, settings, callback) {

    if (!fullPath) throw 'fullPath is undefined';
    if (!remotePath) throw 'remotePath is undefined';
    if (!settings) throw 'settings is undefined';

    //check to makre sure the md5 doens't exist, if it does exist exist
    var accessKeyId     = process.env.EIVU_AWS_ACCESS_KEY_ID;
    var secretAccessKey = process.env.EIVU_AWS_SECRET_ACCESS_KEY;
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
        Bucket: settings.bucket_name,
        Key: remotePath,
        Body: fileStream
      }, function (err) {
        if (err) {
          throw err;
        } else {
          console.log(`uploaded ${fullPath} to ${remotePath}`)
          //run the callback if one is defined
          if (callback) callback();
        }
      });
    });
  }

}
