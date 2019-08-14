import * as React from 'react';
import Api from './api';
import useSubscription from './hooks/useSubscription';
import { FormProvider } from './context';

type FormProps = {
  initialValues: object;
  initialErrors: object;
  validate: (values: object) => object;
  onSubmit: (values: object) => void;
  children: (props: object) => React.ReactNode;
};

const Form = ({ children, ...props }: FormProps) => {
  if (typeof children !== 'function') {
    throw new Error(`children must be specified as function`);
  }

  const { initialValues, initialErrors, validate, onSubmit } = props;

  const [{ api, state: initialState }] = React.useState(() => {
    const api = new Api({
      initialValues,
      initialErrors,
      validate,
      onSubmit,
    });
    return { api, state: api.getState() };
  });

  const { values, errors } = useSubscription(
    React.useMemo(
      () => ({
        getState: api.getState,
        subscribe: (callback: () => void) => {
          api.listener.on('change', callback);
          return () => api.listener.off('change');
        },
      }),
      [initialState]
    )
  );

  return (
    <FormProvider
      value={{
        setValue: api.setValue,
        setError: api.setError,
        getState: api.getState,
        setState: api.setState,
      }}
    >
      {children({ values, errors, handleSubmit: api.handleSubmit })}
    </FormProvider>
  );
};

export default Form;
