import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';

interface PhoneModelProps {
  screenshotUrl: string | null;
}

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

// ── Screen UV & mesh constants (extracted from GLB) ──────────────
// The screen mesh UVs only sample a small rectangle of the texture.
// U axis maps to screen HEIGHT, V axis maps to screen WIDTH.
const UV_U_MIN = 0.184886;
const UV_U_MAX = 0.524024;
const UV_V_MIN = 0.438856;
const UV_V_MAX = 0.601318;
const UV_U_RANGE = UV_U_MAX - UV_U_MIN; // 0.339
const UV_V_RANGE = UV_V_MAX - UV_V_MIN; // 0.162

// Physical screen dimensions in mesh-local coords
const SCREEN_W = 76.414;  // X range
const SCREEN_H = 159.514; // Z range
const SCREEN_AR = SCREEN_W / SCREEN_H; // ≈ 0.479

/**
 * Paint the user's image onto a 2048×2048 canvas at the exact pixel region
 * the screen mesh UVs sample, rotated 90° CW so it appears upright.
 * Uses "object-fit: cover; object-position: center" semantics.
 */
function applyScreenTexture(
  mat: THREE.MeshStandardMaterial,
  img: HTMLImageElement
) {
  mat.map?.dispose();
  mat.emissiveMap?.dispose();

  const TEX_SIZE = 8192;
  const canvas = document.createElement('canvas');
  canvas.width = TEX_SIZE;
  canvas.height = TEX_SIZE;
  const ctx = canvas.getContext('2d')!;

  // With flipY=false, mesh UV (u,v) maps directly to canvas (x,y):
  //   x = u * TEX_SIZE,  y = v * TEX_SIZE
  // Screen mesh samples u∈[U_MIN,U_MAX] (height) × v∈[V_MIN,V_MAX] (width)
  const regionX = UV_U_MIN * TEX_SIZE;
  const regionY = UV_V_MIN * TEX_SIZE;
  const regionW = UV_U_RANGE * TEX_SIZE; // ~694px → screen HEIGHT
  const regionH = UV_V_RANGE * TEX_SIZE; // ~332px → screen WIDTH

  // After 90° CW rotation: img height→regionW, img width→regionH
  const scaleX = regionW / img.naturalHeight;
  const scaleY = regionH / img.naturalWidth;
  const scale = Math.min(scaleX, scaleY); // contain — show full image, no crop

  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;

  const cx = regionX + regionW / 2;
  const cy = regionY + regionH / 2;

  // On canvas (flipY=false): x-right = phone-up, y-down = phone-left.
  // V increases right→left on the phone, so we need a mirror to compensate.
  // Transform: rotate 90° CW + mirror local X axis.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 2);
  ctx.scale(-1, 1);
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.anisotropy = 16;
  tex.needsUpdate = true;

  mat.map = tex;
  mat.emissiveMap = tex;
  mat.emissive = new THREE.Color('#ffffff');
  mat.emissiveIntensity = 0.85;
  mat.needsUpdate = true;
}

export default function PhoneModel({ screenshotUrl }: PhoneModelProps) {
  const { nodes, materials } = useGLTF('/iphone17.glb') as GLTFResult;

  const screenMat = useMemo(() => {
    const mat = materials.Screen_BG.clone();
    mat.side = THREE.FrontSide;
    return mat;
  }, [materials]);

  useEffect(() => {
    if (screenshotUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => applyScreenTexture(screenMat, img);
      img.src = screenshotUrl;
    } else {
      screenMat.map?.dispose();
      screenMat.emissiveMap?.dispose();
      screenMat.map = null;
      screenMat.emissiveMap = null;
      screenMat.emissive = new THREE.Color('#000000');
      screenMat.emissiveIntensity = 0;
      screenMat.needsUpdate = true;
    }
  }, [screenshotUrl, screenMat]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} scale={0.252}>
      {/* Camera lens rings */}
      <mesh geometry={nodes.Cylinder.geometry} material={materials['Material.004']} position={[2.42, 0.477, 6.597]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={3.503} />
      <mesh geometry={nodes.Cylinder001.geometry} material={materials['Material.004']} position={[-0.025, -0.562, -0.345]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={3.503} />
      <mesh geometry={nodes.Cylinder002.geometry} material={materials['Material.004']} position={[-0.025, -0.562, -0.345]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={3.503} />
      {/* Phone body & frame */}
      <mesh geometry={nodes.defaultMaterial001.geometry} material={materials['Material.002']} position={[0, -0.17, 0]} scale={0.1} />
      <mesh geometry={nodes.defaultMaterial002.geometry} material={materials.Glass_Camera_Logo} position={[-0.018, 0.217, -0.047]} scale={0.1} />
      <mesh geometry={nodes.defaultMaterial003.geometry} material={materials.Plastic} position={[2.419, 0.43, 6.596]} scale={0.105} />
      <mesh geometry={nodes.defaultMaterial004.geometry} material={materials.Screen_Rim} position={[0, -0.17, 0]} scale={0.1} />
      <mesh geometry={nodes.defaultMaterial005.geometry} material={materials.Grill_USB} position={[0, -0.17, 0]} scale={0.1} />
      <mesh geometry={nodes.defaultMaterial006.geometry} material={materials.Camera_Pixel_Glass_002} position={[0, -0.17, 0]} scale={0.1} />
      <mesh geometry={nodes.defaultMaterial007.geometry} material={materials.Camera_Pixel__002} position={[0, -0.17, 0]} scale={0.1} />
      <mesh geometry={nodes.defaultMaterial008.geometry} material={materials.Plastic} position={[0, -0.17, 0]} scale={0.1} />
      <mesh geometry={nodes.defaultMaterial009.geometry} material={materials.Rim_Buttons} position={[0, -0.17, 0]} scale={0.1} />
      {/* Flash module */}
      <mesh geometry={nodes.defaultMaterial010.geometry} material={materials.Flash_Glass_002} position={[-2.466, 0.365, 6.811]} scale={0.113} />
      <mesh geometry={nodes.defaultMaterial011.geometry} material={materials.Flash_002} position={[-2.466, 0.317, 6.811]} scale={0.113} />
      {/* Screen */}
      <mesh geometry={nodes.defaultMaterial012.geometry} material={screenMat} position={[0, -0.17, 0]} scale={0.1} />
      <mesh geometry={nodes.defaultMaterial013.geometry} material={materials.Screw} position={[0, -0.17, 0]} scale={0.1} />
      {/* Camera 1 — top lens assembly */}
      <mesh geometry={nodes.defaultMaterial014.geometry} material={materials.Screen_Glass} position={[2.419, 0.557, 6.596]} scale={0.105} />
      <mesh geometry={nodes.defaultMaterial015.geometry} material={materials.Camera_Pixel_Glass_002} position={[2.419, 0.305, 6.596]} scale={[0.155, 0.105, 0.155]} />
      <mesh geometry={nodes.defaultMaterial016.geometry} material={materials.Camera_Pixel__002} position={[2.419, 0.317, 6.596]} scale={[0.155, 0.105, 0.155]} />
      {/* Camera 2 — middle lens assembly */}
      <mesh geometry={nodes.defaultMaterial017.geometry} material={materials.Screen_Glass} position={[2.421, 0.556, 4.5]} scale={0.105} />
      <mesh geometry={nodes.defaultMaterial018.geometry} material={materials.Camera_Pixel_Glass_002} position={[2.421, 0.353, 4.5]} scale={[0.14, 0.052, 0.14]} />
      <mesh geometry={nodes.defaultMaterial019.geometry} material={materials.Camera_Pixel__002} position={[2.421, 0.386, 4.5]} scale={[0.14, 0.052, 0.14]} />
      <mesh geometry={nodes.defaultMaterial020.geometry} material={materials.Plastic} position={[2.421, 0.443, 4.5]} scale={0.105} />
      {/* Camera 3 — bottom lens assembly */}
      <mesh geometry={nodes.defaultMaterial021.geometry} material={materials.Screen_Glass} position={[0.522, 0.557, 5.621]} scale={0.105} />
      <mesh geometry={nodes.defaultMaterial022.geometry} material={materials.Camera_Pixel_Glass_002} position={[0.522, 0.343, 5.621]} scale={[0.175, 0.105, 0.175]} />
      <mesh geometry={nodes.defaultMaterial023.geometry} material={materials.Camera_Pixel__002} position={[0.522, 0.376, 5.621]} scale={[0.175, 0.105, 0.175]} />
      <mesh geometry={nodes.defaultMaterial024.geometry} material={materials.Plastic} position={[0.522, 0.443, 5.621]} scale={0.105} />
    </group>
  );
}

useGLTF.preload('/iphone17.glb');
