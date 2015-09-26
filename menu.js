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
