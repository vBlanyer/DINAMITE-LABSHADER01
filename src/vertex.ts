import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import VertexManipulatorMaterial from './shaders/vertex/material';

class App {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private gui: GUI;
  private geometry: THREE.BufferGeometry;
  private customMaterial: VertexManipulatorMaterial;
  private mesh: THREE.Mesh;
  private startTime: number;

  private readonly params = {
    speed: 1.25,
    strength: 0.25,
  };

  constructor() {
    // Create scene
    this.scene = new THREE.Scene();

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    if (!this.renderer.capabilities.isWebGL2) {
      console.warn('WebGL 2.0 is not available on this browser.');
    }
    this.renderer.setClearColor(new THREE.Color('#1b1e2b'), 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 8.0;

    this.geometry = new THREE.IcosahedronGeometry(0.8, 32);

    this.customMaterial = new VertexManipulatorMaterial();
    
    // Create mesh
    this.mesh = new THREE.Mesh(this.geometry, this.customMaterial.material);
    this.scene.add(this.mesh);
    this.camera.position.set(0, 0.2, 2.8);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.gui = new GUI({ title: 'Control de manipulacion de vertices' });
    this.configureUI();

    // Initialize
    this.startTime = Date.now();
    this.onWindowResize();

    // Bind methods
    this.onWindowResize = this.onWindowResize.bind(this);
    this.animate = this.animate.bind(this);

    // Add event listeners
    window.addEventListener('resize', this.onWindowResize);

    // Start the main loop
    this.animate();
  }

  private configureUI(): void {
    this.gui
      .add(this.params, 'speed', 0.0, 5.0, 0.01)
      .name('Tiempo (velocidad)')
      .onChange(() => this.applyWaveParams());

    this.gui
      .add(this.params, 'strength', 0.0, 0.8, 0.01)
      .name('Intensidad (amplitud)')
      .onChange(() => this.applyWaveParams());

    this.applyWaveParams();
  }

  private applyWaveParams(): void {
    this.customMaterial.material.uniforms.u_speed.value = this.params.speed;
    this.customMaterial.material.uniforms.u_strength.value = this.params.strength;
  }

  private animate(): void {
    requestAnimationFrame(this.animate);
    const elapsedTime = (Date.now() - this.startTime) / 1000;

    this.customMaterial.update(elapsedTime);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}

new App();
