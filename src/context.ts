import { createContext } from 'react';
import { getField, getMeta, getState, setField } from './api';

const getField: getField = Object;
const setField: setField = Object;
const getMeta: getMeta = Object;
const getState: getState = Object;

const FormContext = createContext({
  getField,
  setField,
  getMeta,
  getState,
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;

export default FormContext;
