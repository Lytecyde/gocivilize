"use strict";

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
        drawHexGrid(mapType);
    }
}

function drawHexGrid(mapType) {
    var mapString = maps[mapType].mapName;
    var canvas = document.getElementById(mapString);
    var ctx = canvas.getContext('2d');
    //ctx.clearRect(0, 0, gridType.gridWidth, gridType.gridHeight);
    var grid = makeGrid(mapType);
    for (var h in grid.Hexes) {
        grid.Hexes[h].draw(ctx);
    }
}

function makeGrid(mapType){
    return new HT.Grid(maps[mapType].mapWidth, maps[mapType].mapHeight);
}
/*
 *   data for map
*/
function makeStruct(names) {
    var names = names.split(' ');
    var count = names.length;
    function constructor() {
      for (var i = 0; i < count; i++) {
        this[names[i]] = arguments[i];
      }
    }
    return constructor;
}

var Item = makeStruct("id mapName mapWidth mapHeight hexWidth hexHeight");
var maps = [new Item(0, 'map', '1900' , '800', parseFloat(100.0), parseFloat(86.60254037844388) ),
        new Item(1, 'minimap', '200' , '150', parseFloat(10.0), parseFloat(8.660254037844388) )];