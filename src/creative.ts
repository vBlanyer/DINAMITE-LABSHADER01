import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import vertexShader from './shaders/creative/vertex.glsl';
import fragmentShader from './shaders/creative/fragment.glsl';

class CreativeApp {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private gui: GUI;
  private material: THREE.RawShaderMaterial;
  private clock: THREE.Clock;

  private params = {
    inflation: 0.2, // Parámetro Vertex
    steps: 3.0,     // Parámetro Fragment
    color: '#00ffcc'
  };

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#050505');
    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // OrbitControls: Permite acercarse/alejarse con el ratón (Requisito)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Usamos un Toroide (Dona) porque se ve genial con Toon Shading
    const geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 128, 32);

    this.material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0.0 },
        u_inflation: { value: this.params.inflation },
        u_steps: { value: this.params.steps },
        u_baseColor: { value: new THREE.Color(this.params.color) },
        u_lightPosition: { value: new THREE.Vector3(5, 5, 5) },
        modelMatrix: { value: new THREE.Matrix4() },
        viewMatrix: { value: new THREE.Matrix4() },
        projectionMatrix: { value: new THREE.Matrix4() },
      }
    });

    const mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(mesh);

    this.gui = new GUI({ title: 'Material Creativo: Toon Pulse' });
    this.setupUI();

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  private setupUI() {
    // Control Vertex
    this.gui.add(this.params, 'inflation', 0, 1).name('Inflado (Vertex)').onChange(v => {
      this.material.uniforms.u_inflation.value = v;
    });

    // Control Fragment
    this.gui.add(this.params, 'steps', 1, 10, 1).name('Niveles Toon (Frag)').onChange(v => {
      this.material.uniforms.u_steps.value = v;
    });

    this.gui.addColor(this.params, 'color').name('Color').onChange(v => {
      this.material.uniforms.u_baseColor.value.set(v);
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    const elapsedTime = this.clock.getElapsedTime();

    this.controls.update();

    this.material.uniforms.u_time.value = elapsedTime;
    this.material.uniforms.viewMatrix.value.copy(this.camera.matrixWorldInverse);
    this.material.uniforms.projectionMatrix.value.copy(this.camera.projectionMatrix);

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

new CreativeApp();
