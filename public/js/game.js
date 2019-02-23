/*global document*/
"use strict";

var game = {
    ROWS: 8,
    COLS: 20,
    MOVING: false,
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
    ],
};

function clickEventHandler(tile) {
    if (tile.column >= 0 && tile.row >= 0) {
        if (civilization.units[tile.column][tile.row] === "*") {
            var color = game.map[tile.column][tile.row];
            this.clearHexAtColRow(tile.column, tile.row, color);
            game.MOVING = true;
            game.lastTile = tile;
            civilization.units[tile.column][tile.row] = "";
        }
    }

    if (game.MOVING && this.isAroundTile(game.lastTile, tile)) {
        civilization.units[tile.column][tile.row] = "*";
        this.drawHexAtColRow(tile.column, tile.row);
        game.MOVING = false;
    }
}

// FIXME: all functions should be namespaced.
// game.onload = function () {
//      createTabs();
//      ...
// }
function onload() {
    createTabs();
    createColoredMap();
    assignUnits();
    hgrid();
    hgridMini();
}

// FIXME: move to map
game.getMapColor = function (col, row) {
    return game.map[col][row];
};

game.fogOfWarColor = function () {
    return "rgba(110,110,110, 0.75)";
};

function hgrid() {
    var hexagonGrid = new HexagonGrid("map", 50, clickEventHandler);
    hexagonGrid.drawHexGrid(game.ROWS, game.COLS, 50, 50, game.getMapColor);
    hexagonGrid.drawHexGrid(game.ROWS, game.COLS, 50, 50, game.fogOfWarColor);
}

function hgridMini() {
    var hexagonGrid = new HexagonGrid("minimap", 5, null);
    hexagonGrid.drawHexGrid(game.ROWS, game.COLS, 5, 5, game.getMapColor);
}

// FIXME: move into view/tabs
function createTabs() {
    var tabs = document.querySelectorAll('.tab-box li a'),
        i;

    for (i = 0; i < tabs.length; i = i + 1) {
        setTabHandler(tabs[i], i);
    }
}

// FIXME: move into view/tabs
function setTabHandler(tabs, tabPos) {
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
}

function createColoredMap() {
    game.map = makeMapColors();
}

function getRandomColor() {
    return game.colors[Math.floor(Math.random() * game.colors.length)];
}

function makeMapColors() {
    var colorsMap = [],
        i,
        j;

    for (i = 0; i < game.COLS; i = i + 1) {
        colorsMap[i] = new Array(game.ROWS);
    }

    for (i = 0; i < game.COLS; i = i + 1) {
        for (j = 0; j < game.ROWS; j = j + 1) {
            colorsMap[i][j] = getRandomColor();
        }
    }

    return colorsMap;
}

function makeUnitMap() {
    var units = makeUnits(game.COLS, game.ROWS),
        sp = getStartingPoint(),
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
}

function makeUnits(rows, cols) {
    var units = new Array(rows),
        i;

    for (i = 0; i < rows; i = i + 1) {
        units[i] = new Array(cols);
    }

    return units;
}

function assignUnits() {
    civilization.units = makeUnitMap();
}

function randomCol() {
    return Math.floor(Math.random() * game.COLS);
}

function randomRow() {
    return Math.floor(Math.random() * game.ROWS);
}

function getStartingPoint() {
    return {
        x: randomCol(),
        y: randomRow(),
    };
}

function removeUnit(drawx, drawy, tile) {
    tile.drawHex(drawx, drawy - 6, game.map[tile.column][tile.row], "");
}

function getListUnits(units) {
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
}
