Game-of-Life.js
===============

My attempt at a Javascript implementation of the Conway's Game of Life.

A Javascript canvas test as I'm a tad inexperienced with using Javascript.
You can set some parameters to the GameOfLife class;
* Canvas object
* Canvas context 
* Cell size - (int) Size of each cell 
* Grid border - (boolean) use or do not use a border on the grid


Rules
=====
* Any live cell with fewer than two live neighbours dies, as if caused by under-population.
* Any live cell with two or three live neighbours lives on to the next generation.
* Any live cell with more than three live neighbours dies, as if by overcrowding.
* Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
