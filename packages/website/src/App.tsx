import { NavLink, Route, Routes } from 'react-router-dom';
import { clsx } from 'clsx';
import LandingPage from './pages/LandingPage';
import DocsPage from './pages/DocsPage';
import PlaygroundPage from './pages/PlaygroundPage';
import styles from './styles/App.module.css';

const routes = [
  { path: '/', label: 'Overview', element: <LandingPage /> },
  { path: '/docs', label: 'Docs', element: <DocsPage /> },
  { path: '/playground', label: 'Playground', element: <PlaygroundPage /> },
];

export function App() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>FlowForm</div>
        <nav className={styles.nav}>
          {routes.map(route => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
              end={route.path === '/'}
            >
              {route.label}
            </NavLink>
          ))}
          <a
            className={clsx(styles.navLink, styles.navLinkCta)}
            href="https://github.com/flowtomic/flowform"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main className={styles.main}>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} FlowForm. Crafted by Flowtomic.</span>
        <div className={styles.footerLinks}>
          <a href="mailto:hello@flowtomic.ai">Contact</a>
          <a href="/docs#roadmap">Roadmap</a>
        </div>
      </footer>
    </div>
  );
}

export default App;