/*jslint
    browser: true
*/
/*global game,hex,HexagonGrid*/

document.onkeypress = function (evt) {
    //"use strict";
    evt = evt || window.event;
    var charCode = evt.which || evt.keyCode;
    var charStr = String.fromCharCode(charCode);
    if (charStr === "b" || charStr === "B") {
        alert("City constructed");
        orders.constructCity();
    }
    if (charStr === "g" || charStr === "G") {
        alert("Population growth");
        orders.grow();
    }
};

var orders = {};

orders.constructCity = function () {
    var unitList = game.getListUnits();
    var indexOfActiveUnit = 0;
    var cityLocation = unitList[indexOfActiveUnit];
    console.log("column" + cityLocation.column + "row " + cityLocation.row);
    game.cityMap[cityLocation.column][cityLocation.row] = "#";
    var cityLayer = new HexagonGrid("cityFilm", 50, null);
    cityLayer.drawHexAtColRow(cityLocation.column, cityLocation.row, "", "#");
    //if you have 7 units 
    //  build a city
    //remove all 7 units to build the city at the centre
};

orders.grow = function () {
    var unitList = game.getListUnits();
    var countUnits = unitList.length;
    var i = 0;
    var unitLocations = null;
    while (i < countUnits) {
        //place to free unit on nearby spot
        unitLocations = unitList[i];
        document.getElementById("unitFilm").onclick =
            placeNewUnit(i, unitLocations);
        //add to unitmap
    }
};

var placeNewUnit = function (i, location) {
    var event = window.event;
    var x = event.pageX;
    var y = event.pageY;
    var mouseLocation = hex.getSelectedTile(x, y);
    if (hex.isAroundTile(location, mouseLocation)) {
        //place unit
        game.unitFilm.drawHexAtColRow(
            mouseLocation.column,
            mouseLocation.row,
            "",
            "*"
        );
    }
};

orders.fortify = function () {
    console.log("fortify a unit here");
};