import { useState } from 'react';
import { FlowFormProvider } from '@flowtomic/flowform-react';
import type { FlowFormDefinition } from '@flowtomic/flowform';
import { DefinitionEditor } from '@/components/DefinitionEditor';
import { FlowFormRenderer } from '@/components/FlowFormRenderer';
import { ValuesInspector } from '@/components/ValuesInspector';
import { PlaygroundToolbar } from '@/components/PlaygroundToolbar';
import { DefinitionJsonPanel } from '@/components/DefinitionJsonPanel';
import styles from './PlaygroundPage.module.css';

const starterDefinition: FlowFormDefinition = {
  id: 'customer-intake',
  title: 'Customer intake',
  sections: [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Collect the essentials before configuring downstream Flowgraph nodes.',
      fields: [
        {
          id: 'fullName',
          label: 'Full name',
          kind: 'text',
          required: true,
        },
        {
          id: 'email',
          label: 'Email',
          kind: 'text',
          required: true,
        },
        {
          id: 'companySize',
          label: 'Company size',
          kind: 'select',
          options: [
            { value: 'startup', label: '1-10' },
            { value: 'mid', label: '11-200' },
            { value: 'enterprise', label: '200+' },
          ],
          defaultValue: 'startup',
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      fields: [
        {
          id: 'notes',
          label: 'Notes',
          kind: 'textarea',
          description: 'Share relevant context for the Flowgraph auto-generated nodes.',
        },
        {
          id: 'subscribeUpdates',
          label: 'Subscribe to platform updates',
          kind: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
};

export default function PlaygroundPage() {
  const [definition, setDefinition] = useState<FlowFormDefinition>(() => cloneDefinition(starterDefinition));
  const [showJson, setShowJson] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Playground</h1>
        <p>
          Experiment with FlowForm definitions, render them instantly, and inspect the resulting value state. All
          updates sync with the FlowForm provider—what you see here is what Flowgraph and your apps will receive.
        </p>
      </header>

      <FlowFormProvider definition={definition}>
        <PlaygroundToolbar
          showJson={showJson}
          onToggleJson={() => setShowJson(value => !value)}
          onResetDefinition={() => setDefinition(cloneDefinition(starterDefinition))}
        />
        <div className={styles.layout}>
          <DefinitionEditor definition={definition} onChange={setDefinition} />
          <div className={styles.previewSurface}>
            <FlowFormRenderer />
          </div>
          <ValuesInspector />
          {showJson && <DefinitionJsonPanel definition={definition} onApply={setDefinition} />}
        </div>
      </FlowFormProvider>
    </div>
  );
}

const cloneDefinition = (definition: FlowFormDefinition): FlowFormDefinition =>
  JSON.parse(JSON.stringify(definition)) as FlowFormDefinition;
