precision mediump float;

varying vec3 varColor;

// Textures.
uniform sampler2D tex;

void main() {
  vec4 pixel = texture2D( tex, gl_PointCoord.xy );
  if( pixel.a < 0.1 ) discard;
  float coeff = pixel.r;
  vec3 color;
  if( coeff > .25 )
    color = mix( varColor, vec3(1,1,1), 4.0 * (coeff - .25) / 3.0 );
  else
    color = varColor * 2.0 * (coeff + .25);
  gl_FragColor = vec4( color, 1 );
}
