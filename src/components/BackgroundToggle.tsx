import styles from './BackgroundToggle.module.css';

interface BackgroundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function BackgroundToggle({ enabled, onToggle }: BackgroundToggleProps) {
  return (
    <button className={styles.toggle} onClick={onToggle}>
      {enabled ? 'WITH BACKGROUND' : 'WITHOUT BACKGROUND'}
    </button>
  );
}
