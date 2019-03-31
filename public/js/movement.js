/*jslint
    browser: true
*/
/*global game*/

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