"use strict";

var CODE_BEHIND = {
  onStart: onStart,
  minutes: minutes,
  seconds: seconds
};


function onStart() {
  var that = this;

  if( this._interval ) window.clearTimeout( this._interval );
  this.value = this.initialTime;
  this._startTime = Date.now();
  this._interval = window.setInterval(function() {
    var now = Date.now();
    var elapsedTime = 0.001 * (now - that._startTime);
    var time = Math.max( 0, that.initialTime - elapsedTime );
    that.value = time;
  }, 200);
}


function minutes( v ) {
  return Math.floor( v / 60 );
}


function seconds( v ) {
  var out = '' + v % 60;
  while( out.length < 2 ) out = '0' + out;
  return out;
}
