import * as THREE from 'three';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export default class VertexManipulatorMaterial {
  public readonly material: THREE.RawShaderMaterial;

  constructor() {
    this.material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0.0 },
        u_strength: { value: 0.25 },
        u_speed: { value: 1.25 },
        u_colorA: { value: new THREE.Color('#fb00ff') },
        u_colorB: { value: new THREE.Color('#fff200') },
      },
      glslVersion: THREE.GLSL3,
    });
  }

  update(elapsedTime: number): void {
    this.material.uniforms.u_time.value = elapsedTime;
  }
}
