'use strict';

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var ipc = require('electron').ipcMain;

var mainWindow = null;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 700,
        width: 368,
        frame:false,
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    
});

ipc.on('close-main-window', () => {
    app.quit();
});