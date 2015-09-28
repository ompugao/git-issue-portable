module.exports = {
    template: function(app,mainWindow){
        var menu_template = [
        {
            label: 'Quit',
            submenu: [
            {
                label: 'Quit App',
                accelerator: 'Ctrl+Q',
                click: function() {
                    app.quit();
                }
            }
            ]
        },
        {
            label: 'Repository',
            submenu: [
            {
                label: 'Choose Git Repository',
                accelerator: 'Ctrl+o',
                click: function() {
                    return require('dialog').showOpenDialog(mainWindow, { 'properties': ['openDirectory'] },
                        function(dir) {
                            if(dir && dir[0]) {
                                console.log(dir[0])
                            }
                        });
                }
            }
            ]
        },
        {
            label: 'View',
            submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'Alt+I',
                click: function() {
                    //BrowserWindow.getFocusedWindow().toggleDevTools();
                    mainWindow.toggleDevTools();
                }
            }
            ]
        }];
        return menu_template
    },
}
