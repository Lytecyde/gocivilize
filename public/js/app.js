"use strict";

var app = {
    ROWS: 20,
    COLS: 8,
    MOVING: false,
    MINIMAP:  0,
    MAP: 1,
    WORLDMAP: 2,
    mapStrings: ["minimap", "map"],
    map: [],
    units: [],
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
    assignUnits();
    hgrid();
    hgridMini();
}

function hgrid() {
    var hexagonGrid = new HexagonGrid("map", 50);
    hexagonGrid.drawHexGrid(8, 20, 50, 50, true);
    hexagonGrid.drawFogOfWar(8, 20, 50, 50, false);
    hexagonGrid.visible();
}

function hgridMini() {
    var hexagonGrid = new HexagonGrid("minimap", 5);
    hexagonGrid.drawHexGrid(8, 20, 5, 5, false);
}

function createTabs() {
    var tabs = document.querySelectorAll('.tab-box li a');
    var i;
    for(i = 0; i < tabs.length; i+=1) {
        setTabHandler(tabs[i], i);
    }
}

function setTabHandler(tabs, tabPos) {
    var panels = document.querySelectorAll('article');
    var i;
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
    var color;
    color = app.colors[Math.floor(Math.random() * app.colors.length)];
    return color;
}

function makeMapColors() {
    var colorsMap = new Array(app.ROWS);

    for (var i = 0; i < app.ROWS; i += 1) {
        colorsMap[i] = new Array(app.COLS);
    }

    for (var i = 0; i < app.ROWS; i += 1) {
        for (var j = 0; j < app.COLS; j += 1) {
            colorsMap[i][j] = getRandomColor();
        }
    }
    return colorsMap;
}

function makeUnitMap(){
    var units = makeUnits(app.ROWS, app.COLS);
    var sp = setStartingPoint();
    console.log(sp);
    for (var x = 0; x < app.ROWS; x++) {
        for (var y = 0; y < app.COLS; y++) {
            if(x == sp.x &&
                y == sp.y) {
                units[x][y] = "*";
            }
            else {
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
    var x = Math.floor(Math.random() * app.ROWS);
    var y = Math.floor(Math.random() * app.COLS);
    return {x: x, y: y};
}