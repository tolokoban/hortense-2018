/** @module sound */require( 'sound', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";


exports.play = play;





function play( name ) {
  console.info("[sound] name=", name);
  var audio = new Audio();
  audio.setAttribute( "src", "css/sound/" + name + ".mp3" );
  audio.play();
}




  
module.exports._ = _;
/**
 * @module sound
 * @see module:$

 */
});