import React, { ReactNode } from 'react';
import { FormState, handleReset, handleSubmit } from './api';
import { FormProvider } from './context';
import useForm, { useFormProps } from './hooks/useForm';

export type FormRenderProps = FormState & {
  handleSubmit: handleSubmit;
  handleReset: handleReset;
};

type FormProps = useFormProps & {
  children: (props: FormRenderProps) => ReactNode;
};

const Form = ({ children, ...props }: FormProps) => {
  if (typeof children !== 'function') {
    throw new Error(`children must be specified as function`);
  }

  const { api, state } = useForm(props);

  return (
    <FormProvider
      value={{
        setField: api.setField,
        getField: api.getField,
        getMeta: api.getMeta,
        getState: api.getState,
      }}
    >
      {children({
        ...state,
        handleSubmit: api.handleSubmit,
        handleReset: api.handleReset,
      })}
    </FormProvider>
  );
};

export default Form;
