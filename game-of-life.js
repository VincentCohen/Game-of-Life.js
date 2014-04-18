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
    this.healthColors = {alive: '#64ff93', dead: '#000000', dieing: '#ff8d8d'};
    this.currentGen = new Array(); // store as key = x val = y
    this.nextGen    = [];
    this.gridX      = new Array();
    this.gridY      = new Array();


    /**
     * To avoid performance issues we store the grid in an canvas object and cached variable then pre-draw the grid on it.
     * This way when drawn the grid is already saved in a canvas object which can be used opon drawing.
     *
     * See this.drawGrid();
     * @type {HTMLElement}
     * @private
     */
    var __canvasCache = document.createElement("canvas");
        __canvasCache.width     = this.canvas.width;
        __canvasCache.height    = this.canvas.height;

        __ctxCache    = __canvasCache.getContext("2d");


    for (var x = 0.5; x < this.canvas.width; x += this.cellSize)
    {
        __ctxCache.moveTo(x, 0);
        __ctxCache.lineTo(x, this.canvas.width);
    }

    for (var y = 0.5; y < this.canvas.height; y += this.cellSize)
    {
        __ctxCache.moveTo(0, y);
        __ctxCache.lineTo(this.canvas.width, y);
    }

    __ctxCache.strokeStyle = "#ddd";
    __ctxCache.stroke();
    __ctxCache.save();

    this.__gridCached = __ctxCache.canvas;
}

/**
 * Responsible for methods and actions for each frame update
 */
GameOfLife.prototype.lifeCycle = function()
{
    this.drawGrid();
    this.drawCells(this.currentGen);
//    this.currentGen = this.advanceGeneration(this.currentGen);
}

/**
 * Returns new generation with updated life
 *
 * @returns {Array}
 */
GameOfLife.prototype.advanceGeneration = function(currentGeneration)
{
    var nextGeneration = JSON.parse(JSON.stringify(currentGeneration)); // clones the object

    for (var cellX in currentGeneration)
    {
        if (typeof cellX !== 'undefined' && currentGeneration[cellX] != 'undefined' )
        {
            for (var cellY in currentGeneration[cellX])
            {
                if (this.getCellStatus(cellX, cellY, currentGeneration) == 'alive')
                {
                    nextGeneration[cellX][cellY] = 'dead';
                }

                if (this.getCellStatus(cellX, cellY, currentGeneration) == 'dead')
                {
                    nextGeneration[cellX][cellY] = 'alive';
                }
            }
        }
    }

    return nextGeneration;
}

/**
 * Draws the grid based on the cached __gridCached var, which is essentially and image created from a canvas object
 */
GameOfLife.prototype.drawGrid = function()
{
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.__gridCached, 0, 0); // use the cached canvas object
    this.ctx.save();
}

/**
 * Retrieves status of a existing cell or creates the cell if it does not exist yet
 *
 * @param x
 * @param y
 * @returns {*}
 */
GameOfLife.prototype.getCellStatus = function(x, y, generation)
{
    var xy = this.__mathXY(x,y);
    x = xy.x;
    y = xy.y;

    var generation = generation || this.currentGen;

    if (typeof generation[x] !== 'undefined')
    {
        if (typeof generation[x][y] !== 'undefined')
        {
            return generation[x][y];
        }
    }

    return false;
}

/**
 * Removes a Cell based on X and Y coords
 *
 * @param x
 * @param y
 * @returns {boolean}
 */
GameOfLife.prototype.removeCell = function(x, y, generation)
{
    var xy = this.__mathXY(x,y);
    x = xy.x;
    y = xy.y;

    if (delete generation[x][y])
        return generation;

    return false;
}

/**
 * Draws the cells based on the given generation
 *
 * @param generation
 */
GameOfLife.prototype.drawCells = function(generation)
{
    for (var cellX in generation)
    {
        if (typeof cellX !== 'undefined' && generation[cellX] != 'undefined' )
        {
            for (var cellY in generation[cellX])
            {
                this.drawCell(cellX, cellY, generation[cellX][cellY]);
            }
        }
    }
}

/**
 * Draws a single cell
 *
 * @param x
 * @param y
 * @param health
 */
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

/**
 * Returns X and Y positions based on cell size
 *
 * @param x
 * @param y
 * @returns {{x: number, y: number}}
 * @private
 */
GameOfLife.prototype.__mathXY = function(x,y)
{
    x = Math.floor(x/this.cellSize) * this.cellSize;
    y = Math.floor(y/this.cellSize) * this.cellSize;

    return {x: x, y:y};
}

/**
 * Returns current generation
 *
 * @returns {*}
 */
GameOfLife.prototype.getCurrentGen = function()
{
    return this.currentGen;
}