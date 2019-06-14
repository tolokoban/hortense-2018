"use strict";

var CODE_BEHIND = {
  onStart: onStart,
  onStop: onStop,
  minutes: minutes,
  seconds: seconds
};


function onStart() {
  var that = this;

  if( this._interval ) window.clearTimeout( this._interval );
  this.value = this.initialTime;
  this._startTime = Date.now();
  tick.call( this );
}


function onStop() {
  if( this._interval ) window.clearTimeout( this._interval );
  this.value = this.initialTime + 1;
}


function tick() {
  var now = Date.now();
  var elapsedTime = 0.001 * (now - this._startTime);
  var time = Math.max( 0, this.initialTime - elapsedTime );
  console.info("[hortense.chrono] time=", time);
  this.value = time;
  if( time > 0 ) this._interval = window.setTimeout( tick.bind( this ), 900 );
}


function minutes( v ) {
  return Math.floor( v / 60 );
}


function seconds( v ) {
  var out = '' + v % 60;
  while( out.length < 2 ) out = '0' + out;
  return out;
}
