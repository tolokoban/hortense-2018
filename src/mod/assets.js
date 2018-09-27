"use strict";

exports.fetch = fetchAssets;


function fetchAssets( assets ) {
  return new Promise(function (resolve, reject) {
    console.log( "In the promise..." );
    showSplashScreen().then(function() {
      var count = 0;
      var done = 0;
      for( var key in assets ) count++;
      var progress = document.getElementById("PROGRESS");
      var result = {};

      function next( url ) {
        done++;
        var percent = done / count;
        progress.style.transform = "scaleX(" + percent + ")";
        console.log( url, (100 * percent).toFixed(0) + "%");

        if( done >= count ) {
          resolve( result );
          hideSplashScreen();
          return;
        }
      }

      Object.keys( assets ).forEach(function( key ) {
        var url = assets[key];
        if( endsWith( url, "jpg", "png", "gif", "svg" ) ) {
          var img = new Image();
          img.crossOrigin = "anonymous";
          result[key] = img;
          img.onload = next.bind(null, url);
          img.onerror = function( ex ) {
            console.error("Unable to load image \"" + key + "\":", url);
            console.error( ex );
            next( url );
          };
          img.src = url;
        } else if( endsWith( url, "ogg", "wav", "mp3" ) ) {
          var audio = document.createElement("audio");
          result[key] = audio;
          var slot = function() {
            console.log( "Slot for ", url );
            if( audio._loaded ) return;
            audio._loaded = true;
            console.log( "Loaded: ", url );
            next( url );
          };
          audio.addEventListener( "canplay", slot );
          audio.addEventListener( "loadeddata", slot );
          window.setTimeout( slot, 3000 );
          audio.addEventListener( "error", function( ex ) {
            console.error("Unable to load sound \"" + key + "\":", url);
            console.error( ex );
            next( url );
          });
          audio.src = url;
          console.log("Loading audio: ", url);
        } else {
          fetch( url ).then(function(response) {
            if( !response.ok ) throw "";
            if( endsWith( url, "json" ) ) {
              return response.json();
            } else {
              return response.text();
            }
          }).then(function(content) {
            result[key] = content;
            next( url );
          }).catch(function(ex) {
            console.error("Unable to fetch asset \"" + key + "\": ", url);
            next( url );
          });
        }
      });
    });
  });
}


function showSplashScreen( applicationName ) {
  if( typeof applicationName === 'undefined' ) applicationName = 'TOLOKOBAN';

  console.info("[assets] applicationName=", applicationName);
  return new Promise(function (resolve, reject) {
    function show() {
      var splash = document.createElement( "div" );
      splash.setAttribute( "id", "SPLASH" );
      splash.innerHTML = "<div>" + applicationName + "</div><div>" + applicationName + "</div>";
      document.body.appendChild( splash );
      var progress = document.createElement( "div" );
      progress.setAttribute( "id", "PROGRESS" );
      document.body.appendChild( progress );
      window.setTimeout(function() {
        splash.setAttribute( "class", "show-splash" );
      }, 50);
      resolve();
    }
    console.info("[assets] document.readyState=", document.readyState);
    if( document.readyState === "loading" ) {
      console.log( "Waiting for DOMContentLoaded..." );
      document.addEventListener( "DOMContentLoaded", show );
    } else {
      show();
    }
  });
}


function hideSplashScreen() {
  var splash = document.getElementById( "SPLASH" );
  splash.setAttribute( "class", "hide-splash" );
  var progress = document.getElementById( "PROGRESS" );
  document.body.removeChild( progress );
  window.setTimeout(function() {
    document.body.removeChild( splash );
  }, 500);
}


function endsWith( text ) {
  text = text.trim().toLowerCase();
  var arg;
  for( var i=1; i<arguments.length; i++ ) {
    arg = arguments[i].toLowerCase();
    if( text.substr( text.length - arg.length ) == arg ) return true;
  }
  return false;
}
