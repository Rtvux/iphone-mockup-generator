import { useCallback, useRef, useState } from 'react';
import PhoneScene from './components/PhoneScene';
import UploadArea from './components/UploadArea';
import ExportButton from './components/ExportButton';
import BackgroundToggle from './components/BackgroundToggle';
import GradientPicker from './components/GradientPicker';
import styles from './App.module.css';

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [backgroundEnabled, setBackgroundEnabled] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState('sakura');
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const mockupRef = useRef<HTMLCanvasElement>(null);

  const toggleBackground = useCallback(() => {
    setBackgroundEnabled((prev) => !prev);
  }, []);

  return (
    <div className={styles.app}>
      {isMobile && !bannerDismissed && (
        <div className={styles.mobileBanner}>
          <span>For the best experience, use this tool on a desktop browser.</span>
          <button className={styles.bannerDismiss} onClick={() => setBannerDismissed(true)}>
            Got it
          </button>
        </div>
      )}

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
