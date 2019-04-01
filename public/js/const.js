"use strict";

var moves = {
    NE: 0,
    SE: 1,
    S: 2,
    SW: 3,
    NW: 4,
    N: 5
};

var constants = {
    radius: 50
};

constants.mapDimensions = {
    rows: 8,
    cols: 20
};

constants.framesPerSecond = {
    thirty: 1000 / 30,
    sixty: 1000 / 60
};