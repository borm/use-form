import * as React from 'react';
import useField, { FieldProps } from './hooks/useField';
import { ReactNode } from "react";

export type FieldValue = string | boolean | Array<string | boolean>;
export type FieldState = {
  type?: string,
  name?: string;
  value?: FieldValue,
  error?: any,
  validate?: (value: any, values: object) => any,
  multiple?: boolean,
};

const Field = (props: FieldProps & { component: (props: FieldProps) => ReactNode } ) => {
  const state = useField(props);
  return props.component(state);
};

export default Field;
