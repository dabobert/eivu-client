'use strict';
var  $ = require('jQuery');

class Painter {

  static addRow(data) {
    $('<tr id="' + data.md5 + '"><td class="filename">' + data.filename.substring(0,50) + '</td><td class="size">' + data.size + '</td><td class="md5">' + data.md5 + '</td><td id="status_' + data.md5 + '" class="status">Queued</td></tr>').appendTo('table#fileData tbody');
  }

  static mark(md5,state) {
    document.getElementById(md5).setAttribute('class', state.toLowerCase());
    document.getElementById(md5).querySelectorAll('td.status')[0].innerHTML = state;
  }
}