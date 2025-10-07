import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createFlowForm, reconcileFlowForm, updateFlowForm } from '@flowtomic/flowform';
import type { FlowFormDefinition, FlowFormInstance } from '@flowtomic/flowform';
import { FlowFormContext } from './context.js';

export interface FlowFormProviderProps {
  definition: FlowFormDefinition;
  initialValues?: Record<string, unknown>;
  children?: ReactNode;
}

export function FlowFormProvider({ definition, initialValues, children }: FlowFormProviderProps) {
  const [form, setForm] = useState<FlowFormInstance>(() => createFlowForm(definition, initialValues));

  useEffect(() => {
    setForm(prev => reconcileFlowForm(prev, definition, initialValues));
  }, [definition, initialValues]);

  const setFormInstance = useCallback((next: FlowFormInstance) => {
    setForm(next);
  }, []);

  const updateValues = useCallback((patch: Record<string, unknown>) => {
    setForm(prev => updateFlowForm(prev, patch));
  }, []);

  const resetForm = useCallback(() => {
    setForm(createFlowForm(definition, initialValues));
  }, [definition, initialValues]);

  const value = useMemo(
    () => ({
      form,
      setForm: setFormInstance,
      updateValues,
      resetForm,
    }),
    [form, setFormInstance, updateValues, resetForm]
  );

  return <FlowFormContext.Provider value={value}>{children}</FlowFormContext.Provider>;
}