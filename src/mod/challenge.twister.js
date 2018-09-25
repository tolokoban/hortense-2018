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
    var angL = Math.floor( 48 * Math.random() );
    this.angleLeft += 360*3 + 22.5 * angL;
    var angR = Math.floor( 48 * Math.random() );
    this.angleRight -= 360*3 + 22.5 * angR;
  }
  else if( key == 'ESCAPE' ) this.failure = 1;
  else if( key == 'ENTER' ) this.success = 1;
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
