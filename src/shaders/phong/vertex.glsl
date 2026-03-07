// #version 300 es
precision highp float;

in vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
// -------------
// default vertex shader you'll find in TONS of tutorials
// no need to declare position as it is declared by default
// modelViewMatrix is the shorthand for (model * view) operation
// void main() {
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
