/*jslint
    browser: true
*/
/*global window,game,hex,HexagonGrid*/

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
        selectorClicked: false,
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
    console.log("removing unit from location " +
        location.column +
        "  " +
        location.row);
    game.unitsMap[location.column][location.row] = "";
};

move.placeUnit = function (nextLocation) {
    /*console.log("placing unit from location " +
        nextLocation.column +
        "  " +
        nextLocation.row);
    */
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

move.showActiveUnit = function (column, row, unitLayer) {
    console.log("location and tile selected   c" +
                column + "r" + row);
    unitLayer.drawHexAtColRow(column,
        row,
        "red",
        "*");
};

move.moving = function () {
    console.log("count movable units:" + game.getListUnits().length);
    var e = window.event;
    var x = e.pageX;
    var y = e.pageY;
    var unitLayer = new HexagonGrid("unitFilm", 50, null);
    var unitFilm = document.getElementById("unitFilm");
    const context = unitFilm.getContext("2d");
    if (!move.ongoing.selectorClicked) {
        move.location = hex.getSelectedTile(x - 50, y - 125);
        if (game.unitsMap[move.location.column][move.location.row] === "*") {
            move.showActiveUnit(move.location.column,
                move.location.row,
                unitLayer);
            move.ongoing.selectorClicked = true;
            move.ongoing.targetClick = true;
        }
    } else {
        if (move.ongoing.targetClick) {
            //TODO: needs rework
            move.nextLocation = hex.getSelectedTile(x + 25, y);
            move.nextLocation.column -= 1;
            move.nextLocation.row -= move.nextLocation.column % 2 + 1;
            console.log("next location and tile selected" +
                move.nextLocation.column + "r" + move.nextLocation.row);
            //move unit on unitmap
            move.unit(move.location, move.nextLocation);

            //repaint units onto unitfilm
            context.clearRect(0, 0, 1800, 800);
            //var col = move.nextLocation.column;
            //var row = move.nextLocation.row;
            //unitLayer.drawHexAtColRow(col, row, "", "*");
            game.placeUnits();
            //reset click flags
            move.ongoing.targetClick = false;
            move.ongoing.selectorClicked = false;
        }
    }
};

document.getElementById("unitFilm").onclick = move.moving;