/*jslint
    browser: true
*/

var unitFilm = {};

unitFilm.create = function () {
    var canvas = document.getElementById("unitFilm");
    var context = canvas.getContext("2d");
    context.translate(0, 0);
    context.canvas.width = 1800;
    context.canvas.height = 800;
};