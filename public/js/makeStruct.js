/*
 *   data for map
*/
function makeStruct(names) {
    var names = names.split(' ');
    var count = names.length;
    function constructor() {
        for (var i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
        }
    }
    return constructor;
}
var Item = makeStruct("id mapName mapWidth mapHeight hexWidth hexHeight");
var maps = [new Item(0, 'map', '1900', '800', parseFloat(100.0), parseFloat(86.60254037844388)),
new Item(1, 'minimap', '200', '150', parseFloat(10.0), parseFloat(8.660254037844388))];
