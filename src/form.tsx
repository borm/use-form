import * as React from 'react';
import Api from './api';
import useSubscription from './hooks/useSubscription';
import isEvent from './helpers/isEvent';
import { FormProvider } from './context';

type FormProps = {
  initialValues: object;
  initialErrors: object;
  validate: (values: object) => void;
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
    });
    return { api, state: api.getState() };
  });

  const subscription = React.useMemo(
    () => ({
      getState: api.getState,
      subscribe: (callback: () => void) => {
        api.listener.on('change', callback);
        return () => api.listener.off('change');
      },
    }),
    [initialState]
  );

  const state = useSubscription(subscription);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    if (isEvent(event)) {
      event.preventDefault();
      event.stopPropagation();
    }

    await validate(state.values);
    await onSubmit(state.values);
  };

  return (
    <FormProvider
      value={{
        getState: api.getState,
        setState: api.setState,
      }}
    >
      {children({ ...state, handleSubmit })}
    </FormProvider>
  );
};

export default Form;
