"use strict";

var appNameSpace = {
    MINIMAP:  0,
    MAP : 1,
    WORLDMAP : 2,
    mapStrings : ["minimap", "map"],
    map : [],
}

function onload() {
    createTabs();
    createMap();
    getHexGridWH(appNameSpace.MINIMAP);
    getHexGridWH(appNameSpace.MAP);
}

function createTabs() {
    var tabs = document.querySelectorAll('.tab-box li a');
    var i;
    for(i = 0; i < tabs.length; i++) {
        setTabHandler(tabs[i], i);
    }
}

function setTabHandler(tab, tabPos) {
    var panels = document.querySelectorAll('article');
    tab.onclick = function() {
        for (i = 0; i < tabs.length; i++) {
            tabs[i].className = '';
        }
        tab.className = 'active';
        for (i = 0; i < panels.length; i++) {
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
    var rows = 90;
    var cols = 58;
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