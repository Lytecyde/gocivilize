'use strict';

//array functions
var ArrayWorks = (function () {
    var self = {};
    var create2DArray = function (columns, rows) {
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
    };
    self.arr2D = function (c, r) {
        create2DArray(c,r);
    };

    return self;
}());