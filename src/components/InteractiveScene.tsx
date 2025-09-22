import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useLanguage } from '../hooks/useLanguage';
import { Play, Pause, RotateCcw, Plus, Minus, Eye, EyeOff, Info, MousePointer, Move3D } from 'lucide-react';

export const InteractiveScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<any>();
  const animationRef = useRef<number>();
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [planetCount, setPlanetCount] = useState(3);
  const [sunMass, setSunMass] = useState(1.0);
  const [showGrid, setShowGrid] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [showForces, setShowForces] = useState(false);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [cameraDistance, setCameraDistance] = useState(25);
  
  const { t } = useLanguage();

  // Mouse interaction state
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, lastX: 0, lastY: 0 });
  const cameraRotationRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event: MouseEvent) => {
    mouseRef.current.isDown = true;
    mouseRef.current.lastX = event.clientX;
    mouseRef.current.lastY = event.clientY;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!mouseRef.current.isDown || !cameraRef.current) return;

    const deltaX = event.clientX - mouseRef.current.lastX;
    const deltaY = event.clientY - mouseRef.current.lastY;

    cameraRotationRef.current.y += deltaX * 0.01;
    cameraRotationRef.current.x += deltaY * 0.01;

    // Limit vertical rotation
    cameraRotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraRotationRef.current.x));

    // Update camera position
    const radius = cameraDistance;
    cameraRef.current.position.x = Math.cos(cameraRotationRef.current.y) * Math.cos(cameraRotationRef.current.x) * radius;
    cameraRef.current.position.y = Math.sin(cameraRotationRef.current.x) * radius + 10;
    cameraRef.current.position.z = Math.sin(cameraRotationRef.current.y) * Math.cos(cameraRotationRef.current.x) * radius;
    
    cameraRef.current.lookAt(0, 0, 0);

    mouseRef.current.lastX = event.clientX;
    mouseRef.current.lastY = event.clientY;
  }, [cameraDistance]);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const newDistance = Math.max(10, Math.min(50, cameraDistance + event.deltaY * 0.01));
    setCameraDistance(newDistance);
    
    if (cameraRef.current) {
      const radius = newDistance;
      cameraRef.current.position.x = Math.cos(cameraRotationRef.current.y) * Math.cos(cameraRotationRef.current.x) * radius;
      cameraRef.current.position.y = Math.sin(cameraRotationRef.current.x) * radius + 10;
      cameraRef.current.position.z = Math.sin(cameraRotationRef.current.y) * Math.cos(cameraRotationRef.current.x) * radius;
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [cameraDistance]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    scene.fog = new THREE.Fog(0x0a0a1a, 30, 100);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x404080, 0.4);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(15, 20, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 4096;
    keyLight.shadow.mapSize.height = 4096;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.camera.left = -30;
    keyLight.shadow.camera.right = 30;
    keyLight.shadow.camera.top = 30;
    keyLight.shadow.camera.bottom = -30;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Rim Light
    const rimLight = new THREE.DirectionalLight(0x4444ff, 0.8);
    rimLight.position.set(-10, 5, -10);
    scene.add(rimLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xffaa44, 0.3);
    fillLight.position.set(5, -5, 15);
    scene.add(fillLight);

    // Sun Point Light
    const sunLight = new THREE.PointLight(0xffaa00, 3, 100);
    sunLight.position.set(0, 2, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Enhanced Spacetime Grid with Advanced Shader
    const createAdvancedSpacetimeGrid = () => {
      const geometry = new THREE.PlaneGeometry(60, 60, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          sunPosition: { value: new THREE.Vector3(0, 0, 0) },
          sunMass: { value: sunMass },
          planetPositions: { value: [] },
          planetMasses: { value: [] },
          showGrid: { value: showGrid },
          resolution: { value: new THREE.Vector2(100, 100) }
        },
        vertexShader: `
          uniform float time;
          uniform vec3 sunPosition;
          uniform float sunMass;
          uniform vec3 planetPositions[10];
          uniform float planetMasses[10];
          uniform bool showGrid;
          
          varying vec3 vPosition;
          varying float vWarp;
          varying vec2 vUv;
          varying vec3 vNormal;
          
          void main() {
            vPosition = position;
            vUv = uv;
            
            // Calculate total gravitational effect
            float totalWarp = 0.0;
            
            // Sun effect
            float sunDist = distance(position.xy, sunPosition.xy);
            float sunWarp = sunMass * 4.0 / (1.0 + sunDist * 0.2);
            totalWarp += sunWarp;
            
            // Planet effects
            for(int i = 0; i < 3; i++) {
              if(i < 3) {
                float planetDist = distance(position.xy, planetPositions[i].xy);
                float planetWarp = planetMasses[i] * 0.8 / (1.0 + planetDist * 0.5);
                totalWarp += planetWarp;
              }
            }
            
            vWarp = totalWarp;
            
            // Apply vertical displacement with smooth falloff
            vec3 newPosition = position;
            newPosition.z = -totalWarp * 1.5;
            
            // Add subtle wave animation
            newPosition.z += sin(time * 0.5 + sunDist * 0.3) * 0.1;
            
            // Calculate normal for lighting
            vec3 tangentX = vec3(1.0, 0.0, -4.0 * sunMass / pow(1.0 + sunDist * 0.2, 2.0));
            vec3 tangentY = vec3(0.0, 1.0, -4.0 * sunMass / pow(1.0 + sunDist * 0.2, 2.0));
            vNormal = normalize(cross(tangentX, tangentY));
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform bool showGrid;
          uniform vec2 resolution;
          
          varying vec3 vPosition;
          varying float vWarp;
          varying vec2 vUv;
          varying vec3 vNormal;
          
          void main() {
            // Enhanced grid pattern
            vec2 grid = abs(fract(vPosition.xy * 3.0) - 0.5) / fwidth(vPosition.xy * 3.0);
            float line = min(grid.x, grid.y);
            
            // Dynamic color based on curvature intensity
            vec3 baseColor = vec3(0.1, 0.2, 0.6);
            vec3 warpColor = vec3(1.0, 0.4, 0.1);
            vec3 color = mix(baseColor, warpColor, smoothstep(0.0, 3.0, vWarp));
            
            // Add energy flow effect
            float flow = sin(time * 2.0 + vPosition.x * 0.5 + vPosition.y * 0.3) * 0.1 + 0.9;
            color *= flow;
            
            // Grid visibility with distance fade
            float alpha = showGrid ? (1.0 - min(line, 1.0)) : 0.3;
            alpha *= (1.0 - smoothstep(20.0, 30.0, distance(vPosition.xy, vec2(0.0))));
            alpha *= (0.5 + vWarp * 0.3);
            
            // Add rim lighting effect
            float rimFactor = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
            color += rimFactor * vec3(0.2, 0.4, 1.0) * 0.5;
            
            gl_FragColor = vec4(color, alpha * 0.8);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const grid = new THREE.Mesh(geometry, material);
      grid.rotation.x = -Math.PI / 2;
      grid.position.y = -3;
      grid.userData = { type: 'spacetime-grid' };
      return grid;
    };

    const spacetimeGrid = createAdvancedSpacetimeGrid();
    scene.add(spacetimeGrid);

    // Enhanced Sun with glow effect
    const createEnhancedSun = () => {
      const group = new THREE.Group();
      
      // Main sun body
      const sunGeometry = new THREE.SphereGeometry(2.5, 64, 64);
      const sunMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff4400,
        emissiveIntensity: 0.4,
        roughness: 0.7,
        metalness: 0.1
      });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.castShadow = true;
      sun.userData = { type: 'sun', mass: sunMass };
      group.add(sun);
      
      // Corona effect
      const coronaGeometry = new THREE.SphereGeometry(3.2, 32, 32);
      const coronaMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(0xffaa00) }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 glow = color * intensity;
            float flicker = sin(time * 3.0 + vPosition.x * 2.0) * 0.1 + 0.9;
            gl_FragColor = vec4(glow * flicker, intensity * 0.6);
          }
        `,
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
      group.add(corona);
      
      return group;
    };

    const sunGroup = createEnhancedSun();
    scene.add(sunGroup);

    // Enhanced Planets with detailed materials
    const planets: THREE.Group[] = [];
    const planetOrbits: { radius: number; speed: number; angle: number; inclination: number }[] = [];

    const createEnhancedPlanet = (radius: number, speed: number, color: number, size: number = 0.4) => {
      const group = new THREE.Group();
      
      // Planet body
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshStandardMaterial({ 
        color,
        roughness: 0.8,
        metalness: 0.1,
        normalScale: new THREE.Vector2(0.5, 0.5)
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.castShadow = true;
      planet.receiveShadow = true;
      planet.userData = { type: 'planet', radius, speed };
      group.add(planet);

      // Atmosphere effect
      const atmosphereGeometry = new THREE.SphereGeometry(size * 1.1, 16, 16);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      group.add(atmosphere);
      
      planets.push(group);
      planetOrbits.push({ 
        radius, 
        speed, 
        angle: Math.random() * Math.PI * 2,
        inclination: (Math.random() - 0.5) * 0.2
      });
      scene.add(group);

      // Enhanced orbit trail
      const trailGeometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 128);
      const trailMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: showTrails ? 0.4 : 0,
        side: THREE.DoubleSide
      });
      const trail = new THREE.Mesh(trailGeometry, trailMaterial);
      trail.rotation.x = -Math.PI / 2;
      trail.position.y = -0.2;
      trail.userData = { type: 'orbit-trail' };
      scene.add(trail);

      return group;
    };

    // Create initial planets with varied characteristics
    createEnhancedPlanet(6, 0.025, 0x4466ff, 0.3);   // Mercury-like
    createEnhancedPlanet(9, 0.018, 0xff6644, 0.4);   // Venus-like  
    createEnhancedPlanet(13, 0.012, 0x44ff66, 0.45); // Earth-like

    // Particle system for space dust
    const createSpaceDust = () => {
      const particleCount = 1000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 50;
        positions[i + 2] = (Math.random() - 0.5) * 100;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      
      return new THREE.Points(geometry, material);
    };

    const spaceDust = createSpaceDust();
    scene.add(spaceDust);

    // Mouse event listeners
    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Enhanced Animation Loop
    const animate = (time: number) => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const t = clockRef.current.getElapsedTime();
      const deltaTime = clockRef.current.getDelta();

      // Update spacetime grid
      if (spacetimeGrid.material instanceof THREE.ShaderMaterial) {
        spacetimeGrid.material.uniforms.time.value = t;
        spacetimeGrid.material.uniforms.sunMass.value = sunMass;
        spacetimeGrid.material.uniforms.showGrid.value = showGrid;
        
        // Update planet positions for grid calculation
        const planetPositions = planets.map(planet => planet.position);
        spacetimeGrid.material.uniforms.planetPositions.value = planetPositions;
      }

      // Update sun corona
      const corona = sunGroup.children[1];
      if (corona && corona.material instanceof THREE.ShaderMaterial) {
        corona.material.uniforms.time.value = t;
      }

      // Animate planets with enhanced physics
      planets.forEach((planetGroup, index) => {
        if (planetOrbits[index]) {
          const orbit = planetOrbits[index];
          orbit.angle += orbit.speed * (1 + sunMass * 0.1);
          
          const x = Math.cos(orbit.angle) * orbit.radius;
          const z = Math.sin(orbit.angle) * orbit.radius;
          const y = Math.sin(orbit.angle * 2 + orbit.inclination) * 0.5;
          
          planetGroup.position.set(x, y, z);
          
          // Rotate planet
          const planet = planetGroup.children[0];
          if (planet) {
            planet.rotation.y += 0.02;
            planet.rotation.x = Math.sin(t + index) * 0.1;
          }
        }
      });

      // Rotate sun with solar activity
      const sun = sunGroup.children[0];
      if (sun) {
        sun.rotation.y += 0.005;
        sun.rotation.x = Math.sin(t * 0.3) * 0.05;
      }

      // Animate space dust
      if (spaceDust) {
        spaceDust.rotation.y += 0.0002;
        const positions = spaceDust.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += Math.sin(t + i) * 0.001;
        }
        spaceDust.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPlaying, sunMass, showGrid, showTrails, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, cameraDistance]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setSunMass(1.0);
    setPlanetCount(3);
    setCameraDistance(25);
    cameraRotationRef.current = { x: 0, y: 0 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 15, 25);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const adjustSunMass = (delta: number) => {
    setSunMass(Math.max(0.1, Math.min(5.0, sunMass + delta)));
  };

  const toggleGrid = () => setShowGrid(!showGrid);
  const toggleTrails = () => setShowTrails(!showTrails);
  const toggleForces = () => setShowForces(!showForces);

  return (
    <div className="relative bg-gradient-to-b from-purple-900 via-blue-900 to-black rounded-2xl overflow-hidden shadow-2xl">
      {/* Header with enhanced info */}
      <div className="p-6 bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center flex items-center justify-center gap-3">
          <Move3D className="w-8 h-8 text-purple-400" />
          {t.sceneTitle}
        </h2>
        <p className="text-white/80 text-center mb-4 max-w-2xl mx-auto">
          {t.sceneDescription}
        </p>
        
        {/* Interactive Instructions */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <MousePointer size={16} />
            {t.dragToRotate}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-white/50 rounded flex items-center justify-center">
              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
            </div>
            {t.scrollToZoom}
          </div>
        </div>
      </div>

      {/* Enhanced 3D Scene */}
      <div 
        ref={mountRef} 
        className="w-full h-96 md:h-[600px] relative cursor-grab active:cursor-grabbing"
        style={{ minHeight: '500px' }}
      />

      {/* Information Panel */}
      {selectedObject && (
        <div className="absolute top-20 left-4 bg-black/80 backdrop-blur-md rounded-xl p-4 max-w-xs">
          <h3 className="text-white font-bold mb-2">{selectedObject}</h3>
          <p className="text-white/80 text-sm">
            {selectedObject === 'sun' && t.massEffect}
            {selectedObject === 'planet' && t.orbitMechanics}
            {selectedObject === 'spacetime-grid' && t.spacetimeExplanation}
          </p>
        </div>
      )}

      {/* Enhanced Controls Panel */}
      <div className="p-6 bg-black/40 backdrop-blur-sm border-t border-white/10">
        {/* Primary Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                     text-white px-6 py-3 rounded-full transition-all duration-300
                     hover:scale-105 active:scale-95 shadow-lg"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? t.pause : t.play}
          </button>

          <div className="flex items-center gap-2 bg-purple-600 rounded-full p-1">
            <button
              onClick={() => adjustSunMass(-0.3)}
              className="p-2 hover:bg-purple-700 rounded-full transition-colors"
            >
              <Minus size={18} className="text-white" />
            </button>
            <span className="text-white px-4 text-sm font-medium min-w-[100px] text-center">
              {t.massControl}: {sunMass.toFixed(1)}x
            </span>
            <button
              onClick={() => adjustSunMass(0.3)}
              className="p-2 hover:bg-purple-700 rounded-full transition-colors"
            >
              <Plus size={18} className="text-white" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 
                     text-white px-6 py-3 rounded-full transition-all duration-300
                     hover:scale-105 active:scale-95"
          >
            <RotateCcw size={18} />
            {t.reset}
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={toggleGrid}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300
                       ${showGrid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
          >
            {showGrid ? <Eye size={16} /> : <EyeOff size={16} />}
            {t.showGrid}
          </button>

          <button
            onClick={toggleTrails}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300
                       ${showTrails ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
          >
            {showTrails ? <Eye size={16} /> : <EyeOff size={16} />}
            {t.showTrails}
          </button>

          <button
            onClick={toggleForces}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300
                       ${showForces ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
          >
            <Info size={16} />
            {t.showForces}
          </button>
        </div>

        {/* Physics Information */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <h4 className="text-white font-semibold mb-1">{t.curvatureDetails}</h4>
            <p className="text-white/70">{t.spacetimeExplanation}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h4 className="text-white font-semibold mb-1">{t.realWorldApplications}</h4>
            <p className="text-white/70">{t.realWorldApplications}</p>
          </div>
        </div>
      </div>
    </div>
  );
};