"use strict";

var widthMinimap = parseFloat(10.0);
var heightMinimap = parseFloat(8.660254037844388);

function createMinimap() {
    var canvas = document.getElementById("minimap");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 200, 120);
    var minimapGrid = new HT.Grid(200, 120);
    for (var h in minimapGrid.Hexes) {
        minimapGrid.Hexes[h].draw(ctx);
    }
}