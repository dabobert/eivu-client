'use strict';
var  $ = require('jQuery');

class Painter {

  static addRow(data) {
    $('<tr id="' + data.md5 + '"><td class="filename">' + data.filename.substring(0,50) + '</td><td class="size">' + data.size + '</td><td class="md5">' + data.md5 + '</td><td class="status">Queued</td></tr>').appendTo('table#fileData tbody');
  }

  static mark(md5,state) {
    console.log(`${md5}: ${state}`);
    //find the corresponding row
    // debugger
    $row = $(`table#fileData tr#${md5}`);
    //set the row's class to the proper state
    $row.attr('class', state.toLowerCase());
    //set the row's status column to the proper state
    $row.find(".status").html(state);
  }
}