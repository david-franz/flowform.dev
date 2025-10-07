import { useEffect, useState } from 'react';
import { FlowFormProvider } from '@flowtomic/flowform-react';
import type { FlowFormDefinition } from '@flowtomic/flowform';
import { DefinitionEditor } from '@/components/DefinitionEditor';
import { FlowFormRenderer } from '@/components/FlowFormRenderer';
import { ValuesInspector } from '@/components/ValuesInspector';
import { PlaygroundToolbar } from '@/components/PlaygroundToolbar';
import { DefinitionJsonPanel } from '@/components/DefinitionJsonPanel';
import styles from './PlaygroundPage.module.css';
import appStyles from '../styles/App.module.css';

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
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const mainElement = document.querySelector<HTMLElement>(`.${appStyles.main}`);
    const headerElement = document.querySelector<HTMLElement>(`.${appStyles.header}`);
    const footerElement = document.querySelector<HTMLElement>(`.${appStyles.footer}`);

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousMainPadding = mainElement?.style.padding ?? '';
    const previousMainHeight = mainElement?.style.height ?? '';
    const previousMainOverflow = mainElement?.style.overflow ?? '';

    const applyLayoutSizing = () => {
      if (!mainElement) {
        return;
      }
      const headerHeight = headerElement?.offsetHeight ?? 0;
      const footerHeight = footerElement?.offsetHeight ?? 0;
      mainElement.style.padding = '0';
      mainElement.style.height = `${window.innerHeight - headerHeight - footerHeight}px`;
      mainElement.style.overflow = 'hidden';
    };

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    applyLayoutSizing();
    window.addEventListener('resize', applyLayoutSizing);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      window.removeEventListener('resize', applyLayoutSizing);
      if (mainElement) {
        mainElement.style.padding = previousMainPadding;
        mainElement.style.height = previousMainHeight;
        mainElement.style.overflow = previousMainOverflow;
      }
    };
  }, []);

  return (
    <FlowFormProvider definition={definition}>
      <div className={styles.playground} data-settings-collapsed={settingsCollapsed ? 'true' : 'false'}>
        {settingsCollapsed ? (
          <button
            type="button"
            className={styles.settingsCollapsedHandle}
            onClick={() => setSettingsCollapsed(false)}
          >
            Definition
          </button>
        ) : (
          <aside className={styles.settingsPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelHeaderText}>
                <h1>Form definition</h1>
                <p>
                  Compose sections, tweak field behaviour, and watch Flowform render the schema live alongside the
                  provider state.
                </p>
              </div>
              <button type="button" className={styles.collapseToggle} onClick={() => setSettingsCollapsed(true)}>
                Collapse
              </button>
            </div>

            <div className={styles.panelScroll}>
              <DefinitionEditor definition={definition} onChange={setDefinition} />
            </div>
          </aside>
        )}

        <div className={styles.stage}>
          <div className={styles.previewShell}>
            <div className={styles.previewToolbar}>
              <PlaygroundToolbar
                showJson={showJson}
                onToggleJson={() => setShowJson(value => !value)}
                onResetDefinition={() => setDefinition(cloneDefinition(starterDefinition))}
              />
            </div>
            <div className={styles.previewContent}>
              <div className={styles.formWrapper}>
                <FlowFormRenderer />
              </div>
            </div>
          </div>
          <aside className={styles.inspectorPanel}>
            <div className={styles.inspectorScroll}>
              <ValuesInspector />
              {showJson ? <DefinitionJsonPanel definition={definition} onApply={setDefinition} /> : null}
            </div>
          </aside>
        </div>
      </div>
    </FlowFormProvider>
  );
}

const cloneDefinition = (definition: FlowFormDefinition): FlowFormDefinition =>
  JSON.parse(JSON.stringify(definition)) as FlowFormDefinition;
