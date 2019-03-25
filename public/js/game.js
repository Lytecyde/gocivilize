/*global document,HexagonGrid,civilization*/
"use strict";

var game = {
    ROWS: 8,
    COLS: 20,
    VISIBLE: 1.0,
    FOG: 0.75,
    moving: false,
    colorsMap: [[]],
    unitsMap: [[]],
    fogMap: [[]],
    units: [[]],
    lastTile: {
        row: 0,
        column: 0
    },
    reds: [0, 51, 255, 163, 128, 0, 0, 163],
    greens: [102, 204, 204, 255, 128, 163, 51, 102],
    blues: [0, 51, 0, 102, 128, 255, 102, 102],
    colors: [],
    x: 0,
    y: 0,
    h: {},
    hMap: {}
};

game.clickEventHandler = function (tile) {
    if (tile.column >= 0 && tile.row >= 0) {
        if (civilization.units[tile.column][tile.row] === "*") {
            var color = game.colorsMap[tile.column][tile.row];
            tile.clearHexAtColRow(tile.column, tile.row, color);
            game.moving = true;
            game.lastTile = tile;
            civilization.units[tile.column][tile.row] = "";
        }
    }

    if (game.moving && tile.isAroundTile(game.lastTile, tile)) {
        civilization.units[tile.column][tile.row] = "*";
        tile.drawHexAtColRow(tile.column, tile.row);
        game.moving = false;
    }
};

game.onload = function () {
    game.createTabs();
    //map
    game.makePalette(game.VISIBLE);
    game.assignUnits();
    game.makeUnitMap();
    game.makeColorMap();
    game.hgrid();
    game.hgridMini();

    game.makeFogMap();
    game.fogOfWar();
    //units
    game.makeUnits();
    //game.showUnits();
    game.placeUnit();
};

game.makePalette = function (alpha) {
    var colorsLength = 8;
    var i = 0;
    while (i < colorsLength) {
        game.colors[i] = "rgba(" + game.reds[i] + "," + game.greens[i] + "," + game.blues[i] + "," + alpha + ")";
        i += 1;
    }
};

game.getMapColor = function (col, row) {
    return game.colorsMap[col][row];
};

game.create2DArray = function (columns, rows) {
    var arr = [[]];
    arr.length = rows;
    var index = columns;
    var i = 0;
    var mapRows = [];
    mapRows.length = rows;
    while (i < columns) {
        //mapRows.fill("u");
        index = columns - i;
        arr[index] = mapRows;
        i += 1;
    }

    return arr;
};

game.makeFogMap = function () {
    var col = 0;
    var row;
    var g = game.create2DArray(game.COLS, game.ROWS);
    game.fogMap = g;
    while (col < game.COLS) {
        row = 0;
        while (row < game.ROWS) {
            game.fogMap[row][col] = true;
            row += 1;
        }
        col += 1;
    }
    //game.fogMap[][] = g.fogMap[][];
    //return g.fogMap;
};

game.getRandomColor = function () {
    return game.colors[Math.floor(Math.random() * game.reds.length)];
};

game.makeColorMap = function () {
    var col = 0;
    var row;
    var g = game.create2DArray(game.COLS, game.ROWS);
    game.colorsMap = g;
    while (col < game.COLS) {
        row = 0;
        while (row < game.ROWS) {
            game.colorsMap[row][col] = game.getRandomColor();
            row += 1;
        }
        col += 1;
    }
};

game.fogOfWar = function () {
//paint fog on every tile
    var col = 0;
    var row;
    while (col < game.COLS) {
        row = 0;
        while (row < game.ROWS) {
            if (game.fogMap[row][col]) {
                game.fogDarken(col, row);
            }
            row += 1;
        }
        col += 1;
    }
};

game.fogDarken = function (col, row) {
    game.makePalette(game.FOG);
    game.makeColorMap();
    var colorInRGBA = game.getMapColor(col, row);
    game.colorsMap[col][row] = colorInRGBA;
};

game.fogLighten = function (col, row) {
    game.makePalette(game.VISIBLE);
    game.makeColorMap();
    var colorInRGBA = game.getMapColor(col, row);
    game.colorsMap[col][row] = colorInRGBA;
};

game.hgrid = function () {
    var h = new HexagonGrid("map", 50, game.clickEventHandler);
    game.hMap = h;
    h.Grid.draw(game.ROWS, game.COLS, 50, 50, game.colorsMap);
    //version 0.0.2
    //draw game.fogOfWarColor;
};

game.hgridMini = function () {
    var h = new HexagonGrid("minimap", 5, null);
    h.Grid.draw(game.ROWS, game.COLS, 5, 5);
};

game.createTabs = function () {
    var tabs = document.querySelectorAll('.tab-box li a'),
        i = 0;

    while (i < tabs.length) {
        game.setTabHandler(tabs[i], i);
        i += 1;
    }
};

game.setTabHandler = function (tabs, tabPos) {
    var panels = document.querySelectorAll('article'),
        i = 0;

    tabs.onclick = function () {
        while (i < tabs.length) {
            tabs[i].className = '';
            i += 1;
        }

        tabs.className = 'active';
        i = 0;
        while (i < panels.length) {
            panels[i].className = '';
            i = i + 1;
        }

        panels[tabPos].className = 'active-panel';
    };
};



game.makeUnits = function () {
    var units = [[]];
    units = game.create2DArray(game.COLS, game.ROWS);
    units.fill("");
    return units;
};

game.randomCol = function () {
    return Math.floor(Math.random() * game.COLS);
};

game.randomRow = function () {
    return Math.floor(Math.random() * game.ROWS);
};

game.getStartingPoint = function () {
    var p = {
        x: game.randomCol(),
        y: game.randomRow()
    };
    return p;
};

game.makeUnitMap = function () {
    var g = [[]];
    g = game.makeUnits(game.COLS, game.ROWS);
    game.unitsMap = g;
    var sp = game.getStartingPoint();
    console.log(sp.x + " " + sp.y + "starting point xy");
    var y;
    var countUnits = 0;

    var x = 0;
    while (x < game.COLS) {
        y = 0;
        while (y < game.ROWS) {
            console.log("xy of making unit map");
            if (x === sp.x && y === sp.y) {
                console.log("unit is placed on location");
                g.units[x][y] = "*";//ERROR: not recording something correctly
                countUnits += 1;
            } else {
                g.units[x][y] = "u";
            }
            y += 1;
        }
        x += 1;
    }
    console.log("unit count" + countUnits);
    return game.units;
};

game.assignUnits = function () {
    game.unitsMap = game.makeUnitMap();
};

game.removeUnit = function (drawx, drawy, tile) {
    tile.drawHex(drawx, drawy - 6, game.colorsMap[tile.column][tile.row], "");
};

game.placeUnit = function () {
    var i = 0;
    var unitLocations = game.getListUnits();
    console.log("UL" + unitLocations.length);
    var col = 0;
    var row = 0;
    var color = "";
    var h = game.h;
    while (i < unitLocations.length) {
        col = unitLocations.listUnitLocations[i].x;
        row = unitLocations.listUnitLocations[i].y;
        color = game.colorsMap[row][col];
        h.drawHexagon({row, col}, color, "*");
        h.drawHexAtColRow(1, 1, "red");
    }
};

game.getListUnits = function () {
    var listUnitLocations = [],
        i = 0,
        col = 0,
        row = 0;
    while (col < game.COLS) {
        row = 0;
        while (row < game.ROWS) {
            if (game.unitsMap[col][row] === "*") {
                listUnitLocations.push({
                    x: 0,
                    y: 0
                });
                listUnitLocations[i] = {
                    x: row,
                    y: col
                };
                i += 1;
            }
            row += 1;
        }
        col += 1;
    }

    return listUnitLocations;
};