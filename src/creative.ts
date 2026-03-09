import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import vertexShader from './shaders/creative/vertex.glsl';
import fragmentShader from './shaders/creative/fragment.glsl';

class CreativeApp {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private geometry: THREE.TorusKnotGeometry;
  private material: THREE.RawShaderMaterial;
  private mesh: THREE.Mesh;
  private startTime: number;
  private controls: OrbitControls;
  private gui: GUI;
  
  private camConfig = {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000,
  };

  private params = {
    inflation: 0.2, // Parámetro Vertex
    steps: 3.0,     // Parámetro Fragment
    color: '#00ffcc'
  };

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#050505');
    

    this.camera = new THREE.PerspectiveCamera(
      this.camConfig.fov,
      this.camConfig.aspect,
      this.camConfig.near,
      this.camConfig.far,
    );
    this.camera.position.z = 2.0;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });

    if (!this.renderer.capabilities.isWebGL2) {
      console.warn('WebGL 2.0 is not available on this browser.');
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    // OrbitControls: Permite acercarse/alejarse con el ratón (Requisito)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Usamos un Toroide (Dona) porque se ve genial con Toon Shading
    this.geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 128, 32);

    this.material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        projectionMatrix: { value: this.camera.projectionMatrix },
        viewMatrix: { value: this.camera.matrixWorldInverse },
        modelMatrix: { value: new THREE.Matrix4() },
        //Custom Uniforms
        u_time: { value: 0.0 },
        u_resolution: { value: resolution },
        //Uniforms Creativo
        u_inflation: { value: this.params.inflation },
        u_steps: { value: this.params.steps },
        u_baseColor: { value: new THREE.Color(this.params.color) },
        u_lightPosition: { value: new THREE.Vector3(5, 5, 5) },
      },
      glslVersion: THREE.GLSL3,
    });

    // Create mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.scene.add(this.mesh);

    //GUI
    this.gui = new GUI({ title: 'Material Creativo: Toon Pulse' });
    this.setupUI();

    // Initialize
    this.startTime = Date.now();
    this.onWindowResize();

    //Bind methods
    this.onWindowResize = this.onWindowResize.bind(this);
    this.animate = this.animate.bind(this);

    //Add event listeners
    window.addEventListener("resize", this.onWindowResize);

    //animate
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

  private animate(): void {
    requestAnimationFrame(this.animate);

    const elapsedTime = (Date.now() - this.startTime) / 1000;

    this.controls.update();

    this.material.uniforms.u_time.value = elapsedTime;
    this.material.uniforms.viewMatrix.value.copy(this.camera.matrixWorldInverse);

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

new CreativeApp();
