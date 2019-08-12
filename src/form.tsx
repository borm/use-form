import * as React from 'react';
import { FormProvider } from './context';
import isEvent from './helpers/isEvent';
import Api from './api';

interface FormProps {
  initialValues: any | {};
  initialErrors: any | {};
  validate: (values: any) => object;
  onSubmit: (values: any) => object;
  children: any;
}

const Form = ({ children, ...props }: FormProps) => {
  if (typeof children !== 'function') {
    throw new Error(`children must be specified as function`);
  }

  const { initialValues, initialErrors, validate, onSubmit } = props;

  const form = new Api({ initialValues, initialErrors });
  let initialState = { values: initialValues, errors: initialErrors };

  const unSubscribers = [
    form.subscribe((state: { values: any | {}; errors: any | {} }) => {
      initialState = state;
    }),
  ];

  const [state, setState] = React.useState(initialState);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    if (isEvent(event)) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log(form);
    const values = Array.from(state.values.entries()).reduce(
      (accumulator: object, [key, value]) => ({
        ...accumulator,
        [key]: value,
      }),
      {}
    );

    await validate(values);
    await onSubmit(values);
  };

  return <FormProvider value={form}>{children({ handleSubmit })}</FormProvider>;
};

export default Form;
