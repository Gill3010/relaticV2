import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, QuadraticBezierLine, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Constants
const PLANET_RADIUS = 2.4; // Ligeramente más grande
const PLANET_COLOR = '#FDE047'; // Amarillo (cta)
const ARC_COLOR = '#22D3EE'; // Cyan luminiscente
const ARC_COUNT_DESKTOP = 45;
const ARC_COUNT_MOBILE = 20;

// Helper to get random point on a sphere
function getRandomPointOnSphere(radius: number) {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// A single animated connection arc
function ConnectionArc({ start, end, height, color }: { start: THREE.Vector3, end: THREE.Vector3, height: number, color: string }) {
  const ref = useRef<any>(null);
  const mid = start.clone().lerp(end, 0.5);
  const distance = start.distanceTo(end);
  const midNormalized = mid.normalize().multiplyScalar(PLANET_RADIUS + distance * height);

  const [offset] = useState(() => Math.random() * 100);
  
  useFrame((state) => {
    if (ref.current) {
        const time = state.clock.getElapsedTime();
        ref.current.material.dashOffset = time * 0.15 + offset;
    }
  });

  return (
    <QuadraticBezierLine
      ref={ref}
      start={start}
      end={end}
      mid={midNormalized}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.6}
      dashed
      dashSize={0.4}
      gapSize={0.8}
    />
  );
}

// Data Nodes / Cities
function DataNodes({ points, color }: { points: THREE.Vector3[], color: string }) {
    const instances = useMemo(() => {
        const geometry = new THREE.SphereGeometry(0.03, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.InstancedMesh(geometry, material, points.length);
        
        const dummy = new THREE.Object3D();
        points.forEach((point, i) => {
            dummy.position.copy(point);
            dummy.lookAt(new THREE.Vector3(0,0,0)); 
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
        return mesh;
    }, [points, color]);

    return <primitive object={instances} />;
}

// Orbiting Particles (Satellites) + Dynamic Network
function OrbitingParticles({ count, color, radiusOffset }: { count: number, color: string, radiusOffset: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const particles = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
        const radius = PLANET_RADIUS + radiusOffset + Math.random() * 0.4;
        const speed = (0.05 + Math.random() * 0.2) * (Math.random() > 0.5 ? 1 : -1);
        
        // Random rotation axis
        const axis = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
        
        const pos = new THREE.Vector3(radius, 0, 0);
        pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI * 2);
        pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.random() * Math.PI * 2);

        items.push({ pos, axis, speed });
    }
    return items;
  }, [count, radiusOffset]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-allocate buffer for lines
  const maxLines = (count * (count - 1)) / 2;
  const positions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  useFrame((_, delta) => {
    let lineIndex = 0;

    // Update particle positions
    particles.forEach((particle, i) => {
      particle.pos.applyAxisAngle(particle.axis, particle.speed * delta);
      
      if (meshRef.current) {
        dummy.position.copy(particle.pos);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update lines based on proximity
    const thresholdSq = 1.2 * 1.2; // Maximum connection distance squared
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const p1 = particles[i].pos;
        const p2 = particles[j].pos;
        if (p1.distanceToSquared(p2) < thresholdSq) {
           positions[lineIndex++] = p1.x;
           positions[lineIndex++] = p1.y;
           positions[lineIndex++] = p1.z;
           positions[lineIndex++] = p2.x;
           positions[lineIndex++] = p2.y;
           positions[lineIndex++] = p2.z;
        }
      }
    }
    
    if (linesRef.current) {
       linesRef.current.geometry.setDrawRange(0, lineIndex / 3);
       linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </instancedMesh>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={maxLines * 2}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
      </lineSegments>
    </group>
  );
}
export function EarthNode() {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const arcCount = isMobile ? ARC_COUNT_MOBILE : ARC_COUNT_DESKTOP;

  // Load the specular map (Oceans = white approx, Land = black approx)
  const texture = useTexture('/earth-specular.jpg');

  // Continents shader
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        tSpecular: { value: texture },
        color: { value: new THREE.Color(PLANET_COLOR) },
        opacity: { value: 0.95 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tSpecular;
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
          vec4 spec = texture2D(tSpecular, vUv);
          // Inversion: land becomes 1.0, ocean becomes 0.0
          float land = 1.0 - spec.r; 
          
          // Oceans: light white/gray with low opacity. Land: full opacity yellow
          if (land < 0.2) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1); // Ocean color + opacity
          } else {
            gl_FragColor = vec4(color, opacity * land); // Land color
          }
        }
      `,
      transparent: true,
      side: THREE.FrontSide
    });
  }, [texture]);

  // Generate random arcs
  const arcs = useMemo(() => {
    const result = [];
    const nodePoints = [];
    for (let i = 0; i < arcCount; i++) {
        const start = getRandomPointOnSphere(PLANET_RADIUS);
        const end = getRandomPointOnSphere(PLANET_RADIUS);
        if (start.distanceTo(end) > 1.5) {
            result.push({ start, end });
            nodePoints.push(start, end);
        }
    }
    return { arcs: result, nodes: nodePoints };
  }, [arcCount]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12; // Aumentar la velocidad de rotación
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      {/* Position down so ONLY the top hemisphere is clearly visible in the container */}
      <group ref={groupRef} position={[0, -1.8, 0]}>
        
        {/* Core sphere - to give some baseline depth and hide back-side lines */}
        <Sphere args={[PLANET_RADIUS * 0.98, 32, 32]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </Sphere>

        {/* The Planet Surface with Continents */}
        <Sphere args={[PLANET_RADIUS, 64, 64]} material={earthMaterial} />

        {/* Connection Arcs */}
        {arcs.arcs.map((arc, i) => (
          <ConnectionArc
             key={i}
             start={arc.start}
             end={arc.end}
             height={0.4}
             color={ARC_COLOR}
          />
        ))}

        {/* Data Nodes at start/end of arcs */}
        <DataNodes points={arcs.nodes} color={ARC_COLOR} />

        {/* Orbiting particles (Satellites) */}
        <OrbitingParticles count={isMobile ? 40 : 100} color={ARC_COLOR} radiusOffset={0.2} />
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        autoRotate={false}
      />
    </>
  );
}
