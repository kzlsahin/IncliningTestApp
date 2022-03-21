"use strict";

let fileReaded;



let IdleClickhandler = {

    menulistContainers: [],

    registerSelf(elem) {
        IdleClickhandler.menulistContainers.push(elem.id);
    },

    documentClicked(event) {
        IdleClickhandler.checkDropdownNodes(event);
    },

    checkDropdownNodes(event) {
        
        for (let id of IdleClickhandler.menulistContainers) {
            if (!event.target.closest("#" + id.trim())) {
                document.getElementById(id).removeAttribute('open');
            }
        }
    }

};

function registerMenuDropdowns() {
    let elems = document.getElementsByClassName("dropdown");
    for (let elem of elems) {
        IdleClickhandler.registerSelf(elem);

    }
    window.removeEventListener('click', registerMenuDropdowns);
}

document.addEventListener('click', IdleClickhandler.documentClicked);
window.addEventListener('click', registerMenuDropdowns);
window.addEventListener('load', () => { updateTimestamp(); setInterval(updateTimestamp, 5000);  console.log('time start'); });
window.addEventListener('visibilitychange', visibilitychanged);

document.addEventListener("DOMContentLoaded", function() {
    // your marvelous code here
    checkSessionStorage();
    console.log("ready");
  });

////FİLE I/O////
document.getElementById('filePicker').addEventListener('change', uploadSavedProject);
/////

function refreshApp(){
    refreshState();
}

function visibilitychanged (){

    if(document.visibilityState == 'hidden') updateDataBuffer();
}

function getFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    else {
        document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    }
}

function updateTimestamp() {
    let txt = Date('timestamp');
    document.getElementById("timestamp").innerText = txt;
}

/*
let IDLE_TIMEOUT = 60; //seconds
let _idleSecondsTimer = null;
let _idleSecondsCounter = 0;

document.onclick = function() {
    _idleSecondsCounter = 0;
};

document.onmousemove = function() {
    _idleSecondsCounter = 0;
};

document.onkeypress = function() {
    _idleSecondsCounter = 0;
};


_idleSecondsTimer = window.setInterval(CheckIdleTime, 1000);

function CheckIdleTime() {
     _idleSecondsCounter++;

    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
        
        window.clearInterval(_idleSecondsTimer);
        
        loadDataFromJSON(localStorage.getItem('lastDataState') );
    } else {
        updateDataBuffer();
        console.log(_idleSecondsCounter);
    }
}

*/


