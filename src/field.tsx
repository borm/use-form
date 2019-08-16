import { ReactNode } from 'react';
import useField, { FieldProps } from './hooks/useField';

export type FieldValue = string | boolean | Array<string | boolean>;
export type FieldState = {
  type?: string;
  name?: string;
  value?: FieldValue;
  error?: any;
  validate?: (value: any, values: object) => any;
  multiple?: boolean;
};

const Field = ({
  component,
  ...props
}: FieldProps & { component: (props: FieldProps) => ReactNode }) =>
  component(useField(props));

export default Field;
