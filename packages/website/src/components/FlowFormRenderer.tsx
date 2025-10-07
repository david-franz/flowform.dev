import { Fragment } from 'react';
import { clsx } from 'clsx';
import { useFlowForm } from '@flowtomic/flowform-react';
import type { FlowFormFieldDefinition } from '@flowtomic/flowform';
import styles from './FlowFormRenderer.module.css';

export function FlowFormRenderer() {
  const { form, updateValues } = useFlowForm();

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
      case 'select':
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
            {(field.options ?? []).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
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
      {form.definition.title && <h2>{form.definition.title}</h2>}
      {form.definition.sections.map(section => (
        <Fragment key={section.id}>
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
        </Fragment>
      ))}
    </div>
  );
}