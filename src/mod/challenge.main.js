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
  window.setInterval( checkMove.bind( this ), 500 );
}

function keydown( rawKey ) {
  var key = rawKey.toUpperCase();
  console.info("[challenge.main] key=", key);
  switch( key ) {
  case 'A':
    this.challenge = 'anagram';
    break;
  case 'B':
    this.challenge = 'twister';
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
