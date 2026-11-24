import * as THREE from "three";

export interface DigitalTwinCallbacks {
  onSurgeToggle?: (isSurge: boolean) => void;
  onFpsUpdate?: (fps: number) => void;
}

export class DigitalTwinEngine {
  private container: HTMLElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private terrain!: THREE.Mesh;
  private water!: THREE.Mesh;
  private waterGeo!: THREE.PlaneGeometry;
  private particles!: THREE.Points;
  private markers: { group: THREE.Group; ring: THREE.Mesh }[] = [];

  private animId: number | null = null;
  private isSurge = false;
  private rotZ = -0.25;
  private rotX = 0.55;
  private isDragging = false;
  private prevMouse = { x: 0, y: 0 };
  private clock = 0;
  private callbacks: DigitalTwinCallbacks;

  private cleanupFns: (() => void)[] = [];

  constructor(container: HTMLElement, callbacks: DigitalTwinCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.init();
  }

  private init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 340;

    // Scene & Abyssal Hydrological Navy Fog (#040B14)
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x040b14, 0.02);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, -32, 22);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.container.appendChild(this.renderer.domElement);

    // Hydrological Blue Lighting (#0284C7, #F0F9FF, #0EA5E9)
    const ambientLight = new THREE.AmbientLight(0x0284c7, 1.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xf0f9ff, 2.0);
    dirLight.position.set(20, -20, 30);
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x0ea5e9, 2.8, 60);
    pointLight.position.set(0, 0, 12);
    this.scene.add(pointLight);

    // River Canyon Terrain (#0284C7 Deep Marine Blue Wireframe)
    const gridX = 44;
    const gridY = 28;
    const terrainGeo = new THREE.PlaneGeometry(54, 34, gridX, gridY);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const canyon = Math.exp(-Math.pow(y, 2) / 26) * -5.2;
      const hills = Math.sin(x * 0.18) * 2.2 + Math.cos(y * 0.25) * 1.8 + Math.sin((x + y) * 0.1) * 1.1;
      pos.setZ(i, canyon + hills);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      wireframe: true,
      emissive: 0x081424,
      roughness: 0.85,
    });
    this.terrain = new THREE.Mesh(terrainGeo, terrainMat);
    this.terrain.rotation.z = this.rotZ;
    this.scene.add(this.terrain);

    // Flowing Water Mesh (#38BDF8 Glacial Sky Blue nominal, #0EA5E9 Deep River Blue surge)
    this.waterGeo = new THREE.PlaneGeometry(54, 13, 44, 16);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.58,
      transparent: true,
      opacity: 0.88,
      roughness: 0.18,
      metalness: 0.32,
    });
    this.water = new THREE.Mesh(this.waterGeo, waterMat);
    this.water.position.set(0, 0, -2.6);
    this.water.rotation.z = this.rotZ;
    this.scene.add(this.water);

    // Telemetry Stations
    this.createMarkers();

    // Floating Atmospheric Particles
    this.createParticles();

    // Event Listeners for Orbit & Touch Controls
    this.setupControls();

    // Resize Observer
    this.setupResizeObserver();

    // Start Animation Loop
    this.animate();
  }

  private createMarkers() {
    const stations = [
      { x: -15, y: -0.4, color: 0x7dd3fc, label: "Upstream Gauge (Son)" },
      { x: 2, y: 0.6, color: 0x0ea5e9, label: "Patna Sector Confluence" },
      { x: 17, y: -0.8, color: 0x38bdf8, label: "Downstream Station (Gandak)" },
    ];

    stations.forEach((st) => {
      const group = new THREE.Group();
      group.position.set(st.x, st.y, -1.5);

      const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 8);
      const poleMat = new THREE.MeshBasicMaterial({ color: st.color });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.rotation.x = Math.PI / 2;
      group.add(pole);

      const beaconGeo = new THREE.SphereGeometry(0.65, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xf0f9ff });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.z = 1.8;
      group.add(beacon);

      const ringGeo = new THREE.RingGeometry(0.8, 1.3, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: st.color,
        transparent: true,
        opacity: 0.78,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = 1.8;
      group.add(ring);

      this.scene.add(group);
      this.markers.push({ group, ring });
    });
  }

  private createParticles() {
    const count = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 50;
      pPos[i + 1] = (Math.random() - 0.5) * 30;
      pPos[i + 2] = Math.random() * 12 - 2;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.32,
      transparent: true,
      opacity: 0.58,
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);
  }

  private setupControls() {
    const onMouseDown = (e: MouseEvent) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      this.isDragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.prevMouse.x;
      const deltaY = e.clientY - this.prevMouse.y;
      this.rotZ += deltaX * 0.007;
      if (this.terrain) this.terrain.rotation.z = this.rotZ;
      if (this.water) this.water.rotation.z = this.rotZ;
      if (this.scene) {
        this.scene.rotation.x = Math.max(-0.25, Math.min(0.9, this.scene.rotation.x + deltaY * 0.006));
      }
      this.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      this.isDragging = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.prevMouse.x;
        this.rotZ += deltaX * 0.008;
        if (this.terrain) this.terrain.rotation.z = this.rotZ;
        if (this.water) this.water.rotation.z = this.rotZ;
        this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    this.container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    this.container.addEventListener("mousemove", onMouseMove);

    this.container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    this.container.addEventListener("touchmove", onTouchMove, { passive: true });

    this.cleanupFns.push(() => {
      this.container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      this.container.removeEventListener("mousemove", onMouseMove);
      this.container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      this.container.removeEventListener("touchmove", onTouchMove);
    });
  }

  private setupResizeObserver() {
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && this.camera && this.renderer) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
        }
      }
    });
    observer.observe(this.container);
    this.cleanupFns.push(() => observer.disconnect());
  }

  public toggleSurge(): boolean {
    this.isSurge = !this.isSurge;
    if (this.callbacks.onSurgeToggle) {
      this.callbacks.onSurgeToggle(this.isSurge);
    }
    return this.isSurge;
  }

  public setSurge(active: boolean) {
    this.isSurge = active;
    if (this.callbacks.onSurgeToggle) {
      this.callbacks.onSurgeToggle(this.isSurge);
    }
  }

  public resetCamera() {
    this.rotZ = -0.25;
    this.rotX = 0.55;
    if (this.terrain) this.terrain.rotation.z = this.rotZ;
    if (this.water) this.water.rotation.z = this.rotZ;
    if (this.scene) this.scene.rotation.x = 0;
  }

  private animate = () => {
    this.animId = requestAnimationFrame(this.animate);
    this.clock += 0.024;

    if (this.waterGeo) {
      const wPos = this.waterGeo.attributes.position;
      for (let i = 0; i < wPos.count; i++) {
        const u = wPos.getX(i);
        const v = wPos.getY(i);
        const wave = Math.sin(u * 0.35 + this.clock * 2.2) * 0.45 + Math.cos(v * 0.55 + this.clock * 1.6) * 0.28;
        wPos.setZ(i, wave);
      }
      wPos.needsUpdate = true;
    }

    this.markers.forEach((m) => {
      const s = 1 + (Math.sin(this.clock * 3) + 1) * 0.55;
      m.ring.scale.set(s, s, 1);
      const mat = m.ring.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0.1, 1 - (s - 1) * 0.7);
    });

    if (this.water) {
      const targetZ = this.isSurge ? -0.8 : -2.6;
      this.water.position.z += (targetZ - this.water.position.z) * 0.08;
      const wMat = this.water.material as THREE.MeshStandardMaterial;
      if (this.isSurge) {
        wMat.color.setHex(0x0ea5e9);
        wMat.emissive.setHex(0x0284c7);
      } else {
        wMat.color.setHex(0x38bdf8);
        wMat.emissive.setHex(0x0ea5e9);
      }
    }

    if (!this.isDragging) {
      this.rotZ += 0.0018;
      if (this.terrain) this.terrain.rotation.z = this.rotZ;
      if (this.water) this.water.rotation.z = this.rotZ;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
