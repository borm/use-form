import { useCallback, ReactNode, SyntheticEvent } from "react";
import useForm from './useForm';

export type FieldProps = {
  component: (props: object) => ReactNode;
  type: string;
  name: string;
  value?: any;
  isFocus?: boolean;
  isBlur?: boolean;
  isChecked?: boolean;
  multiple?: boolean;
  onBlur?: SyntheticEvent;
  onChange?: SyntheticEvent;
  onFocus?: SyntheticEvent;
  validate?: () => any;
};

const useField = ({ name, validate = () => undefined }: FieldProps) => {
  const form = useForm();
  form.setState('validators', name, validate);
  const { value, error } = form.getState(name);

  const onChange = useCallback(
    event => {
      form.setValue(name, event.target.value);
    },
    [name, value]
  );

  return { value, error, onChange, onBlur: onChange };
};

export default useField;
