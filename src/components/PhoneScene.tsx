import { Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Center } from '@react-three/drei';
import PhoneModel from './PhoneModel';
import SceneBackground from './SceneBackground';
import styles from './PhoneScene.module.css';

interface PhoneSceneProps {
  screenshotUrl: string | null;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  backgroundEnabled: boolean;
  gradientId: string;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.4, 0.8, 0.05]} />
      <meshStandardMaterial color="#333" wireframe />
    </mesh>
  );
}

export default function PhoneScene({ screenshotUrl, canvasRef, backgroundEnabled, gradientId }: PhoneSceneProps) {
  const onCanvasCreated = useCallback(
    (state: { gl: { domElement: HTMLCanvasElement } }) => {
      if (canvasRef && 'current' in canvasRef) {
        (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current =
          state.gl.domElement;
      }
    },
    [canvasRef]
  );

  return (
    <div className={styles.canvasContainer}>
      <Canvas
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        camera={{ position: [0, 0, 7], fov: 35 }}
        dpr={/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 1.5 : 2}
        onCreated={onCanvasCreated}
      >
        <SceneBackground enabled={backgroundEnabled} gradientId={gradientId} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
        <directionalLight position={[-3, 2, 4]} intensity={0.3} />

        <Suspense fallback={<LoadingFallback />}>
          <Environment preset="studio" />
          <Center>
            <PhoneModel screenshotUrl={screenshotUrl} />
          </Center>
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={7}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={(5 * Math.PI) / 6}
        />
      </Canvas>
    </div>
  );
}
