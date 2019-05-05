/*jslint
    browser: true
*/
/*global game,economy,science,industry,population,trade*/
var turn = {};

turn.run = function () {
    //collect tax, 2 per city
    economy.prepare();
    //*grow 1 per unit if empty spaces are nearby
    //*move ??? and conflict
    //*build

    //construct goods 1 per city
    economy.collectResources();
    //!trade
    //allocate resources
    economy.allocateResources();
    //science purchases

    //disasters and celebrations
    economy.celebrations();
    economy.disasters();

    game.score();
};