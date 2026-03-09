import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import vertexShader from "./shaders/phong/vertex.glsl";
import fragmentShader from "./shaders/phong/fragment.glsl";


class PhongApp {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private geometry: THREE.SphereGeometry;
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
    materialColor: '#0077ff',
    specularColor: '#ffffff',
    shininess: 64.0,
    lightX: 2.0,
    lightY: 2.0,
    lightZ: 2.0,
  };

  constructor() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1d1c1c');

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      this.camConfig.fov,
      this.camConfig.aspect,
      this.camConfig.near,
      this.camConfig.far,
    );
    this.camera.position.z = 2.0;

    // Setup renderer1
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!this.renderer.capabilities.isWebGL2) {
      console.warn("WebGL 2.0 is not available on this browser.");
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // Create shader material
    this.geometry = new THREE.SphereGeometry(1, 64, 64);
    this.material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        projectionMatrix: { value: this.camera.projectionMatrix },
        viewMatrix: { value: this.camera.matrixWorldInverse },
        modelMatrix: { value: new THREE.Matrix4() },
        // custom uniforms
        u_time: { value: 0.0 },
        u_resolution: { value: resolution },
        //Phong uniforms
        u_materialColor: { value: new THREE.Color(this.params.materialColor) },
        u_lightColor: { value: new THREE.Color('#ffffff') },
        u_lightPosition: { value: new THREE.Vector3(2, 2, 2) },
        u_specularColor: { value: new THREE.Color(this.params.specularColor) },
        u_shininess: { value: this.params.shininess },
        u_viewPosition: { value: new THREE.Vector3() },
      },
      glslVersion: THREE.GLSL3,
    });

    // Create mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    
    //GUI
    this.gui = new GUI({ title: 'Configuración Blinn-Phong' });
    this.setupUI();

    // Initialize
    this.startTime = Date.now();
    this.onWindowResize();

    // Bind methods
    this.onWindowResize = this.onWindowResize.bind(this);
    this.animate = this.animate.bind(this);

    // Add event listeners
    window.addEventListener("resize", this.onWindowResize);

    // Start the main loop
    this.animate();
  }

  private animate(): void {
    requestAnimationFrame(this.animate);
    
    const elapsedTime = (Date.now() - this.startTime) / 1000;
    this.material.uniforms.u_time.value = elapsedTime;

    // 1. IMPORTANTE: Actualizar la posición de la cámara para el brillo especular
    this.material.uniforms.u_viewPosition.value.copy(this.camera.position);

    // 2. ACTUALIZAR MATRICES: Como usas RawShaderMaterial, 
    // Three.js no siempre actualiza las matrices automáticamente en los uniforms.
    this.material.uniforms.viewMatrix.value.copy(this.camera.matrixWorldInverse);

    // 3. Actualizar controles para que el damping funcione suave
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
}

  private onWindowResize(): void {
    this.camera.aspect = this.camConfig.aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
  }

    private setupUI() {
    this.gui.addColor(this.params, 'materialColor').name('Color').onChange((v: string) => this.material.uniforms.u_materialColor.value.set(v));
    this.gui.addColor(this.params, 'specularColor').name('Specular').onChange((v: string) => this.material.uniforms.u_specularColor.value.set(v));
    this.gui.add(this.params, 'shininess', 1, 256).name('Brillo').onChange((v: number) => this.material.uniforms.u_shininess.value = v);
    
    const light = this.gui.addFolder('Luz');
    light.add(this.params, 'lightX', -5, 5).onChange((v: number) => this.material.uniforms.u_lightPosition.value.x = v);
    light.add(this.params, 'lightY', -5, 5).onChange((v: number) => this.material.uniforms.u_lightPosition.value.y = v);
  }
}

new PhongApp()
