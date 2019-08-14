import * as React from 'react';
import useField, { FieldProps } from './hooks/useField';

export type FieldValue = string | boolean | Array<string | boolean>;
export type FieldState = {
  type?: string,
  name?: string;
  value?: FieldValue,
  error?: any,
};

const Field = (props: FieldProps) => {
  const state = useField(props);
  return props.component(state);
};

export default Field;
