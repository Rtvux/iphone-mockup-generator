import { useCallback, useRef, useState } from 'react';
import PhoneScene from './components/PhoneScene';
import UploadArea from './components/UploadArea';
import ExportButton from './components/ExportButton';
import BackgroundToggle from './components/BackgroundToggle';
import GradientPicker from './components/GradientPicker';
import styles from './App.module.css';

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState('sakura');
  const mockupRef = useRef<HTMLCanvasElement>(null);

  const toggleBackground = useCallback(() => {
    setBackgroundEnabled((prev) => !prev);
  }, []);

  return (
    <div className={styles.app}>
      <PhoneScene
        screenshotUrl={uploadedImage}
        canvasRef={mockupRef}
        backgroundEnabled={backgroundEnabled}
        gradientId={selectedGradient}
      />

      <header className={styles.toolbar}>
        <h1 className={styles.title}>M-GEN</h1>
        <div className={styles.actions}>
          <BackgroundToggle enabled={backgroundEnabled} onToggle={toggleBackground} />
          {backgroundEnabled && (
            <GradientPicker selectedId={selectedGradient} onSelect={setSelectedGradient} />
          )}
          <UploadArea onImageUpload={setUploadedImage} hasImage={!!uploadedImage} />
          <ExportButton disabled={!uploadedImage} mockupRef={mockupRef} />
        </div>
      </header>
    </div>
  );
}
