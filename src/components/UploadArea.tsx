import { useCallback, useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { ACCEPTED_FILE_TYPES, ACCEPTED_EXTENSIONS, MAX_FILE_SIZE } from '../utils/constants';
import styles from './UploadArea.module.css';

interface UploadAreaProps {
  onImageUpload: (dataUrl: string | null) => void;
  hasImage: boolean;
}

export default function UploadArea({ onImageUpload, hasImage }: UploadAreaProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setError('Invalid file type');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError('File too large (max 10MB)');
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        onImageUpload(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [processFile]
  );

  const handleClick = useCallback(() => {
    if (!hasImage) {
      inputRef.current?.click();
    }
  }, [hasImage]);

  const handleClear = useCallback(() => {
    setError(null);
    setFileName(null);
    onImageUpload(null);
  }, [onImageUpload]);

  return (
    <div
      className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleChange}
        className={styles.hidden}
      />

      {hasImage ? (
        <div className={styles.uploaded}>
          <span className={styles.filename}>{fileName}</span>
          <button
            className={styles.clearButton}
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            Clear
          </button>
        </div>
      ) : (
        <span className={styles.label}>Upload Screenshot</span>
      )}

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
