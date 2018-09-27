/** @module hortense.chrono */require( 'hortense.chrono', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

var CODE_BEHIND = {
  onStart: onStart,
  minutes: minutes,
  seconds: seconds
};


function onStart() {
  var that = this;

  if( this._interval ) window.clearTimeout( this._interval );
  this.value = this.initialTime;
  this._startTime = Date.now();
  this._interval = window.setInterval(function() {
    var now = Date.now();
    var elapsedTime = 0.001 * (now - that._startTime);
    var time = Math.max( 0, that.initialTime - elapsedTime );
    that.value = time;
  }, 200);
}


function minutes( v ) {
  return Math.floor( v / 60 );
}


function seconds( v ) {
  var out = '' + v % 60;
  while( out.length < 2 ) out = '0' + out;
  return out;
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
    View.ensureCodeBehind( CODE_BEHIND, "onStart", "minutes", "seconds" );
    //-------------------
    // Global functions.
    function defVal(args, attName, attValue) { return args[attName] === undefined ? attValue : args[attName]; };
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
        pm.create("initialTime", { cast: conv_integer(0) });
        pm.create("value", { cast: conv_integer(0) });
        pm.createAction("start")
        //------------------
        // Create elements.
        var e_ = new Tag('DIV', ["class"]);
        var e_0 = new Tag('DIV');
        var e_1 = new Tag('DIV', ["textcontent"]);
        var e_2 = new Tag('DIV');
        $.add( e_2, ":" );
        var e_3 = new Tag('DIV', ["textcontent"]);
        $.add( e_0, e_1, e_2, e_3 );
        $.add( e_, e_0 );
        //-----------------------
        // Declare root element.
        Object.defineProperty( this, '$', {value: e_.$, writable: false, enumerable: false, configurable: false } );
        //-------
        // Links
        new Link({
          A:{obj: that,
              name: 'value'},
          B:{obj: e_1,
              name: 'textcontent',
              converter: CODE_BEHIND.minutes.bind( this )},
          name:"value > e_1/textcontent"
        });
        new Link({
          A:{obj: that,
              name: 'value'},
          B:{obj: e_3,
              name: 'textcontent',
              converter: CODE_BEHIND.seconds.bind( this )},
          name:"value > e_3/textcontent"
        });
        //-----------------------
        // On attribute changed.
        pm.on( "start", function(v) {
          try {
            CODE_BEHIND.onStart.call( that, v );
          }
          catch( ex ) {
            console.error('Exception in function behind "onStart" of module "mod/hortense.chrono.js" for attribute "start"!  ');
            console.error( ex );
          }} );
        //----------------------
        // Initialize elements.
        e_.class = "hortense-chrono";
        //------------------------
        // Initialize attributes.
        this.initialTime = defVal(args, "initialTime", 180);
        this.value = defVal(args, "value", 0);
        $.addClass(this, 'view', 'custom');
      }
      catch( ex ) {
        console.error('mod/hortense.chrono.js', ex);
        throw Error('Instantiation error in XJS of "mod/hortense.chrono.js":\n' + ex)
      }
    };
    return ViewClass;
  }();
}
catch( ex ) {
  throw Error('Definition error in XJS of "mod/hortense.chrono.js"\n' + ex)
}


  
module.exports._ = _;
/**
 * @module hortense.chrono
 * @see module:$
 * @see module:dom
 * @see module:tfw.binding.property-manager
 * @see module:tfw.view
 * @see module:tfw.binding.link
 * @see module:tfw.view
 * @see module:tfw.binding.converters

 */
});