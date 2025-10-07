import styles from './DocsPage.module.css';

const steps = [
  {
    heading: '1. Describe a FlowForm definition',
    code: `import type { FlowFormDefinition } from '@flowtomic/flowform';

export const definition: FlowFormDefinition = {
  id: 'assist-config',
  title: 'Assistant Settings',
  sections: [
    {
      id: 'general',
      title: 'General',
      fields: [
        { id: 'name', label: 'Display name', kind: 'text', required: true },
        { id: 'model', label: 'Model', kind: 'select', options: [
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
          { value: 'sonnet-3.5', label: 'Claude Sonnet 3.5' }
        ]}
      ],
    },
  ],
};`,
  },
  {
    heading: '2. Render inside React',
    code: `import { FlowFormProvider } from '@flowtomic/flowform-react';
import { FlowFormRenderer } from '@/components/FlowFormRenderer';

export function AssistantConfigForm() {
  return (
    <FlowFormProvider definition={definition}>
      <FlowFormRenderer />
    </FlowFormProvider>
  );
}`,
  },
  {
    heading: '3. Sync with Flowgraph',
    description:
      'Use FlowForm inside your Flowgraph node inspectors by sharing the same definitions. Flowgraph nodes can load FlowForm schemas, and FlowForm can emit node drafts back to Flowgraph when users submit. Shared form metadata keeps builders consistent across surfaces.',
  },
  {
    heading: '4. Tune the experience',
    description:
      'Assign responsive widths, placeholders, slider ranges, textarea rows, and option sets directly in the definition editor. The playground keeps form state in sync while you tweak layouts, defaults, and conditional sections.',
  },
];

export default function DocsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Developer docs</h1>
        <p>
          FlowForm ships as a workspaces trio: a schema & runtime core, a set of React bindings, and a documentation
          playground. Each package can be consumed independently while still sharing a single source of truth.
        </p>
      </header>

      <section className={styles.steps}>
        {steps.map(step => (
          <article key={step.heading} className={styles.step}>
            <h3>{step.heading}</h3>
            {step.description && <p>{step.description}</p>}
            {step.code && <pre>
              <code>{step.code}</code>
            </pre>}
          </article>
        ))}
      </section>

      <section className={styles.grid}>
        <div>
          <h2>Packages</h2>
          <ul>
            <li>
              <strong>@flowtomic/flowform</strong> – schema, defaults, validation pipelines, and serialisation.
            </li>
            <li>
              <strong>@flowtomic/flowform-react</strong> – hooks, providers, and renderer helpers.
            </li>
            <li>
              <strong>flowform-website</strong> – docs + playground powered by local packages.
            </li>
          </ul>
        </div>
        <div>
          <h2>Interoperability</h2>
          <p>
            FlowForm definitions can be used to generate Flowgraph inspector panels, mobile-friendly dialogs, or embed
            into custom experiences. Runtime events expose granular change tracking so Flowgraph can react to mutations
            in real-time.
          </p>
        </div>
      </section>
    </div>
  );
}