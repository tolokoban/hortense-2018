/** @module challenge.main */require( 'challenge.main', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
 var GLOBAL = {
  "vert": "uniform float uniTime;\nuniform float uniSize;\n\nattribute vec3 attPos;\nattribute float attA1;\nattribute float attA2;\nattribute float attD1;\nattribute float attD2;\nattribute vec3 attColor;\n\nvarying vec3 varColor;\n\n\nvoid main() {\n  varColor = attColor;\n  \n  float factor = (1.0 + attPos.z) * .5;\n  float time = uniTime * 0.0001;\n  float radius = 0.1 * factor;\n  float x = attPos.x + radius * (cos( time * attA1 + attD1 ) + cos( time * attA2 + attD2 ));\n  float y = mod( attPos.y + time * factor, 2.4 ) - 1.2;\n  \n  gl_Position = vec4(x, y, -attPos.z, 1);\n  gl_PointSize = uniSize * factor;\n\n}\n",
  "frag": "precision mediump float;\n\nvarying vec3 varColor;\n\n// Textures.\nuniform sampler2D tex;\n\nvoid main() {\n  vec4 pixel = texture2D( tex, gl_PointCoord.xy );\n  if( pixel.a < 0.1 ) discard;\n  vec3 color = mix( varColor, vec3(1,1,1), pixel.r );\n  gl_FragColor = vec4( color, 1 );\n}\n"};
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
  [.50,0,0], [0,.50,0], [0,0,.50],
  [0,.50,.50], [.50,0,.50], [.50,.50,0],
  [0,.50,.25], [0,.25,.50], [.50,0,.25], [.25,0,.50], [.50,.25,0], [.25,.50,0]
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
    //-------------------------------------------------------
    // Check if needed functions are defined in code behind.
    View.ensureCodeBehind( CODE_BEHIND, "onCursorChanged", "keydown", "init", "mapChallenges" );
    //-------------------
    // Global functions.
    function defVal(args, attName, attValue) { return args[attName] === undefined ? attValue : args[attName]; };
    //-------------------
    // Global variables.
    var conv_array = Converters.get('array');
    var conv_boolean = Converters.get('boolean');
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
        pm.create("challenges", { cast: conv_array });
        pm.create("anim", { cast: conv_boolean });
        pm.createAction("challenge")
        pm.create("cursor", { cast: conv_integer(0) });
        pm.create("die", { cast: conv_integer(0) });
        pm.create("forward", { cast: conv_boolean });
        pm.create("bounce", { cast: conv_boolean });
        //------------------
        // Create elements.
        var e_ = new Tag('DIV', ["class"]);
        var e_canvas = new Tag('CANVAS');
        this.$elements.canvas = e_canvas;
        var e_1 = new Tag('DIV', ["class"]);
        var e_strip = new Tag('DIV', ["class"]);
        this.$elements.strip = e_strip;
        var e_3 = new Tag('DIV', ["class"]);
        $.add( e_1, e_strip, e_3 );
        var e_4 = new Tag('DIV', ["class","innerhtml"]);
        $.add( e_, e_canvas, e_1, e_4 );
        //-----------------------
        // Declare root element.
        Object.defineProperty( this, '$', {value: e_.$, writable: false, enumerable: false, configurable: false } );
        //-------
        // Links
        new Link({
          A:{obj: that,
              name: 'challenges'},
          B:{action: function(v) {
          // Updating children of e_strip.
          $.clear(e_strip);
          if( !Array.isArray( v ) ) v = [v];
          v.forEach(function (elem) {
            $.add(e_strip, elem);
          });},
              map: function() {
          return CODE_BEHIND.mapChallenges.apply(that, arguments)}},
          name:"challenges > undefined"
        });
        //-----------------------
        // On attribute changed.
        pm.on( "cursor", function(v) {
          try {
            CODE_BEHIND.onCursorChanged.call( that, v );
          }
          catch( ex ) {
            console.error('Exception in function behind "onCursorChanged" of module "mod/challenge.main.js" for attribute "cursor"!  ');
            console.error( ex );
          }} );
        //----------------------
        // Initialize elements.
        e_.class = "challenge-main";
        e_1.class = "strip-container";
        e_strip.class = "strip";
        e_3.class = "cursor";
        e_4.class = "shadowFFF";
        e_4.innerhtml = "Lancez un dé à 6 faces et tapez le chiffre obtenu.<br/>Si vous faites <b>6</b>, restez sur place !";
        //------------------------
        // Initialize attributes.
        this.challenges = defVal(args, "challenges", ["paper","anagram","twister","taquin","nim","paper","anagram","twister","taquin","nim","victory"]);
        this.anim = defVal(args, "anim", true);
        this.cursor = defVal(args, "cursor", 0);
        this.die = defVal(args, "die", 0);
        this.forward = defVal(args, "forward", true);
        this.bounce = defVal(args, "bounce", false);
        // Initialization.
        CODE_BEHIND.init.call( this );
        $.addClass(this, 'view', 'custom');
      }
      catch( ex ) {
        console.error('mod/challenge.main.js', ex);
        throw Error('Instantiation error in XJS of "mod/challenge.main.js":\n' + ex)
      }
    };
    //------------------
    // Static members..
    ViewClass.prototype.keydown = CODE_BEHIND.keydown;
    return ViewClass;
  }();
}
catch( ex ) {
  throw Error('Definition error in XJS of "mod/challenge.main.js"\n' + ex)
}


  
module.exports._ = _;
/**
 * @module challenge.main
 * @see module:$
 * @see module:dom
 * @see module:webgl.resize
 * @see module:webgl.program
 * @see module:dom
 * @see module:tfw.binding.property-manager
 * @see module:tfw.view
 * @see module:tfw.binding.link
 * @see module:tfw.view
 * @see module:tfw.binding.converters

 */
});