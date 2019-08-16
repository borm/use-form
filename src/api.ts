import * as React from 'react';
import { FieldState, FieldValue } from './field';
import isEvent from './helpers/isEvent';
import isEmpty from './helpers/isEmpty';
import deserialize from './helpers/deserialize';
import serialize from './helpers/serialize';
import noop from "./helpers/noop";

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
export type getValue = (name: string, defaultValue?: any) => any;
export type setError = (name: string, error?: any) => FieldState;
export type getError = (name: string, defaultError?: any) => any;

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
  private readonly validate: (values: object) => undefined | { [key: string]: any };
  private readonly onSubmit: (values: object) => void;

  private readonly initialValues: Map<string, FieldValue> = new Map();
  private readonly initialErrors: Map<string, any> = new Map();
  private readonly fields: Map<string, FieldState> = new Map();
  private readonly values: Map<string, FieldValue> = new Map();
  private readonly errors: Map<string, any> = new Map();

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

    this.initialValues = this.values = new Map(
      Object.keys(values).map(key => [key, values[key]])
    );
    this.initialErrors = this.errors = new Map(
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
    const State: FormState = {
      fields: mapped(this.fields),
      values: serialize(mapped(this.values)),
      errors: serialize(mapped(this.errors)),
    };
    return State;
  };

  public getField: getField = name => {
    const State: FieldState = {
      value: this.getValue(name),
      error: this.getError(name),
      validate: noop,
      ...this.fields.get(name),
    };

    return State;
  };

  public setField: setField = name => ({
    mount: ({
      type = 'text',
      validate = noop,
      multiple = undefined,
    }: FieldState) => {
      this.fields.set(name, {
        type,
        name,
        validate,
        multiple,
      });
      this.values.set(name, this.getValue(name));
      this.errors.set(name, this.getError(name));
      return this.getField(name);
    },
    unmount: () => {
      this.fields.delete(name);
      this.values.delete(name);
      this.errors.delete(name);
    },
    value: event => this.setValue(name, event),
    error: error => this.setError(name, error),
  });

  private setValue: setValue = (name, event) => {
    let value = event;
    const field = this.getField(name);
    if (isEvent(event)) {
      const { type } = field;
      value = event.target.value;
      switch (type) {
        case 'checkbox':
        case 'radio':
          value = event.target.checked;
          break;
        case 'select':
          const { options } = event.target;
          value = [];
          if (field.multiple && options && options.length) {
            for (let index = 0; index < options.length; index++) {
              const option = options[index];

              if (option.selected) {
                value.push(option.value);
              }
            }
          }
          break;
        default:
          break;
      }
    }
    console.log(value);
    this.values.set(name, value);
    this.setError(name);
    this.handleValidate({
      [name]: value,
    });
    this.listener.emit();
    return this.getField(name);
  };

  private getValue: getValue = (name) => {
    const { type, multiple } = this.fields.get(name) || { type: 'text', multiple: false };

    let defaultValue;
    switch (type) {
      case 'checkbox':
        defaultValue = false;
        break;
      case 'select':
        if (multiple) {
          defaultValue = [];
        }
        break;
      default:
        defaultValue = '';
        break;
    }
    return this.initialValues.get(name) || defaultValue;
  };

  private setError: setError = (name, error) => {
    this.errors.set(name, error);
    this.listener.emit();
    return this.getField(name);
  };

  private getError: getError = (name, defaultError) => {
    return this.initialErrors.get(name) || defaultError;
  };

  private handleValidate = (values: object = this.getState().values) => {
    const errors = this.validate(values) || {};

    Object.keys(values).forEach(name => {
      const { value, validate } = this.getField(name);
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
    this.handleValidate();
    this.listener.emit();
    const { errors, values } = this.getState();
    if (isEmpty(errors)) {
      this.onSubmit(values);
    }
  };
}
