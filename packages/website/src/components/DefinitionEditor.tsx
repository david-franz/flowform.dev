import { useEffect, useMemo, useState } from 'react';
import type {
  FlowFormDefinition,
  FlowFormFieldDefinition,
  FlowFormFieldKind,
  FlowFormFieldWidth,
} from '@flowtomic/flowform';
import styles from './DefinitionEditor.module.css';

const fieldKinds: FlowFormFieldKind[] = ['text', 'textarea', 'number', 'select', 'checkbox', 'switch', 'slider'];
const widthOptions: Array<{ value: FlowFormFieldWidth; label: string }> = [
  { value: 'full', label: 'Full width' },
  { value: 'half', label: 'Half width' },
  { value: 'third', label: 'Third width' },
];

interface DefinitionEditorProps {
  definition: FlowFormDefinition;
  onChange: (next: FlowFormDefinition) => void;
}

export function DefinitionEditor({ definition, onChange }: DefinitionEditorProps) {
  const [activeSectionId, setActiveSectionId] = useState(definition.sections[0]?.id ?? '');
  const [activeFieldId, setActiveFieldId] = useState(definition.sections[0]?.fields[0]?.id ?? '');

  useEffect(() => {
    if (!definition.sections.find(section => section.id === activeSectionId)) {
      setActiveSectionId(definition.sections[0]?.id ?? '');
    }
  }, [activeSectionId, definition.sections]);

  useEffect(() => {
    const activeSection = definition.sections.find(section => section.id === activeSectionId);
    if (!activeSection) {
      setActiveFieldId('');
      return;
    }

    if (!activeSection.fields.find(field => field.id === activeFieldId)) {
      setActiveFieldId(activeSection.fields[0]?.id ?? '');
    }
  }, [activeSectionId, activeFieldId, definition.sections]);

  const activeSection = useMemo(
    () => definition.sections.find(section => section.id === activeSectionId),
    [activeSectionId, definition.sections]
  );

  const activeField = useMemo(() => activeSection?.fields.find(field => field.id === activeFieldId), [activeFieldId, activeSection]);

  const updateDefinition = (mutator: (draft: FlowFormDefinition) => void) => {
    const draft = cloneDefinition(definition);
    mutator(draft);
    onChange(draft);
  };

  const updateSection = (sectionId: string, updater: (section: FlowFormSectionMutable) => void) => {
    updateDefinition(draft => {
      const section = draft.sections.find(item => item.id === sectionId);
      if (section) {
        updater(section as FlowFormSectionMutable);
      }
    });
  };

  const updateField = (sectionId: string, fieldId: string, updater: (field: FlowFormFieldMutable) => void) => {
    updateSection(sectionId, section => {
      const target = section.fields.find(item => item.id === fieldId);
      if (target) {
        updater(target as FlowFormFieldMutable);
      }
    });
  };

  const handleAddSection = () => {
    const existingIds = new Set(definition.sections.map(section => section.id));
    const id = generateIncrementalId('section', existingIds);

    updateDefinition(draft => {
      draft.sections.push({ id, title: 'New section', fields: [] });
    });
    setActiveSectionId(id);
    setActiveFieldId('');
  };

  const handleRemoveSection = (sectionId: string) => {
    if (definition.sections.length <= 1) {
      return;
    }

    updateDefinition(draft => {
      draft.sections = draft.sections.filter(section => section.id !== sectionId);
    });

    if (activeSectionId === sectionId) {
      const nextSection = definition.sections.find(section => section.id !== sectionId);
      setActiveSectionId(nextSection?.id ?? '');
      setActiveFieldId(nextSection?.fields[0]?.id ?? '');
    }
  };

  const handleAddField = () => {
    if (!activeSection) {
      return;
    }

    const existingIds = new Set(activeSection.fields.map(field => field.id));
    const id = generateIncrementalId('field', existingIds);

    updateSection(activeSection.id, section => {
      (section.fields as FlowFormFieldMutable[]).push({
        id,
        label: 'Untitled field',
        kind: 'text',
        required: false,
        width: 'full',
      });
    });

    setActiveFieldId(id);
  };

  const handleRemoveField = (fieldId: string) => {
    if (!activeSection) {
      return;
    }

    updateSection(activeSection.id, section => {
      section.fields = section.fields.filter(field => field.id !== fieldId);
    });

    if (activeFieldId === fieldId) {
      const nextField = activeSection.fields.find(field => field.id !== fieldId);
      setActiveFieldId(nextField?.id ?? '');
    }
  };

  return (
    <aside className={styles.editor}>
      <header className={styles.header}>
        <h2>Definition builder</h2>
        <div className={styles.controlGroup}>
          <label>
            <span>Form title</span>
            <input
              value={definition.title ?? ''}
              placeholder="Untitled form"
              onChange={event => updateDefinition(draft => void (draft.title = event.target.value || undefined))}
            />
          </label>
        </div>
      </header>

      <section className={styles.sections}>
        <div className={styles.sectionHeader}>
          <h3>Sections</h3>
          <button type="button" onClick={handleAddSection}>
            + Add section
          </button>
        </div>

        <div className={styles.sectionList}>
          {definition.sections.map(section => (
            <button
              key={section.id}
              type="button"
              className={section.id === activeSectionId ? styles.sectionTabActive : styles.sectionTab}
              onClick={() => setActiveSectionId(section.id)}
            >
              <span>{section.title ?? section.id}</span>
              {definition.sections.length > 1 && (
                <span
                  className={styles.remove}
                  onClick={event => {
                    event.stopPropagation();
                    handleRemoveSection(section.id);
                  }}
                >
                  ×
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {activeSection && (
        <section className={styles.sectionEditor}>
          <div className={styles.controlGroup}>
            <label>
              <span>Section title</span>
              <input
                value={activeSection.title ?? ''}
                placeholder="Section title"
                onChange={event =>
                  updateSection(activeSection.id, section => {
                    section.title = event.target.value || undefined;
                  })
                }
              />
            </label>
            <label>
              <span>Description</span>
              <textarea
                value={activeSection.description ?? ''}
                placeholder="Optional description"
                onChange={event =>
                  updateSection(activeSection.id, section => {
                    section.description = event.target.value || undefined;
                  })
                }
              />
            </label>
          </div>

          <div className={styles.sectionHeader}>
            <h3>Fields</h3>
            <button type="button" onClick={handleAddField}>
              + Add field
            </button>
          </div>

          <div className={styles.fieldTabs}>
            {activeSection.fields.map(field => (
              <button
                key={field.id}
                type="button"
                className={field.id === activeFieldId ? styles.fieldTabActive : styles.fieldTab}
                onClick={() => setActiveFieldId(field.id)}
              >
                <span>{field.label || field.id}</span>
                <span
                  className={styles.remove}
                  onClick={event => {
                    event.stopPropagation();
                    handleRemoveField(field.id);
                  }}
                >
                  ×
                </span>
              </button>
            ))}
          </div>

          {activeField && (
            <div className={styles.fieldEditor}>
              <label>
                <span>Field label</span>
                <input
                  value={activeField.label}
                  onChange={event =>
                    updateField(activeSection.id, activeField.id, field => {
                      field.label = event.target.value;
                    })
                  }
                />
              </label>
              <label>
                <span>Field id</span>
                <input
                  value={activeField.id}
                  onChange={event => {
                    const nextId = event.target.value.trim();
                    if (!nextId) {
                      return;
                    }

                    const duplicate = activeSection.fields.some(field => field.id === nextId && field.id !== activeField.id);
                    if (duplicate) {
                      return;
                    }

                    updateSection(activeSection.id, section => {
                      const target = section.fields.find(field => field.id === activeField.id);
                      if (!target) {
                        return;
                      }
                      target.id = nextId;
                    });
                    setActiveFieldId(nextId);
                  }}
                />
              </label>
              <label>
                <span>Type</span>
                <select
                  value={activeField.kind}
                  onChange={event =>
                    updateField(activeSection.id, activeField.id, field => {
                      const nextKind = event.target.value as FlowFormFieldKind;
                      field.kind = nextKind;

                      if (nextKind !== 'select') {
                        delete field.options;
                      } else if (!field.options || field.options.length === 0) {
                        field.options = [
                          { value: 'option-1', label: 'Option 1' },
                          { value: 'option-2', label: 'Option 2' },
                        ];
                      }

                      if (!supportsPlaceholder(nextKind)) {
                        delete field.placeholder;
                      }

                      if (!supportsNumericConfig(nextKind)) {
                        delete field.min;
                        delete field.max;
                        delete field.step;
                      }

                      if (!supportsRows(nextKind)) {
                        delete field.rows;
                      }
                    })
                  }
                >
                  {fieldKinds.map(kind => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </label>
              {supportsPlaceholder(activeField.kind) && (
                <label>
                  <span>Placeholder</span>
                  <input
                    value={activeField.placeholder ?? ''}
                    onChange={event =>
                      updateField(activeSection.id, activeField.id, field => {
                        field.placeholder = event.target.value || undefined;
                      })
                    }
                  />
                </label>
              )}
              <label>
                <span>Field width</span>
                <select
                  value={activeField.width ?? 'full'}
                  onChange={event =>
                    updateField(activeSection.id, activeField.id, field => {
                      field.width = event.target.value as FlowFormFieldWidth;
                    })
                  }
                >
                  {widthOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={Boolean(activeField.required)}
                  onChange={event =>
                    updateField(activeSection.id, activeField.id, field => {
                      field.required = event.target.checked || undefined;
                    })
                  }
                />
                <span>Required</span>
              </label>
              <label>
                <span>Description</span>
                <textarea
                  value={activeField.description ?? ''}
                  placeholder="Explain the intent of this field"
                  onChange={event =>
                    updateField(activeSection.id, activeField.id, field => {
                      field.description = event.target.value || undefined;
                    })
                  }
                />
              </label>
              {supportsNumericConfig(activeField.kind) && (
                <div className={styles.numericRow}>
                  <label>
                    <span>Min</span>
                    <input
                      type="number"
                      value={activeField.min ?? ''}
                      onChange={event =>
                        updateField(activeSection.id, activeField.id, field => {
                          field.min = coerceNumber(event.target.value);
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Max</span>
                    <input
                      type="number"
                      value={activeField.max ?? ''}
                      onChange={event =>
                        updateField(activeSection.id, activeField.id, field => {
                          field.max = coerceNumber(event.target.value);
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Step</span>
                    <input
                      type="number"
                      value={activeField.step ?? ''}
                      onChange={event =>
                        updateField(activeSection.id, activeField.id, field => {
                          field.step = coerceNumber(event.target.value);
                        })
                      }
                    />
                  </label>
                </div>
              )}
              {supportsRows(activeField.kind) && (
                <label>
                  <span>Rows</span>
                  <input
                    type="number"
                    value={activeField.rows ?? ''}
                    onChange={event =>
                      updateField(activeSection.id, activeField.id, field => {
                        const nextValue = event.target.value;
                        field.rows = nextValue ? Math.max(1, Number(nextValue)) : undefined;
                      })
                    }
                  />
                </label>
              )}
              <label>
                <span>Default value</span>
                <input
                  value={stringifyDefault(activeField.defaultValue)}
                  placeholder="Computed automatically when blank"
                  onChange={event =>
                    updateField(activeSection.id, activeField.id, field => {
                      field.defaultValue = parseDefault(event.target.value, field.kind);
                    })
                  }
                />
              </label>
              {activeField.kind === 'select' && (
                <label>
                  <span>Options (value:label per line)</span>
                  <textarea
                    value={serializeOptions(activeField.options)}
                    onChange={event =>
                      updateField(activeSection.id, activeField.id, field => {
                        field.options = parseOptions(event.target.value);
                      })
                    }
                  />
                </label>
              )}
            </div>
          )}
        </section>
      )}
    </aside>
  );
}

type FlowFormSectionMutable = {
  id: string;
  title?: string;
  description?: string;
  fields: FlowFormFieldDefinition[];
};

type FlowFormFieldMutable = FlowFormFieldDefinition & {
  options?: FlowFormFieldDefinition['options'];
};

const generateIncrementalId = (prefix: string, existingIds: Set<string>) => {
  let index = existingIds.size + 1;
  while (existingIds.has(`${prefix}-${index}`)) {
    index += 1;
  }
  return `${prefix}-${index}`;
};

const stringifyDefault = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return JSON.stringify(value);
};

const parseDefault = (raw: string, kind: FlowFormFieldKind): unknown => {
  if (!raw) {
    return undefined;
  }

  switch (kind) {
    case 'number':
    case 'slider':
      return Number(raw);
    case 'checkbox':
    case 'switch':
      return raw === 'true' || raw === '1' || raw.toLowerCase() === 'yes';
    default:
      return raw;
  }
};

const serializeOptions = (options: FlowFormFieldDefinition['options']): string => {
  if (!options) {
    return '';
  }
  return options.map(option => `${option.value}:${option.label}`).join('\n');
};

const parseOptions = (raw: string): FlowFormFieldDefinition['options'] => {
  const lines = raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return undefined;
  }

  return lines.map(line => {
    const [value, ...labelParts] = line.split(':');
    const label = labelParts.length ? labelParts.join(':') : value;
    return { value: value.trim(), label: label.trim() };
  });
};

const cloneDefinition = (definition: FlowFormDefinition): FlowFormDefinition =>
  JSON.parse(JSON.stringify(definition)) as FlowFormDefinition;

const supportsPlaceholder = (kind: FlowFormFieldKind): boolean =>
  kind === 'text' || kind === 'textarea' || kind === 'number' || kind === 'select';

const supportsNumericConfig = (kind: FlowFormFieldKind): boolean => kind === 'number' || kind === 'slider';

const supportsRows = (kind: FlowFormFieldKind): boolean => kind === 'textarea';

const coerceNumber = (raw: string): number | undefined => {
  if (raw === '') {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
};

