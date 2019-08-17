import { SyntheticEvent } from 'react';
import { FieldState, FieldValue } from './field';
import isEvent from './helpers/isEvent';
import isEmpty from './helpers/isEmpty';
import deserialize from './helpers/deserialize';
import serialize from './helpers/serialize';
import noop from './helpers/noop';

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

export type getField = (name?: string) => FieldState;
export type setField = (
  name: string
) => {
  mount: (props: FieldState) => FieldState;
  value: (value: any) => FieldState;
  error: (error: any) => FieldState;
  unmount: (value?: any) => void;
};

export type getDefaultValue = (name: string, defaultValue?: any) => any;
export type getValue = (name: string, event: any) => FieldValue;
export type setValue = (name: string, value: any) => FieldState;

export type getDefaultError = (name: string, defaultError?: any) => any;
export type setError = (name: string, error?: any) => FieldState;

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
  private readonly validate: (
    values: object
  ) => undefined | { [key: string]: any };
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

    Object.keys(values).map(key => {
      this.setValue(key, values[key]);
    });
    this.initialValues = this.values;
    Object.keys(errors).map(key => {
      this.setError(key, errors[key]);
    });
    this.initialErrors = this.errors;
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
      value: this.values.get(name),
      error: this.errors.get(name),
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
      this.setValue(name, this.getDefaultValue(name));
      this.setError(name, this.getDefaultError(name));
      return this.getField(name);
    },
    unmount: () => {
      this.fields.delete(name);
      this.values.delete(name);
      this.errors.delete(name);
    },
    value: event => {
      const value = this.getValue(name, event);
      const state = this.setValue(name, value);
      this.setError(name);
      this.handleValidate({
        [name]: value,
      });
      this.listener.emit();
      return state;
    },
    error: error => {
      const state = this.setError(name, error);
      this.listener.emit();
      return state;
    },
  });

  private getDefaultValue: getDefaultValue = name => {
    const { type, multiple } = this.fields.get(name) || {
      type: 'text',
      multiple: false,
    };

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

  private getValue: getValue = (name, event) => {
    if (isEvent(event)) {
      const { value, checked, options } = event.target;
      const { type, multiple } = this.getField(name);
      switch (type) {
        case 'checkbox':
        case 'radio':
          return checked;
        case 'select':
          if (multiple) {
            const selected = [];
            if (options && options.length) {
              for (let index = 0; index < options.length; index++) {
                const option = options[index];

                if (option.selected) {
                  selected.push(option.value);
                }
              }
            }
            return selected;
          }
          return value;
        default:
          return value;
      }
    }
    return event;
  };

  private setValue: setValue = (name, value) => {
    this.values.set(name, value);
    return this.getField(name);
  };

  private getDefaultError: getDefaultError = (name, defaultError) => {
    return this.initialErrors.get(name) || defaultError;
  };

  private setError: setError = (name, error) => {
    if (error) {
      this.errors.set(name, error);
    } else {
      this.errors.delete(name);
    }
    return this.getField(name);
  };

  private handleValidate = (values: object = this.getState().values) => {
    const errors = this.validate(values) || {};

    Object.keys(values).forEach(name => {
      const { value, validate } = this.getField(name);
      this.setError(name, validate(value, values) || errors[name]);
    });
  };

  public handleSubmit: (
    event: SyntheticEvent<HTMLFormElement>
  ) => void = event => {
    if (isEvent(event)) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.handleValidate();
    this.listener.emit();
    const { errors, values } = this.getState();
    if (!errors || isEmpty(errors)) {
      this.onSubmit(values);
    }
  };
}
