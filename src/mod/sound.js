"use strict";


exports.play = play;





function play( name ) {
  console.info("[sound] name=", name);
  var audio = new Audio();
  audio.setAttribute( "src", "css/sound/" + name + ".mp3" );
  audio.play();
}


