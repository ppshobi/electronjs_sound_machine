'use strict';

var ipc = require('electron').ipcRenderer;
var config = require('../configuration');

var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function (e) {
    ipc.send('close-settings-window');
});


var modifierCheckboxes = document.querySelectorAll('.global-shortcut');

for (var i = 0; i < modifierCheckboxes.length; i++) {
    var shortcutKeys = config.readSettings('shortcutKeys');
    var modifierKey = modifierCheckboxes[i].attributes['data-modifier-key'].value;
    modifierCheckboxes[i].checked = shortcutKeys.indexOf(modifierKey) !== -1;

    modifierCheckboxes[i].addEventListener('click', function (e) {
        bindModifierCheckboxes(e);
    });
}

function bindModifierCheckboxes(e) {
    var shortcutKeys = config.readSettings('shortcutKeys');
    var modifierKey = e.target.attributes['data-modifier-key'].value;

    if (shortcutKeys.indexOf(modifierKey) !== -1) {
        var shortcutKeyIndex = shortcutKeys.indexOf(modifierKey);
        shortcutKeys.splice(shortcutKeyIndex, 1);
    }
    else {
        shortcutKeys.push(modifierKey);
    }

    config.saveSettings('shortcutKeys', shortcutKeys);
    ipc.send('set-global-shortcuts');
}