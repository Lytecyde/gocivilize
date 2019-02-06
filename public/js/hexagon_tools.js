"use strict";

var HT = HT || {};
var selected = true;
/**
 * A Point is  x and y coordinates
 * @constructor
 */
HT.Point = function(x, y) {
    var X = x;
    var Y = y;
};


//variables 
var Points = [];
var Id;

var TopLeftPoint;
var BottomRightPoint;
var MidPoint;
var P1;

var topLeftX, topLeftY;
/**
 * A Rectangle is x and y origin and width and height
 * @constructor
 */
HT.Rectangle = function(x, y, width, height) {
    /*
    var X = x;
    var Y = y;
    var Width = width;
    var Height = height;
    */
};

/**
 * A Line is x and y start and x and y end
 * @constructor
 */
HT.Line = function(x1, y1, x2, y2) {
    var X1 = x1;
    var Y1 = y1;
    var X2 = x2;
    var Y2 = y2;
};

/**
 * A Hexagon is a 6 sided polygon, our hexes don't have to be symmetrical, i.e. ratio of width to height could be 4 to 3
 * @constructor
 */
HT.Hexagon = function(id, x, y) {
    topLeftX = x;
    topLeftY = y;
    var x1 = null;
    var y1 = null;
    if (HT.Hexagon.Static.ORIENTATION == HT.Hexagon.Orientation.Normal) {
        x1 = (HT.Hexagon.Static.WIDTH - HT.Hexagon.Static.SIDE) / 2;
        y1 = (HT.Hexagon.Static.HEIGHT / 2);
        Points.push(new HT.Point(x1 + x, y));
        Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, y));
        Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + y));
        Points.push(new HT.Point(x1 + HT.Hexagon.Static.SIDE + x, HT.Hexagon.Static.HEIGHT + y));
        Points.push(new HT.Point(x1 + x, HT.Hexagon.Static.HEIGHT + y));
        Points.push(new HT.Point(x, y1 + y));
    } else {
        x1 = (HT.Hexagon.Static.WIDTH / 2);
        y1 = (HT.Hexagon.Static.HEIGHT - HT.Hexagon.Static.SIDE) / 2;
        Points.push(new HT.Point(x1 + x, y));
        Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + y));
        Points.push(new HT.Point(HT.Hexagon.Static.WIDTH + x, y1 + HT.Hexagon.Static.SIDE + y));
        Points.push(new HT.Point(x1 + x, HT.Hexagon.Static.HEIGHT + y));
        Points.push(new HT.Point(x, y1 + HT.Hexagon.Static.SIDE + y));
        Points.push(new HT.Point(x, y1 + y));
    }

    Id = id;
    TopLeftPoint = new HT.Point(x, y);
    BottomRightPoint = new HT.Point(x + HT.Hexagon.Static.WIDTH, y + HT.Hexagon.Static.HEIGHT);
    MidPoint = new HT.Point(x + (HT.Hexagon.Static.WIDTH / 2), y + (HT.Hexagon.Static.HEIGHT / 2));
    P1 = new HT.Point(x + x1, y + y1);
    selected = false;
};

function getRandomColor() {
    var letters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    var colorCode = ['', '', '', '', '', ''];
    var hash = '#';
    var i = 0;
    colorCode.foreach(function(i) {
        colorCode[i] = letters[Math.floor(Math.random() * 16)];
        i += 1;
    });
    return hash + colorCode.toString;
}

/**
 * draws this Hexagon to the canvas
 * @this {HT.Hexagon}
 */
HT.Hexagon.prototype.draw = function(ctx) {
    var fillingColor = getRandomColor();
    if (!selected) {
        ctx.strokeStyle = "grey";
    } else {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Points[0].X, Points[0].Y);
        var i;
        var p;
        Points.forEach(function(element) {
            ctx.lineTo(p.X, p.Y);
        });
        ctx.fillStyle = fillingColor;
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }
    if (Id) {
        //draw text for debugging
        ctx.fillStyle = "black";
        ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
        var sizeMinimap = 200;
        if (ctx.canvas.width != sizeMinimap) {
            ctx.fillText(Id, MidPoint.X, MidPoint.Y);
        }
    }

    if (this.PathCoOrdX !== null && this.PathCoOrdY !== null && typeof(this.PathCoOrdX) != "undefined" && typeof(this.PathCoOrdY) != "undefined") {
        //draw co-ordinates for debugging
        ctx.fillStyle = "black";
        ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
        ctx.fillText("(" + this.PathCoOrdX + "," + this.PathCoOrdY + ")", this.MidPoint.X, this.MidPoint.Y + 10);
    }

    if (HT.Hexagon.Static.DRAWSTATS) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        //draw our x1, y1, and z
        ctx.beginPath();
        ctx.moveTo(P1.X, topLeftY);
        ctx.lineTo(P1.X, P1.Y);
        ctx.lineTo(topLeftX, P1.Y);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = 'middle';
        //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
        ctx.fillText("z", topLeftX + HT.Line.x1 / 2 - 8, topLeftY + HT.Line.y1 / 2);
        ctx.fillText("x", topLeftX + HT.Line.x1 / 2, P1.Y + 10);
        ctx.fillText("y", P1.X + 2, topLeftY + HT.Line.y1 / 2);
        ctx.fillText("z = " + HT.Hexagon.Static.SIDE, P1.X, P1.Y + HT.Line.y1 + 10);
        ctx.fillText("(" + x1.toFixed(2) + "," + y1.toFixed(2) + ")", P1.X, P1.Y + 10);
    }

    drawCiv(ctx);
};

function drawCiv(ctx) {
    ctx.fillStyle = "white";
    ctx.lineWidth = 4;
    ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
    ctx.fillText("#");
}

/**
 * Returns true if the x,y coordinates are inside this hexagon
 * @this {HT.Hexagon}
 * @return {boolean}
 */
HT.Hexagon.prototype.isInBounds = function(x, y) {
    return HT.Hexagon.Contains(new HT.Point(x, y));
};


/**
 * Returns true if the point is inside this hexagon, it is a quick contains
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.isInHexBounds = function( /*Point*/ p) {
    if (TopLeftPoint.X < p.X &&
        TopLeftPoint.Y < p.Y &&
        p.X < BottomRightPoint.X &&
        p.Y < BottomRightPoint.Y) {
        return true;
    }
    return false;
};

//grabbed from:
//http://www.developingfor.net/c-20/testing-to-see-if-a-point-is-within-a-polygon.html
//and
//http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html#The%20C%20Code
/**
 * Returns true if the point is inside this hexagon, it first uses the quick isInHexBounds contains, then check the boundaries
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {boolean}
 */
HT.Hexagon.prototype.Contains = function( /*Point*/ p) {
    var isIn = false;
    if (this.isInHexBounds(p)) {
        //turn our absolute point into a relative point for comparing with the polygon's points
        //var pRel = new HT.Point(p.X - this.x, p.Y - this.y);
        var i = 0;
        var j = 0;
        var iP;
        var jP;
        var pointsInHexagon = 6;
        for (j = Points.length - 1; i < pointsInHexagon; j = i++) {
            iP = Points[i];
            jP = Points[j];
            if (
                //CLEAN: magical logic 
                (
                    ((iP.Y <= p.Y) && (p.Y < jP.Y)) ||
                    ((jP.Y <= p.Y) && (p.Y < iP.Y))
                    //((iP.Y > p.Y) != (jP.Y > p.Y))
                ) &&
                (p.X < (jP.X - iP.X) * (p.Y - iP.Y) / (jP.Y - iP.Y) + iP.X)
            ) {
                isIn = !isIn;
            }
        }
    }
    return isIn;
};

/**
 * Returns absolute distance in pixels from the mid point of this hex to the given point
 * Provided by: Ian (Disqus user: boingy)
 * @this {HT.Hexagon}
 * @param {HT.Point} p the test point
 * @return {number} the distance in pixels
 */
HT.Hexagon.prototype.distanceFromMidPoint = function( /*Point*/ p) {
    // Pythagoras' Theorem: Square of hypotenuse = sum of squares of other two sides
    var deltaX = MidPoint.X - p.X;
    var deltaY = MidPoint.Y - p.Y;

    //squaring so don't need to worry about square-rooting a negative number
    return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
};

HT.Hexagon.Orientation = {
    Normal: 0,
    Rotated: 1
};

HT.Hexagon.Static = {
    HEIGHT: 91.14378277661477,
    WIDTH: 91.14378277661477,
    SIDE: 50.0,
    ORIENTATION: HT.Hexagon.Orientation.Normal,
    DRAWSTATS: false
}; //hexagons will have 25 unit sides for now