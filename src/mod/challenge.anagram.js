"use strict";

var CODE_BEHIND = {
  onStart: onStart,
  onMap: onMap,
  keydown: keydown,
  completeWithDashes: completeWithDashes,
  onTimer: onTimer,
  onHint: onHint
};


var $ = require("dom");
var Sound = require("sound");


function onStart() {
  var choice = Math.floor( Math.random() * this.words.length );
  var word = this.words[ choice ].toUpperCase();
  var letters = shuffle( extractLetters( word ) );

  this.letters = letters;
  this.solution = word;
  this.proposition = "---";
  this.proposition = "";
}


function extractLetters( word ) {
  var letters = [];
  for( var i=0; i<word.length; i++ ) {
    letters.push( word.charAt( i ).toUpperCase() );
  }
  return letters;
}


function shuffle( arr ) {
  var i, j, tmp;
  for( i = 0 ; i < arr.length ; i++ ) {
    tmp = arr[i];
    j = Math.floor( Math.random() * arr.length );
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}


function onMap( letter ) {
  return $.div( [letter] );
}


function keydown( rawKey ) {
  var key = rawKey.toUpperCase();
  if( key === 'BACKSPACE' ) return backspace.call( this );
  if( this.letters.indexOf( key ) === -1 ) return Sound.play( "error" );
  if( this.proposition.length >= this.solution.length ) return Sound.play( "error" );
  this.proposition += key;
  if( this.proposition === this.solution ) this.success = 1;
}


function backspace() {
  if( this.proposition.length > this.hint )
    this.proposition = this.proposition.substr( 0, this.proposition.length - 1 );
  else
    Sound.play( "error" );
}

function completeWithDashes( proposition ) {
  var out = [];
  var i, char;
  for( i = 0 ; i < proposition.length ; i++ ) {
    char = proposition.charAt(i);
    if( i < this.hint ) out.push( $.div( 'hint', [char] ) );
    else out.push( $.div( [char] ) );
  }
  for( i = proposition.length; i < this.solution.length ; i++ ) {
    out.push( $.div( 'dash', ['-'] ) );
  }

  return out;
}

function onTimer( v ) {
  if( v === 0 ) {
    this.failure = 1;
    return;
  }
  var size = this.solution.length;
  if( size < 5 ) return;
  if( v === 60 ) this.hint = 1;
  else if( v === 40 && size > 5 ) this.hint = 2;
  else if( v === 20 && size > 7 ) this.hint = 3;  
}


function onHint() {
  this.proposition = this.solution.substr(0, this.hint) + this.proposition.substr( this.hint );
}
