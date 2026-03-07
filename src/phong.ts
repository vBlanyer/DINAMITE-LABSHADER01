import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import vertexShader from './shaders/phong/vertex.glsl';
import fragmentShader from './shaders/phong/fragment.glsl';

class PhongApp {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private gui: GUI;
  private material: THREE.RawShaderMaterial;
  private mesh: THREE.Mesh;

  private params = {
    materialColor: '#0077ff',
    specularColor: '#ffffff',
    shininess: 64.0,
    lightX: 2.0,
    lightY: 2.0,
    lightZ: 2.0,
  };

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0a0a0a');

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Usamos una esfera para apreciar mejor el brillo especular
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    this.material = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader,
      fragmentShader,
      uniforms: {
        u_materialColor: { value: new THREE.Color(this.params.materialColor) },
        u_lightColor: { value: new THREE.Color('#ffffff') },
        u_specularColor: { value: new THREE.Color(this.params.specularColor) },
        u_shininess: { value: this.params.shininess },
        u_lightPosition: { value: new THREE.Vector3(2, 2, 2) },
        u_viewPosition: { value: new THREE.Vector3() },
        // Matrices requeridas manualmente por el profesor
        modelMatrix: { value: new THREE.Matrix4() },
        viewMatrix: { value: new THREE.Matrix4() },
        projectionMatrix: { value: new THREE.Matrix4() },
      },
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    this.gui = new GUI({ title: 'Configuración Blinn-Phong' });
    this.setupUI();

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  private setupUI() {
    this.gui.addColor(this.params, 'materialColor').name('Color').onChange((v: string) => this.material.uniforms.u_materialColor.value.set(v));
    this.gui.addColor(this.params, 'specularColor').name('Specular').onChange((v: string) => this.material.uniforms.u_specularColor.value.set(v));
    this.gui.add(this.params, 'shininess', 1, 256).name('Brillo').onChange((v: number) => this.material.uniforms.u_shininess.value = v);
    
    const light = this.gui.addFolder('Luz');
    light.add(this.params, 'lightX', -5, 5).onChange((v: number) => this.material.uniforms.u_lightPosition.value.x = v);
    light.add(this.params, 'lightY', -5, 5).onChange((v: number) => this.material.uniforms.u_lightPosition.value.y = v);
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    // Actualización manual de uniformes de matriz y posición de cámara
    this.material.uniforms.viewMatrix.value.copy(this.camera.matrixWorldInverse);
    this.material.uniforms.projectionMatrix.value.copy(this.camera.projectionMatrix);
    this.material.uniforms.u_viewPosition.value.copy(this.camera.position);

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

new PhongApp();
