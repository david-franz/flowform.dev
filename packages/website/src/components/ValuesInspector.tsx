import { useFlowForm } from '@flowtomic/flowform-react';
import styles from './ValuesInspector.module.css';

export function ValuesInspector() {
  const { form } = useFlowForm();

  return (
    <section className={styles.inspector}>
      <header>
        <h2>Live values</h2>
        <p>Interact with the form to inspect the emitted value object.</p>
      </header>
      <pre>{JSON.stringify(form.values, null, 2)}</pre>
    </section>
  );
}