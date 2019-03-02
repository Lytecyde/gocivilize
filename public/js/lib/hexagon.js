/*global document*/
// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
"use strict";

var hex = {};
var HexagonGrid = function (canvasId, radius, clickEventHandler) {
    hex.radius = radius;

    hex.height = Math.sqrt(3) * radius;
    hex.width = 2 * radius;
    hex.side = (3 / 2) * radius;

    hex.canvas = document.getElementById(canvasId);
    hex.context = hex.canvas.getContext('2d');

    hex.canvasOriginX = 0;
    hex.canvasOriginY = 0;

    hex.canvas.addEventListener("mousedown", hex.clickEvent.bind(hex), false);

    hex.clickEventHandler = clickEventHandler;
};

//helper functionality
function getCurrentHexXY(offsetColumn, col, row, originX, originY) {
    var currentHex = {
        x: 0,
        y: 0
    };
    if (!offsetColumn) {
        currentHex.x = (col * hex.side) + originX;
        currentHex.y = (row * hex.height) + originY;
        return {currentHex};
    } else {
        currentHex.x = col * hex.side + originX;
        currentHex.y = (row * hex.height) + originY + (hex.height * 0.5);
        return {currentHex};
    }
}

function prepareHex(currentHex, offsetColumn, col, row, originX, originY, color, colorFunc) {
    currentHex = getCurrentHexXY(offsetColumn, col, row, originX, originY);
    color = colorFunc(col, row);
    return {currentHex, color};
}

function create2DArray(columns, rows) {
    var arr = [];
    arr.length = rows;
    var i = columns;
    var mapRows = [];
    mapRows.length = rows;
    while (i > 0) {
        arr[columns - 1 - i] = mapRows;
        i -= 1;
    }

    return arr;
}

function isEvenColumn(column) {
    return column % 2 === 0;
}

function getYDifferenceOfEncirclement(col) {
    var dy;
    var dy1 = [-1, 0, 1, 0, -1, -1];
    var dy2 = [0, 1, 1, 1, 0, -1];
    if (isEvenColumn(col)) {
        dy = dy1;
    } else {
        dy = dy2;
    }
    return dy;
}

function getColumn(mouseX, offSet, mouseY) {
    var column,
        row,
        f1,
        f2;
    mouseX -= offSet.x;
    mouseY -= offSet.y;
    column = Math.floor(mouseX / hex.side);
    f1 = Math.floor(mouseY / hex.height);
    f2 = Math.floor((mouseY + (hex.height * 0.5)) / hex.height) - 1;
    if (isEvenColumn(column)) {
        row = f1;
    } else {
        row = f2;
    }
    return {
        mouseX,
        mouseY,
        column,
        f1,
        f2,
        row
    };
}

function get_p3(p1, t) {
    var p3 = {};
    p3.x = p1.x + t.width - t.side;
    p3.y = p1.y;
    return p3;
}

function get_p2(p1, t) {
    var p2 = {};
    p2.x = p1.x;
    p2.y = p1.y + (t.height / 2);
    return p2;
}
var drawHexagon = function (currentHex, fillColor) {
    var DrawHexagon = {};
    var x0 = currentHex.x,
        y0 = currentHex.y;
    DrawHexagon.context = hex.context;
    DrawHexagon.context.strokeStyle = "#000";
    DrawHexagon.context.beginPath();
    DrawHexagon.context.moveTo(x0 + DrawHexagon.width - DrawHexagon.side, y0);
    DrawHexagon.context.lineTo(x0 + DrawHexagon.side, y0);
    DrawHexagon.context.lineTo(x0 + DrawHexagon.width, y0 + (DrawHexagon.height / 2));
    DrawHexagon.context.lineTo(x0 + DrawHexagon.side, y0 + DrawHexagon.height);
    DrawHexagon.context.lineTo(x0 + DrawHexagon.width - DrawHexagon.side, y0 + DrawHexagon.height);
    DrawHexagon.context.lineTo(x0, y0 + (DrawHexagon.height / 2));

    if (fillColor) {
        DrawHexagon.context.fillStyle = fillColor;
        DrawHexagon.context.fill();
    }

    DrawHexagon.context.closePath();
    DrawHexagon.context.stroke();
};
//helper functions end

var Grid = (function () {
    var self = {};
    self.draw = function (rows, cols, originX, originY, colorFunc) {
        hex.canvasOriginX = originX;
        hex.canvasOriginY = originY;

        var currentHexCoordinate = {
            x: 0,
            y: 0
        };

        var offsetColumn = false,
            color = "";

        var hexContents = {
            currentHexCoordinate: {
                x: 0,
                y: 0
            },
            color: ""
        };

        var hexGrid = create2DArray(cols, rows);

        var row = 0,
            col = 0;
        while (row < rows) {
            while (col < cols) {
                hexContents = prepareHex(currentHexCoordinate, offsetColumn, col, row, originX, originY, color, colorFunc);
                hexGrid[row][col] = drawHexagon(hexContents);
                col += 1;
            }
            row += 1;
            offsetColumn = !offsetColumn;
        }
    };

    return self;
}());

var Grinwald = function () {
    Grid.draw();
};

var isPointInTriangle = function (pt, v1, v2, v3) {
    var b1 = hex.sign(pt, v1, v2) < 0.0,
        b2 = hex.sign(pt, v2, v3) < 0.0,
        b3 = hex.sign(pt, v3, v1) < 0.0;

    return ((b1 === b2) && (b2 === b3));
};

var getEncirclementOne = function (col, row) {
    //var numberOfTilesAroundHex = 6;
    var Encirclement = {};
    var h = {
        col: 0,
        row: 0
    };
    Encirclement.firstCircle = [h, h, h, h, h, h];
    Encirclement.dx = [1, 1, 0, -1, -1, 0];
    Encirclement.dy = getYDifferenceOfEncirclement(col);
    var i = 0;
    Encirclement.firstCircle.map(function (en) {
        en = {
            col: col + Encirclement.dx[i],
            row: row + Encirclement.dy[i]
        };
        Encirclement.firstCircle[i] = en;
        i += 1;
    });
    return Encirclement.firstCircle;
};

var drawHexAtColRow = function (column, row, color) {
    var HexAt = {};
    HexAt.drawy = 0;
    if (isEvenColumn(column)) {
        HexAt.drawy = (row * HexAt.height) + HexAt.canvasOriginY;
    } else {
        HexAt.drawy = (row * HexAt.height) + HexAt.canvasOriginY + (HexAt.height / 2);
    }
    HexAt.drawx = (column * HexAt.side) + HexAt.canvasOriginX;
    var hexCoordinate = {
        x: HexAt.drawx,
        y: HexAt.drawy
    };
    drawHexagon(hexCoordinate, color);
};

//Recursively step up to the body to calculate canvas offset.
var getRelativeCanvasOffset = function () {
    var x = 0,
        y = 0,
        layoutElement = Grid.canvas;

    if (layoutElement.offsetParent) {
        do {
            x += layoutElement.offsetLeft;
            y += layoutElement.offsetTop;
        } while (layoutElement === layoutElement.offsetParent);

        return {
            x: x,
            y: y
        };
    }
};

//Uses a grid overlay algorithm to determine hexagon location
//Left edge of grid has a test to accurately determine correct hex
function get_p1(column, row, tile) {
    var p1 = {};
    p1.x = column * tile.side;
    if (isEvenColumn(column)) {
        p1.y = row * tile.height;
    } else {
        p1.y = (row * tile.height) + (tile.height / 2);
    }
    return p1;
}

var getSelectedTile = function (mouseX, mouseY) {
    var offSet = Grid.getRelativeCanvasOffset(),
        mousePoint,
        p1,
        p2,
        p3,
        p4,
        p5,
        p6;

    var data = {
        mouseX: mouseX,
        mouseY: mouseY,
        column: 0,
        f1: 0,
        f2: 0,
        row: 0
    };

    data = getColumn(mouseX, offSet, mouseY);

    //Test if on left side of frame
    if (data.mouseX > (data.column * Grid.side) && data.mouseX < (data.column * Grid.side) + Grid.width - Grid.side) {
        //Now test which of the two triangles we are in
        //Top left triangle points
        p1 = get_p1(p1, data.column, data.row);

        p2 = get_p2(p1);

        p3 = get_p3(p1);

        mousePoint = {};
        mousePoint.x = data.mouseX;
        mousePoint.y = data.mouseY;

        if (isPointInTriangle(mousePoint, p1, p2, p3)) {
            data.column = data.column - 1;

            if (isEvenColumn(data.column)) {
                data.row = data.row - 1;
            }
        }

        //Bottom left triangle points
        p4 = {};
        p4 = p2;

        p5 = {};
        p5.x = p4.x;
        p5.y = p4.y + (Grid.height / 2);

        p6 = {};
        p6.x = p5.x + (Grid.width - Grid.side);
        p6.y = p5.y;

        if (isPointInTriangle(mousePoint, p4, p5, p6)) {
            data.column = data.column - 1;

            if (isEvenColumn(data.column)) {
                data.row += 1;
            }
        }
    }

    return {
        row: data.row,
        column: data.column
    };
};

var sign = function (p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
};

hex.clickEvent = function (e) {
    if (!hex.clickEventHandler) {
        return;
    }

    var mouseX = e.pageX,
        mouseY = e.pageY,
        localX = mouseX - hex.canvasOriginX,
        localY = mouseY - hex.canvasOriginY,
        tile = hex.getSelectedTile(localX, localY);

    hex.clickEventHandler(tile);
};

//!!!linting for loop !!!
var isAroundTile = function (lastTile, tile) {
    var listAroundTile = lastTile.getEncirclementOne(lastTile.column, lastTile.row);
    listAroundTile.foreach(function (h) {
        if (h.col === tile.column && h.row === tile.row) {
            return true;
        }
    });

    return false;
};