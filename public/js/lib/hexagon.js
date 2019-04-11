/*jslint
    browser: true
*/
/*global document,constants*/
// Hex math defined here:
//http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
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
    colorsMap: []
};

var HexagonGrid = function (canvasId, radius, clickEventHandler) {
    hex.radius = radius;

    hex.height = Math.sqrt(3) * radius;
    hex.width = 2 * radius;
    hex.side = (3 / 2) * radius;

    hex.canvas = document.getElementById(canvasId);
    hex.context = hex.canvas.getContext("2d");

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
    var coordinate = {
        x: 0,
        y: 0
    };
    if (offsetColumn) {
        coordinate.x = location.column * hex.side + origin.x;
        coordinate.y = (location.row * hex.height) +
            origin.y + (hex.height * 0.5);
        return ({
            coordinate
        });
    } else {
        coordinate.x = (location.column * hex.side) + origin.x;
        coordinate.y = (location.row * hex.height) + origin.y;
        return ({
            coordinate
        });
    }
};

hex.prepare = function (offsetColumn, location, origin, colors) {
    var currentHex = hex.getCurrentXY(offsetColumn, location, origin);
    var coordinate = currentHex.coordinate;
    var text = "";
    var color = colors[location.column][location.row];
    return {
        coordinate: coordinate,
        color: color,
        text: text
    };
};

function isEvenColumn(column) {
    return column % 2 === 0;
}

function getColumn(mouse, offSet) {
    var f1;
    var f2;
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
        mouse, //TODO check if this is extra knowledge
        location
    };
}

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
    var x0 = hexContents.coordinate.x;
    var y0 = hexContents.coordinate.y;
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
        ctx.fillStyle = "#000";
        ctx.font = "80px bold Times";
        ctx.fillText(text, x0 + (hex.width / 4), y0 + hex.height);
    }

    ctx.closePath();
    ctx.stroke();
};
//helper functions end
var init2DArray = function () {
    var arr = [];
    while (arr.length < constants.mapDimensions.cols) {
        arr.push([]);
    }
    return arr;
};

hex.Grid = (function () {
    var self = {};
    self.draw = function (rows, cols, x, y, colors) {
        Variables.origin = {
            x: x,
            y: y
        };
        Variables.colorsMap = colors;
        var offsetColumn = false;
        var hexGrid = init2DArray();
        var row = 0;
        var col = 0;
        var c;
        while (row < rows) {
            while (col < cols) {
                Variables.location = {
                    column: col,
                    row: row
                };
                c = hex.prepare(offsetColumn,
                    Variables.location,
                    Variables.origin,
                    Variables.colorsMap);
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

hex.isAbove = function (p, p1, p2) {
    var difference = (p.x - p2.x) * (p1.y - p2.y) -
        (p1.x - p2.x) * (p.y - p2.y);
    if (difference < 0.0) {
        return true;
    }
    return false;
};

var isPointInTriangle = function (pt, v1, v2, v3) {
    var b1 = hex.isAbove(pt, v1, v2);
    var b2 = hex.isAbove(pt, v2, v3);
    var b3 = hex.isAbove(pt, v3, v1);
    return ((b1 === b2) && (b2 === b3)); //
};
//todo: encirclement obj

function getXDifferenceOfEncirclement() {
    return [1, 1, 0, -1, -1, 0];
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

hex.getEncirclementOne = function (col, row) {
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
///////////////////////
hex.getHexCoordinates = function (column, row) {
    var drawy = 0;
    hex.canvasOriginY = 50;
    if (isEvenColumn(column)) {
        drawy = (row * hex.height) + hex.canvasOriginY;
    } else {
        drawy = (row * hex.height) + hex.canvasOriginY + (hex.height / 2);
    }
    hex.canvasOriginX = 50;
    var drawx = (column * hex.side) + hex.canvasOriginX;
    return { x: drawx, y: drawy };
};
// TODO: parameters to contents
hex.drawHexAtColRow = function (column, row, color, text) {
    var coordinate = {
        x: 0,
        y: 0
    };
    coordinate = hex.getHexCoordinates(column, row);
    var contents = {};
    contents.coordinate = coordinate;
    contents.color = color;
    contents.text = text;

    hex.drawHexagon(contents);
};

//Recursively step up to the body to calculate canvas offset.
var getRelativeCanvasOffset = function () {
    var x = 0;
    var y = 0;
    var layoutElement = hex.canvas;

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

function getLocationAbove(mousePoint, p1, p2, p3, data) {
    if (isPointInTriangle(mousePoint, p1, p2, p3)) {
        data.location.column = data.location.column - 1;
        if (isEvenColumn(data.location.column)) {
            data.location.row += -1;
        }
    }
    return data.location;
}

function getLocationBelow(mousePoint, p4, p5, p6, data) {
    if (isPointInTriangle(mousePoint, p4, p5, p6)) {
        data.location.column = data.location.column - 1;

        if (isEvenColumn(data.location.column)) {
            data.location.row += 1;
        }
    }
}

hex.getSelectedTile = function (mouseX, mouseY) {
    var offSet = getRelativeCanvasOffset();
    var mousePoint;
    var p1;
    var p2;
    var p3;
    var p4;
    var p5;
    var p6;

    var data = Variables.mouse;
    mousePoint = {};
    mousePoint.x = mouseX;
    mousePoint.y = mouseY;
    data = getColumn(mousePoint, offSet);

    //Test if on left side of frame
    //TODO : fix test
    var minBorderX = data.location.column * hex.side;
    var maxBorderX = (data.location.column * hex.side) + hex.width - hex.side;

    if (mouseX > minBorderX &&
        mouseX < maxBorderX) {
        //Now test which of the two triangles we are in
        //Top left triangle points
        p1 = get_p1(data.location.column, data.location.row, hex);

        p2 = get_p2(p1, hex);

        p3 = get_p3(p1, hex);

        getLocationAbove(mousePoint, p1, p2, p3, data);

        //Bottom left triangle points
        p4 = {};
        p4 = p2;

        p5 = {};
        p5.x = p4.x;
        p5.y = p4.y + (hex.height / 2);

        p6 = {};
        p6.x = p5.x + (hex.width - hex.side);
        p6.y = p5.y;

        getLocationBelow(mousePoint, p4, p5, p6, data, data);
    }

    return {
        column: data.location.column,
        row: data.location.row
    };
};

hex.clickEvent = function (e) {
    if (!hex.clickEventHandler) {
        return;
    }

    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var localX = mouseX - hex.canvasOriginX;
    var localY = mouseY - hex.canvasOriginY;
    var tile = hex.getSelectedTile(localX, localY);

    hex.clickEventHandler(tile);
};

//!!!tODO fix error
hex.isAroundTile = function (centreTile, tile) {
    var listAroundTile = hex.getEncirclementOne(centreTile.column,
        centreTile.row);
    var isAdjacent = false;
    listAroundTile.forEach(function (h) {
        if (h.column === tile.column && h.row === tile.row) {
            isAdjacent = true;
        }
    });

    return isAdjacent;
};