import { useCallback, useState } from 'react';
import { exportMockup } from '../utils/export';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  disabled: boolean;
  mockupRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function ExportButton({ disabled, mockupRef }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!mockupRef.current || exporting) return;

    setExporting(true);
    try {
      await exportMockup(mockupRef.current);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [mockupRef, exporting]);

  return (
    <button
      className={`${styles.exportButton} ${exporting ? styles.exporting : ''}`}
      disabled={disabled || exporting}
      onClick={handleExport}
    >
      {exporting ? 'Exporting...' : 'Download PNG'}
    </button>
  );
}
