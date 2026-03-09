precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

//uniform float u_time;

in vec3 position;
in vec3 normal;

out vec3 vNormal;
out vec3 vWorldPosition;

void main() {
    // Calculamos la posición en el mundo para la dirección de la luz
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    
    // Transformamos la normal al espacio del mundo (sin escalas no uniformes)
    vNormal = mat3(modelMatrix) * normal;
    
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
