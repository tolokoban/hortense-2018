// Code behind.
"use strict";


var CODE_BEHIND = {
  onEatenChanged: onEatenChanged,
  keydown: keydown
};


var $ = require("dom");


function keydown( key ) {
  var lastTime = this._lastTime || 0;
  var now = Date.now();
  if( now - lastTime < 2000 ) return;
  
  switch( key ) {
  case "1":
  case "2":
  case "3":
    lastTime = now;
    this.eaten += parseInt( key );
    window.setTimeout( play.bind( this ), 1000 );
    break;
  }
}


function onEatenChanged( eaten ) {
  var items = $(this).querySelectorAll("div.item");
  for( var i = 0 ; i < items.length ; i++ ) {
    var item = items[i];
    if( i < eaten ) {
      $.addClass( item, 'miam' );
    }
    else {
      $.removeClass( item, 'miam' );
    }     
  }
}


function play() {
  if( this.eaten >= 17 ) {
    this.success = 1;
    return;
  }

  var remain = 17 - this.eaten;
  var modulo = remain % 4;
  if( modulo === 0) modulo = 1 + Math.floor( Math.random() * 3 );
  this.eaten += modulo;

  var that = this;
  window.setTimeout(function() {
    if( that.eaten >= 17 ) that.failure = 1;
  }, 1000);
}
