import { useFlowForm } from '@flowtomic/flowform-react';
import styles from './PlaygroundToolbar.module.css';

interface PlaygroundToolbarProps {
  showJson: boolean;
  onToggleJson: () => void;
  onResetDefinition: () => void;
}

export function PlaygroundToolbar({ showJson, onToggleJson, onResetDefinition }: PlaygroundToolbarProps) {
  const { resetForm } = useFlowForm();

  return (
    <div className={styles.toolbar}>
      <div className={styles.actionsGroup}>
        <button type="button" onClick={onToggleJson} className={styles.ghostButton}>
          {showJson ? 'Hide definition JSON' : 'Show definition JSON'}
        </button>
      </div>

      <div className={styles.actionsGroup}>
        <button type="button" onClick={resetForm} className={styles.ghostButton}>
          Reset values
        </button>
        <button type="button" onClick={onResetDefinition} className={styles.primaryButton}>
          Reset definition
        </button>
      </div>
    </div>
  );
}
