/*global console,document,HexagonGrid,civilization,loop,state*/
'use strict';

var endings = {
    worldCatastrophy: false,
    victory: false,
    exit: false,
    isTimeUp: false
};

var loop = {};

loop.cycle = function () {
    loop.update();
    loop.render();
};

function addEpoch() {
    var epochLength = 1;
    state.year += epochLength;
}

loop.update = function () {
    //addEpoch();
    //more functionality to come
};

loop.render = function () {
    //console.log("Rendering the loops");
};

loop.clickExit = function () {
    endings.exit = true;
    console.log("Archeologists have uncovered the signs of a lost civilization...");
};

loop.clickNext = function () {
    addEpoch();
    var id = document.getElementById("year");
    id.innerHTML = state.year;
};