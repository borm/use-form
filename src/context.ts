import { createContext } from 'react';
import { getState, setState } from "./api";

const getState: getState = Object;
const setState: setState = Object;

const FormContext = createContext({
  getState: getState,
  setState: setState,
});

export const { Provider: FormProvider, Consumer: FormConsumer } = FormContext;

export default FormContext;
