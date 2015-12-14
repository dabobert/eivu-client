'use strict';
var  $ = require('jQuery');

class UI {

  static addRow(data) {
    $('<tr id="' + data.md5 + '"><td class="filename">' + data.filename.substring(0,50) + '</td><td class="size">' + data.size + '</td><td class="md5">' + data.md5 + '</td><td id="status_' + data.md5 + '" class="status">Queued</td></tr>').appendTo('table#fileData tbody');
  }

  static mark(md5,state) {
    document.getElementById(md5).setAttribute('class', state.toLowerCase());
    document.getElementById(md5).querySelectorAll('td.status')[0].innerHTML = state;
  }

  static fetchSettings() {
    return {
      bucket_id: $("#bucket").val(),
      bucket_name: $("#bucket option:selected").html(),
      baseUrl: ($("input[name=env]:checked").val() == "development" ? "http://localhost:3001" : '//eivuapp.heroku.com'),
      token: "yNKoyn41T912g81XefGPatSM"
    }
  };

}