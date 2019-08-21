import { createContext } from 'react';
import { getField, getState, setField } from './api';

const setField: setField = Object;
const getField: getField = Object;
const getState: getState = Object;

const FormContext = createContext({
  setField,
  getField,
  getState,
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;

export default FormContext;
