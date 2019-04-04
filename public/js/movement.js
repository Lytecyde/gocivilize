/*jslint
    browser: true
*/
/*global game,hex,HexagonGrid*/

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
    ongoing: {
        selectorClick: false,
        targetClick: false
    }
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
    move.removeUnit(location);
    move.placeUnit(nextLocation);
};

move.removeUnit = function (location) {
    game.unitsMap[location.column][location.row] = "";

};

move.placeUnit = function (nextLocation) {
    game.unitsMap[nextLocation.column][nextLocation.row] = "*";
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
    var x = e.pageX ;
    var y = e.pageY ;
    move.location = hex.getSelectedTile(x -50, y -100);
    if (
        !move.ongoing.selectorClick
        && game.unitsMap[move.location.column][move.location.row] === "*"
        ) {
        console.log("location and tile selected   c" +
        move.location.column + "r" + move.location.row);
        move.ongoing.selectorClick = true;
        move.ongoing.targetClick = true;
    }
    else {
        if (move.ongoing.targetClick) {
            move.nextLocation = hex.getSelectedTile(x, y);
            move.nextLocation.column -= 1;
            move.nextLocation.row -= move.nextLocation.column%2 + 1;
            console.log("next location and tile selected" +
            move.nextLocation.column + "r" + move.nextLocation.row);
            move.unit(move.location, move.nextLocation);
            //repaint units onto unitfilm
            var unitFilm = document.getElementById("unitFilm");
            const context = unitFilm.getContext("2d");
            context.clearRect(0, 0, 1800, 800);
            //game.replaceUnits(context);
            var col = move.nextLocation.column;
            var row = move.nextLocation.row;
            var unitLayer = new HexagonGrid("unitFilm", 50, null);
            unitLayer.drawHexAtColRow(col, row, "", "*");
            move.ongoing.selectorClick = false;
            move.ongoing.targetClick = false;
        }
    }
};