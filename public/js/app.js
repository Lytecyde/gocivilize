"use strict";

var appNameSpace = {
    ROWS : 90,
    COLS : 58,
    MINIMAP:  0,
    MAP : 1,
    WORLDMAP : 2,
    mapStrings : ["minimap", "map"],
    map : [],
    units : []
};

function onload() {
    createTabs();
    createColoredMap();
    assignUnits();
    hgrid();
}

function hgrid() {
    var hexagonGrid = new HexagonGrid("map", 50);
    hexagonGrid.drawHexGrid(8, 20, 50, 50, true);
}

function createTabs() {
    var tabs = document.querySelectorAll('.tab-box li a');
    var i;
    for(i = 0; i < tabs.length; i+=1) {
        setTabHandler(tabs[i], i);
    }
}

function setTabHandler(tab, tabPos) {
    var panels = document.querySelectorAll('article');
    tab.onclick = function() {
        for (i = 0; i < tabs.length; i+=1) {
            tabs[i].className = '';
        }
        tab.className = 'active';
        for (i = 0; i < panels.length; i+=1) {
            panels[i].className = '';
        }
        panels[tabPos].className = 'active-panel';
    };
}

function createColoredMap() {
    appNameSpace.map = makeMapColors();
}

function getRandomColor() {
    var colors = [
        '#006600',//darkgreen forest
        '#33cc33', //LIGHT GREEN 
        '#ffcc00', //yellow desert
        '#99ff66',  //VERYlight green field
        '#808080', //grey mntn
        '#0099ff', //light blue beach
        '#003366', //dark blue ocean
        '#996633' //brown hills
    ];
    var color;
    color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}

function makeMapColors() {
    var rows = appNameSpace.ROWS;
    var cols = appNameSpace.COLS;
    var colorsMap = new Array(rows);

    for (var i = 0; i < colorsMap.length; i++) {
        colorsMap[i] = new Array(cols);
    }

    for (var i = 0; i < rows; i += 1) {
        for (var j = 0; j < cols; j += 1) {
            colorsMap[i][j] = getRandomColor();
        }
    }
    return colorsMap;
}

function makeUnitMap(){
    var rows = appNameSpace.ROWS;
    var cols = appNameSpace.COLS;
    //create unitsMap[][]
    var units = new Array(rows);
    for (var i = 0; i < rows; i++) {
        units[i] = new Array(cols);
    }
    //set startingpoints
    var sp = startingPoint();
    //paint all units to map
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if(x == sp.X &&
                y == sp.Y){
                units[x][y] = "*";
            }
            else {
                units[x][y] = "";
            }
        }
    }
    return units;
}

function assignUnits(){
    civilization.units = makeUnitMap();

}
function startingPoint() {
    var X = Math.floor(Math.random() * 17);
    var Y = Math.floor(Math.random() * 11);
    console.log("x" + X + "y" + Y);
    return {X, Y};
}

var mouse = {
    tempX : 0,
    tempY : 0
}