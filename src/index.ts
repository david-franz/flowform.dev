export type FlowFormFieldKind =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'slider'
  | 'password'
  | 'email'
  | 'url'
  | 'date'
  | 'time'
  | 'color'
  | 'radio'
  | 'multiselect';

export type FlowFormFieldWidth = 'full' | 'half' | 'third';

export interface FlowFormFieldDefinition {
  id: string;
  label: string;
  kind: FlowFormFieldKind;
  description?: string;
  required?: boolean;
  defaultValue?: unknown;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  width?: FlowFormFieldWidth;
}

export interface FlowFormSectionDefinition {
  id: string;
  title?: string;
  fields: FlowFormFieldDefinition[];
  description?: string;
}

export interface FlowFormDefinition {
  id: string;
  title?: string;
  sections: FlowFormSectionDefinition[];
  metadata?: Record<string, unknown>;
}

export interface FlowFormInstance {
  definition: FlowFormDefinition;
  values: Record<string, unknown>;
}

export function createFlowForm(definition: FlowFormDefinition, initialValues?: Record<string, unknown>): FlowFormInstance {
  const values = deriveValues(definition, initialValues);

  return {
    definition,
    values,
  };
}

export function updateFlowForm(instance: FlowFormInstance, patch: Record<string, unknown>): FlowFormInstance {
  const nextValues = { ...instance.values };

  for (const [key, value] of Object.entries(patch)) {
    const field = findField(instance.definition, key);
    if (!field) {
      continue;
    }

    nextValues[key] = value;
  }

  return {
    definition: instance.definition,
    values: nextValues,
  };
}

export function findField(definition: FlowFormDefinition, fieldId: string): FlowFormFieldDefinition | undefined {
  for (const section of definition.sections) {
    const match = section.fields.find(field => field.id === fieldId);
    if (match) {
      return match;
    }
  }

  return undefined;
}

export function reconcileFlowForm(
  previous: FlowFormInstance | undefined,
  definition: FlowFormDefinition,
  initialValues?: Record<string, unknown>
): FlowFormInstance {
  const baseValues = previous?.values ?? {};
  const values = deriveValues(definition, initialValues, baseValues);

  return {
    definition,
    values,
  };
}

function deriveValues(
  definition: FlowFormDefinition,
  initialValues?: Record<string, unknown>,
  baseValues?: Record<string, unknown>
): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const section of definition.sections) {
    for (const field of section.fields) {
      if (baseValues && field.id in baseValues) {
        values[field.id] = baseValues[field.id];
        continue;
      }

      if (initialValues && field.id in initialValues) {
        values[field.id] = initialValues[field.id];
        continue;
      }

      if (field.defaultValue !== undefined) {
        values[field.id] = field.defaultValue;
      }
    }
  }

  return values;
}