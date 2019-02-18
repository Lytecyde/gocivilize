"use strict";

var allhexes;

function findHexWithWidthAndHeight(width, height) {
    var y = height / 2.0;

    //solve quadratic
    var a = -3.0;
    var b = (-2.0 * width);
    var c = (Math.pow(width, 2)) + (Math.pow(height, 2));

    var z = (-b - Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);

    var x = (width - z) / 2.0;

    HT.Hexagon.Static.WIDTH = width;
    HT.Hexagon.Static.HEIGHT = height;
    HT.Hexagon.Static.SIDE = z;
}

function getHexGridWH(mapType) {
    if (typeof mapType !== 'undefined') {
        var width = maps[mapType].hexWidth;
        var height = maps[mapType].hexHeight;
        findHexWithWidthAndHeight(width, height);
        var ctx = makeContext(mapType);
        makeHexesMap(ctx, mapType);
    }
}

function makeContext(mapType) {
    var mapString = maps[mapType].mapName;
    var canvas = document.getElementById(mapString);
    var ctx = canvas.getContext('2d');
    //ctx.clearRect(0, 0, gridType.gridWidth, gridType.gridHeight);
    return ctx;
}

function makeHexesMap( ctx, mapType) {
    var g = makeGrid(mapType);
    for (var h in g.Hexes) {
        g.Hexes[h].draw(ctx);
    }
}

function makeGrid(mapType) {
    return new HT.Grid(mapType);
}