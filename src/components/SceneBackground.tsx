import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GRADIENT_PRESETS } from '../utils/gradients';

interface SceneBackgroundProps {
  enabled: boolean;
  gradientId: string;
}

export default function SceneBackground({ enabled, gradientId }: SceneBackgroundProps) {
  const { scene } = useThree();

  const preset = useMemo(
    () => GRADIENT_PRESETS.find((p) => p.id === gradientId) ?? GRADIENT_PRESETS[0],
    [gradientId]
  );

  useEffect(() => {
    if (!enabled) {
      scene.background = null;
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, preset.topColor);
    gradient.addColorStop(1, preset.bottomColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2, 512);

    const texture = new THREE.CanvasTexture(canvas);
    scene.background = texture;

    return () => {
      texture.dispose();
      scene.background = null;
    };
  }, [enabled, preset, scene]);

  return null;
}
