/*jslint
    browser: true
*/
/*global console,document,HexagonGrid,civilization,loop,state,game*/
//'use strict';

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

loop.update = function () {
    //update the map with a new unitsmap
    //movement 
};

loop.render = function () {
    //game.placeUnits();
};

//TODO: move to game engine
function addEpoch() {
    var epochLength = 1;
    state.year += epochLength;
}

loop.clickExit = function () {
    loop.endSequence();
};

loop.endSequence = function () {
    endings.exit = true;
    var id = document.getElementById("next");
    if (id) {
        id.remove();
    }
    console.log("Archeologists have uncovered " +
        "the signs of a lost civilization...");
};

loop.clickNext = function () {
    addEpoch();
    var id = document.getElementById("year");
    id.innerHTML = state.year;
};