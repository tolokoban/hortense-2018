precision mediump float;

varying vec3 varColor;

// Textures.
uniform sampler2D tex;

void main() {
  vec4 pixel = texture2D( tex, gl_PointCoord.xy );
  if( pixel.a < 0.1 ) discard;
  vec3 color = mix( varColor, vec3(1,1,1), pixel.r );
  gl_FragColor = vec4( color, 1 );
}
