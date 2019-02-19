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
    createMap();
    assignUnits();
    getHexGridWH(appNameSpace.MINIMAP);
    getHexGridWH(appNameSpace.MAP);
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

function createMap() {
    appNameSpace.map = makeMapColors();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    var colorLength = 6;
    for (var i = 0; i < colorLength; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
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
    var X = Math.floor(Math.random() * 11);
    var Y = Math.floor(Math.random() * 17);
    console.log("x" + X + "y" + Y);
    return {X, Y};
}