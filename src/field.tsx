import * as React from 'react';
import useField from './hooks/useField';

export type FieldValue = string | boolean | Array<string | boolean>;
export type FieldState = {
  type?: string,
  name?: string;
  value?: FieldValue,
  error?: any,
};

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
  const state = useField(name);
  return component(state);
};

export default Field;
