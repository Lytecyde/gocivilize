var moves = {
    NE: 0,
    SE: 1,
    S: 2,
    SW: 3,
    NW: 4,
    N: 5
};

function move(location, direction) {
    removeUnit(location);
    var newLocation = getNewLocation(location, direction);
    drawUnit(newLocation);
};

function removeUnit(location) {

};

function getNewLocation(location) {

};