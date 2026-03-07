// #version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  fragColor = vec4(uv.x, uv.y, 0.5 + 0.5 * sin(u_time), 1.0);
}
// -------------
// default fragment shader you'll find in TONS of tutorials
// uniform float time;
// uniform vec2 resolution;

// void main() {
//   vec2 uv = gl_FragCoord.xy / resolution.xy;
//   gl_FragColor = vec4(uv.x, uv.y, 0.5 + 0.5 * sin(time), 1.0);
// }