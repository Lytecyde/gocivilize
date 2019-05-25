/*jslint
    browser: true
*/
/*global document,economy*/

var hud = {
    unitScreen: document.getElementById("unit-data"),
    playerScreen: document.getElementById("hud-data"),
    cityScreen: document.getElementById("city-data")
};

hud.update = function () {
    hud.getElementById("bank").innerHTML = economy.bank;
};