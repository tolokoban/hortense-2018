"use strict";

// Many SVG art can be found here: https://www.svgrepo.com/

require("font.josefin");
var $ = require("dom");
var PM = require("tfw.binding.property-manager");
var Nim = require("challenge.nim");
var Main = require("challenge.main");
var Sound = require("sound");
var Paper = require("challenge.paper");
var Taquin = require("challenge.taquin");
var Assets = require("assets");
var Twister = require("challenge.twister");
var Anagram = require("challenge.anagram");

var g_mainView;
var g_currentView;

exports.start = function() {
  console.log("START");
  Assets.fetch({
    background: "css/main/background.jpg",
    anagram: "css/challenge.main/anagram.png",
    nim: "css/challenge.main/nim.png",
    paper: "css/challenge.main/paper.svg",
    taquin: "css/challenge.main/taquin.png",
    twister: "css/challenge.main/twister.svg",
    victory: "css/challenge.main/victory.png",
    nim2: "css/challenge.nim/nim.png",
    paper2: "css/challenge.paper/paper.png",
    scissors2: "css/challenge.paper/scissors.png",
    stone2: "css/challenge.paper/stone.png",
    well2: "css/challenge.paper/well.png",
    taquin21: "css/challenge.taquin/picture-1.png",
    taquin22: "css/challenge.taquin/picture-2.png",
    taquin23: "css/challenge.taquin/picture-3.png",
    twisterDisk: "css/challemge.twister/disk.svg",
    twisterNeedle: "css/challemge.twister/needle.svg"
  }).then(
    function( assets ) {
      console.log("All assets loaded: ", assets);
      createMainView();
      g_currentView = g_mainView;

      document.addEventListener( 'keydown', function( evt ) {
        g_currentView.keydown( evt.key );
        if( evt.key.toUpperCase() === 'BACKSPACE' ) evt.preventDefault();
      });
    },
    function( err ) {
      console.error( "Assets.fetch: ", err );
    }
  );
};


function createMainView() {
  var view = new Main();
  $.add( document.body, view );
  g_mainView = view;
  PM( view ).on( "challenge", function( name ) {
    switch( name ) {
    case "anagram": return createAnagram();
    case "twister": return createTwister();
    case "paper": return createPaper();
    case "taquin": return createTaquin();
    case "nim": return createNim();
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


function createNim() {
  var view = new Nim();
  showView( view );
}


function createPaper() {
  var view = new Paper();
  showView( view );
}


function createTaquin() {
  var view = new Taquin();
  showView( view );
}


function showView( view ) {
  $.addClass( view, "hide" );
  $.add( document.body, view );
  g_mainView.anim = false;
  window.setTimeout(function() {
    $.removeClass( view, "hide" );
    window.setTimeout(function() {
      $.addClass( view, "show" );
    });
  });
  g_currentView = view;
  var close = function() {
    $.removeClass( view, "show" );
    window.setTimeout(function() {
      $.addClass( view, "hide" );
    });
    window.setTimeout(function() {
      g_mainView.anim = true;
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
