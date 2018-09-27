uniform float uniTime;
uniform float uniSize;

attribute vec3 attPos;
attribute float attA1;
attribute float attA2;
attribute float attD1;
attribute float attD2;
attribute vec3 attColor;

varying vec3 varColor;


void main() {
  varColor = attColor;
  
  float factor = (1.0 + attPos.z) * .5;
  float time = uniTime * 0.0001;
  float radius = 0.1 * factor;
  float x = attPos.x + radius * (cos( time * attA1 + attD1 ) + cos( time * attA2 + attD2 ));
  float y = mod( attPos.y + time * factor, 2.4 ) - 1.2;
  
  gl_Position = vec4(x, y, -attPos.z, 1);
  gl_PointSize = uniSize * factor;

}
