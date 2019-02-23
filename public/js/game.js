"use strict";

var app = {
    ROWS: 8,
    COLS: 20,
    MOVING: false,
    MINIMAP:  0,
    MAP: 1,
    WORLDMAP: 2,
    mapStrings: ["minimap", "map"],
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
    civColors: [
        "red",
        "purple",
        "magenta",
        "pink",
        "mauve",
        "lilac",
        "violet",
        "black",
        "white"
    ]
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

function hgrid() {
    var hexagonGrid = new HexagonGrid("map", 50);
    hexagonGrid.drawHexGrid(app.ROWS, app.COLS, 50, 50);
    hexagonGrid.drawFogOfWar(app.ROWS, app.COLS, 50, 50, false);
    hexagonGrid.visible();
}

function hgridMini() {
    var hexagonGrid = new HexagonGrid("minimap", 5);
    hexagonGrid.drawHexGrid(app.ROWS, app.COLS, 5, 5);
}

function createTabs() {
    var tabs = document.querySelectorAll('.tab-box li a'),
        i;

    for(i = 0; i < tabs.length; i+=1) {
        setTabHandler(tabs[i], i);
    }
}

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
    var colorsMap = [];
    for (var i = 0; i < app.COLS; i += 1) {
        colorsMap[i] = new Array(app.ROWS);
    }

    for (var i = 0; i < app.COLS; i += 1) {
        for (var j = 0; j < app.ROWS; j += 1) {
            colorsMap[i][j] = getRandomColor();
        }
    }

    return colorsMap;
}

function makeUnitMap(){
    var units = makeUnits(app.COLS, app.ROWS),
        sp = setStartingPoint();

    for (var x = 0; x < app.COLS; x++) {
        for (var y = 0; y < app.ROWS; y++) {
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
    var units = new Array(rows);
    for (var i = 0; i < rows; i++) {
        units[i] = new Array(cols);
    }

    return units;
}

function assignUnits(){
    civilization.units = makeUnitMap();
}

function setStartingPoint() {
    return {
        x: Math.floor(Math.random() * app.COLS),
        y: Math.floor(Math.random() * app.ROWS),
    };
}

function removeUnit(drawx, drawy, tile) {
    tile.drawHex(drawx, drawy - 6, app.map[tile.column][tile.row], "");
}

function createFogMap() {
    var fogs = [];
    for(var x = 0; x < app.COLS; x += 1) {
        for (var y = 0; y < app.ROWS; y += 1) {
            fogs[x] = new Array();
        }
    }
    civilization.fogMap = fogs;

    for(var x = 0; x < app.COLS; x += 1) {  
        for (var y = 0; y < app.ROWS; y += 1) {
            civilization.fogMap[x][y] = true;
        }
    }
}

var moves = {
    NE: 0,
    SE: 1,
    S: 2,
    SW: 3,
    NW: 4,
    N: 5
};

function move(location, direction) {
    removeUnit(location);
    var newLocation = getNewLocation(location, direction);
    drawUnit(newLocation);
};

function removeUnit(location) {

};

function getNewLocation(location) {

};