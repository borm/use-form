import React from 'react';
import { render } from 'react-dom';
import { Form, Field } from '../src';

const UseFormExample = () => {
  const form = {
    initialValues: {
      test: 'test@test.te',
      a: { b: 1 },
      c: { d: [[1], 5, 12] },
    },
    validate: values => {
      console.log(values);
    },
    onSubmit: values => {
      console.log(values);
    },
  };

  return (
    <Form {...form}>
      {({ handleSubmit, ...state }) => {
        console.log(state);
        return (
          <form onSubmit={handleSubmit}>
            <p>Use Form Example</p>
            <Field
              type="text"
              name="test"
              component={props => <input {...props} />}
            />

            <input type="submit" />
          </form>
        );
      }}
    </Form>
  );
};

render(<UseFormExample />, document.getElementById('app'));
