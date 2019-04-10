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
};