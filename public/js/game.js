/*global document,HexagonGrid,civilization*/
"use strict";

var game = {
    ROWS: 8,
    COLS: 20,
    moving: false,
    map: [],
    units: [],
    lastTile: {
        row: 0,
        column: 0,
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
            var color = game.map[tile.column][tile.row];
            this.clearHexAtColRow(tile.column, tile.row, color);
            game.moving = true;
            game.lastTile = tile;
            civilization.units[tile.column][tile.row] = "";
        }
    }

    if (game.moving && this.isAroundTile(game.lastTile, tile)) {
        civilization.units[tile.column][tile.row] = "*";
        this.drawHexAtColRow(tile.column, tile.row);
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
    return game.map[col][row];
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
        i;

    for (i = 0; i < tabs.length; i = i + 1) {
        game.setTabHandler(tabs[i], i);
    }
};

game.setTabHandler = function (tabs, tabPos) {
    var panels = document.querySelectorAll('article'),
        i;

    tabs.onclick = function () {
        for (i = 0; i < tabs.length; i = i + 1) {
            tabs[i].className = '';
        }

        tabs.className = 'active';
        for (i = 0; i < panels.length; i = i + 1) {
            panels[i].className = '';
        }

        panels[tabPos].className = 'active-panel';
    };
};

game.createColoredMap = function () {
    game.map = game.makeMapColors();
};

game.getRandomColor = function () {
    return game.colors[Math.floor(Math.random() * game.colors.length)];
};

game.makeMapColors = function () {
    var colorsMap = [],
        i,
        j;

    for (i = 0; i < game.COLS; i = i + 1) {
        colorsMap[i] = new Array(game.ROWS);
    }

    for (i = 0; i < game.COLS; i = i + 1) {
        for (j = 0; j < game.ROWS; j = j + 1) {
            colorsMap[i][j] = game.getRandomColor();
        }
    }

    return colorsMap;
};

game.makeUnitMap = function () {
    var units = game.makeUnits(game.COLS, game.ROWS),
        sp = game.getStartingPoint(),
        x,
        y;

    for (x = 0; x < game.COLS; x = x + 1) {
        for (y = 0; y < game.ROWS; y = y + 1) {
            if (x === sp.x && y === sp.y) {
                units[x][y] = "*";
            } else {
                units[x][y] = "";
            }
        }
    }

    return units;
};

game.makeUnits = function (rows, cols) {
    var units = new Array(rows),
        i;

    for (i = 0; i < rows; i = i + 1) {
        units[i] = new Array(cols);
    }

    return units;
};

game.assignUnits = function () {
    civilization.units = game.makeUnitMap();
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
        y: game.randomRow(),
    };
};

game.removeUnit = function (drawx, drawy, tile) {
    tile.drawHex(drawx, drawy - 6, game.map[tile.column][tile.row], "");
};

game.getListUnits = function (units) {
    var listUnitLocations = [],
        i = 0,
        x,
        y;

    for (x = 0; x < game.COLS; x = x + 1) {
        for (y = 0; y < game.ROWS; y = y + 1) {
            if (units[x][y] === "*") {
                listUnitLocations[i++] = {
                    x: x,
                    y: y,
                };
            }
        }
    }

    return listUnitLocations;
};
