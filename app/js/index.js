'use strict';

var ipc = require('electron').ipcRenderer;
var menu = require('electron').remote.Menu;
var tray = require('electron').remote.Tray;
var path = require('path');

var closeEl = document.querySelector('.close');
var settingsEl = document.querySelector('.settings');
var trayIcon = null;

if (process.platform === 'darwin') {
    trayIcon = new tray(path.join(__dirname, 'img/tray-iconTemplate.png'));
}
else {
    trayIcon = new tray(path.join(__dirname, 'img/tray-icon-alt.png'));
}

var trayMenuTemplate = [
    {
        label: 'Sound machine',
        enabled: false
    },
    {
        label: 'Settings',
        click: function () {
            ipc.send('open-settings-window');
        }
    },
    {
        label: 'Quit',
        click: function () {
            ipc.send('close-main-window');
        }
    }
];

var trayMenu = menu.buildFromTemplate(trayMenuTemplate);
trayIcon.setContextMenu(trayMenu);

closeEl.addEventListener('click', function () {
    ipc.send('close-main-window');
});

settingsEl.addEventListener('click', function () {
    ipc.send('open-settings-window');
});

var soundButtons = document.querySelectorAll('.button-sound');

for (var i = 0; i < soundButtons.length; i++) {
    var soundButton = soundButtons[i];
    var soundName = soundButton.attributes['data-sound'].value;

    prepareButton(soundButton, soundName);
}

function prepareButton(buttonEl, soundName) {
    buttonEl.querySelector('span').style.backgroundImage = 'url("img/icons/' + soundName + '.png")';

    var audio = new Audio(__dirname + '/wav/' + soundName + '.wav');
    buttonEl.addEventListener('click', function () {
        audio.currentTime = 0;
        audio.play();
    });
}

ipc.on('globalShortcut', function (event, arg) {
    var click = new MouseEvent('click');
    console.log(arg);
    soundButtons[arg].dispatchEvent(click);
});


ipc.on('close-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.close();
    }
});


