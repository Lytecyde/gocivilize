"use strict";

var app = {
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

// FIXME: all functions should be namespaced.
// app.onload = function () {
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
app.getMapColor = function (col, row) {
    return app.map[col][row];
};

app.fogOfWarColor = function (col, row) {
    return "rgba(110,110,110, 0.75)";
};

function hgrid() {
    var hexagonGrid = new HexagonGrid("map", 50);
    hexagonGrid.drawHexGrid(app.ROWS, app.COLS, 50, 50, app.getMapColor);
    hexagonGrid.drawHexGrid(app.ROWS, app.COLS, 50, 50, app.fogOfWarColor);
    hexagonGrid.visible();
}

function hgridMini() {
    var hexagonGrid = new HexagonGrid("minimap", 5);
    hexagonGrid.drawHexGrid(app.ROWS, app.COLS, 5, 5, app.getMapColor);
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
    app.map = makeMapColors();
}

function getRandomColor() {
    return app.colors[Math.floor(Math.random() * app.colors.length)];
}

function makeMapColors() {
    var colorsMap = [],
        i,
        j;

    for (i = 0; i < app.COLS; i += 1) {
        colorsMap[i] = new Array(app.ROWS);
    }

    for (i = 0; i < app.COLS; i += 1) {
        for (j = 0; j < app.ROWS; j += 1) {
            colorsMap[i][j] = getRandomColor();
        }
    }

    return colorsMap;
}

function makeUnitMap(){
    var units = makeUnits(app.COLS, app.ROWS),
        sp = getStartingPoint(),
        x,
        y;

    for (x = 0; x < app.COLS; x++) {
        for (y = 0; y < app.ROWS; y++) {
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
    return Math.floor(Math.random() * app.COLS);
}

function randomRow() {
    return Math.floor(Math.random() * app.ROWS);
}

function getStartingPoint() {
    return {
        x: randomCol(),
        y: randomRow(),
    };
}

function removeUnit(drawx, drawy, tile) {
    tile.drawHex(drawx, drawy - 6, app.map[tile.column][tile.row], "");
}

function createFogMap() {
    var fogs = [],
        x,
        y;

    for (x = 0; x < app.COLS; x += 1) {
        for (y = 0; y < app.ROWS; y += 1) {
            fogs[x] = new Array();
        }
    }

    civilization.fogMap = fogs;

    for (x = 0; x < app.COLS; x += 1) {  
        for (y = 0; y < app.ROWS; y += 1) {
            civilization.fogMap[x][y] = true;
        }
    }
}

function move(location, direction) {
    removeUnit(location);
    var newLocation = getNewLocation(location, direction);
    drawUnit(newLocation);
};

function removeUnit(location) {

};

function getNewLocation(location) {

};