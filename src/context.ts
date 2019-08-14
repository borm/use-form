import { createContext } from 'react';
import { setValue, setError, setState, getState } from "./api";

const setValue: setValue = Object;
const setError: setError = Object;
const setState: setState = Object;
const getState: getState = Object;

const FormContext = createContext({
  setValue: setValue,
  setError: setError,
  setState: setState,
  getState: getState,
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;

export default FormContext;
