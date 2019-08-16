import { useState, useEffect, useCallback, ReactNode, SyntheticEvent } from 'react';
import useForm from './useForm';

export type FieldProps = {
  component: (props: object) => ReactNode;
  name: string;
  type: string;
  value?: any;
  multiple?: boolean;
  isFocus?: boolean;
  isBlur?: boolean;
  isChecked?: boolean;
  onBlur?: SyntheticEvent;
  onChange?: SyntheticEvent;
  onFocus?: SyntheticEvent;
  validate?: (value: any, values: object) => any
};

const useField = (props: FieldProps) => {
  const form = useForm();
  const { name } = props;
  const [state, setState] = useState(form.setField(name).mount(props));
  useEffect(() => form.setField(name).unmount, []);

  const { type, value, error } = state;

  const onChange = useCallback(
    event => {
      event.persist();
      setState(form.setField(name).value(event));
    },
    [name, value]
  );

  return { name, type, value, error, onChange, onBlur: onChange };
};

export default useField;
