/**
 * Created with JetBrains PhpStorm.
 * User: vincent
 * Date: 4/7/14
 * Time: 9:25 PM
 * To change this template use File | Settings | File Templates.
 */

function GameOfLife(canvas, context, grid, cellSize)
{
    this.canvas     = canvas;
    this.ctx        = context;
    this.cellSize   = cellSize || 10;
    this.healthColors = {'alive': '#64ff93', 'dead': '#000', 'dieing': '#ff8d8d'};
    this.currentGen = new Array(); // store as key = x val = y
    this.nextGen    = [];
    this.grid       = grid;
    this.gridX      = new Array();
    this.gridY      = new Array();

    /*
        To avoid performance issues we store the grid based on the canvas width and selected cellsize
        in a cached variable and pre-draw the grid on it.
        This way when drawn the grid is already saved in a canvas object which can be used opon drawing.
        See this.drawGrid();
     */
    var __canvasCache = document.createElement("canvas");
        __canvasCache.width     = this.canvas.width;
        __canvasCache.height    = this.canvas.height;

        __ctxCache    = __canvasCache.getContext("2d");


    for (var x = 0.5; x < this.canvas.width; x += this.cellSize) {
        __ctxCache.moveTo(x, 0);
        __ctxCache.lineTo(x, this.canvas.width);
    }

    for (var y = 0.5; y < this.canvas.height; y += this.cellSize) {
        __ctxCache.moveTo(0, y);
        __ctxCache.lineTo(this.canvas.width, y);
    }

    __ctxCache.strokeStyle = "#ddd";
    __ctxCache.stroke();
    __ctxCache.save();

    this.__gridCached = __ctxCache.canvas;
}

GameOfLife.prototype.live = function()
{

}

GameOfLife.prototype.update = function()
{
    this.advanceGeneration();
    this.drawGrid();
//    this.drawCells();
}

GameOfLife.prototype.drawGrid = function()
{
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.__gridCached, 0, 0); // use the cached canvas object
    this.ctx.save();
}

GameOfLife.prototype.advanceGeneration = function()
{
    // the 'hard' part, cell status updates etc.
}

GameOfLife.prototype.getCellStatus = function(x, y)
{
    var xy = this.__mathXY(x,y);
    x = xy.x;
    y = xy.y;

    if (typeof this.currentGen[x] !== 'undefined' && typeof this.currentGen[x][y] !== 'undefined')
        return this.currentGen[x][y];

    return false;
}

GameOfLife.prototype.removeCell = function(x, y)
{
    var xy = this.__mathXY(x,y);
    x = xy.x;
    y = xy.y;

    if (delete this.currentGen[x][y])
        return true;

    return false;
}

GameOfLife.prototype.drawCells = function()
{

}

GameOfLife.prototype.drawCell = function(x, y, health)
{
    var xy = this.__mathXY(x,y);
    x = xy.x;
    y = xy.y;

    var health = health || 'alive';

    if (typeof this.currentGen[x] === 'undefined')
        this.currentGen[x] = [];

    this.currentGen[x][y] = health;

    this.ctx.fillStyle = this.healthColors[health];
    this.ctx.fillRect( x, y, this.cellSize, this.cellSize);
}

GameOfLife.prototype.__mathXY = function(x,y)
{
    x = Math.floor(x/this.cellSize) * this.cellSize;
    y = Math.floor(y/this.cellSize) * this.cellSize;

    return {x: x, y:y};
}

GameOfLife.prototype.getCurrentGen = function()
{
    return this.currentGen;
}