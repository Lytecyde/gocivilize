/*jslint
    browser: true
*/
/*global console,setInterval,document,HexagonGrid,civilization,loop*/
//"use strict";

var game = {
    ROWS: 8,
    COLS: 20,
    VISIBLE: 0.9,
    FOG: 1.0,
    moving: false,
    colorsMap: [
        []
    ],
    unitsMap: [
        []
    ],
    fogMap: [
        []
    ],
    lastTile: {
        row: 0,
        column: 0
    },
    colors: [],
    x: 0,
    y: 0,
    //h: {},
    colorsLength: 8,
    hMap: {},
    hMini: {}
};

game.clickEventHandler = function (tile) {
    if (tile.column >= 0 && tile.row >= 0) {
        if (game.unitsMap[tile.column][tile.row] === "*") {
            var color = game.colorsMap[tile.column][tile.row];
            tile.clearHexAtColRow(tile.column, tile.row, color);
            game.moving = true;
            game.lastTile = tile;
            civilization.units[tile.column][tile.row] = "";
        }
    }

    if (game.moving && tile.isAroundTile(game.lastTile, tile)) {
        game.unitsMap[tile.column][tile.row] = "*";
        tile.drawHexAtColRow(tile.column, tile.row, "red", "*");
        game.moving = false;
    }
};

game.onload = function () {
    //menu
    game.createTabs();
    //preparations
    //map
    game.makePalette(game.FOG);
    game.makeColorMap();

    game.assignUnits();

    game.grid();
    game.minimap();
    //fow
    game.makeFogMap();
    game.fogOfWar();
    //units
    game.makeUnits();
    //game.placeUnit();

    game.loop();
};

game.makePalette = function (alpha) {
    var reds = [0, 51, 255, 163, 128, 0, 0, 163];
    var greens = [102, 204, 204, 255, 128, 163, 51, 102];
    var blues = [0, 51, 0, 102, 128, 255, 102, 102];
    var i = 0;
    while (i < game.colorsLength) {
        game.colors[i] = "rgba(" + reds[i] + ","
        + greens[i] + ","
        + blues[i] + ","
        + alpha + ")";
        i += 1;
    }
};

game.getMapColor = function (col, row) {
    return game.colorsMap[col][row];
};

game.create2DArray = function (columns, rows) {
    var arr = [
        []
    ];
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
    var row;
    var col;
    var g = game.create2DArray(game.COLS, game.ROWS);
    game.fogMap = g;

    col = 0;
    while (col < game.COLS) {
        row = 0;
        while (row < game.ROWS) {
            game.fogMap[row][col] = true;
            row += 1;
        }
        col += 1;
    }
    //return g;
};

game.getRandomColor = function () {
    return game.colors[Math.floor(Math.random() * game.colorsLength)];
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

game.grid = function () {
    var h = new HexagonGrid("map", 50, game.clickEventHandler);
    game.hMap = h;
    h.Grid.draw(game.ROWS, game.COLS, 50, 50, game.colorsMap);
    //version 0.0.2
    //draw game.fogOfWarColor;
};

game.minimap = function () {
    var h = new HexagonGrid("minimap", 5, null);
    game.hMini = h;
    h.Grid.draw(game.ROWS, game.COLS, 5, 5, game.colorsMap);
};

game.createTabs = function () {
    var tabs = document.querySelectorAll(".tab-box li a");
    var i = 0;

    while (i < tabs.length) {
        game.setTabHandler(tabs[i], i);
        i += 1;
    }
};

game.setTabHandler = function (tabs, tabPos) {
    var panels = document.querySelectorAll("article");
    var i = 0;

    tabs.onclick = function () {
        while (i < tabs.length) {
            tabs[i].className = "";
            i += 1;
        }

        tabs.className = "active";
        i = 0;
        while (i < panels.length) {
            panels[i].className = "";
            i = i + 1;
        }

        panels[tabPos].className = "active-panel";
    };
};

game.makeUnits = function () {
    var units = [];
    var col = 0;
    var row = 0;
    var r;
    while (col < game.COLS) {
        row = 0;
        units[col] = [];
        r = [];
        r.length = game.ROWS;
        units[col].push(r);
        while (row < game.ROWS) {
            units[col][row] = "*";
            row += 1;
        }
        col += 1;
    }
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
    var g = game.makeUnits();
    var sp = game.getStartingPoint();
    var x;
    var y;

    x = 0;
    while (x < game.COLS) {
        y = 0;
        while (y < game.ROWS) {
            if (x === sp.x && y === sp.y) {
                g[x][y] = "*";
            } else {
                g[x][y] = "u";
            }
            y += 1;
        }
        x += 1;
    }
    return g;
};

game.assignUnits = function () {
    game.unitsMap = game.makeUnitMap();
};

game.removeUnit = function (drawx, drawy, tile) {
    tile.drawHex(drawx, drawy - 6, game.colorsMap[tile.column][tile.row], "");
};

game.getListUnits = function () {
    var listUnitLocations = [];
    var i = 0;
    var col = 0;
    var row = 0;
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

function placeOneUnit(i, unitLocations, unitLayer) {
    var col = 0;
    var row = 0;
    var color = "";
    var coordinate = {
        x: 0,
        y: 0
    };
    var contents = {};
    col = unitLocations[i].x;
    row = unitLocations[i].y;
    color = game.colorsMap[row][col];
    coordinate.x = col;
    coordinate.y = row;
    contents.coordinate = coordinate;
    contents.color = color;
    contents.text = "*";
    unitLayer.drawHexAtColRow(row, col, color, "*");
    i += 1;
    return i;
}

game.placeUnit = function () {
    var i = 0;
    var unitLocations = game.getListUnits();
    var unitLayer = new HexagonGrid("map", 50, game.clickEventHandler);
    while (i < unitLocations.length) {
        i = placeOneUnit(i, unitLocations, unitLayer);
    }
};

game.loop = function () {
    const framesPerSecond = {
        thirty: 1000 / 30,
        sixty: 1000 / 60
    };
    setInterval(loop.cycle(), framesPerSecond.thirty);
};