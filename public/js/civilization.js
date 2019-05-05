"use strict";

var civilization = {
    identification: null,
    capital: "",
    startingPoint: {
        x: 0,
        y: 0
    },
    population: 1,
    cities: 0,
    bank: 50,
    store: 0,
    goods: 0,
    units: [],
    unitCount: 1,
    taxRatePerCity: 1
};

var identification = {
    name: "",
    number: 0
        /*jslint
            browser: true
        */
        /*global game*/
};

var unit = {
    identification: null,
    location: [],
    type: "Settler",
    sign: "*",
    movement: 1,
    power: 1,
    life: 10
};

var civilizations = {
    names: [
        "Egypt",
        "Mesopotamia",
        "Greece",
        "Rome",
        "Germany",
        "England",
        "Russia",
        "India",
        "China",
        "Japan",
        "Aztec",
        "Maya"
    ],
    capitals: [
        "Thebes",
        "Uruk",
        "Athens",
        "Rome",
        "Berlin",
        "London",
        "Moscow",
        "Delhi",
        "Beijing",
        "Tokyo",
        "Tenochtitlan",
        "Tikal"
    ]
};