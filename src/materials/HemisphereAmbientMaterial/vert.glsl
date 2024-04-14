precision highp float;

attribute vec4 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform vec3 uColorTop;
uniform vec3 uColorBottom;
varying vec4 vColor;

void main() {
  gl_Position = projectionMatrix * (modelViewMatrix * position);
  vColor = vec4(mix(uColorBottom, uColorTop, position.y * 0.5 + 0.5), 1.0);
}