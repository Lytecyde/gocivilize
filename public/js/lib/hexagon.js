/*global document*/
// Hex math defined here: http://blog.ruslans.com/2011/02/hexagonal-grid-math.html
"use strict";

function HexagonGrid(canvasId, radius) {
    this.radius = radius;

    this.height = Math.sqrt(3) * radius;
    this.width = 2 * radius;
    this.side = (3 / 2) * radius;

    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.canvasOriginX = 0;
    this.canvasOriginY = 0;

    this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);
}

HexagonGrid.prototype.drawHexGrid = function (rows, cols, originX, originY, colorFunc) {
    this.canvasOriginX = originX;
    this.canvasOriginY = originY;

    var currentHexX,
        currentHexY,
        offsetColumn = false,
        col,
        row,
        color;

    for (col = 0; col < cols; col += 1) {
        for (row = 0; row < rows; row += 1) {
            if (!offsetColumn) {
                currentHexX = (col * this.side) + originX;
                currentHexY = (row * this.height) + originY;
            } else {
                currentHexX = col * this.side + originX;
                currentHexY = (row * this.height) + originY + (this.height * 0.5);
            }

            color = colorFunc(col, row);
            this.drawHexagon(currentHexX, currentHexY, color);
        }

        offsetColumn = !offsetColumn;
    }
};

HexagonGrid.prototype.getEncirclementOne = function (col, row) {
    var numberOfTilesAroundHex = 6,
        encirclement = [],
        dx = [ 1, 1, 0, -1, -1, 0],
        dy1 = [ -1, 0, 1, 0 , -1, -1],
        dy2 = [ 0, 1, 1, 1, 0, -1],
        dy = col % 2 === 0 ? dy1 : dy2,
        i;

    for (i = 0; i < numberOfTilesAroundHex; i += 1) {
        encirclement[i] = {COL: col + dx[i], ROW: row + dy[i] };
    }

    return encirclement;
};

HexagonGrid.prototype.drawHexAtColRow = function (column, row, color) {
    var drawy = column % 2 === 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2),
        drawx = (column * this.side) + this.canvasOriginX;

    this.drawHexagon(drawx, drawy, color);
};

HexagonGrid.prototype.clearHexAtColRow = function (column, row) {
    var drawy = column % 2 === 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2),
        drawx = (column * this.side) + this.canvasOriginX,
        color = app.map[column][row];
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
        } while (layoutElement = layoutElement.offsetParent);
        return {
            x: x,
            y: y,
        };
    }
};

//Uses a grid overlay algorithm to determine hexagon location
//Left edge of grid has a test to accurately determine correct hex
HexagonGrid.prototype.getSelectedTile = function (mouseX, mouseY) {
    var offSet = this.getRelativeCanvasOffset(),
        mousePoint,
        p1,
        p2,
        p3,
        p4,
        p5,
        p6,
        column,
        row;

    mouseX -= offSet.x;
    mouseY -= offSet.y;

    column = Math.floor((mouseX) / this.side);
    row = Math.floor(
        column % 2 === 0
            ? Math.floor((mouseY) / this.height)
            : Math.floor(((mouseY + (this.height * 0.5)) / this.height)) - 1);

    //Test if on left side of frame
    if (mouseX > (column * this.side) && mouseX < (column * this.side) + this.width - this.side) {
        //Now test which of the two triangles we are in
        //Top left triangle points
        p1 = {};
        p1.x = column * this.side;
        p1.y = column % 2 === 0
            ? row * this.height
            : (row * this.height) + (this.height / 2);

        p2 = {};
        p2.x = p1.x;
        p2.y = p1.y + (this.height / 2);

        p3 = {};
        p3.x = p1.x + this.width - this.side;
        p3.y = p1.y;

        mousePoint = {};
        mousePoint.x = mouseX;
        mousePoint.y = mouseY;

        if (this.isPointInTriangle(mousePoint, p1, p2, p3)) {
            column--;

            if (column % 2 != 0) {
                row--;
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
            column--;

            if (column % 2 === 0) {
                row += 1;
            }
        }
    }

    return {
        row: row,
        column: column,
    };
};

HexagonGrid.prototype.sign = function (p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
};

//TODO: Replace with optimized barycentric coordinate method
HexagonGrid.prototype.isPointInTriangle = function isPointInTriangle(pt, v1, v2, v3) {
    var b1 = this.sign(pt, v1, v2) < 0.0,
        b2 = this.sign(pt, v2, v3) < 0.0,
        b3 = this.sign(pt, v3, v1) < 0.0;

    return ((b1 === b2) && (b2 === b3));
};

HexagonGrid.prototype.clickEvent = function (e) {
    var mouseX = e.pageX,
        mouseY = e.pageY,
        localX = mouseX - this.canvasOriginX,
        localY = mouseY - this.canvasOriginY,
        tile = this.getSelectedTile(localX, localY);

    if (tile.column >= 0 && tile.row >= 0) {
        drawy = tile.column % 2 === 0 ? (tile.row * this.height) + this.canvasOriginY + 6 : (tile.row * this.height) + this.canvasOriginY + 6 + (this.height / 2);
        drawx = (tile.column * this.side) + this.canvasOriginX;
        if (civilization.units[tile.column][tile.row] === "*") {
            color = app.map[column][row];
            this.clearHexAtColRow(tile.column, tile.row);
            app.MOVING = true;
            app.lastTile = tile;
            civilization.units[tile.column][tile.row] = "";
        };
    }

    if (app.MOVING && this.isAroundTile(app.lastTile, tile)) {
        civilization.units[tile.column][tile.row] = "*";
        this.drawHexAtColRow(tile.column, tile.row);
        this.visible();
        app.MOVING = false;
    }
};

HexagonGrid.prototype.isAroundTile = function (lastTile, tile) {
    var h;

    for (h of this.getEncirclementOne(lastTile.column, lastTile.row)) {
        if (h.COL === tile.column && h.ROW === tile.row) {
            return true;
        };
    };

    return false;
};

HexagonGrid.prototype.visible = function () {
    var units = civilization.units,
        u,
        h;

    for (u of getListUnits(units)) {
        this.drawHexAtColRow(u.x, u.y, app.map[u.x][u.y]);
        for (h of this.getEncirclementOne(u.x, u.y)) {
            this.drawHexAtColRow(h.COL, h.ROW, app.map[h.COL][h.ROW]);
        }
    }

    function getListUnits(units) {
        var listUnitLocations = [],
            i = 0,
            x,
            y;

        for (x = 0; x < app.COLS; x += 1) {
            for (y = 0; y < app.ROWS; y += 1) {
                if (units[x][y] === "*") {
                    listUnitLocations[i++] = {
                        x: x,
                        y: y,
                    };
                }
            }
        }

        return listUnitLocations;
    }
};
