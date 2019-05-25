/*jslint
    browser: true
*/
/*global game*/

var economy = {
    taxRate: 2,
    annualTaxes: 0,
    bank: 50,
    store: 0,
    resources: 0,
    cities: 0,
    population: 0,
    units: 0,
    citySize: 5
};

economy.collectTaxes = function () {
    //taxes
    //tarifs
    //tolls?
    //tithes?
    //tributes?
    //trophies?
    economy.bank += economy.cities * economy.taxRate;
};

economy.setCities = function () {
    economy.cities = game.getListCities().length;
};

economy.getCities = function () {
    return economy.cities;
};

economy.collectResources = function () {
    economy.resources += economy.cities;
};

economy.allocateResources = function () {
    //culture - expand more units
    //mil???
    //science 5- 20 points???
    //industry - wonder built faster
    //economy - merchant travels farther

};

economy.trade = function () {
    //merchants, goods
    //select number of resources
    //total value
    //type
    //other player
    //offers
};

economy.getPopulation = function () {
    return economy.population;
};

economy.setPopulation = function () {
    economy.population = economy.cities * economy.citySize + economy.units;
};

economy.prepare = function () {
    economy.setCities();
    economy.setPopulation();
    economy.collectTaxes();
};

economy.disasters = function () {
    var disasters = [
        "volcano",
        "flood",
        "famine",
        "epidemic",
        "civil war",
        "civil disorder",
        "heresy",
        "piracy"
    ];
    var badEvents = [];
    var disaster = "";
    var i = 0;
    var n = 0;
    while (i < (Math.random() * 1)) {
        n = Math.floor(Math.random() * disasters.length);
        disaster = disasters[n];
        badEvents.push(disaster);
        alert(disaster);
        i += 1;
    }
};

economy.celebrations = function () {
    var celebrations = [
        "feast",
        "golden age",
        "invention",
        "great person",
        "great work",
        "union",
        "welfare",
        "jubilee",
        "miracle",
        "boom",
        "peace"
    ];
    var goodEvents = [];
    var celebration = "";
    var i = 0;
    var n = 0;
    while (i < (Math.random() * 3)) {
        n = Math.floor(Math.random() * celebrations.length);
        celebration = celebrations[n];
        goodEvents.push(celebration);
        alert(celebration);
        i += 1;
    }
};