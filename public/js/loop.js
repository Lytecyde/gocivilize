'use strict';

var endings = {
    worldCatastrophy: false,
    victory: false,
    exit: false,
    isTimeUp: false
};

var loop = {};

var looping = function () {
    return loop;
};

loop.cycle = function () {
    while (endings.exit === false) {
        loop.update();
        loop.render();
    }
    console.log("Archeologists have uncovered the signs of a lost civilization...");
};

function addEpoch() {
    var epochLength = 1;
    var s = new statement();
    s.year += epochLength;
}

loop.update = function () {
    addEpoch();
};

loop.clickExit = function () {
    endings.exit = true;
};