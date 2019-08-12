import React from 'react';
import { render } from 'react-dom';
import { Form, Field } from '../src';

const UseFormExample = () => {
  const form = {
    initialValues: {
      test: 'test@test.te',
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
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <p>Use Form Example</p>
          <Field
            type="text"
            name="test"
            component={props => <input {...props} />}
          />

          <input type="submit" />
        </form>
      )}
    </Form>
  );
};

render(<UseFormExample />, document.getElementById('app'));
