precision highp float;

in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float u_time;
uniform float u_strength;
uniform float u_speed;

out float vWave;

void main() {
  float wave = sin((position.y * 6.0) + (u_time * u_speed));
  float displacement = wave * u_strength;

  vec3 transformed = position + (normal * displacement);

  vWave = wave;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
