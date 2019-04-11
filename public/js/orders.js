/*jslint
    browser: true
*/
/*global game,hex,HexagonGrid,move*/

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
        //console.log("Population growth");
        orders.grow();
    }
    if (charStr === "m" || charStr === "M") {
        //alert("Moving unit");
        orders.move();
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
    var unitLocation = null;
    var i = 0;
    while (i < countUnits) {
        //place to free unit on nearby spot
        unitLocation = unitList[i];

        placeNewUnit(unitLocation);
        console.log("unit SELECTOR" +
            unitLocation.column +
            " " +
            unitLocation.row);
        //add to unitmap
        
        i += 1;
    }
    console.log("done growing");
};

var addUnitToUnitsMap = function (nextLocation) {
    /*console.log("placing unit from location " +
        nextLocation.column +
        "  " +
        nextLocation.row);
    */
    game.unitsMap[nextLocation.column][nextLocation.row] = "*";
};

var placeNewUnit = function (location) {
    var done = false;
    document.getElementById("unitFilm").onclick = function () {
        var event = window.event;
        var x = event.pageX;
        var y = event.pageY;
        var mouseLocation = hex.getSelectedTile(x, y);
        console.log("clickin on unitfilm @column" +
            mouseLocation.column +
            " r " +
            mouseLocation.row +
            "unit location is @ loc column" +
            location.column +
            " loc row" +
            location.row);
        function isAnotherLocation (mouseLocation, location) {
            return !(mouseLocation.column === location.column &&
                mouseLocation.row === location.row);
        }

        if (isAnotherLocation(mouseLocation, location) && !done) {
            //place unit
            console.log("good enough, placing unit");
            var h = new HexagonGrid("unitFilm", 50, null);
            h.drawHexAtColRow(
                mouseLocation.column,
                mouseLocation.row,
                "",
                "*"
            );
            addUnitToUnitsMap(mouseLocation);
            done = true;
        } else {
            document.getElementById("unitFilm").onclick = function () {};
        }
    };
};

orders.fortify = function () {
    console.log("fortify a unit here");
};

orders.move = function () {
    document.getElementById("unitFilm").onclick = move.moving;
};