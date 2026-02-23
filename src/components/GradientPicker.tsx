import { GRADIENT_PRESETS } from '../utils/gradients';
import styles from './GradientPicker.module.css';

interface GradientPickerProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function GradientPicker({ selectedId, onSelect }: GradientPickerProps) {
  return (
    <div className={styles.picker}>
      {GRADIENT_PRESETS.map((preset) => (
        <button
          key={preset.id}
          className={`${styles.swatch} ${preset.id === selectedId ? styles.selected : ''}`}
          style={{
            background: `linear-gradient(to bottom, ${preset.topColor}, ${preset.bottomColor})`,
          }}
          title={preset.name}
          onClick={() => onSelect(preset.id)}
        />
      ))}
    </div>
  );
}
