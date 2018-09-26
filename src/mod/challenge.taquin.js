"use strict";

var CODE_BEHIND = {
  onStart: onStart,
  keydown: keydown,
  onTimer: onTimer
};


var $ = require("dom");
var Sound = require("sound");


function onStart() {
  this._grid = [null];
  var grid = this.$elements.grid;
  $.clear( grid );
  
  var row, col, cell;
  for( row = 0; row < 3; row++ ) {
    for( col = 0; col < 3; col++ ) {
      if( col === 0 && row === 0 ) continue;
      cell = $.div( 'cell' );
      $.css( cell, {
        transform: "translate(" + (100 * col / 3) + "%," + (100 * row / 3) + "%)",
        backgroundPosition: (-100 * col / 3) + "% " + (-100 * row / 3) + "%"
      });
      this._grid.push( cell );
      $.add( grid, cell );      
    }
  }
}


function keydown( rawKey ) {
  var key = rawKey.toUpperCase();

  move.call( this, key );
}


function move( key ) {
  
}


function onTimer( v ) {
  if( v === 0 ) {
    this.failure = 1;
    return;
  }
}
