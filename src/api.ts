import { FieldState, FieldValue } from './field';

type ApiProps = {
  initialValues: { [key: string]: any };
  initialErrors: { [key: string]: any };
};

type State = {
  values: Map<string, FieldValue>;
  errors: Map<string, any>;
} & FieldState;

export type getState = (name?: string) => State;
export type setState = (
  key: 'values' | 'errors',
  name: string,
  value: any
) => object;

function mapToObject(map: Map<string, any>): any {
  return Array.from(map.entries()).reduce((accumulator, [key, value]) => ({
    ...accumulator,
    [key]: value,
  }), {});
}

export default class Api {
  private readonly values: State['values'];
  private readonly errors: State['errors'];
  constructor({ initialValues = {}, initialErrors = {} }: ApiProps) {
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
    // console.log(Array.from(this.values.entries()));
    const State: State = {
      values: mapToObject(this.values),
      errors: mapToObject(this.errors),
      ...(name && {
        value: this.values.get(name) || '',
        error: this.errors.get(name) || '',
      }),
    };
    return State;
  };

  public setState: setState = (key, name, value) => {
    this[key].set(name, value);
    this.listener.emit();
    return this.getState();
  };
}
