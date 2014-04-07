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
    this.healthColors = {'alive': '#64ff93', 'dead': '#000', 'dieing': '#ff8d8d'};
    this.currentGen = []; // store as key = x val = y
    this.nextGen    = [];

    // draw grid
    for (var x = 10; x < this.canvas.width; x += this.cellSize) {
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.width);

        this.currentGen[x] = [];
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

GameOfLife.prototype.getCellStatus = function(x, y)
{
    var x =  Math.round(x/this.cellSize) * this.cellSize;
    var y =  Math.round(y/this.cellSize) * this.cellSize;

    if (typeof this.currentGen[x] !== 'undefined' && typeof this.currentGen[x][y] !== 'undefined')
        return this.currentGen[x][y];

    return false;
}

GameOfLife.prototype.removeCell = function(x, y)
{
    var y =  Math.round(y/this.cellSize) * this.cellSize;
    var x =  Math.round(x/this.cellSize) * this.cellSize;

    delete this.currentGen[x][y];

    console.log(this.currentGen);
}

GameOfLife.prototype.drawCell = function(x, y, health)
{
    var y =  Math.round(y/this.cellSize) * this.cellSize;
    var x =  Math.round(x/this.cellSize) * this.cellSize;

    var health = health || 'alive';

    if (typeof this.currentGen[x] === 'undefined')
        this.currentGen[x] = [];

    this.currentGen[x][y] = health;

    this.ctx.fillStyle = this.healthColors[health];
    this.ctx.fillRect( x, y, this.cellSize, this.cellSize);

    console.log(this.currentGen);
}