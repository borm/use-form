import * as React from 'react';
import useField from './useField';

type FieldProps = {
  type: string;
  name: string;
  value?: any;
  isFocus?: boolean;
  isBlur?: boolean;
  isChecked?: boolean;
  multiple?: boolean;
  component: (props: object) => React.ReactNode;
  onBlur?: React.SyntheticEvent;
  onChange?: React.SyntheticEvent;
  onFocus?: React.SyntheticEvent;
};

const Field = ({ name, component, ...rest }: FieldProps) => {
  const state = useField(name, { type: rest.type, value: rest.value });

  return component(state);
};

export default Field;
