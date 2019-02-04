var width = parseFloat(10.0);
var height = parseFloat(8.660254037844388);

createMinimap();

function findHexWithWidthAndHeight(width, height) {
    var y = height / 2.0;
    //solve quadratic
    var a = -3.0;
    var b = (-2.0 * width);
    var c = (Math.pow(width, 2)) + (Math.pow(height, 2));
    var z = (-b - Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);

    var x = (width - z) / 2.0;

    HT.Hexagon.Static.WIDTH = width;
    HT.Hexagon.Static.HEIGHT = height;
    HT.Hexagon.Static.SIDE = z;
}

function createMinimap() {
    findHexWithWidthAndHeight(width, height);
    getHexGridWH(width, height);
    var canvas = document.getElementById("minimap");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 200, 120);
    var minimapGrid = new HT.Grid(200, 120);
    for (var h in minimapGrid.Hexes) {
        minimapGrid.Hexes[h].draw(ctx);
    }
}