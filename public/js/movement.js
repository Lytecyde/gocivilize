"use strict";

var move = {};

var selectUnit = function () {
    //get mouse coordinates 
    //get hex at that coordinate
    //check if there is a unit
    var location = {
        column: 0,
        row: 0
    };
    return location;
};

move.unitToAdjacentHex = function () {
    //selectUnit
    var location = selectUnit();
    if (fitsOnMap(location)) {
            
    }
};
