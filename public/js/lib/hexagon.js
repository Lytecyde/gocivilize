/*global document*/
// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
"use strict";

function HexagonGrid(canvasId, radius, clickEventHandler) {
    this.radius = radius;

    this.height = Math.sqrt(3) * radius;
    this.width = 2 * radius;
    this.side = (3 / 2) * radius;

    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.canvasOriginX = 0;
    this.canvasOriginY = 0;

    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);

    this.clickEventHandler = clickEventHandler;
}

//helper functionality
function isEvenColumn(column) {
    return column % 2 === 0;
}

function getCurrentHexXY(offsetColumn, col, row, originX, originY, t) {
    var currentHex = {
        x: 0,
        y: 0
    };
    if (!offsetColumn) {
        currentHex.x = (col * t.side) + originX;
        currentHex.y = (row * t.height) + originY;
    } else {
        currentHex.x = col * t.side + originX;
        currentHex.y = (row * t.height) + originY + (t.height * 0.5);
    }
    return {currentHex};
}

function getYCoordinateOfEncirclement(col) {
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

function getColumn(mouseX, offSet, mouseY, t) {
    var column,
        row,
        f1,
        f2;
    mouseX -= offSet.x;
    mouseY -= offSet.y;
    column = Math.floor(mouseX / t.side);
    f1 = Math.floor(mouseY / t.height);
    f2 = Math.floor((mouseY + (t.height * 0.5)) / t.height) - 1;
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

//helper functions end

HexagonGrid.prototype.drawHexGrid = function (rows, cols, originX, originY, colorFunc) {
    this.canvasOriginX = originX;
    this.canvasOriginY = originY;

    var currentHex = {
        x: 0,
        y: 0
    };
    var offsetColumn = false,
        col,
        row,
        color;
    var t = this;
    for (col = 0; col < cols; col += 1) {
        for (row = 0; row < rows; row += 1) {
            currentHex = getCurrentHexXY(offsetColumn, col, row, originX, originY, t);
            color = colorFunc(col, row);
            this.drawHexagon(currentHex.x, currentHex.y, color);
        }
        offsetColumn = !offsetColumn;
    }
};

HexagonGrid.prototype.getEncirclementOne = function (col, row) {
    //var numberOfTilesAroundHex = 6;
    var h = {
        col: 0,
        row: 0
    };
    var encirclement = [h, h, h, h, h, h];
    var dx = [1, 1, 0, -1, -1, 0];
    var dy = getYCoordinateOfEncirclement(col);
    var i = 0;
    encirclement.map(function (en) {
        en = {
            col: col + dx[i],
            row: row + dy[i]
        };
        encirclement[i] = en;
        i += 1;
    });
    return encirclement;
};

HexagonGrid.prototype.drawHexAtColRow = function (column, row, color) {
    var drawy;
    if (isEvenColumn(column)) {
        drawy = (row * this.height) + this.canvasOriginY;
    } else {
        drawy = (row * this.height) + this.canvasOriginY + (this.height / 2);
    }
    var drawx = (column * this.side) + this.canvasOriginX;

    this.drawHexagon(drawx, drawy, color);
};

HexagonGrid.prototype.drawHexagon = function (x0, y0, fillColor) {
    this.context.strokeStyle = "#000";
    this.context.beginPath();
    this.context.moveTo(x0 + this.width - this.side, y0);
    this.context.lineTo(x0 + this.side, y0);
    this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
    this.context.lineTo(x0 + this.side, y0 + this.height);
    this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
    this.context.lineTo(x0, y0 + (this.height / 2));

    if (fillColor) {
        this.context.fillStyle = fillColor;
        this.context.fill();
    }

    this.context.closePath();
    this.context.stroke();
};

//Recursively step up to the body to calculate canvas offset.
HexagonGrid.prototype.getRelativeCanvasOffset = function () {
    var x = 0,
        y = 0,
        layoutElement = this.canvas;

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

HexagonGrid.prototype.getSelectedTile = function (mouseX, mouseY) {
    var offSet = this.getRelativeCanvasOffset(),
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

    data = getColumn(mouseX, offSet, mouseY, this);

    //Test if on left side of frame
    if (data.mouseX > (data.column * this.side) && data.mouseX < (data.column * this.side) + this.width - this.side) {
        //Now test which of the two triangles we are in
        //Top left triangle points
        p1 = get_p1(p1, data.column, data.row);

        p2 = get_p2(p1);

        p3 = get_p3(p1);

        mousePoint = {};
        mousePoint.x = data.mouseX;
        mousePoint.y = data.mouseY;

        if (this.isPointInTriangle(mousePoint, p1, p2, p3)) {
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
        p5.y = p4.y + (this.height / 2);

        p6 = {};
        p6.x = p5.x + (this.width - this.side);
        p6.y = p5.y;

        if (this.isPointInTriangle(mousePoint, p4, p5, p6)) {
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

HexagonGrid.prototype.sign = function (p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
};

HexagonGrid.prototype.isPointInTriangle = function isPointInTriangle(pt, v1, v2, v3) {
    var b1 = this.sign(pt, v1, v2) < 0.0,
        b2 = this.sign(pt, v2, v3) < 0.0,
        b3 = this.sign(pt, v3, v1) < 0.0;

    return ((b1 === b2) && (b2 === b3));
};

HexagonGrid.prototype.clickEvent = function (e) {
    if (!this.clickEventHandler) {
        return;
    }

    var mouseX = e.pageX,
        mouseY = e.pageY,
        localX = mouseX - this.canvasOriginX,
        localY = mouseY - this.canvasOriginY,
        tile = this.getSelectedTile(localX, localY);

    this.clickEventHandler(tile);
};

//!!!linting for loop !!!
HexagonGrid.prototype.isAroundTile = function (lastTile, tile) {
    var listAroundTile = lastTile.getEncirclementOne(lastTile.column, lastTile.row);
    listAroundTile.foreach(function (h) {
        if (h.col === tile.column && h.row === tile.row) {
            return true;
        }
    });

    return false;
};