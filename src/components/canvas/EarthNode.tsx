import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, QuadraticBezierLine, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ── Constants ──────────────────────────────────────────────────────────────
const PLANET_RADIUS = 2.4;
const OCEAN_COLOR = '#0f2744';
const OCEAN_DEEP = '#061324';
const LAND_COLOR = '#166534';
const LAND_LIGHT = '#22c55e';
const ARC_PRIMARY = '#22D3EE';   // Luminous Cyan
const ARC_SECONDARY = '#FDE047'; // Luminous Gold
const NODE_GLOW = '#38bdf8';
const ATMOSPHERE_COLOR = '#38bdf8';

// ── Comprehensive Worldwide Node Database (60+ Nodes) ──────────────────────
// [latitude, longitude, region/name, isHub]
type NodeTuple = [number, number, string, boolean];

const WORLD_NODES: NodeTuple[] = [
  // Central America & Caribbean (Focus Hub: Panama & Valladolid)
  [8.98, -79.52, 'Panamá', true],
  [20.69, -88.57, 'Valladolid (ITSVA)', true],
  [9.93, -84.08, 'Costa Rica', false],
  [14.63, -90.51, 'Guatemala', false],
  [13.69, -89.19, 'El Salvador', false],
  [12.11, -86.24, 'Nicaragua', false],
  [15.50, -88.03, 'Honduras', false],
  [18.47, -69.90, 'Rep. Dominicana', false],
  [23.13, -82.38, 'Cuba', false],
  [10.48, -66.90, 'Caracas', false],

  // Mexico & North America
  [19.43, -99.13, 'Ciudad de México', true],
  [20.97, -89.62, 'Mérida', false],
  [25.67, -100.31, 'Monterrey', false],
  [20.67, -103.35, 'Guadalajara', false],
  [40.71, -74.01, 'New York', true],
  [38.91, -77.04, 'Washington DC', false],
  [34.05, -118.24, 'Los Angeles', true],
  [41.87, -87.62, 'Chicago', false],
  [45.50, -73.56, 'Montreal', false],
  [49.28, -123.12, 'Vancouver', false],

  // South America
  [4.71, -74.07, 'Bogotá', true],
  [6.24, -75.58, 'Medellín', false],
  [-0.18, -78.47, 'Quito', false],
  [-12.05, -77.04, 'Lima', true],
  [-16.50, -68.15, 'La Paz', false],
  [-33.45, -70.66, 'Santiago', true],
  [-34.60, -58.38, 'Buenos Aires', true],
  [-23.55, -46.63, 'São Paulo', true],
  [-15.79, -47.88, 'Brasilia', false],
  [-22.90, -43.17, 'Río de Janeiro', false],
  [-25.29, -57.63, 'Asunción', false],
  [-34.88, -56.17, 'Montevideo', false],

  // Europe
  [40.42, -3.70, 'Madrid', true],
  [41.38, 2.17, 'Barcelona', false],
  [51.51, -0.13, 'Londres', true],
  [48.86, 2.35, 'París', true],
  [52.52, 13.41, 'Berlín', true],
  [41.90, 12.50, 'Roma', false],
  [52.37, 4.89, 'Ámsterdam', false],
  [48.20, 16.37, 'Viena', false],
  [38.72, -9.14, 'Lisboa', false],

  // Africa & Middle East
  [30.04, 31.23, 'El Cairo', true],
  [6.52, 3.38, 'Lagos', false],
  [-26.20, 28.04, 'Johannesburgo', true],
  [33.59, -7.61, 'Casablanca', false],
  [-1.29, 36.82, 'Nairobi', false],
  [25.20, 55.27, 'Dubái', true],

  // Asia
  [35.68, 139.69, 'Tokyo', true],
  [39.90, 116.40, 'Beijing', true],
  [31.23, 121.47, 'Shanghai', false],
  [37.56, 126.97, 'Seúl', false],
  [1.35, 103.82, 'Singapur', true],
  [28.61, 77.20, 'Nueva Delhi', false],
  [22.31, 114.16, 'Hong Kong', false],
  [13.75, 100.50, 'Bangkok', false],

  // Oceania
  [-33.86, 151.20, 'Sídney', true],
  [-37.81, 144.96, 'Melbourne', false],
  [-36.84, 174.76, 'Auckland', false],
];

// ── Worldwide Intercontinental & Regional Connection Grid ───────────────────
// Pair indices connecting cities across all oceans & regions
const WORLD_CONNECTIONS: [number, number, boolean][] = [
  // ── Intercontinental Transatlantic (Americas ↔ Europe & Africa)
  [0, 32, true],   // Panama → Madrid
  [0, 34, true],   // Panama → London
  [1, 32, true],   // Valladolid → Madrid
  [10, 32, true],  // Mexico DF → Madrid
  [10, 35, true],  // Mexico DF → Paris
  [14, 34, true],  // New York → London
  [14, 35, true],  // New York → Paris
  [20, 32, true],  // Bogota → Madrid
  [26, 32, true],  // Buenos Aires → Madrid
  [27, 32, true],  // Sao Paulo → Madrid
  [27, 40, true],  // Sao Paulo → Lisbon
  [27, 43, true],  // Sao Paulo → Johannesburg
  [44, 32, true],  // Casablanca → Madrid
  [41, 37, true],  // Cairo → Rome

  // ── Intercontinental Transpacific & Asia-America
  [16, 47, true],  // Los Angeles → Tokyo
  [16, 51, true],  // Los Angeles → Singapore
  [19, 47, true],  // Vancouver → Tokyo
  [23, 47, true],  // Lima → Tokyo
  [25, 55, true],  // Santiago → Sydney

  // ── Europe ↔ Africa ↔ Middle East ↔ Asia
  [32, 44, false], // Madrid → Casablanca
  [37, 41, false], // Rome → Cairo
  [41, 46, true],  // Cairo → Dubai
  [46, 52, true],  // Dubai → New Delhi
  [46, 51, true],  // Dubai → Singapore
  [34, 47, true],  // London → Tokyo
  [36, 48, true],  // Berlin → Beijing
  [35, 51, true],  // Paris → Singapore
  [42, 43, false], // Lagos → Johannesburg
  [45, 43, false], // Nairobi → Johannesburg
  [51, 55, true],  // Singapore → Sydney
  [47, 55, true],  // Tokyo → Sydney
  [48, 55, true],  // Beijing → Sydney
  [49, 50, false], // Shanghai → Seoul

  // ── Americas Spine & Cross-Regional Web
  [0, 1, true],    // Panama → Valladolid
  [0, 2, false],   // Panama → Costa Rica
  [0, 3, false],   // Panama → Guatemala
  [0, 10, true],   // Panama → Mexico DF
  [0, 20, true],   // Panama → Bogota
  [0, 22, false],  // Panama → Quito
  [0, 23, true],   // Panama → Lima
  [0, 26, true],   // Panama → Buenos Aires
  [0, 27, true],   // Panama → Sao Paulo
  [1, 10, true],   // Valladolid → Mexico DF
  [1, 11, false],  // Valladolid → Merida
  [10, 12, false], // Mexico DF → Monterrey
  [10, 13, false], // Mexico DF → Guadalajara
  [10, 14, true],  // Mexico DF → New York
  [10, 16, true],  // Mexico DF → Los Angeles
  [14, 15, false], // New York → Washington DC
  [14, 17, false], // New York → Chicago
  [14, 18, false], // New York → Montreal
  [16, 19, false], // Los Angeles → Vancouver
  [20, 21, false], // Bogota → Medellin
  [20, 22, false], // Bogota → Quito
  [20, 23, true],  // Bogota → Lima
  [20, 9, false],  // Bogota → Caracas
  [23, 24, false], // Lima → La Paz
  [23, 25, true],  // Lima → Santiago
  [25, 26, true],  // Santiago → Buenos Aires
  [26, 27, true],  // Buenos Aires → Sao Paulo
  [27, 28, false], // Sao Paulo → Brasilia
  [27, 29, false], // Sao Paulo → Rio de Janeiro
  [26, 31, false], // Buenos Aires → Montevideo
  [26, 30, false], // Buenos Aires → Asuncion

  // ── Europe Regional Web
  [32, 33, false], // Madrid → Barcelona
  [32, 35, true],  // Madrid → Paris
  [34, 35, true],  // London → Paris
  [35, 36, true],  // Paris → Berlin
  [35, 37, false], // Paris → Rome
  [36, 38, false], // Berlin → Amsterdam
  [36, 39, false], // Berlin → Vienna
  [32, 40, false], // Madrid → Lisbon

  // ── Asia Regional Web
  [47, 48, true],  // Tokyo → Beijing
  [47, 50, false], // Tokyo → Seoul
  [48, 49, false], // Beijing → Shanghai
  [49, 53, false], // Shanghai → Hong Kong
  [51, 53, false], // Singapore → Hong Kong
  [51, 54, false], // Singapore → Bangkok
  [55, 56, false], // Sydney → Melbourne
  [55, 57, false], // Sydney → Auckland
];

// ── Helpers ────────────────────────────────────────────────────────────────
function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ── Luminous Connection Arc Component ──────────────────────────────────────
function ConnectionArc({
  start,
  end,
  isPrimary,
  pulseSpeed,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  isPrimary: boolean;
  pulseSpeed: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  const mid = useMemo(() => {
    const m = start.clone().lerp(end, 0.5);
    const distance = start.distanceTo(end);
    const height = Math.max(0.2, distance * (isPrimary ? 0.38 : 0.25));
    return m.normalize().multiplyScalar(PLANET_RADIUS + height);
  }, [start, end, isPrimary]);

  const [offset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (ref.current?.material) {
      ref.current.material.dashOffset = state.clock.getElapsedTime() * pulseSpeed + offset;
    }
  });

  return (
    <QuadraticBezierLine
      ref={ref}
      start={start}
      end={end}
      mid={mid}
      color={isPrimary ? ARC_PRIMARY : ARC_SECONDARY}
      lineWidth={isPrimary ? 1.6 : 1.0}
      transparent
      opacity={isPrimary ? 0.75 : 0.45}
      dashed
      dashSize={isPrimary ? 0.4 : 0.25}
      gapSize={isPrimary ? 0.4 : 0.6}
    />
  );
}

// ── Glowing Node Points ────────────────────────────────────────────────────
function GlowingNodes({ points, isHub }: { points: THREE.Vector3[]; isHub: boolean[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const initializedRef = useRef(false);

  useFrame((state) => {
    if (!initializedRef.current && meshRef.current && glowRef.current) {
      const dummy = new THREE.Object3D();
      points.forEach((point, i) => {
        dummy.position.copy(point);
        dummy.lookAt(new THREE.Vector3(0, 0, 0));
        const scale = isHub[i] ? 1.5 : 0.85;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        dummy.scale.setScalar(scale * 3.8);
        dummy.updateMatrix();
        glowRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      glowRef.current.instanceMatrix.needsUpdate = true;
      initializedRef.current = true;
    }

    if (glowRef.current?.material && 'opacity' in glowRef.current.material) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.18 + Math.sin(state.clock.getElapsedTime() * 2.0) * 0.12;
    }
  });

  return (
    <group>
      {/* Core Node Spheres */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, points.length]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial color={NODE_GLOW} />
      </instancedMesh>
      {/* Outer Halo Glow */}
      <instancedMesh ref={glowRef} args={[undefined, undefined, points.length]}>
        <sphereGeometry args={[0.028, 12, 12]} />
        <meshBasicMaterial color={NODE_GLOW} transparent opacity={0.25} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

// ── Traveling Pulses (Information Packets) ──────────────────────────────────
function TravelingPulses({
  connections,
  nodePositions,
}: {
  connections: [number, number, boolean][];
  nodePositions: THREE.Vector3[];
}) {
  const count = Math.min(connections.length, 32);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [pulseData] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      connectionIndex: i % connections.length,
      progress: Math.random(),
      speed: 0.18 + Math.random() * 0.3,
    }))
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    pulseData.forEach((pulse, i) => {
      pulse.progress += pulse.speed * delta;
      if (pulse.progress > 1) {
        pulse.progress = 0;
        pulse.connectionIndex = (pulse.connectionIndex + 4) % connections.length;
      }

      const conn = connections[pulse.connectionIndex];
      if (!conn) return;
      const a = nodePositions[conn[0]];
      const b = nodePositions[conn[1]];
      const isPrimary = conn[2];
      if (!a || !b) return;

      const mid = a.clone().lerp(b, 0.5);
      const dist = a.distanceTo(b);
      mid.normalize().multiplyScalar(PLANET_RADIUS + Math.max(0.2, dist * (isPrimary ? 0.38 : 0.25)));

      const t = pulse.progress;
      const oneMinusT = 1 - t;
      const pos = new THREE.Vector3()
        .addScaledVector(a, oneMinusT * oneMinusT)
        .addScaledVector(mid, 2 * oneMinusT * t)
        .addScaledVector(b, t * t);

      dummy.position.copy(pos);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.028, 8, 8]} />
      <meshBasicMaterial color={ARC_SECONDARY} transparent opacity={0.95} />
    </instancedMesh>
  );
}

// ── Atmosphere Glow Shader ─────────────────────────────────────────────────
function Atmosphere() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(ATMOSPHERE_COLOR) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(glowColor, intensity * 0.75);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  return <Sphere args={[PLANET_RADIUS * 1.14, 64, 64]} material={material} />;
}

// ── Main EarthNode Component ───────────────────────────────────────────────
export function EarthNode() {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;

  const texture = useTexture('/earth-specular.jpg');

  // Realistic Earth Shader with land & ocean distinction
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        tSpecular: { value: texture },
        oceanColor: { value: new THREE.Color(OCEAN_COLOR) },
        oceanDeep: { value: new THREE.Color(OCEAN_DEEP) },
        landColor: { value: new THREE.Color(LAND_COLOR) },
        landLight: { value: new THREE.Color(LAND_LIGHT) },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tSpecular;
        uniform vec3 oceanColor;
        uniform vec3 oceanDeep;
        uniform vec3 landColor;
        uniform vec3 landLight;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec4 spec = texture2D(tSpecular, vUv);
          float land = 1.0 - spec.r;

          // Lighting: Directional light from upper-right
          vec3 lightDir = normalize(vec3(0.6, 0.8, 1.0));
          float diffuse = max(dot(vNormal, lightDir), 0.0);
          float ambient = 0.28;
          float lighting = ambient + diffuse * 0.72;

          vec3 color;
          float alpha;

          if (land < 0.25) {
            // Ocean: rich deep gradient + water specular reflection
            float depth = spec.r * 0.6 + 0.4;
            color = mix(oceanDeep, oceanColor, depth);
            color *= lighting;
            vec3 viewDir = normalize(-vPosition);
            vec3 reflectDir = reflect(-lightDir, vNormal);
            float specHighlight = pow(max(dot(viewDir, reflectDir), 0.0), 28.0);
            color += vec3(0.2, 0.4, 0.6) * specHighlight * 0.6;
            alpha = 0.96;
          } else {
            // Land: natural emerald green landscape
            float elevation = smoothstep(0.25, 0.8, land);
            color = mix(landColor, landLight, elevation);
            color *= lighting;
            alpha = 0.98;
          }

          // Atmosphere rim light
          float rimDot = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
          float rim = smoothstep(0.45, 1.0, rimDot);
          color += vec3(0.15, 0.45, 0.75) * rim * 0.5;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
    });
  }, [texture]);

  const earthMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  if (earthMaterialRef.current == null) {
    earthMaterialRef.current = earthMaterial;
  }

  useFrame((state) => {
    if (earthMaterialRef.current?.uniforms.time) {
      earthMaterialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  // Calculate 3D positions for all world nodes
  const nodePositions = useMemo(() =>
    WORLD_NODES.map(([lat, lon]) => latLonToVec3(lat, lon, PLANET_RADIUS * 1.008)),
    []
  );

  const isHub = useMemo(() => WORLD_NODES.map((n) => n[3]), []);

  const visibleConnections = useMemo(
    () => (isMobile ? WORLD_CONNECTIONS.slice(0, 35) : WORLD_CONNECTIONS),
    [isMobile]
  );

  // Slow smooth rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.09;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#a0c4ff" />
      <directionalLight position={[6, 8, 10]} intensity={0.95} color="#ffffff" />
      <pointLight position={[-6, -4, -6]} intensity={0.2} color="#38bdf8" />

      {/* Position globe slightly down so upper hemisphere is prominently displayed */}
      <group ref={groupRef} position={[0, -1.6, 0]}>
        {/* Core sphere */}
        <Sphere args={[PLANET_RADIUS * 0.97, 32, 32]}>
          <meshBasicMaterial color={OCEAN_DEEP} />
        </Sphere>

        {/* Realistic Earth Surface */}
        <Sphere args={[PLANET_RADIUS, 64, 64]} material={earthMaterial} />

        {/* Atmosphere Glow */}
        <Atmosphere />

        {/* Global Connection Network Arcs */}
        {visibleConnections.map(([fromIdx, toIdx, isPrimaryRoute], i) => {
          const from = nodePositions[fromIdx];
          const to = nodePositions[toIdx];
          if (!from || !to) return null;
          return (
            <ConnectionArc
              key={i}
              start={from}
              end={to}
              isPrimary={isPrimaryRoute}
              pulseSpeed={0.12 + (i % 6) * 0.025}
            />
          );
        })}

        {/* Luminous Node Points */}
        <GlowingNodes points={nodePositions} isHub={isHub} />

        {/* Traveling Data Pulses */}
        <TravelingPulses connections={visibleConnections} nodePositions={nodePositions} />
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
