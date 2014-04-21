/**
 * Created with JetBrains PhpStorm.
 * User: vincent
 * Date: 4/7/14
 * Time: 9:25 PM
 * To change this template use File | Settings | File Templates.
 */

function GameOfLife(canvas, context, cellSize, gridBorder)
{
    this.canvas     = canvas;
    this.ctx        = context;
    this.cellSize   = cellSize || 10;
    this.healthColors = {alive: '#64ff93', dead: '#ffffff', dieing: '#ff8d8d'};
    this.currentGeneration = {}; // store as key = x val = y
    this.gridX      = {};
    this.gridY      = {};
    this.hasGridBorder = gridBorder;

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
        var cellX = this.__mathXY(x);
            cellX = cellX.x;

        this.gridX[cellX] = {};
    }

    for (var y = 0.5; y < this.canvas.height; y += this.cellSize)
    {
        __ctxCache.moveTo(0, y);
        __ctxCache.lineTo(this.canvas.width, y);

        var cellY = this.__mathXY(0, y);
            cellY = cellY.y;

        this.gridY[cellY] = {};
    }

    __ctxCache.strokeStyle = "#ddd";
    __ctxCache.stroke();
    __ctxCache.save();

    this.__gridCached = __ctxCache.canvas;

    this.__createCells();

    this.lifeCycle();
};


/**
 * Creates cells based on grid
 */
GameOfLife.prototype.__createCells = function()
{
    for (var x in this.gridX)
    {
        this.currentGeneration[x] = {};
        for (var y in this.gridY)
        {
            this.currentGeneration[x][y] = 'dead';
        }
    }
};


/**
 * Responsible for methods and actions for each frame update
 */
GameOfLife.prototype.lifeCycle = function()
{
    if (this.hasGridBorder)
        this.drawGrid();

    this.drawCells(this.currentGeneration);
    this.currentGeneration = this.advanceGeneration(this.currentGeneration);
};


/**
 * Returns new generation with updated life
 *
 * @returns {Array}
 */
GameOfLife.prototype.advanceGeneration = function(currentGeneration)
{
    var nextGeneration = jQuery.extend(true, {}, currentGeneration);

    for (var cellX in currentGeneration)
    {
        for (var cellY in currentGeneration[cellX])
        {
            var cellState = 'dead'; // asume all cells are dead
            var isNewBorn = false;
            var neighbours = this.getNeighbours(cellX, cellY);

            if (currentGeneration[cellX][cellY] == 'alive')
            {
                if (neighbours == 2 || neighbours == 3)
                    cellState = 'alive';
            }
            else
            {
                if (neighbours == 3)
                {
                    cellState = 'alive';
                    isNewBorn = true;
                }
            }

            nextGeneration[cellX][cellY] = cellState;
        }
    }

    return nextGeneration;
};


/**
 * Calculates amount of neighbours based on x and y position
 *
 * @param x
 * @param y
 * @returns {number}
 */
GameOfLife.prototype.getNeighbours = function(x, y)
{
    var neighbours = 0;
    var cellSize = this.cellSize;
    var cellXY = this.__mathXY(x,y);

    x = cellXY.x;
    y = cellXY.y;

    if (this.currentGeneration[x][y-cellSize] && this.currentGeneration[x][y-cellSize] == 'alive')
        neighbours++;


    if (this.currentGeneration[x][y+cellSize] && this.currentGeneration[x][y+cellSize] == 'alive')
        neighbours++;


    if (this.currentGeneration[x-cellSize])
    {
        if (this.currentGeneration[x-cellSize][y] && this.currentGeneration[x-cellSize][y] == 'alive' )
            neighbours++;

        if (this.currentGeneration[x-cellSize][y-cellSize] && this.currentGeneration[x-cellSize][y-cellSize] == 'alive')
            neighbours++;

        if (this.currentGeneration[x-cellSize][y+cellSize] && this.currentGeneration[x-cellSize][y+cellSize] == 'alive')
            neighbours++;
    }

    if (this.currentGeneration[x+cellSize])
    {
        if (this.currentGeneration[x+cellSize][y] && this.currentGeneration[x+cellSize][y] == 'alive')
            neighbours++;

        if (this.currentGeneration[x+cellSize][y-cellSize] && this.currentGeneration[x+cellSize][y-cellSize] == 'alive')
            neighbours++;

        if (this.currentGeneration[x+cellSize][y+cellSize] && this.currentGeneration[x+cellSize][y+cellSize] == 'alive')
            neighbours++;
    }


    return neighbours;
}


/**
 * Draws the grid based on the cached __gridCached var, which is essentially and image created from a canvas object
 */
GameOfLife.prototype.drawGrid = function()
{
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(this.__gridCached, 0, 0); // use the cached canvas object
    this.ctx.save();
};


/**
 * Draws the cells based on the given generation
 *
 * @param generation
 */
GameOfLife.prototype.drawCells = function(generation)
{
    for (var cellX in generation)
    {
        for (var cellY in generation[cellX])
        {
            this.drawCell(cellX, cellY, generation[cellX][cellY]);
        }
    }
};


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

    this.currentGeneration[x][y] = health;

    this.ctx.fillStyle = this.healthColors[health];

    if (this.hasGridBorder)
    {
        this.ctx.fillRect( x+0.25, y+0.25, this.cellSize-0.5, this.cellSize-0.5);
    }
    else
    {
        this.ctx.fillRect( x, y, this.cellSize, this.cellSize);
    }
};


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
    y = Math.floor(y/this.cellSize) * this.cellSize || 0;

    return {x: x, y:y};
};