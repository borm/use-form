import { useFieldProps } from './types';
import { form } from './types';

interface ApiProps {
  initialValues: { [key: string]: any };
  initialErrors: { [key: string]: any };
}

export default class Api {
  fields: form['fields'];
  values: form['values'];
  errors: form['errors'];
  field: form['field'] = {
    getState: name => this.fields.get(name),
    setState: (name: string, state: useFieldProps) => {
      const field = this.fields.get('name') || {};
      return this.fields.set(name, { ...field, ...state }).get(name);
    },
  };
  subscribers: form['subscribers'] = [];
  subscribe: form['subscribe'];
  notify: () => void;

  constructor({ initialValues = {}, initialErrors = {} }: ApiProps) {
    this.fields = new Map();
    this.values = new Map(
      Object.keys(initialValues).map(key => [key, initialValues[key]])
    );
    this.errors = initialErrors;

    this.subscribers = [];
    this.subscribe = callback => this.subscribers.push(callback);
    this.notify = () => {
      this.subscribers.forEach(subscriber =>
        subscriber({
          values: this.values,
          errors: this.errors,
        })
      );
    }
  }
}
