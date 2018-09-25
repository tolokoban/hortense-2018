// Code behind.
"use strict";

var CODE_BEHIND = {
  keydown: keydown,
  mapChallenges: mapChallenges
};


var $ = require("dom");

function keydown( rawKey ) {
  var key = rawKey.toUpperCase();
  console.info("[challenge.main] key=", key);
  if( key === 'A' ) this.challenge = "anagram";
  else if( key === 'B' ) this.challenge = "twister";
}


function mapChallenges( challenge ) {
  return $.div( "challenge", "thm-ele12", challenge );
}
