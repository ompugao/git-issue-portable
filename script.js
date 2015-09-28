var $ = require('jquery');
window.$ = window.jQuery = $;
require('bootstrap');


remote = require('remote');
function openGitRepository() {
    remote.require('dialog').showOpenDialog(remote.getCurrentWindow(), { 'properties': ['openDirectory'] },
            function(dir) {
                if(dir && dir[0]) {
                    console.log(dir[0])
                }
            });
}

