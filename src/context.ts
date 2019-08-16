import { createContext } from 'react';
import { setField, getField, getState } from "./api";

const setField: setField = Object;
const getField: getField = Object;
const getState: getState = Object;

const FormContext = createContext({
  setField: setField,
  getField: getField,
  getState: getState,
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;

export default FormContext;
