import styles from './LandingPage.module.css';

const featureHighlights = [
  {
    title: 'Schema-first',
    description:
      'Describe complex multi-section forms with expressive TypeScript definitions. Compose layouts, defaults, and conditional logic without leaving your editor.',
  },
  {
    title: 'Pixel & native ready',
    description:
      'Ship the same definition to the FlowForm React renderer, the upcoming React Native kit, or embed inside Flowgraph nodes.',
  },
  {
    title: 'Playground powered',
    description:
      'Iterate visually on the FlowForm playground and sync new capabilities straight into the docs and component library.',
  },
];

const roadmap = [
  'Dynamic layouts with responsive grids and conditional sections',
  'Renderer registry with slot-based composition and custom fields',
  'Native bridge for React Native and Expo applications',
  'Tight interoperability with Flowgraph node builders',
];

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>FlowForm</h1>
        <p>
          The form engine that powers Flowtomic&apos;s next-generation configuration surfaces. Build once, render
          anywhere—from Flowgraph nodes to standalone apps.
        </p>
        <div className={styles.ctas}>
          <a className={styles.primaryCta} href="/playground">
            Launch Playground
          </a>
          <a className={styles.secondaryCta} href="/docs">
            Read the Docs
          </a>
        </div>
      </section>

      <section className={styles.features}>
        {featureHighlights.map(feature => (
          <article key={feature.title} className={styles.featureCard}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className={styles.roadmap} id="roadmap">
        <h2>Roadmap</h2>
        <ul>
          {roadmap.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}