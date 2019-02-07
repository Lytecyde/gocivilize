"use strict";

const MINIMAP = 0;
const MAP = 1;
const WORLDMAP = 2;

function onload() {
    createTabs();
    createMinimap();
    drawHexGrid("map");
}

function createTabs() {
    var tabs = document.querySelectorAll('.tab-box li a');
    var i;
    for (i = 0; i < tabs.length; i++) {
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

function drawHexGrid(maptype) {
    var canvas = document.getElementById(gridType.id[mapid]);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, gridType.gridWidth, gridType.gridHeight);
    console.log(gridType.mapType.length);
    for (var h in gridType.mapType) {
        gridType.mapType[h].draw(ctx);
    }
}

function gridType(n) {
    function id(n) {
        var id = ["minimap", "map", "worldmap"];
        return id[n];
    }

    function mapSizes(n) {
        var size = [];
        var gridWidth = [1900, 200];
        var gridHeight = [800, 150];
        size.push(gridWidth[n]);
        size.push(gridHeight[n])
        return size;
    }

    function hexSizes(n) {
        var size = [];
        var width = [parseFloat(10.0), parseFloat(100.0)];
        var height = [parseFloat(8.660254037844388), parseFloat(86.60254037844388)];
        size.push(width[n]);
        size.push(height[n])
        return size;
    }

    function mapHexes(n) {
        return new HT.Grid(gridWidth[n], gridHeight[n]).Hexes;
    }
}