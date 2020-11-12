import { flatten, nested } from 'nest-deep';
import { SyntheticEvent } from 'react';
import { FieldInput, FieldMeta, FieldMountState, FieldValue } from './field';
import get from './helpers/get';
import isEmpty from './helpers/isEmpty';
import isEqual from './helpers/isEqual';
import isEvent from './helpers/isEvent';
import noop from './helpers/noop';
import { isObject } from './helpers/typeOf';

export type getField = (name: string) => FieldInput;
export type getMeta = (name: string) => FieldMeta;

type MetaKey = 'touched' | 'errors' | 'validations';
export type setField = (
  name: string
) => {
  mount: (props: FieldMountState) => FieldInput;
  unmount: () => void;
  value: (value: any) => FieldInput;
  error: (error: any) => FieldInput;
  meta: (metaKey: MetaKey, metaValue: any) => FieldInput;
};

export type FormState = {
  fields: { [key: string]: FieldInput };
  values: { [key: string]: any };
  // meta
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  submitting: boolean;
  valid: boolean;
};

export type getState = () => FormState;

export type handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => void;
export type handleReset = (event: SyntheticEvent & FormState) => void;

function mapped(map: Map<string, any>): { [key: string]: any } {
  return Array.from(map.entries()).reduce(
    (accumulator, [key, value]) => ({
      ...accumulator,
      [key]: value,
    }),
    {}
  );
}

const { keys } = Object;

export default class Api {
  public listener: {
    on: (name: string, callback: () => void) => void;
    off: (name: string) => void;
    emit: () => void;
  } = {
    on: (name, callback) => this.listeners.set(name, callback),
    off: name => this.listeners.delete(name),
    emit: async () => this.listeners.forEach(listener => listener()),
  };
  private listeners: Map<string, () => void> = new Map();

  private readonly validate: (
    values: object
  ) => undefined | { [key: string]: any };
  private readonly onSubmit: (values: object) => void;

  private readonly initialValues: Map<string, FieldValue> = new Map();
  private readonly initialErrors: Map<string, any> = new Map();
  private readonly fields: Map<string, FieldInput> = new Map();
  private readonly values: Map<string, FieldValue> = new Map();
  private readonly meta: {
    touched?: Map<string, any>;
    errors?: Map<string, any>;
    validations?: Map<string, any>;
  } = {
    errors: new Map(),
    touched: new Map(),
    validations: new Map(),
  };

  private submitting: boolean = false;

  constructor({
    validate = noop,
    onSubmit = noop,
    initialValues = {},
    initialErrors = {},
  }: {
    initialValues: {};
    initialErrors: {};
    validate: (values: object) => undefined | object;
    onSubmit: (values: object) => void;
  }) {
    this.validate = validate;
    this.onSubmit = onSubmit;

    const values = flatten(initialValues);
    const errors = flatten(initialErrors);

    keys(values).map(key => {
      this.initialValues.set(key, values[key]);
      this.setValue(key, values[key]);
    });

    keys(errors).map(key => {
      this.initialErrors.set(key, errors[key]);
      this.setError(key, errors[key]);
    });
  }

  public handleReset: handleReset = async event => {
    const prevValues = mapped(this.values);
    const prevValueKeys = keys({ ...prevValues, ...flatten(prevValues) });
    this.values.clear();
    this.meta.errors.clear();
    this.meta.touched.clear();

    if (isEvent(event)) {
      event.preventDefault();
      event.stopPropagation();
      prevValueKeys.map(key => {
        this.setValue(key, this.getDefaultValue(key));
      });
      keys(mapped(this.initialErrors)).map(key => {
        this.setError(key, this.getDefaultError(key));
      });
    } else if (isObject(event) && !isEmpty(event)) {
      this.initialValues.clear();
      this.initialErrors.clear();

      const nextValues = flatten(event.values);
      const nextErrors = flatten(event.errors);
      keys(nextValues).map(key => {
        this.initialValues.set(key, nextValues[key]);
        this.setValue(key, this.getDefaultValue(key));
      });
      keys(nextErrors).map(key => {
        this.initialErrors.set(key, nextErrors[key]);
        this.setError(key, nextErrors[key]);
      });
    }

    this.listener.emit();
  };

  public handleSubmit: handleSubmit = async event => {
    if (isEvent(event)) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.submitting = true;
    await this.listener.emit();
    this.handleValidate(this.getState().values);
    const { errors, values } = this.getState();
    if (!errors || isEmpty(errors)) {
      await this.onSubmit(values);
    }
    this.submitting = false;
    this.listener.emit();
  };

  public getState: getState = () => {
    const errors = nested(mapped(this.meta.errors));
    const State: FormState = {
      fields: nested(mapped(this.fields)),
      values: nested(mapped(this.values)),
      errors,
      touched: nested(mapped(this.meta.touched)),
      valid: keys(errors).length === 0,
      submitting: this.submitting,
    };
    return State;
  };

  public getField: getField = name => {
    return {
      value: get(nested(mapped(this.values)), name, ''),
      ...get(nested(mapped(this.fields)), name, {}),
    };
  };

  public setField: setField = name => ({
    mount: ({ type = 'text', validate = noop, multiple }: FieldMountState) => {
      this.fields.set(name, {
        type,
        name,
        multiple,
      });
      this.setValue(name, this.getDefaultValue(name));
      const defaultError = this.getDefaultError(name);
      this.setError(name, defaultError);
      this.setMeta(name, 'validations', validate);
      return this.getField(name);
    },
    unmount: () => {
      this.fields.delete(name);
      this.values.delete(name);
      this.meta.errors.delete(name);
      this.meta.touched.delete(name);
      this.meta.validations.delete(name);
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
    meta: (metaKey, metaValue) => {
      this.setMeta(name, metaKey, metaValue);
      const state = this.getField(name);
      this.listener.emit();
      return state;
    },
  });

  public getMeta: getMeta = name => {
    const State: FieldMeta = {
      error: get(nested(mapped(this.meta.errors)), name),
      touched: this.meta.touched.get(name),
      validate: this.meta.validations.get(name),
    };

    return State;
  };

  private setMeta: (
    name: string,
    metaKey: MetaKey,
    metaValue: any
  ) => FieldInput = (name, metaKey, metaValue) => {
    if (metaValue) {
      this.meta[metaKey].set(name, metaValue);
    } else {
      this.meta[metaKey].delete(name);
    }
    return this.getField(name);
  };

  private getDefaultValue: (name: string) => any = name => {
    const { type, multiple } = this.getField(name);

    let defaultValue;
    switch (type) {
      case 'checkbox':
        defaultValue = false;
        break;
      case 'select':
        defaultValue = '';
        if (multiple) {
          defaultValue = [];
        }
        break;
      default:
        defaultValue = '';
        break;
    }
    return get(nested(mapped(this.initialValues)), name, defaultValue);
  };

  private getValue: (
    name: string,
    event: SyntheticEvent<HTMLFormElement> | any
  ) => FieldValue = (name, event) => {
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
              // tslint:disable-next-line:prefer-for-of
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

  private setValue: (name: string, value: any) => FieldInput = (
    name,
    value
  ) => {
    if (Array.isArray(value)) {
      const prevValues = flatten({
        [name]: get(nested(mapped(this.values)), name),
      });

      const nextValues = flatten({ [name]: value });
      if (!isEqual(prevValues, nextValues)) {
        for (const key in prevValues) {
          if (prevValues.hasOwnProperty(key)) {
            this.values.delete(key);
          }
        }
        for (const key in nextValues) {
          if (nextValues.hasOwnProperty(key)) {
            this.values.set(key, nextValues[key]);
          }
        }
      }
    }
    this.values.set(name, value);
    return this.getField(name);
  };

  private getDefaultError: (name: string) => any = name =>
    get(nested(mapped(this.initialErrors)), name);

  private setError: (name: string, error?: any) => FieldInput = (
    name,
    error
  ) => {
    this.setMeta(name, 'touched', Boolean(error));
    return this.setMeta(name, 'errors', error);
  };

  private handleValidate = (valuesForValidate: object = {}) => {
    const { values } = this.getState();
    const allValues = {
      ...values,
      ...flatten(values),
    };

    const errors = flatten(this.validate(allValues) || {});

    keys({
      ...valuesForValidate,
      ...flatten(valuesForValidate),
    }).forEach(name => {
      const { value } = this.getField(name);
      const { validate } = this.getMeta(name);
      const error = (validate && validate(value, allValues)) || errors[name];
      this.setError(name, error);
    });
  };
}
