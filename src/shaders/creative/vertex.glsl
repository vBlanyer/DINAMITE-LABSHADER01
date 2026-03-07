precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float u_time;
uniform float u_inflation; // Parámetro 1: Controla qué tanto se infla

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    // Efecto de inflado: movemos el vértice en la dirección de su normal
    // Usamos u_time para que el "pulso" sea animado
    float pulse = sin(u_time * 2.0) * 0.5 + 0.5; 
    vec3 newPosition = position + (normal * u_inflation * pulse);

    vec4 worldPos = modelMatrix * vec4(newPosition, 1.0);
    vWorldPosition = worldPos.xyz;
    vNormal = mat3(modelMatrix) * normal;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
// -------------
// default vertex shader you'll find in TONS of tutorials
// no need to declare position as it is declared by default
// modelViewMatrix is the shorthand for (model * view) operation
// void main() {
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
