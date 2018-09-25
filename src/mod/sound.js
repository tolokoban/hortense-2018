"use strict";


exports.play = play;
exports.speak = speak;





function play( name ) {
  
}


window.speechSynthesis.onvoiceschanged = function() {
  console.log("Voices: ", window.speechSynthesis.getVoices());  
};


function speak( text ) {
  var synth = window.speechSynthesis;
  
}
