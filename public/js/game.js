"use strict";

var game = {
    ROWS: 8,
    COLS: 20,
    MOVING: false,
    map: [],
    units: [],
    lastTile: { row:0, column:0},
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

function clickEventHandler (tile) {
    var drawy,
        drawx;

    if (tile.column >= 0 && tile.row >= 0) {
        drawy = tile.column % 2 === 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
        drawx = (tile.column * this.side) + this.canvasOriginX;
        if (civilization.units[tile.column][tile.row] === "*") {
            color = app.map[column][row];
            this.clearHexAtColRow(tile.column, tile.row, color);
            app.MOVING = true;
            app.lastTile = tile;
            civilization.units[tile.column][tile.row] = "";
        };
    }

    if (app.MOVING && this.isAroundTile(app.lastTile, tile)) {
        civilization.units[tile.column][tile.row] = "*";
        this.drawHexAtColRow(tile.column, tile.row);
        app.MOVING = false;
    }
};

// FIXME: all functions should be namespaced.
// game.onload = function () {
//      createTabs();
//      ...
// }
function onload() {
    createTabs();
    createColoredMap();
    //createFogMap();
    assignUnits();
    hgrid();
    hgridMini();
}

// FIXME: move to map
game.getMapColor = function (col, row) {
    return game.map[col][row];
};

game.fogOfWarColor = function (col, row) {
    return "rgba(110,110,110, 0.75)";
};

function hgrid() {
    var hexagonGrid = new HexagonGrid("map", 50);
    hexagonGrid.drawHexGrid(game.ROWS, game.COLS, 50, 50, game.getMapColor);
    hexagonGrid.drawHexGrid(game.ROWS, game.COLS, 50, 50, game.fogOfWarColor);
}

function hgridMini() {
    var hexagonGrid = new HexagonGrid("minimap", 5);
    hexagonGrid.drawHexGrid(game.ROWS, game.COLS, 5, 5, game.getMapColor);
}

// FIXME: move into view/tabs
function createTabs() {
    var tabs = document.querySelectorAll('.tab-box li a'),
        i;

    for(i = 0; i < tabs.length; i+=1) {
        setTabHandler(tabs[i], i);
    }
}

// FIXME: move into view/tabs
function setTabHandler(tabs, tabPos) {
    var panels = document.querySelectorAll('article'),
        i;

    tabs.onclick = function() {
        for (i = 0; i < tabs.length; i+=1) {
            tabs[i].className = '';
        }

        tabs.className = 'active';
        for (i = 0; i < panels.length; i+=1) {
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

    for (i = 0; i < game.COLS; i += 1) {
        colorsMap[i] = new Array(game.ROWS);
    }

    for (i = 0; i < game.COLS; i += 1) {
        for (j = 0; j < game.ROWS; j += 1) {
            colorsMap[i][j] = getRandomColor();
        }
    }

    return colorsMap;
}

function makeUnitMap(){
    var units = makeUnits(game.COLS, game.ROWS),
        sp = getStartingPoint(),
        x,
        y;

    for (x = 0; x < game.COLS; x++) {
        for (y = 0; y < game.ROWS; y++) {
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

    for (i = 0; i < rows; i++) {
        units[i] = new Array(cols);
    }

    return units;
}

function assignUnits(){
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

function createFogMap() {
    var fogs = [],
        x,
        y;

    for (x = 0; x < game.COLS; x += 1) {
        for (y = 0; y < game.ROWS; y += 1) {
            fogs[x] = new Array();
        }
    }

    civilization.fogMap = fogs;

    for (x = 0; x < game.COLS; x += 1) {  
        for (y = 0; y < game.ROWS; y += 1) {
            civilization.fogMap[x][y] = true;
        }
    }
}

function getListUnits(units) {
    var listUnitLocations = [],
        i = 0,
        x,
        y;

    for (x = 0; x < game.COLS; x += 1) {
        for (y = 0; y < game.ROWS; y += 1) {
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
