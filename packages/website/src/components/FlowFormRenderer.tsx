import { Fragment, useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { useFlowForm } from '@flowtomic/flowform-react';
import type { FlowFormFieldDefinition } from '@flowtomic/flowform';
import styles from './FlowFormRenderer.module.css';

export function FlowFormRenderer() {
  const { form, updateValues } = useFlowForm();
  const sections = useMemo(() => form.definition.sections ?? [], [form.definition.sections]);
  const [activeSectionId, setActiveSectionId] = useState<string>(() => sections[0]?.id ?? '');

  useEffect(() => {
    if (!sections.find(section => section.id === activeSectionId)) {
      setActiveSectionId(sections[0]?.id ?? '');
    }
  }, [sections, activeSectionId]);

  const renderField = (field: FlowFormFieldDefinition) => {
    const value = form.values[field.id];

    const onValueChange = (nextValue: unknown) => {
      updateValues({ [field.id]: nextValue });
    };

    switch (field.kind) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            required={field.required}
            rows={field.rows}
            onChange={event => onValueChange(event.target.value)}
          />
        );
      case 'select': {
        const options = field.options ?? [];
        if (!options.length) {
          return <div className={styles.emptyState}>Add options in the definition editor.</div>;
        }

        return (
          <select
            id={field.id}
            value={String(value ?? '')}
            required={field.required}
            onChange={event => onValueChange(event.target.value)}
          >
            <option value="" disabled>
              {field.placeholder ?? 'Select…'}
            </option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }
      case 'multiselect': {
        const options = field.options ?? [];
        if (!options.length) {
          return <div className={styles.emptyState}>Add options in the definition editor.</div>;
        }

        const selectedValues = Array.isArray(value)
          ? value.map(item => String(item))
          : value
            ? [String(value)]
            : [];

        return (
          <select
            id={field.id}
            multiple
            required={field.required}
            value={selectedValues}
            onChange={event =>
              onValueChange(Array.from(event.target.selectedOptions, option => option.value))
            }
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }
      case 'radio': {
        const options = field.options ?? [];
        if (!options.length) {
          return <div className={styles.emptyState}>Add options in the definition editor.</div>;
        }

        const currentValue = value === undefined || value === null ? '' : String(value);

        return (
          <div className={styles.radioGroup}>
            {options.map(option => (
              <label key={option.value} className={styles.radioOption}>
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={currentValue === option.value}
                  required={field.required}
                  onChange={event => onValueChange(event.target.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      }
      case 'number':
        return (
          <input
            id={field.id}
            type="number"
            value={value === undefined || value === null ? '' : Number(value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={event => {
              const raw = event.target.value;
              onValueChange(raw === '' ? undefined : Number(raw));
            }}
          />
        );
      case 'checkbox':
      case 'switch':
        return (
          <input
            id={field.id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={event => onValueChange(event.target.checked)}
          />
        );
      case 'slider':
        return (
          <div className={styles.sliderRow}>
            <input
              id={field.id}
              type="range"
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              value={value === undefined || value === null ? field.min ?? 0 : Number(value)}
              onChange={event => onValueChange(Number(event.target.value))}
            />
            <span>{value ?? field.defaultValue ?? field.min ?? 0}</span>
          </div>
        );
      case 'color': {
        const currentColor = typeof value === 'string' && value ? value : '#000000';
        return (
          <input
            id={field.id}
            type="color"
            value={currentColor}
            required={field.required}
            onChange={event => onValueChange(event.target.value)}
          />
        );
      }
      case 'password':
      case 'email':
      case 'url':
      case 'date':
      case 'time':
        return (
          <input
            id={field.id}
            type={field.kind}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            required={field.required}
            onChange={event => onValueChange(event.target.value)}
          />
        );
      case 'text':
      default:
        return (
          <input
            id={field.id}
            type="text"
            value={String(value ?? '')}
            placeholder={field.placeholder}
            required={field.required}
            onChange={event => onValueChange(event.target.value)}
          />
        );
    }
  };

  return (
    <div className={styles.formSurface}>
      <div className={styles.formHeader}>
        {form.definition.title && <h2>{form.definition.title}</h2>}
        {sections.length > 1 && (
          <nav className={styles.sectionTabs} aria-label="Form sections">
            {sections.map(section => (
              <button
                key={section.id}
                type="button"
                className={clsx(styles.sectionTab, activeSectionId === section.id && styles.sectionTabActive)}
                onClick={() => setActiveSectionId(section.id)}
              >
                {section.title ?? section.id}
              </button>
            ))}
          </nav>
        )}
      </div>

      {sections.map(section => (
        <Fragment key={section.id}>
          {section.id === activeSectionId && (
            <section className={styles.section}>
              <header className={styles.sectionHeader}>
                {section.title && <h3>{section.title}</h3>}
                {section.description && <p>{section.description}</p>}
              </header>
              <div className={styles.fieldsGrid}>
                {section.fields.map(field => (
                  <label
                    key={field.id}
                    htmlFor={field.id}
                    className={clsx(
                      styles.field,
                      field.width === 'half' && styles.fieldHalf,
                      field.width === 'third' && styles.fieldThird
                    )}
                  >
                    <span className={styles.fieldLabel}>
                      {field.label}
                      {field.required && <sup>*</sup>}
                    </span>
                    {renderField(field)}
                    {field.description && <small>{field.description}</small>}
                  </label>
                ))}
              </div>
            </section>
          )}
        </Fragment>
      ))}
    </div>
  );
}