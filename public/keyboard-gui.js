console.log('Loading keyboard-gui script...');
//alert('Loading keyboard-gui script...');
(function() {

    // Optimization for Repeat Views
    if( sessionStorage.criticalFoftFontsLoaded ) {
        console.log("fonts are already loaded");
        return;
    }

    var guiWebFont = new FontFaceObserver('Fira Sans');

    Promise.all([guiWebFont.load()]).then(function () {
        console.log("fonts are loaded");
        // Optimization for Repeat Views
        sessionStorage.criticalFoftFontsLoaded = true;
    });
})();


window.kbAbcLow = true;
window.kbAbcHigh = false;
window.kbNum = false;
window.kbChar = false;
var old_timestamp = null;

function toggleKb(kb){
    if(window.kbAbcLow == kb){
        var navkbSwitch = document.getElementById("navkbSwitch");
        navkbSwitch.components['gui-button'].setText('123');
        // navkbSwitch.components['gui-interactable'].setClickAction('switchKbToNum');
        switchKbToAbcLow();
    }else if(window.kbAbcHigh == kb){
        var navkbSwitch = document.getElementById("navkbSwitch");
        navkbSwitch.components['gui-button'].setText('123');
        // navkbSwitch.components['gui-interactable'].setClickAction('switchKbToNum');
        switchKbToAbcHigh();
    }else if(window.kbNum == kb){
        var navkbSwitch = document.getElementById("navkbSwitch");
        navkbSwitch.components['gui-button'].setText('Abc');
        // navkbSwitch.components['gui-interactable'].setClickAction('switchKbToAbcLow');
        switchKbToNum();
    }else if(window.kbChar == kb){
        var navkbSwitch = document.getElementById("navkbSwitch");
        navkbSwitch.components['gui-button'].setText('Abc');
        // navkbSwitch.components['gui-interactable'].setClickAction('switchKbToAbcLow');
        switchKbToChar();
    }
}

function switchKbToNum() {
    var keyboardAbcLow = document.getElementById("keyboardAbcLow");
    var keyboardAbcHigh = document.getElementById("keyboardAbcHigh");
    var keyboardNum = document.getElementById("keyboardNum");
    var keyboardChar = document.getElementById("keyboardChar");
    console.log(" - switchKbToNum");
    keyboardAbcLow.setAttribute('position','0 -10 -1');
    keyboardAbcHigh.setAttribute('position','0 -10 -1');
    keyboardChar.setAttribute('position','0 -10 -1');
    keyboardNum.setAttribute('position','0 0 0');

    keyboardAbcLow.setAttribute('visible',false);
    keyboardAbcHigh.setAttribute('visible',false);
    keyboardChar.setAttribute('visible',false);
    keyboardNum.setAttribute('visible',true);
}
function switchKbToChar() {
    var keyboardAbcLow = document.getElementById("keyboardAbcLow");
    var keyboardAbcHigh = document.getElementById("keyboardAbcHigh");
    var keyboardNum = document.getElementById("keyboardNum");
    var keyboardChar = document.getElementById("keyboardChar");
    console.log(" - switchKbToChar");
    keyboardAbcLow.setAttribute('position','0 -10 -1');
    keyboardAbcHigh.setAttribute('position','0 -10 -1');
    keyboardNum.setAttribute('position','0 -10 -1');
    keyboardChar.setAttribute('position','0 0 0');

    keyboardAbcLow.setAttribute('visible',false);
    keyboardAbcHigh.setAttribute('visible',false);
    keyboardNum.setAttribute('visible',false);
    keyboardChar.setAttribute('visible',true);
}
function switchKbToAbcHigh() {
    var keyboardAbcLow = document.getElementById("keyboardAbcLow");
    var keyboardAbcHigh = document.getElementById("keyboardAbcHigh");
    var keyboardNum = document.getElementById("keyboardNum");
    var keyboardChar = document.getElementById("keyboardChar");
    console.log(" - switchKbToAbcHigh");
    keyboardAbcLow.setAttribute('position','0 -10 -1');
    keyboardNum.setAttribute('position','0 -10 -1');
    keyboardChar.setAttribute('position','0 -10 -1');
    keyboardAbcHigh.setAttribute('position','0 0 0');

    keyboardAbcLow.setAttribute('visible',false);
    keyboardNum.setAttribute('visible',false);
    keyboardChar.setAttribute('visible',false);
    keyboardAbcHigh.setAttribute('visible',true);
}
function switchKbToAbcLow() {
    var keyboardAbcLow = document.getElementById("keyboardAbcLow");
    var keyboardAbcHigh = document.getElementById("keyboardAbcHigh");
    var keyboardNum = document.getElementById("keyboardNum");
    var keyboardChar = document.getElementById("keyboardChar");
    console.log(" - switchKbToAbcLow");
    keyboardAbcHigh.setAttribute('position','0 -10 -1');
    keyboardNum.setAttribute('position','0 -10 -1');
    keyboardChar.setAttribute('position','0 -10 -1');
    keyboardAbcLow.setAttribute('position','0 0 0');

    keyboardNum.setAttribute('visible',false);
    keyboardChar.setAttribute('visible',false);
    keyboardAbcHigh.setAttribute('visible',false);
    keyboardAbcLow.setAttribute('visible',true);
}
