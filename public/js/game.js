/*jslint
    browser: true
*/
/*global console,setInterval,document,HexagonGrid,civilization,loop,unitFilm,cityFilm*/
//"use strict";

var game = {
    ROWS: 8,
    COLS: 20,
    VISIBLE: 0.9,
    FOG: 1.0,
    moving: false,
    activeUnitIndex: 0,
    colorsMap: null, //TODO: rename landsMap
    unitsMap: [
        []
    ],
    cityMap: null,
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

game.onload = function () {
    //menu
    game.createTabs();
    //preparations
    //map
    game.makePalette(game.FOG);
    game.makeColorMap();
    game.makeCityMap();

    game.assignUnits();

    game.grid();
    game.minimap();
    unitFilm.create();
    cityFilm.create();
    //fow
    //game.makeFogMap();
    //game.fogOfWar();
    //units
    //game.makeUnits();
    game.placeUnits();

    game.loop();
};

game.makePalette = function (alpha) {
    var reds = [0, 51, 255, 163, 128, 0, 0, 163];
    var greens = [102, 204, 204, 255, 128, 163, 51, 102];
    var blues = [0, 51, 0, 102, 128, 255, 102, 102];
    var i = 0;
    while (i < game.colorsLength) {
        game.colors[i] = "rgba(" +
            reds[i] + "," +
            greens[i] + "," +
            blues[i] + "," +
            alpha + ")";
        i += 1;
    }
};

game.getMapColor = function (col, row) {
    return game.colorsMap[col][row];
};

game.makeFogMap = function () {
    var row;
    var col;
    var g = game.init2DArray();
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

game.init2DArray = function () {
    var arr = [];
    while (arr.length < game.COLS) {
        arr.push([]);
    }
    return arr;
};

game.makeColorMap = function () {
    var row;
    game.colorsMap = game.init2DArray();
    var col = 0;
    while (col < game.COLS) {
        row = 0;
        while (row < game.ROWS) {
            game.colorsMap[col][row] = game.getRandomColor();
            row += 1;
        }
        col += 1;
    }
};

game.makeCityMap = function () {
    var row;
    game.cityMap = game.init2DArray();
    var col = 0;
    while (col < game.COLS) {
        row = 0;
        while (row < game.ROWS) {
            game.cityMap[col][row] = game.getRandomColor();
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
    var h = new HexagonGrid("map", 50, null);
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
            units[col][row] = "";
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
                    column: 0,
                    row: 0
                });
                listUnitLocations[i] = {
                    column: col,
                    row: row
                };
                i += 1;
            }
            row += 1;
        }
        col += 1;
    }

    return listUnitLocations;
};

game.incrementActiveUnitIndex = function () {
    console.log("game.getListUnits.length" + game.getListUnits().length);
    if (game.activeUnitIndex < game.getListUnits().length) {
        game.activeUnitIndex += 1;
    } else {
        game.activeUnitIndex = 0;
    }
    console.log("index : " + game.activeUnitIndex);
};

game.placeOneUnit = function (i, unitLocations, unitLayer) {
    var col = 0;
    var row = 0;
    var color = "";
    var coordinate = {
        x: 0,
        y: 0
    };
    var contents = {};
    col = unitLocations[i].column;
    row = unitLocations[i].row;
    coordinate.x = col;
    coordinate.y = row;
    contents.coordinate = coordinate;
    contents.color = "";
    contents.text = "*";
    unitLayer.drawHexAtColRow(col, row, color, "*");
};

game.placeUnits = function () {
    var i = 0;
    var unitLocations = game.getListUnits();
    var unitLayer = new HexagonGrid("unitFilm", 50, null);
    game.unitFilm = unitLayer;
    while (i < unitLocations.length) {
        game.placeOneUnit(i, unitLocations, unitLayer);
        i += 1;
    }

};

game.getHexCoordinates = function (column, row) {
    var drawy = 0;
    var radius = 50;
    var canvasOriginY = 50;
    var height = Math.sqrt(3) * radius;
    var side = (3 / 2) * radius;

    if (column % 2 === 0) {
        drawy = (row * height) + canvasOriginY;
    } else {
        drawy = (row * height) + canvasOriginY + (height / 2);
    }
    var canvasOriginX = 50;
    var drawx = (column * side) + canvasOriginX;
    return { x: drawx, y: drawy };
};

game.replaceUnits = function (context) {
    var i = 0;
    var unitLocations = game.getListUnits();
    var x = 0;
    var y = 0;
    var loc;
    var coordinates;
    console.log(unitLocations.length);
    while (i < unitLocations.length) {
        loc = unitLocations[i];
        coordinates = game.getHexCoordinates(loc.column, loc.row);
        x = coordinates.x - 25;
        y = coordinates.y + 25;
        context.font = "80px bold Times";
        console.log("unit loc x " + x + " y " + y);
        context.fillText("*", y, x);
        context.stroke();
        i += 1;
    }
};

game.loop = function () {
    loop.cycle();
};