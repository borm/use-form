import * as React from 'react';
import useForm from './useForm';
import { useFieldProps } from './types';

const useField = (name: string, { type, value }: useFieldProps) => {
  const form = useForm();

  const [state, setState] = React.useState(() =>
    form.field.setState(name, {
      type,
      value: value || form.values.get(name),
    })
  );

  const onChange = React.useCallback(
    (event: any) => {
      const targetValue = event.target.value;
      setState(form.field.setState(name, { value: targetValue }));
    },
    [name, state.value]
  );

  return { ...state, onChange };
};

export default useField;
