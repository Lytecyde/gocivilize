"use strict";

function removeUnit(drawx, drawy, tile) {
    tile.drawHex(drawx, drawy - 6, app.map[tile.column][tile.row], "");
}

function createFogMap() {
    var fogs = [];
    for(var x = 0; x < app.COLS; x += 1) {
        for (var y = 0; y < app.ROWS; y += 1) {
            fogs[x] = new Array();
        }
    }
    civilization.fogMap = fogs;

    for(var x = 0; x < app.COLS; x += 1) {  
        for (var y = 0; y < app.ROWS; y += 1) {
            civilization.fogMap[x][y] = true;
        }
    }
}