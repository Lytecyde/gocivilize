/*global document*/
// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
"use strict";

var hex = {};

var Variables = {
    origin: {
        x: 0,
        y: 0
    },
    location: {
        column: 0,
        row: 0
    },
    mouse: {
        x: 0,
        y: 0
    },
    color: ""
};

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
    return hex;
};

var GetHex = function () {
    return hex;
};
//helper functionality
hex.getCurrentXY = function (offsetColumn, location, origin) {
    var currentHex = {
        x: 0,
        y: 0
    };
    if (!offsetColumn) {
        currentHex.x = (location.column * hex.side) + origin.x;
        currentHex.y = (location.row * hex.height) + origin.y;
        return ({
            currentHex
        });
    } else {
        currentHex.x = location.column * hex.side + origin.x;
        currentHex.y = (location.row * hex.height) + origin.y + (hex.height * 0.5);
        return ({
            currentHex
        });
    }
};

hex.getHex = function () {
    return hex;
};

hex.prepare = function (offsetColumn, location, origin) {
    var currentHex = hex.getCurrentXY(offsetColumn, location, origin);
    var coordinate = currentHex.currentHex;
    var text = "";
    return {
        coordinate,
        text
    };
};

function create2DArray(columns, rows) {
    var arr = [];
    arr.length = columns;
    var i = columns;
    var mapRows = [];
    mapRows.length = rows;
    while (i > 0) {
        arr[columns - i] = mapRows;
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

function getColumn(mouse, offSet) {
    var f1,
        f2;
    var location = Variables.location;
    mouse.x -= offSet.x;
    mouse.y -= offSet.y;
    location.column = Math.floor(mouse.x / hex.side);
    f1 = Math.floor(mouse.y / hex.height);
    f2 = Math.floor((mouse.y + (hex.height * 0.5)) / hex.height) - 1;
    if (isEvenColumn(location.column)) {
        location.row = f1;
    } else {
        location.row = f2;
    }
    return {
        mouse,
        location
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
hex.drawHexagon = function (hexContents) {
    var x0 = hexContents.coordinate.x,
        y0 = hexContents.coordinate.y;
    var fillColor = hexContents.color;
    var text = hexContents.text;
    var ctx = hex.context;
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(x0 + hex.width - hex.side, y0);
    ctx.lineTo(x0 + hex.side, y0);
    ctx.lineTo(x0 + hex.width, y0 + (hex.height / 2));
    ctx.lineTo(x0 + hex.side, y0 + hex.height);
    ctx.lineTo(x0 + hex.width - hex.side, y0 + hex.height);
    ctx.lineTo(x0, y0 + (hex.height / 2));

    if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    if (text) {
        ctx.fillText = text;
    }

    ctx.closePath();
    ctx.stroke();
};
//helper functions end

hex.Grid = (function () {
    var self = {};
    self.draw = function (rows, cols, x, y) {
        Variables.origin = {
            x: x,
            y: y
        };
        var offsetColumn = false;

        var hexGrid = create2DArray(cols, rows);

        var row = 0,
            col = 0;
        var c;
        while (row < rows) {
            while (col < cols) {
                Variables.location = {
                    column: col,
                    row: row
                };
                c = hex.prepare(offsetColumn, Variables.location, Variables.origin);
                //console.log("c x" + c.coordinate.x + "y" + c.coordinate.y);
                hexGrid[row][col] = hex.drawHexagon(c);
                col += 1;
                offsetColumn = !offsetColumn;
            }
            row += 1;
            col = 0;
        }
    };

    return self;
}());

hex.getHex = function () {
    return hex;
};

var isPointInTriangle = function (pt, v1, v2, v3) {
    var b1 = hex.sign(pt, v1, v2) < 0.0,
        b2 = hex.sign(pt, v2, v3) < 0.0,
        b3 = hex.sign(pt, v3, v1) < 0.0;

    return ((b1 === b2) && (b2 === b3));
};

function getXDifferenceOfEncirclement() {
    return [1, 1, 0, -1, -1, 0];
}

var getEncirclementOne = function (col, row) {
    //var numberOfTilesAroundHex = 6;
    var Encirclement = {};
    var h = {
        col: 0,
        row: 0
    };
    Encirclement.firstCircle = [h, h, h, h, h, h];
    Encirclement.dx = getXDifferenceOfEncirclement();
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

function getHexCoordinates(column, row) {
    var drawy = 0;
    if (isEvenColumn(column)) {
        drawy = (row * hex.height) + hex.canvasOriginY;
    } else {
        drawy = (row * hex.height) + hex.canvasOriginY + (hex.height / 2);
    }
    var drawx = (column * hex.side) + hex.canvasOriginX;
    return {drawx, drawy };
}

hex.drawHexAtColRow = function (column, row, color) {
    var hexCoordinate = {
        x: 0,
        y: 0
    };
    hexCoordinate = getHexCoordinates(column, row);
    hex.drawHexagon(hexCoordinate, color);
};

//Recursively step up to the body to calculate canvas offset.
var getRelativeCanvasOffset = function () {
    var x = 0,
        y = 0,
        layoutElement = hex.canvas;

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
    var p1 = {
        x: 0,
        y: 0
    };
    p1.x = column * tile.side;
    if (isEvenColumn(column)) {
        p1.y = row * tile.height;
    } else {
        p1.y = (row * tile.height) + (tile.height / 2);
    }
    return p1;
}

var getSelectedTile = function (mouseX, mouseY) {
    var offSet = hex.getRelativeCanvasOffset(),
        mousePoint,
        p1,
        p2,
        p3,
        p4,
        p5,
        p6;

    var data = Variables.mouse;
    var m = {
        x: mouseX,
        y: mouseY
    };
    data = getColumn(m, offSet);

    //Test if on left side of frame
    if (data.mouse.x > (data.location.column * hex.side) && data.mouse.x < (data.location.column * hex.side) + hex.width - hex.side) {
        //Now test which of the two triangles we are in
        //Top left triangle points
        p1 = get_p1(p1, data.location.column, data.row);

        p2 = get_p2(p1);

        p3 = get_p3(p1);

        mousePoint = {};
        mousePoint.x = data.mouse.x;
        mousePoint.y = data.mouse.y;

        if (isPointInTriangle(mousePoint, p1, p2, p3)) {
            data.location.column = data.location.column - 1;

            if (isEvenColumn(data.location.column)) {
                data.location.row = data.location.row - 1;
            }
        }

        //Bottom left triangle points
        p4 = {};
        p4 = p2;

        p5 = {};
        p5.x = p4.x;
        p5.y = p4.y + (hex.height / 2);

        p6 = {};
        p6.x = p5.x + (hex.width - hex.side);
        p6.y = p5.y;

        if (isPointInTriangle(mousePoint, p4, p5, p6)) {
            data.location.column = data.location.column - 1;

            if (isEvenColumn(data.location.column)) {
                data.location.row += 1;
            }
        }
    }

    return {
        row: data.location.row,
        column: data.location.column
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