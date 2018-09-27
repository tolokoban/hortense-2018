"use strict";

var CODE_BEHIND = {
  onStart: onStart,
  keydown: keydown,
  onTimer: onTimer
};


var $ = require("dom");
var Sound = require("sound");

var DIRS = [ [1,0], [0,1], [-1,0], [0,-1] ];


function onStart() {
  this._wait = true;
  this._grid = [null];
  var grid = this.$elements.grid;
  $.clear( grid );

  var row, col, cell;
  for( row = 0; row < 3; row++ ) {
    for( col = 0; col < 3; col++ ) {
      if( col === 0 && row === 0 ) continue;
      cell = $.div( 'cell', 'cell-' + (col + 3 * row) );
      $.css( cell, {
        transform: "translate(" + (100 * col) + "%," + (100 * row) + "%)"
      });
      this._grid.push( cell );
      $.add( grid, cell );
    }
  }

  this._lastIndex = 2;
  this._loops = 20;
  window.setTimeout( shuffle.bind( this ), 1000 );
}


function shuffle() {
  console.info("[challenge.taquin] this._loops, this._lastIndex=", this._loops, this._lastIndex);
  if( this._loops <= 0 ) {
    this._wait = false;
    this.start = 1;
    return;
  }

  for(;;) {
    var index = Math.floor(Math.random() * DIRS.length);
    console.info("[challenge.taquin] index=", index);
    if( (index + 2) % DIRS.length === this._lastIndex ) continue;
    var dir = DIRS[index];
    if( !move.call( this, dir[0], dir[1] ) ) continue;
    break;
  }

  this._lastIndex = index;
  this._loops--;
  window.setTimeout( shuffle.bind( this ), 200 );
}


function keydown( rawKey ) {
  // Check if we still are in shuffle mode.
  if( this._wait ) return;

  var key = rawKey.toUpperCase();

  console.info("[challenge.taquin] key=", key);

  switch( key ) {
  case 'ARROWRIGHT': return move.call( this, 1, 0 );
  case 'ARROWDOWN': return move.call( this, 0, 1 );
  case 'ARROWLEFT': return move.call( this, -1, 0 );
  case 'ARROWUP': return move.call( this, 0, -1 );
  }
}


function move( dx, dy ) {
  var grid = this._grid;

  var posHole = findHolePosition( grid );
  var posCell = {
    col: posHole.col - dx,
    row: posHole.row - dy
  };
  if( posCell.col < 0 || posCell.col > 2 ) return false;
  if( posCell.row < 0 || posCell.row > 2 ) return false;

  var idxHole = pos2idx( posHole );
  var idxCell = pos2idx( posCell );

  var cell = grid[idxCell];

  var tmp = grid[idxHole];
  grid[idxHole] = grid[idxCell];
  grid[idxCell] = tmp;

  $.css( cell, {
    transform: "translate("
      + 100 * posHole.col + "%,"
      + 100 * posHole.row + "%)"
  });

  var that = this;

  if( gridIsSolved( grid ) ) {
    this.stop = 1;
    this._wait = true;
    window.setTimeout(function() {
      $.addClass( that, 'victory' );
      window.setTimeout(function() {
        that.success = 1;
      }, 3000);
    }, 300);
  }
  return true;
}


function gridIsSolved( grid ) {
  if( grid[0] !== null ) return false;
  for( var i = 1 ; i < grid.length ; i++ ) {
    var cell = grid[i];
    if( !$.hasClass( cell, 'cell-' + i ) ) return false;
  }
  return true;
}


function findHolePosition( cells ) {
  for( var i = 0 ; i < cells.length ; i++ ) {
    if( !cells[i] ) return idx2pos( i );
  }
}


function idx2pos( idx ) {
  var col = idx % 3;
  var row = (idx - col) / 3;
  return { col: col, row: row };
}


function pos2idx( pos ) {
  return pos.col + 3 * pos.row;
}


function onTimer( v ) {
  if( v === 0 ) {
    this.failure = 1;
    return;
  }
}
