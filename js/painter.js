'use strict';
var  $ = require('jQuery');

class Painter {

  static addRow(data) {
    $('<tr id="' + data.md5 + '"><td class="filename">' + data.filename.substring(0,50) + '</td><td class="size">' + data.size + '</td><td class="md5">' + data.md5 + '</td><td class="status">Queued</td></tr>').appendTo('table#fileData tbody');
  }
}