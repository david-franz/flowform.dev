import styles from './DocsPage.module.css';

const quickLinks = [
  { title: 'Getting started', anchor: '#getting-started' },
  { title: 'Definition anatomy', anchor: '#definition-anatomy' },
  { title: 'Field types', anchor: '#field-types' },
  { title: 'Rendering in React', anchor: '#rendering' },
  { title: 'Syncing with Flowgraph', anchor: '#flowgraph' },
  { title: 'Runtime events', anchor: '#runtime-events' },
  { title: 'Packages', anchor: '#packages' },
  { title: 'Roadmap', anchor: '#roadmap' },
];

const definitionSnippet = `import type { FlowFormDefinition } from '@flowtomic/flowform';

export const intakeForm: FlowFormDefinition = {
  id: 'assistant-intake',
  title: 'Assistant Setup',
  sections: [
    {
      id: 'profile',
      title: 'Profile',
      fields: [
        { id: 'name', label: 'Display name', kind: 'text', required: true },
        { id: 'model', label: 'Model', kind: 'select', options: [
          { value: 'gpt-4o', label: 'GPT-4o' },
          { value: 'sonnet-3.5', label: 'Claude Sonnet 3.5' }
        ]},
        { id: 'temperature', label: 'Temperature', kind: 'slider', min: 0, max: 1, step: 0.1 }
      ],
    },
  ],
};`;

const renderSnippet = `import { FlowFormProvider } from '@flowtomic/flowform-react';
import { FlowFormRenderer } from '@/components/FlowFormRenderer';

export function IntakeForm() {
  return (
    <FlowFormProvider definition={intakeForm}>
      <FlowFormRenderer />
    </FlowFormProvider>
  );
}`;

const runtimeEvents = [
  { name: 'form.values', description: 'Mirror of the current form state. Subscribe to diff changes in Flowgraph.' },
  {
    name: 'form.change(fieldId, value)',
    description: 'Emitted whenever a field mutates. Broker updates to Flowgraph nodes or custom analytics.',
  },
  {
    name: 'form.submit()',
    description: 'Trigger a submit from the renderer or call manually to push values upstream.',
  },
  {
    name: 'form.reset()',
    description: 'Reset values back to defaults while keeping observers informed.',
  },
];

const packages = [
  {
    name: '@flowtomic/flowform',
    description: 'Schema definition helpers, defaults, validation, and serialisation.',
  },
  {
    name: '@flowtomic/flowform-react',
    description: 'Provider, hooks, renderer primitives, and playground utilities.',
  },
  {
    name: 'flowform-website',
    description: 'This documentation site and playground wired to local packages.',
  },
];

export default function DocsPage() {
  return (
    <div className={styles.docs}>
      <aside className={styles.sidebar}>
        <h2>On this page</h2>
        <nav>
          <ul>
            {quickLinks.map(link => (
              <li key={link.anchor}>
                <a href={link.anchor}>{link.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className={styles.content}>
        <section id="getting-started">
          <h1>Flowform developer guide</h1>
          <p>
            Flowform ships as a schema core, a set of renderer bindings, and a playground that exercises every feature.
            Define your form once, stream updates into Flowgraph, and reuse the same definition across web and native
            clients.
          </p>
        </section>

        <section id="definition-anatomy">
          <h2>1. Describe a definition</h2>
          <p>
            Definitions are plain JSON objects. Sections group related fields and each field describes its renderer,
            validation rules, defaults, and responsive width.
          </p>
          <pre>
            <code>{definitionSnippet}</code>
          </pre>
        </section>

        <section id="field-types">
          <h2>Available field types</h2>
          <p>
            Flowform ships with a growing renderer library. Use the definition builder to configure any of the
            following field kinds:
          </p>
          <ul className={styles.inlineList}>
            <li>text</li>
            <li>textarea</li>
            <li>number</li>
            <li>select</li>
            <li>multiselect</li>
            <li>radio</li>
            <li>checkbox</li>
            <li>switch</li>
            <li>slider</li>
            <li>password</li>
            <li>email</li>
            <li>url</li>
            <li>date</li>
            <li>time</li>
            <li>color</li>
          </ul>
        </section>

        <section id="rendering">
          <h2>2. Render inside React</h2>
          <p>
            Wrap the renderer with <code>FlowFormProvider</code> to expose hooks and context. The provider synchronises
            values, emits events, and keeps field-level errors in sync.
          </p>
          <pre>
            <code>{renderSnippet}</code>
          </pre>
        </section>

        <section id="flowgraph">
          <h2>3. Sync with Flowgraph</h2>
          <p>
            FlowGraph nodes can consume the same definition files. Publish your schema alongside node templates and
            load them inside inspectors, nodes, or bespoke builder surfaces. Submit events can emit node drafts back to
            Flowgraph so your automation stays in lockstep with form updates.
          </p>
        </section>

        <section id="runtime-events">
          <h2>4. Observe runtime events</h2>
          <p>
            The provider exposes lightweight event emitters so you can orchestrate behaviour without prop drilling. Use
            them to populate analytics, synchronise Flowgraph previews, or persist state between sessions.
          </p>
          <ul>
            {runtimeEvents.map(event => (
              <li key={event.name}>
                <strong>{event.name}</strong> — {event.description}
              </li>
            ))}
          </ul>
        </section>

        <section id="packages" className={styles.packages}>
          <h2>Packages</h2>
          <div className={styles.packageGrid}>
            {packages.map(pkg => (
              <article key={pkg.name}>
                <h3>{pkg.name}</h3>
                <p>{pkg.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="roadmap" className={styles.roadmap}>
          <h2>Roadmap</h2>
          <p>
            Flowform evolves alongside Flowgraph. Expect responsive layout primitives, richer field registries, and
            deeper Flowgraph synchronisation as workflow builders continue to expand.
          </p>
        </section>
      </main>
    </div>
  );
}