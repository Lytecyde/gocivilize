/*jslint
    browser: true
*/
/*global game,hex*/

var move = {
    coordinates: {
        x: 0,
        y: 0
    },
    location: {
        column: 0,
        row: 0
    },
    nextLocation: {
        column: 0,
        row: 0
    },
    ongoing: false
};

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

move.fitsOnMap = function (location) {
    function isWithinVisibleLimits(location, game) {
        var isPositiveColumn = location.column >= 0;
        var isUnderMaximumColumn = location.column < game.COLS;
        var isPositiveRow = location.row >= 0;
        var isUnderMaximumRow = location.row < game.ROWS;
        var isColumnWithinLimits = isPositiveColumn && isUnderMaximumColumn;
        var isRowWithinLimits = isPositiveRow && isUnderMaximumRow;
        return isColumnWithinLimits && isRowWithinLimits;
    }

    if (isWithinVisibleLimits(location, game)) {
        return true;
    }
    return false;
};

move.unit = function (location, nextLocation) {
    if (game.unitsMap[location.column][location.row] === "*") {
        move.removeUnit(location);
        move.placeUnit(nextLocation);
    }
};

move.removeUnit = function (location) {
    game.unitsMap[location.column][location.row] = "";

};

move.placeUnit = function (nextLocation) {
    game.unitsMap[nextLocation.row][nextLocation.column] = "*";
};

move.unitToAdjacentHex = function () {
    //selectUnit
    var location = selectUnit();
    var nextLocation = null;
    if (move.fitsOnMap(location)) {
        move.unit(location, nextLocation);
    }
};

document.getElementById("unitFilm").onclick = function fun()
{
    var e = window.event;
    var x = e.pageX;
    var y = e.pageY;
    if (!move.ongoing ) {
        move.location = hex.getSelectedTile(x, y);
        console.log("location and tile selected   c" +
        move.location.column + "r" + move.location.row);
        move.ongoing = true;
    } else {
        move.nextLocation = hex.getSelectedTile(x, y);
        console.log("next location and tile selected" +
        move.nextLocation.column + "r" + move.nextLocation.row);
        //&& game.unitsMap[move.location.column][move.location.row] === "*"
        move.unit(move.location, move.nextLocation);
        move.ongoing = false;
    }
    //update unitFilm
    var unitFilm = document.getElementById("unitFilm");
    const context = unitFilm.getContext("2d");
    context.clearRect(0, 0, 1800, 800);
    game.replaceUnits(context);
};