import { createContext } from 'react';
import { form } from './types';

const context: form = {
  fields: ({}),
  values: ({}),
  errors: ({}),
  field: {
    getState: name => ({}),
    setState: props => ({}),
  }
};

const FormContext = createContext(context);

export const {
  Provider: FormProvider,
  Consumer: FormConsumer,
} = FormContext;

export default FormContext;
