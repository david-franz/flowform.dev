import styles from './LandingPage.module.css';

const highlights = [
  {
    title: 'Schema-first control',
    description:
      'Describe sections, validations, and defaults with typed definitions. Flowform emits one schema that every surface can trust.',
  },
  {
    title: 'Flowgraph ready',
    description:
      'Share the same definitions with Flowgraph node inspectors so canvas builders and forms stay in sync.',
  },
  {
    title: 'Lightweight renderer',
    description:
      'Drop the Flowform provider and renderer into any React experience. The playground uses the exact packages you ship.',
  },
];

const roadmap = [
  {
    title: 'Responsive layouts',
    description: 'Adaptive grid controls with breakpoint-aware widths and conditional sections.',
  },
  {
    title: 'Renderer registry',
    description: 'Bring your own field components with slot-based renderers and custom widgets.',
  },
  {
    title: 'Definition tooling',
    description: 'Expanded linting, diffing, and versioning support for long-lived schemas.',
  },
  {
    title: 'Flowgraph sync',
    description: 'Round-trip definitions between Flowgraph nodes and external apps with a single source of truth.',
  },
];

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.label}>Flowform</span>
          <h1>Compose definition-driven forms for Flowgraph and beyond.</h1>
          <p>
            Flowform turns definition files into fully managed experiences. Capture intent once, hydrate it in Flowgraph
            inspectors, and reuse the same schema inside your own apps without duplicating UI logic.
          </p>
          <div className={styles.actions}>
            <a className={styles.primaryCta} href="/playground">
              Launch playground
            </a>
            <a className={styles.secondaryCta} href="/docs">
              Read the docs
            </a>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.formCard}>
            <header>
              <span className={styles.formTitle}>Assistant intake</span>
              <span className={styles.formStatus}>Synced</span>
            </header>
            <div className={styles.formField}>
              <span>Full name</span>
              <div className={styles.formInput} aria-hidden="true" />
            </div>
            <div className={styles.formField}>
              <span>Company size</span>
              <div className={styles.formSelect} aria-hidden="true">
                <span>11-200</span>
                <span>▾</span>
              </div>
            </div>
            <div className={styles.formField}>
              <span>Notes</span>
              <div className={styles.formTextarea} aria-hidden="true" />
            </div>
            <footer>
              <div>
                <span className={styles.badge}>Flowgraph inspector</span>
              </div>
              <button type="button">Submit</button>
            </footer>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        {highlights.map(feature => (
          <article key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className={styles.roadmap} id="roadmap">
        <div className={styles.roadmapCopy}>
          <h2>What&apos;s next</h2>
          <p>
            We&apos;re shipping Flowform in lockstep with Flowgraph, expanding the schema, renderer, and playground as new
            node capabilities land.
          </p>
        </div>
        <div className={styles.roadmapItems}>
          {roadmap.map(item => (
            <article key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}