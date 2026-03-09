
precision highp float;

uniform vec3 u_lightPosition;
uniform vec3 u_baseColor;
uniform float u_steps; // Parámetro 2: Controla cuántos niveles de sombra hay

in vec3 vNormal;
in vec3 vWorldPosition;

out vec4 fragColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(u_lightPosition - vWorldPosition);
    
    // Cálculo de intensidad difusa básica
    float diff = max(dot(normal, lightDir), 0.0);
    
    // TOON SHADING: Cuantizamos la intensidad
    // Esto crea las bandas de color sólidas típicas de los dibujos animados
    float toonDiff = floor(diff * u_steps) / u_steps;
    
    // Un pequeño toque de luz ambiental para que las sombras no sean negras puras
    vec3 ambient = u_baseColor * 0.2;
    vec3 finalColor = u_baseColor * toonDiff + ambient;

    fragColor = vec4(finalColor, 1.0);
}
// -------------
// default fragment shader you'll find in TONS of tutorials
// uniform float time;
// uniform vec2 resolution;

// void main() {
//   vec2 uv = gl_FragCoord.xy / resolution.xy;
//   gl_FragColor = vec4(uv.x, uv.y, 0.5 + 0.5 * sin(time), 1.0);
// }
