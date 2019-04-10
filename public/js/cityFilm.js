/*jslint
    browser: true
*/

var cityFilm = {};

cityFilm.create = function () {
    var canvas = document.getElementById("cityFilm");
    var context = canvas.getContext("2d");
    context.translate(0, 0);
    context.canvas.width = 1800;
    context.canvas.height = 800;
};