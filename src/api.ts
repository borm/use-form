import * as React from 'react';
import { FieldState, FieldValue } from './field';
import isEvent from './helpers/isEvent';
import isEmpty from './helpers/isEmpty';
import deserialize from './helpers/deserialize';
import serialize from './helpers/serialize';

type ApiProps = {
  initialValues: { [key: string]: any };
  initialErrors: { [key: string]: any };
  validate: (values: object) => undefined | object;
  onSubmit: (values: object) => void;
};

type FormState = {
  fields: object;
  values: object;
  errors: object;
};

export type setField = (
  name: string
) => {
  mount: (props: FieldState) => FieldState;
  value: (value: any) => FieldState;
  error: (error: any) => FieldState;
  unmount: (value?: any) => void;
};
export type getField = (name?: string) => FieldState;
export type setValue = (name: string, value: any) => FieldState;
export type getValue = (name: string, defaultValue: any) => any;
export type setError = (name: string, error?: any) => FieldState;
export type getError = (name: string, defaultError: any) => any;

export type getState = () => FormState;

function mapped(map: Map<string, any>): { [key: string]: any } {
  return Array.from(map.entries()).reduce(
    (accumulator, [key, value]) => ({
      ...accumulator,
      [key]: value,
    }),
    {}
  );
}

export default class Api {
  private readonly validate: (values: object) => undefined | object;
  private readonly onSubmit: (values: object) => void;

  private readonly initialValues: Map<string, FieldValue> = new Map();
  private readonly initialErrors: Map<string, any> = new Map();
  private readonly fields: Map<string, FieldState> = new Map();

  constructor({
    validate,
    onSubmit,
    initialValues = {},
    initialErrors = {},
  }: ApiProps) {
    this.validate = validate;
    this.onSubmit = onSubmit;

    const values = deserialize(initialValues);
    const errors = deserialize(initialErrors);

    this.initialValues = new Map(
      Object.keys(values).map(key => [key, values[key]])
    );
    this.initialErrors = new Map(
      Object.keys(initialErrors).map(key => [key, errors[key]])
    );
  }

  private listeners: Map<string, () => void> = new Map();
  public listener: {
    on: (name: string, callback: () => void) => void;
    off: (name: string) => void;
    emit: () => void;
  } = {
    on: (name, callback) => this.listeners.set(name, callback),
    off: name => this.listeners.delete(name),
    emit: () => this.listeners.forEach(listener => listener()),
  };

  public getState: getState = () => {
    const fields = mapped(this.fields);
    const { values, errors } = Object.keys(fields).reduce(
      (accumulator, name) => ({
        values: {
          ...accumulator.values,
          [name]: fields[name].value,
        },
        errors: {
          ...accumulator.errors,
          [name]: fields[name].error,
        },
      }),
      { values: mapped(this.initialValues), errors: mapped(this.initialErrors) }
    );
    const State: FormState = {
      fields: serialize(fields),
      values: serialize(values),
      errors: serialize(errors),
    };
    return State;
  };

  public getField: getField = name => {
    const State: FieldState = {
      validate: () => undefined,
      ...this.fields.get(name),
    };
    return State;
  };

  public setField: setField = name => ({
    mount: ({
      type,
      value: defaultValue,
      error: defaultError,
      validate,
    }: FieldState) => {
      this.fields.set(name, {
        type,
        name,
        value: this.getValue(name, defaultValue),
        error: this.getError(name, defaultError),
        validate,
      });
      return this.fields.get(name);
    },
    unmount: () => this.fields.delete(name),
    value: event => this.setValue(name, event),
    error: error => this.setError(name, error),
  });

  private setValue: setValue = (name, event) => {
    let value = event;
    if (isEvent(event)) {
      value = event.target.value;
    }
    const field = this.getField(name);
    this.fields.set(name, { ...field, value });
    this.setError(name);
    this.handleValidate({
      [name]: value,
    });
    this.listener.emit();
    return this.getField(name);
  };

  private getValue: getValue = (name, defaultValue = '') => {
    return this.initialValues.get(name) || defaultValue;
  };

  private setError: setError = (name, error) => {
    this.fields.set(name, { ...this.getField(name), error });
    this.listener.emit();
    return this.getField(name);
  };

  private getError: getError = (name, defaultError) => {
    return this.initialErrors.get(name) || defaultError;
  };

  // TODO, needs to refactoring
  private handleValidate = (values: object) => {
    const errors = this.validate(values) || {};

    Object.keys(values).forEach(name => {
      const { value, validate } = this.getField(name);
      // TODO
      // @ts-ignore
      this.setError(name, validate(value, values) || errors[name]);
    });
  };

  public handleSubmit: (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => void = event => {
    if (isEvent(event)) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.handleValidate(this.getState().values);
    this.listener.emit();
    const { errors, values } = this.getState();
    if (isEmpty(errors)) {
      this.onSubmit(values);
    }
  };
}
