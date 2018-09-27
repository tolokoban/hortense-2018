/** @module challenge.twister */require( 'challenge.twister', function(require, module, exports) { var _=function(){var D={"fr":{"rotate":"rotate($1deg)"}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    // Code behind.
"use strict";


var CODE_BEHIND = {
  keydown: keydown,
  onAngleLeft: onAngleLeft,
  onAngleRight: onAngleRight
};


function keydown( rawKey ) {
  var key = rawKey.toUpperCase();
  console.info("[challenge.twister] key=", key);
  if( key === ' ' ) {    
    var now = Date.now();
    if( now - this.lastThrow < 6000 ) return;
    this.lastThrow = now;

    if( this.tries < 1 ) this.success = 1;
    this.tries--;
    
    var angL = Math.floor( 48 * Math.random() );
    this.angleLeft += 360*3 + 22.5 * angL;
    var angR = Math.floor( 48 * Math.random() );
    this.angleRight -= 360*3 + 22.5 * angR;
  }
  else if( key == 'ESCAPE' ) this.failure = 1;
}


function rotate( v ) {
  return "rotate(" + v + "deg)";
}


function onAngleLeft( v ) {
  this.rotateLeft = rotate( v );
}


function onAngleRight( v ) {
  this.rotateRight = rotate( v );
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
    View.ensureCodeBehind( CODE_BEHIND, "onAngleLeft", "onAngleRight", "keydown" );
    //-------------------
    // Global functions.
    function defVal(args, attName, attValue) { return args[attName] === undefined ? attValue : args[attName]; };
    //-------------------
    // Global variables.
    var conv_integer = Converters.get('integer');
    var conv_string = Converters.get('string');
    var conv_float = Converters.get('float');
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
        pm.create("tries", { cast: conv_integer(0) });
        pm.create("rotateLeft", { cast: conv_string });
        pm.create("rotateRight", { cast: conv_string });
        pm.create("angleLeft", { cast: conv_float(0) });
        pm.create("angleRight", { cast: conv_float(0) });
        pm.create("lastThrow", { cast: conv_float(0) });
        pm.createAction("success")
        pm.createAction("failure")
        //------------------
        // Create elements.
        var e_ = new Tag('DIV', ["class"]);
        var e_0 = new Tag('DIV', ["class"]);
        var e_1 = new Tag('DIV');
        var e_2 = new Tag('DIV');
        $.add( e_1, e_2 );
        var e_3 = new Tag('DIV');
        var e_4 = new Tag('DIV');
        $.add( e_3, e_4 );
        $.add( e_0, e_1, e_3 );
        var e_5 = new Tag('DIV', ["class","textcontent"]);
        var e_6 = new Tag('P', ["innerhtml"]);
        $.add( e_, e_0, e_5, e_6 );
        //-----------------------
        // Declare root element.
        Object.defineProperty( this, '$', {value: e_.$, writable: false, enumerable: false, configurable: false } );
        //-------
        // Links
        new Link({
          A:{obj: that,
              name: 'tries'},
          B:{obj: e_5,
              name: 'textcontent'},
          name:"tries > e_5/textcontent"
        });
        //-----------------------
        // On attribute changed.
        pm.on( "angleLeft", function(v) {
          try {
            CODE_BEHIND.onAngleLeft.call( that, v );
          }
          catch( ex ) {
            console.error('Exception in function behind "onAngleLeft" of module "mod/challenge.twister.js" for attribute "angleLeft"!  ');
            console.error( ex );
          }} );
        pm.on( "angleRight", function(v) {
          try {
            CODE_BEHIND.onAngleRight.call( that, v );
          }
          catch( ex ) {
            console.error('Exception in function behind "onAngleRight" of module "mod/challenge.twister.js" for attribute "angleRight"!  ');
            console.error( ex );
          }} );
        pm.on("rotateLeft", function(v) {
          e_2.$.style["transform"] = v;
        });
        pm.on("rotateRight", function(v) {
          e_4.$.style["transform"] = v;
        });
        //----------------------
        // Initialize elements.
        e_.class = "challenge-twister background";
        e_0.class = "disks";
        e_5.class = "tries shadowFFF";
        e_6.innerhtml = "Tapez sur <b>ESPACE</b> pour lancer les roues. <b>ECHAP</b> si c'est perdu.";
        //------------------------
        // Initialize attributes.
        this.tries = defVal(args, "tries", 9);
        this.rotateLeft = defVal(args, "rotateLeft", "");
        this.rotateRight = defVal(args, "rotateRight", "");
        this.angleLeft = defVal(args, "angleLeft", 11.25);
        this.angleRight = defVal(args, "angleRight", -11.25);
        this.lastThrow = defVal(args, "lastThrow", 0);
        $.addClass(this, 'view', 'custom');
      }
      catch( ex ) {
        console.error('mod/challenge.twister.js', ex);
        throw Error('Instantiation error in XJS of "mod/challenge.twister.js":\n' + ex)
      }
    };
    //------------------
    // Static members..
    ViewClass.prototype.keydown = CODE_BEHIND.keydown;
    return ViewClass;
  }();
}
catch( ex ) {
  throw Error('Definition error in XJS of "mod/challenge.twister.js"\n' + ex)
}


  
module.exports._ = _;
/**
 * @module challenge.twister
 * @see module:$
 * @see module:dom
 * @see module:tfw.binding.property-manager
 * @see module:tfw.view
 * @see module:tfw.binding.link
 * @see module:tfw.view
 * @see module:tfw.binding.converters

 */
});