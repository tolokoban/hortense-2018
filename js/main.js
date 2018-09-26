/** @module main */require( 'main', function(require, module, exports) { var _=function(){var D={"en":{"welcome":"Welcome in the world of"},"fr":{"welcome":"Bienvenue dans le monde de"}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

require("font.josefin");
var $ = require("dom");
var PM = require("tfw.binding.property-manager");
var Main = require("challenge.main");
var Sound = require("sound");
var Twister = require("challenge.twister");
var Anagram = require("challenge.anagram");

var g_mainView;
var g_currentView;

exports.start = function() {
  createMainView();
  g_currentView = g_mainView;
  
  document.addEventListener( 'keydown', function( evt ) {
    g_currentView.keydown( evt.key );
  });
};


function createMainView() {
  var view = new Main();
  $.add( document.body, view );
  g_mainView = view;
  PM( view ).on( "challenge", function( name ) {
    switch( name ) {
    case "anagram": return createAnagram();
    case "twister": return createTwister();
    }
  });
}

function createAnagram() {
  var view = new Anagram();
  view.start = 1;
  showView( view );
}


function createTwister() {
  var view = new Twister();
  showView( view );
}


function showView( view ) {
  $.addClass( view, "hide" );
  $.add( document.body, view );
  window.setTimeout(function() {
    $.removeClass( view, "hide" );
    $.addClass( view, "show" );
  });
  g_currentView = view;
  var close = function() {
    $.removeClass( view, "show" );
    $.addClass( view, "hide" );
    window.setTimeout(function() {
      $.detach( view );
    }, 1000);
    g_currentView = g_mainView;
  };
  PM( view ).on( "success", function() {
    Sound.play( "success" );
    g_mainView.forward = true;
    close();
  });
  PM( view ).on( "failure", function() {
    Sound.play( "failure" );
    g_mainView.forward = false;
    close();
  });
}


  
module.exports._ = _;
/**
 * @module main
 * @see module:$
 * @see module:font.josefin
 * @see module:dom
 * @see module:tfw.binding.property-manager
 * @see module:challenge.main
 * @see module:sound
 * @see module:challenge.twister
 * @see module:challenge.anagram

 */
});