/** @module challenge.taquin */require( 'challenge.taquin', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
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
  this._loops = 10;
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


//===============================
// XJS:View autogenerated code.
try {
  module.exports = function() {
    //--------------------
    // Dependent modules.
    var $ = require('dom');
    var PM = require('tfw.binding.property-manager');
    var Tag = require('tfw.view').Tag;
    var Link = require('tfw.binding.link');
    var View = require('tfw.view');;
    var Converters = require('tfw.binding.converters');
    var HortenseChrono = require('hortense.chrono');
    //-------------------------------------------------------
    // Check if needed functions are defined in code behind.
    View.ensureCodeBehind( CODE_BEHIND, "onTimer", "keydown", "onStart" );
    //-------------------
    // Global variables.
    var conv_integer = Converters.get('integer');
    //-------------------
    // Class definition.
    var ViewClass = function( args ) {
      try {
        if( typeof args === 'undefined' ) args = {};
        this.$elements = {};
        var that = this;
        var pm = PM(this);
        //--------------------
        // Create attributes.
        pm.create("timer", { cast: conv_integer(0) });
        pm.createAction("start")
        pm.createAction("success")
        pm.createAction("failure")
        //------------------
        // Create elements.
        var e_ = new Tag('DIV', ["class"]);
        var e_0 = new HortenseChrono({ initialTime: 120 });
        var e_1 = new Tag('DIV', ["class"]);
        var e_background = new Tag('DIV', ["class"]);
        this.$elements.background = e_background;
        var e_grid = new Tag('DIV', ["class"]);
        this.$elements.grid = e_grid;
        $.add( e_1, e_background, e_grid );
        var e_4 = new Tag('P', ["innerhtml"]);
        $.add( e_, e_0, e_1, e_4 );
        //-----------------------
        // Declare root element.
        Object.defineProperty( this, '$', {value: e_.$, writable: false, enumerable: false, configurable: false } );
        //-------
        // Links
        new Link({
          A:{obj: that,
              name: 'start'},
          B:{obj: e_0,
              name: 'start'},
          name:"start > e_0/start"
        });
        new Link({
          A:{obj: that,
              name: 'timer'},
          B:{obj: e_0,
              name: 'value'},
          name:"timer > e_0/value"
        });
        //-----------------------
        // On attribute changed.
        pm.on( "timer", function(v) {
          try {
            CODE_BEHIND.onTimer.call( that, v );
          }
          catch( ex ) {
            console.error('Exception in function behind "onTimer" of module "mod/challenge.taquin.js" for attribute "timer"!  ');
            console.error( ex );
          }} );
        //----------------------
        // Initialize elements.
        e_.class = "challenge-taquin background";
        e_1.class = "grid-container";
        e_background.class = "background";
        e_grid.class = "grid";
        e_4.innerhtml = "Utilisez les flèches.";
        //------------------------
        // Initialize attributes.
        this.timer = args["timer"];
        // Initialization.
        CODE_BEHIND.onStart.call( this );
        $.addClass(this, 'view', 'custom');
      }
      catch( ex ) {
        console.error('mod/challenge.taquin.js', ex);
        throw Error('Instantiation error in XJS of "mod/challenge.taquin.js":\n' + ex)
      }
    };
    //------------------
    // Static members..
    ViewClass.prototype.keydown = CODE_BEHIND.keydown;
    return ViewClass;
  }();
}
catch( ex ) {
  throw Error('Definition error in XJS of "mod/challenge.taquin.js"\n' + ex)
}


  
module.exports._ = _;
/**
 * @module challenge.taquin
 * @see module:$
 * @see module:dom
 * @see module:sound
 * @see module:dom
 * @see module:tfw.binding.property-manager
 * @see module:tfw.view
 * @see module:tfw.binding.link
 * @see module:tfw.view
 * @see module:tfw.binding.converters
 * @see module:hortense.chrono

 */
});