'use strict';

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var ipc = require('electron').ipcMain;
var globalShortcut = require('electron').globalShortcut;

var mainWindow = null;
var settingsWindow = null;
var config = require('./configuration');

app.on('ready', function() {

    if (!config.readSettings('shortcutKeys')) {
        config.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    mainWindow = new BrowserWindow({
        height: 700,
        width: 368,
        frame:false,
        resizable:false,
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    setGlobalShortcuts();
    
});

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();

    var shortcutKeysSetting = config.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

    globalShortcut.register(shortcutPrefix + '0', function () {
        mainWindow.webContents.send('globalShortcut', 0);
    });
    globalShortcut.register(shortcutPrefix + '1', function () {
        mainWindow.webContents.send('globalShortcut', 1);
    });
}



ipc.on('open-settings-window', function () {
    if (settingsWindow) {
        return;
    }
    
    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200
    });
    
    settingsWindow.loadURL('file://' + __dirname + '/app/settings.html');
    
    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});


ipc.on('close-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.close();
    }
});

ipc.on('close-main-window', () => {
    app.quit();
});

ipc.on('set-global-shortcuts', function () {
    setGlobalShortcuts();
});
