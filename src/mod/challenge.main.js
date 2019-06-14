// Code behind.
"use strict";

var CODE_BEHIND = {
  init: init,
  keydown: keydown,
  onCursorChanged: onCursorChanged,
  mapChallenges: mapChallenges
};


var $ = require("dom");


function init() {
  this._interval = window.setInterval( checkMove.bind( this ), 500 );
  createWebGlAnimation.call( this );
}

function keydown( rawKey ) {
  var key = rawKey.toUpperCase();
  console.info("[challenge.main] key=", key);
  switch( key ) {
  case 'D':
    keydown.call( this, "" + (1 + Math.floor( Math.random() * 6 ) ) );
    break;
  case '1':
  case '2':
  case '3':
  case '4':
  case '5':
    if( this.die > 0 ) return;
    this.bounce = false;
    this.die = key;
    break;
  case '6':
    // We stay where we are, but we start the challenge.
    this.challenge = this.challenges[this.cursor];
    break;
  }
}


function mapChallenges( challenge ) {
  return $.div( "challenge", "thm-ele12", challenge );
}


/**
 * Every 300 ms, we must advance the `cursor` if there is still `die` > 0.
 */
function checkMove() {
  if( this.die < 1 ) return;

  this.die--;
  var dir = 0;
  if( this.forward ) dir = this.bounce ? -1 : 1;
  else dir = this.bounce ? 1 : -1;

  var cursor = this.cursor + dir;
  if( cursor < 0 || cursor >= this.challenges.length ) {
    // Bouncing on an edge.
    this.bounce = true;
    cursor = this.cursor - dir;
  }
  this.cursor = cursor;

  if( this.die === 0 ) {
    // End of the die travel. We go to the selected challenge.
    var that = this;
    window.setTimeout(function() {
      that.challenge = that.challenges[cursor];
    }, 500);
  }
}


function onCursorChanged( cursor ) {
  $.css( this.$elements.strip, {
    transform: "translateX(" + (30 - cursor * 15) + "vw)"
  });
}



//============================================================

var Resize = require("webgl.resize");
var Program = require("webgl.program");


var BALLOONS_COUNT = 120;
var COLORS = [
  [1,0,0], [0,1,0], [0,0,1],
  [1,.5,.5], [.5,1,.5], [.5,.5,1],
  [0,1,1], [1,0,1], [1,1,0],
  [0,1,.5], [0,.5,1], [1,0,.5], [.5,0,1], [1,.5,0], [.5,1,0]
];

function createWebGlAnimation() {
  var that = this;

  var canvas = this.$elements.canvas.$;
  var gl = canvas.getContext( 'webgl' );
  var prg = new Program( gl, {
    vert: GLOBAL.vert,
    frag: GLOBAL.frag
  });

  var dataBalloons = createPoints();
  var buffBalloons = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, buffBalloons );
  gl.bufferData( gl.ARRAY_BUFFER, dataBalloons, gl.STATIC_DRAW );

  gl.enable( gl.DEPTH_TEST );
  gl.clearColor( .6, .9, 1, 1 );
  gl.clearDepth( 1 );
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  var img = new Image();
  img.src = "css/challenge.main/balloon.png";
  img.onload = function() {
    var texture = createTexture( gl, img );
    
    var draw = function( time ) {
      requestAnimationFrame( draw );

      if( !that.anim ) return;
      
      var w = gl.canvas.clientWidth;
      var h = gl.canvas.clientHeight;
      Resize( gl );

      gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

      prg.use();
      prg.$uniTime = time;
      prg.$uniSize = Math.min( w, h ) * 0.12;

      gl.activeTexture( gl.TEXTURE0 );
      gl.bindTexture( gl.TEXTURE_2D, texture );
      prg.$tex = 0;

      prg.bindAttribs( buffBalloons,
                       "attPos",
                       "attA1", "attA2", "attD1", "attD2",
                       "attColor" );
      gl.drawArrays( gl.POINTS, 0, BALLOONS_COUNT );
    };
    requestAnimationFrame( draw );
  };
}


function createPoints() {
  var points = [];
  var count = BALLOONS_COUNT;
  while( count --> 0 ) {
    var idxColor = Math.floor(Math.random() * COLORS.length);
    var color = COLORS[idxColor];
    points.push(
      rnd(-1, +1),            // X
      rnd(-1, +1),            // Y
      count / BALLOONS_COUNT, // Z
      rnd( 1, 3 ),            // A1
      rnd( 1, 3 ),            // A2
      rnd( 0, 3.14159 ),      // D1
      rnd( 0, 3.14159 ),      // D2
      color[0],
      color[1],
      color[2]
    );
  }

  return new Float32Array( points );
}


function createTexture( gl, img ) {
  var texture = gl.createTexture();

  gl.bindTexture( gl.TEXTURE_2D, texture );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

  gl.activeTexture( gl.TEXTURE0 );
  gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );

  return texture;
}

function rnd( min, max ) {
  if( typeof max === 'undefined' ) {
    max = min;
    min = 0;
  }
  return min + (max - min) * Math.random();
}
