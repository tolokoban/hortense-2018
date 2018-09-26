"use strict";

var CODE_BEHIND = {
  keydown: keydown,
  onAngleChanged: onAngleChanged
};


function keydown( key ) {
  var that = this;

  console.info("[challenge.paper] key=", key);

  var now = Date.now();
  if( now - this.lastThrow < 5000 ) return;
  
  switch( key.toUpperCase() ) {
  case 'ARROWRIGHT':
    this.scoreRight++;
    if( this.scoreRight > 4 ) {
      window.setTimeout(function() {
        that.failure = 1;
      }, 500);
    }
    break;
  case 'ARROWLEFT':
    this.scoreLeft++;
    if( this.scoreLeft > 4 ) {
      window.setTimeout(function() {
        that.success = 1;
      }, 500);
    }
    break;
  case ' ':
    swingTheWheel.call( this );
    this.lastThrow = now;
    break;
  }
}


function onAngleChanged( v ) {
  this.rotate = "rotate(" + v + "deg)";  
}


function swingTheWheel() {
  this.angle += 180 + Math.floor( Math.random() * 8 ) * 45;
}
