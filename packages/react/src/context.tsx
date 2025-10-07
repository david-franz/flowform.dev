import { createContext, useContext } from 'react';
import type { FlowFormInstance } from '@flowtomic/flowform';

export interface FlowFormContextValue {
  form: FlowFormInstance;
  setForm: (next: FlowFormInstance) => void;
  updateValues: (patch: Record<string, unknown>) => void;
  resetForm: () => void;
}

export const FlowFormContext = createContext<FlowFormContextValue | undefined>(undefined);

export function useFlowForm(): FlowFormContextValue {
  const ctx = useContext(FlowFormContext);

  if (!ctx) {
    throw new Error('useFlowForm must be used within a FlowFormProvider');
  }

  return ctx;
}