/** @module sound */require( 'sound', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
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


  
module.exports._ = _;
/**
 * @module sound
 * @see module:$

 */
});