import React, { ReactNode } from 'react';
import { FormProvider } from './context';
import useForm, { useFormProps } from './hooks/useForm';

type FormProps = useFormProps & {
  children: (props: object) => ReactNode;
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
        getState: api.getState,
      }}
    >
      {children({ ...state, handleSubmit: api.handleSubmit })}
    </FormProvider>
  );
};

export default Form;
