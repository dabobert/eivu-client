'use strict';
var fs = require('fs');

class Folder {
	
	static badFilenames() {
		return ['.DS_Store'];
	}

	static traverse(currentPath, callback) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var currentFile = currentPath + '/' + files[i];
      var stats = fs.statSync(currentFile);
      if (stats.isFile()) {
        filename = CloudFile.toFilename(currentFile);
        // if (callback != null) {
        if (Folder.badFilenames().indexOf(filename) == -1) {
          callback(currentFile, stats);
        }
        // console.log(currentFile);
      } else if (stats.isDirectory()) {
        Folder.traverse(currentFile, callback);
      }
    }
  }
}