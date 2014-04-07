/**
 * Created with JetBrains PhpStorm.
 * User: vincent
 * Date: 4/7/14
 * Time: 9:25 PM
 * To change this template use File | Settings | File Templates.
 */

function GameOfLife(canvas, context, cellSize)
{
    this.canvas     = canvas;
    this.ctx        = context;
    this.cellSize   = cellSize || 10;
    this.currentGen = []; // store as key = x val = y
    this.nextGen    = [];

    // draw grid
    for (var x = 10; x < this.canvas.width; x += this.cellSize) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.width);
    }

    for (var y = 0.5; y < this.canvas.height; y += this.cellSize) {
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvas.width, y);
    }

    this.ctx.strokeStyle = "#ddd";
    this.ctx.stroke();
}

GameOfLife.prototype.live = function()
{
    //alert('living in the name of..');
}

GameOfLife.prototype.update = function()
{
    // update each frame
}

GameOfLife.prototype.drawCell = function(x, y)
{
    var x =  Math.round(x/10) *10;
    var y =  Math.round(y/10) *10;

    this.currentGen[x] = y;
    this.ctx.fillRect( x, y, this.cellSize, this.cellSize);

    console.log(this.currentGen);
}