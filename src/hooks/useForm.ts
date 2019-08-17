import { useMemo, useState } from 'react';
import Api from '../api';
import useSubscription from '../hooks/useSubscription';

export type useFormProps = {
  initialValues: object;
  initialErrors: object;
  validate: (values: object) => object;
  onSubmit: (values: object) => void;
};

const useForm = (props: useFormProps) => {
  const { initialValues, initialErrors, validate, onSubmit } = props;

  const [{ api, initialState }] = useState(() => {
    const api = new Api({
      initialValues,
      initialErrors,
      validate,
      onSubmit,
    });
    return { api, initialState: api.getState() };
  });

  const state = useSubscription(
    useMemo(
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
  return {
    api,
    state,
  };
};

export default useForm;
