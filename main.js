'use strict';

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var ipc = require('electron').ipcMain;
var globalShortcut = require('electron').globalShortcut;

var mainWindow = null;

app.on('ready', function() {
    var mainWindow = new BrowserWindow({
        height: 700,
        width: 368,
        frame:false,
        resizable:false,
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

    globalShortcut.register('ctrl+shift+1', () => {
        mainWindow.webContents.send('globalShortcut', 1);
    });
    
});

ipc.on('close-main-window', () => {
    app.quit();
});