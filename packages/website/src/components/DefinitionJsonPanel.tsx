import { useEffect, useMemo, useState } from 'react';
import type { FlowFormDefinition } from '@flowtomic/flowform';
import styles from './DefinitionJsonPanel.module.css';

interface DefinitionJsonPanelProps {
  definition: FlowFormDefinition;
  onApply: (next: FlowFormDefinition) => void;
}

export function DefinitionJsonPanel({ definition, onApply }: DefinitionJsonPanelProps) {
  const [draft, setDraft] = useState(() => JSON.stringify(definition, null, 2));
  const [error, setError] = useState<string | null>(null);

  const isDirty = useMemo(() => {
    try {
      return JSON.stringify(JSON.parse(draft)) !== JSON.stringify(definition);
    } catch (parseError) {
      return true;
    }
  }, [definition, draft]);

  useEffect(() => {
    setDraft(JSON.stringify(definition, null, 2));
    setError(null);
  }, [definition]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(draft) as FlowFormDefinition;
      validateDefinition(parsed);
      onApply(parsed);
      setError(null);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : 'Unable to parse definition.');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setError(null);
    } catch (copyError) {
      setError(copyError instanceof Error ? copyError.message : 'Unable to copy to clipboard.');
    }
  };

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <h2>Definition JSON</h2>
        <div className={styles.headerActions}>
          <button type="button" onClick={handleCopy}>
            Copy
          </button>
          <button type="button" onClick={handleApply} disabled={!isDirty}>
            Apply changes
          </button>
        </div>
      </header>
      <textarea value={draft} onChange={event => setDraft(event.target.value)} spellCheck={false} />
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}

function validateDefinition(definition: FlowFormDefinition): void {
  if (!definition || typeof definition !== 'object') {
    throw new Error('Definition must be an object.');
  }

  if (!definition.sections || !Array.isArray(definition.sections)) {
    throw new Error('Definition requires a sections array.');
  }

  definition.sections.forEach(section => {
    if (!section.id) {
      throw new Error('Each section requires an id.');
    }
    if (!Array.isArray(section.fields)) {
      throw new Error(`Section ${section.id} requires a fields array.`);
    }
    section.fields.forEach(field => {
      if (!field.id) {
        throw new Error(`Field in section ${section.id} is missing an id.`);
      }
      if (!field.kind) {
        throw new Error(`Field ${field.id} in section ${section.id} is missing a kind.`);
      }
    });
  });
}

