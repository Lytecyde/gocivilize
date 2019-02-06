"use strict";

var grid = new HT.Grid(1900, 800);

function onload() {
    createTabs();
    createMinimap();
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

function drawHexGrid() {
    var canvas = document.getElementById("map");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1900, 800);
    console.log(grid.Hexes.length);
    for (var h in grid.Hexes) {
        grid.Hexes[h].draw(ctx);
    }
}