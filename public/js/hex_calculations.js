"use strict";
var grid = new HT.Grid(1900, 800);

function findHexWithSideLengthZAndRatio() {
    var z = parseFloat(document.getElementById("sideLength").value);
    var r = parseFloat(document.getElementById("whRatio").value);

    //solve quadratic
    var r2 = Math.pow(r, 2);
    var a = (1 + r2) / r2;
    var b = z / r2;
    var c = ((1 - 4.0 * r2) / (4.0 * r2)) * (Math.pow(z, 2));

    var x = (-b + Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);

    var y = ((2.0 * x) + z) / (2.0 * r);

    var contentDiv = document.getElementById("hexStatus");

    var width = ((2.0 * x) + z);
    var height = (2.0 * y);
    contentDiv.innerHTML = "Values for Hex: <br /><b>Side Length, z:</b> " + z + "<br /><b>x:</b> " + x + "<br /><b>y:</b> " + y +
        "<br /><b>Width:</b> " + width + "<br /><b>Height: </b>" + height;

    HT.Hexagon.Static.WIDTH = width;
    HT.Hexagon.Static.HEIGHT = height;
    HT.Hexagon.Static.SIDE = z;
}

var width = parseFloat(100.0);
var height = parseFloat(86.60254037844388);

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

function drawHexGrid() {
    var canvas = document.getElementById("map");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1900, 800);
    console.log(grid.Hexes.length);
    for (var h in grid.Hexes) {
        grid.Hexes[h].draw(ctx);
    }
}

function getHexGridZR() {
    findHexWithSideLengthZAndRatio();
    drawHexGrid();
}

function getHexGridWH(canvas) {
    findHexWithWidthAndHeight(width, height);
    drawHexGrid(canvas);
}

function changeOrientation() {
    if (document.getElementById("hexOrientationNormal").checked) {
        HT.Hexagon.Static.ORIENTATION = HT.Hexagon.Orientation.Normal;
    } else {
        HT.Hexagon.Static.ORIENTATION = HT.Hexagon.Orientation.Rotated;
    }
    drawHexGrid();
}

function debugHexZR() {
    findHexWithSideLengthZAndRatio();
    addHexToCanvasAndDraw(15, 15);
}

function debugHexWH() {
    findHexWithWidthAndHeight();
    addHexToCanvasAndDraw(15, 15);
}

function addHexToCanvasAndDraw(x, y) {
    HT.Hexagon.Static.DRAWSTATS = true;
    var hex = new HT.Hexagon(null, x, y);

    var canvas = document.getElementById("map");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1500, 800);
    hex.draw(ctx);
}