import React, { ReactElement, SyntheticEvent, useRef } from 'react';
import useField, { FieldProps } from './hooks/useField';

export type FieldValue = any;
export type FieldInput = {
  type?: string;
  name?: string;
  value?: FieldValue;
  checked?: boolean;
  multiple?: boolean;
  onChange?: (event: SyntheticEvent) => void;
  onFocus?: (event: SyntheticEvent) => void;
  onBlur?: (event: SyntheticEvent) => void;
};

export type FieldMeta = {
  error?: string;
  touched?: boolean;
  validate?: (value: any, values: object) => any;
};
export type FieldState = {
  input: FieldInput;
  meta: FieldMeta;
};

export type FieldMountState = FieldInput & FieldMeta;

const Field = ({
  component,
  ...props
}: FieldProps & { component: (props: FieldState) => ReactElement }) => {
  const { current: Component } = useRef(component);
  return <Component {...useField(props)} />;
};

export default Field;
