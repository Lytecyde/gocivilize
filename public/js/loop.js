/*jslint
    browser: true
*/
/*global console,document,HexagonGrid,civilization,loop,state,game,move,turn*/
//'use strict';

var endings = {
    worldCatastrophy: false,
    victory: false,
    exit: false,
    isTimeUp: false
};

var loop = {}; //from turn to turn and vic check to vic check

loop.cycle = function () {
    loop.update();
    loop.render();
};



loop.update = function () {
    //update the map with a new unitsmap
    var event = window.event;
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
    turn.run();
    addEpoch();
    var id = document.getElementById("year");
    id.innerHTML = state.year;
};