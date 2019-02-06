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

function getHexGridWH(canvas) {
    var widthGrid = parseFloat(100.0);
    var heightGrid = parseFloat(86.60254037844388);
    findHexWithWidthAndHeight(widthGrid, heightGrid);
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