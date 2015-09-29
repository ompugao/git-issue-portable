'use strict';
var $ = require('jquery');
window.$ = window.jQuery = $;
require('bootstrap');

var remote = require('remote');

function openGitRepository() {
  remote.require('dialog').showOpenDialog(remote.getCurrentWindow(), { 'properties': ['openDirectory'] },
      function(dir) {
        if(dir && dir[0]) {
          var n = new Notification('Open ' + dir[0]);
          n.onclick = function() {};
          console.log(dir[0])

          var message = 'Open ' + dir[0];
          var bootstrap_alert = function() {}
          bootstrap_alert.info = function(msg) {
            $('#notification_placeholder').html('<div class="alert alert-info alert-dismissible" role="alert"><a class="close" data-dismiss="alert" aria-label="Close">x</a><span aria-hidden="true">'+msg+'</span></div>');
          }
          bootstrap_alert.info(message);
          //$('#clickme').on('click', function() {
                      //bootstrap_alert.warning('Your text goes here');
          //});
        } else {
          var n = new Notification('Invalid Git Repo');
          n.onclick = function() {};
        }
      });
}

