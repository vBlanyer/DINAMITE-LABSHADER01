precision highp float;

uniform vec3 u_colorA;
uniform vec3 u_colorB;

in float vWave;
out vec4 fragColor;

void main() {
  float waveMask = 0.5 + 0.5 * vWave;
  vec3 baseColor = mix(u_colorA, u_colorB, waveMask);

  fragColor = vec4(baseColor, 1.0);
}
