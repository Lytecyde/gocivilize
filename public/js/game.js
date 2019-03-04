/*global document,HexagonGrid,civilization*/
"use strict";

var game = {
    ROWS: 8,
    COLS: 20,
    moving: false,
    colorsMap: [],
    unitsMap: [],
    units: [],
    lastTile: {
        row: 0,
        column: 0
    },
    colors: [
        '#006600',//darkgreen forest
        '#33cc33',//LIGHT GREEN
        '#ffcc00',//yellow desert
        '#99ff66',//VERYlight green field
        '#808080',//grey mntn
        '#0099ff',//light blue beach
        '#003366',//dark blue ocean
        '#996633' //brown hills
    ],
    x: 0,
    y: 0,
};

game.clickEventHandler = function (tile) {
    if (tile.column >= 0 && tile.row >= 0) {
        if (civilization.units[tile.column][tile.row] === "*") {
            var color = game.colorsMap[tile.column][tile.row];
            tile.clearHexAtColRow(tile.column, tile.row, color);
            game.moving = true;
            game.lastTile = tile;
            civilization.units[tile.column][tile.row] = "";
        }
    }

    if (game.moving && tile.isAroundTile(game.lastTile, tile)) {
        civilization.units[tile.column][tile.row] = "*";
        tile.drawHexAtColRow(tile.column, tile.row);
        game.moving = false;
    }
};

game.onload = function () {
    game.createTabs();
    game.createColoredMap();
    game.assignUnits();
    game.hgrid();
    game.hgridMini();
};

game.getMapColor = function (col, row) {
    return game.colorsMap[col][row];
};

game.fogOfWarColor = function () {
    return "rgba(110,110,110, 0.75)";
};

game.hgrid = function () {
    var h = hex.HexagonGrid("map", 50, game.clickEventHandler);
    Grid.draw(game.ROWS, game.COLS, 50, 50, game.getMapColor, h);
    //version 0.0.2
    //g.drawHexGrid(game.ROWS, game.COLS, 50, 50, game.fogOfWarColor);
};

game.hgridMini = function () {
    var h = hex.HexagonGrid("minimap", 5, null);
    Grid.draw(game.ROWS, game.COLS, 5, 5, game.getMapColor, h);
};

game.createTabs = function () {
    var tabs = document.querySelectorAll('.tab-box li a'),
        i = 0;

    while (i < tabs.length) {
        game.setTabHandler(tabs[i], i);
        i += 1;
    }
};

game.setTabHandler = function (tabs, tabPos) {
    var panels = document.querySelectorAll('article'),
        i = 0;

    tabs.onclick = function () {
        while (i < tabs.length) {
            tabs[i].className = '';
            i += 1;
        }

        tabs.className = 'active';
        i = 0;
        while (i < panels.length) {
            panels[i].className = '';
            i = i + 1;
        }

        panels[tabPos].className = 'active-panel';
    };
};

game.createColoredMap = function () {
    game.colorsMap = game.makeMapColors();
};

game.getRandomColor = function () {
    return game.colors[Math.floor(Math.random() * game.colors.length)];
};

game.makeMapColors = function () {
    var colorsMap = [[]];
    colorsMap.length = game.COLS * game.ROWS;
    colorsMap.forEach(function (x) {
        colorsMap[x] = game.getRandomColor();
    });

    return colorsMap;
};

game.create2DArray = function (columns, rows) {
    var arr = [];
    arr.length = rows;
    var i = columns;
    var mapRows = [];
    mapRows.length = rows;
    while (i > 0) {
        mapRows.fill("u");
        arr[columns - i] = mapRows;
        i -= 1;
    }

    return arr;
};

game.makeUnits = function (cols, rows) {
    var units = game.create2DArray(rows, cols);
    console.log(units[7][1]);
    //units.fill("u");
    return units;
};

game.randomCol = function () {
    return Math.floor(Math.random() * game.COLS);
};

game.randomRow = function () {
    return Math.floor(Math.random() * game.ROWS);
};

game.getStartingPoint = function () {
    return {
        x: game.randomCol(),
        y: game.randomRow()
    };
};

game.makeUnitMap = function () {
    game.units = game.makeUnits(game.COLS, game.ROWS);
    console.log(game.units[6][6]);
    var sp = game.getStartingPoint();
    var x = 0;
    var y;
    while (x < game.ROWS) {
        y = 0;
        while (y < game.COLS) {
            console.log("1:" + x + "x2  " + y + "y");
            if (typeof(game.units) != 'undefined' && typeof(game.units[7]) != 'undefined') {
                if (x === sp.x && y === sp.y ) {
                    console.log(x + "found");
                    game.units[x][y] = "*";
                } else {
                    console.log("2:" + x + "x2  " + y + "y");
                    game.units[x][y] = "n";
                }
            }
            y += 1;
        }
        x += 1;
    }

    return game.units;
};

game.assignUnits = function () {
    game.unitsMap = game.makeUnitMap();
};

game.removeUnit = function (drawx, drawy, tile) {
    tile.drawHex(drawx, drawy - 6, game.colorsMap[tile.column][tile.row], "");
};

game.getListUnits = function (units) {
    var listUnitLocations = [],
        i = 0,
        x = 0,
        y = 0;

    while (x < game.COLS) {
        y = 0;
        while (y < game.ROWS) {
            if (units[x][y] === "*") {
                listUnitLocations[i] = {
                    x: x,
                    y: y
                };
                i += 1;
            }
        }
        x = x + 1;
    }

    return listUnitLocations;
};