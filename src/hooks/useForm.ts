import { useMemo } from 'react';
import Api, { FormState } from '../api';
import useSubscription from '../hooks/useSubscription';

export type useFormProps = {
  initialValues: object;
  initialErrors: object;
  validate: (values: object) => object;
  onSubmit: (values: object) => void;
};

const useForm = (props: useFormProps) => {
  const { initialValues, initialErrors, validate, onSubmit } = props;

  const api = useMemo(
    () =>
      new Api({
        initialValues,
        initialErrors,
        validate,
        onSubmit,
      }),
    []
  );

  const state: FormState = useSubscription(
    useMemo(
      () => ({
        getState: api.getState,
        subscribe: (callback: () => void) => {
          api.listener.on('subscribe', callback);
          return () => api.listener.off('subscribe');
        },
      }),
      []
    )
  );

  return {
    api,
    state,
  };
};

export default useForm;
