function createMinimap() {
    var canvas = document.getElementById("minimap");
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 200, 120);
    for (var h in grid.Hexes) {
        grid.Hexes[h].draw(ctx);
    }
}