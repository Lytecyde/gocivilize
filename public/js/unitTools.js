function removeUnit(drawx, drawy, tile) {
    this.drawHex(drawx, drawy - 6, app.map[tile.column][tile.row], "");
}

function zoneOfVisibility(tile) {
    var enc = this.getEncirclementOne(tile.column, tile.row);
    for (const p of enc) {
        this.drawHexAtColRow(p.COL, p.ROW, "rgba(110,110,110, 0.0)");
    }
}

function getListUnits(units){
    var listUnitLocations = [];
    var i = 0;
    for(var x = 0; x < app.COLS; x += 1) {
        for (var y = 0; y < app.ROWS; y += 1) {
            if(units[x][y] == "*") listUnitLocations[i++] = {x:x, y:y};
        }
    }
    return listUnitLocations;
}

function createFogMap() {
    var fogs = new Array(app.COLS);
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
