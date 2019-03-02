/*global document,HexagonGrid,civilization*/
"use strict";

var game = {
    ROWS: 8,
    COLS: 20,
    moving: false,
    colorsMap: [],
    unitsMap: [],
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
    ]
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
    var hexagonGrid = new HexagonGrid("map", 50, game.clickEventHandler);
    hexagonGrid.drawHexGrid(game.ROWS, game.COLS, 50, 50, game.getMapColor);
    hexagonGrid.drawHexGrid(game.ROWS, game.COLS, 50, 50, game.fogOfWarColor);
};

game.hgridMini = function () {
    var hexagonGrid = new HexagonGrid("minimap", 5, null);
    hexagonGrid.drawHexGrid(game.ROWS, game.COLS, 5, 5, game.getMapColor);
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
        arr[columns - 1 - i] = mapRows;
        i -= 1;
    }

    return arr;
};

game.makeUnits = function (cols, rows) {
    var units = game.create2DArray(rows, cols);
    units.fill(" ");
    return units;
};

game.makeUnitMap = function () {
    var units = game.makeUnits(game.COLS, game.ROWS),
        sp = game.getStartingPoint();
    game.x = 0;
    while (game.x < game.ROWS) {
        game.y = 0;
        while (game.y < game.COLS) {
            if (game.x === sp.x && game.y === sp.y) {
                units[game.x][game.y] = "*";
            } else {
                console.log(game.x + " " + game.y);
                units[game.x][game.y] = "";
            }
            game.y += 1;
        }
        game.x += 1;
    }

    return units;
};

game.assignUnits = function () {
    game.unitsMap = game.makeUnitMap();
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