"use strict";

var civilization = {
    identification,
    capital: "",
    startingPoint: locationPoint,
    population: 4,
    gold: 50,
    food: 50,
    fuel: 0,
    pollution: 0,
    units: [],
    fogMap: [],
    unknownMap: [],
    happiness: 50,
    loyalty: 50,
    amenities: 0
);

var identification = {
    name: "",
    number: 0
}

var unit = {
    identification,
    location: [],
    type: "Settler",
    sign: "👨",
    movement: 2,
    power: 1,
    life: 10
}

var locationPoint = function(x, y){
    this.X = x;
    this.Y = y;
}

var civilizations = {
    names: ["Egypt", "Mesopotamia", "Greece", "Rome", "Germany", "England", "Russia", "India", "China", "Japan", "Aztec", "Maya"],
    capitals: ["Thebes", "Uruk", "Athens", "Rome", "Berlin", "London", "Moscow", "Delhi", "Beijing", "Tokyo", "Tenochtitlan", "Tikal"],
};