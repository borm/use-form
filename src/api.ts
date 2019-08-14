import * as React from 'react';
import { FieldState, FieldValue } from './field';
import isEvent from './helpers/isEvent';
import isEmpty from './helpers/isEmpty';

type ApiProps = {
  initialValues: { [key: string]: any };
  initialErrors: { [key: string]: any };
  validate: (values: object) => undefined | object;
  onSubmit: (values: object) => void;
};

type FormState = {
  values: Map<string, FieldValue>;
  errors: Map<string, any>;
};

export type setValue = (name: string, value: any) => void;
export type setError = (name: string, error?: any) => void;
export type setState = (
  key: 'values' | 'errors' | 'validators',
  name?: string,
  value?: any
) => void;
export type getState = (name?: string) => FormState & FieldState;

function mapped(map: Map<string, any>): any {
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

  private readonly values: FormState['values'];
  private readonly errors: FormState['errors'];
  private validators: Map<string, (value: any, values: object) => void> = new Map();
  constructor({
    validate,
    onSubmit,
    initialValues = {},
    initialErrors = {},
  }: ApiProps) {
    this.validate = validate;
    this.onSubmit = onSubmit;

    this.values = new Map(
      Object.keys(initialValues).map(key => [key, initialValues[key]])
    );
    this.errors = new Map(
      Object.keys(initialErrors).map(key => [key, initialErrors[key]])
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

  public getState: getState = name => {
    const State: getState = name => ({
      values: mapped(this.values),
      errors: mapped(this.errors),
      ...(name && {
        value: this.values.get(name) || '',
        error: this.errors.get(name) || '',
      }),
    });
    return State(name);
  };

  public setValue: setValue = (name, value) => {
    this.values.set(name, value);
    this.setError(name);
    this.handleValidate({
      [name]: value,
    });
    this.setState('values');
    return this.getState(name);
  };

  public setError: setError = (name, error) => {
    if (isEmpty(error)) {
      this.errors.delete(name);
    } else {
      this.errors.set(name, error);
    }
    return this.getState(name);
  };

  // TODO, needs to refactoring
  public setState: setState = (key, name, value) => {
    if (['values', 'errors'].includes(key)) {
      this.listener.emit();
    } else if (typeof key !== 'undefined') {
      this[key].set(name, value);
    }
  };

  // TODO, needs to refactoring
  private handleValidate = (values: object) => {
    const errors = this.validate(values);

    if (!isEmpty(errors)) {
      Object.keys(errors).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          // TODO
          // @ts-ignore
          this.setError(key, errors[key]);
        }
      })
    }

    this.validators.forEach((validate, key) => {
      const { error, value } = this.getState(key);
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        // TODO
        // @ts-ignore
        this.setError(key, validate(value, values) || error);
      }
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
    const { errors, values } = this.getState();
    if (isEmpty(errors)) {
      this.onSubmit(values);
    }
    this.setState('values');
  };
}
