
precision highp float;

uniform vec3 u_lightColor;
uniform vec3 u_materialColor;
uniform vec3 u_specularColor;
uniform float u_shininess;
uniform vec3 u_lightPosition;
uniform vec3 u_viewPosition;

in vec3 vNormal;
in vec3 vWorldPosition;

out vec4 fragColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(u_lightPosition - vWorldPosition);
    vec3 viewDir = normalize(u_viewPosition - vWorldPosition);
    
    // BLINN-PHONG: Vector a mitad de camino entre la luz y la vista
    vec3 halfwayDir = normalize(lightDir + viewDir);

    // 1. Ambient
    float ambientStrength = 0.15;
    vec3 ambient = ambientStrength * u_lightColor;

    // 2. Diffuse (Lambert)
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * u_lightColor;

    // 3. Specular (Blinn-Phong)
    // El brillo se calcula con el punto entre la Normal y el Halfway vector
    float spec = pow(max(dot(normal, halfwayDir), 0.0), u_shininess);
    vec3 specular = spec * u_specularColor;

    // Combinación final
    vec3 finalColor = (ambient + diffuse + specular) * u_materialColor;
    
    fragColor = vec4(finalColor, 1.0);
}
