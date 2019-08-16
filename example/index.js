import React from 'react';
import { render } from 'react-dom';
import { Form, Field } from '../src';

const UseFormExample = () => {
  const form = {
    initialValues: {
      email: 'test@test.te',
      'a.b': 1,
      'c.d[0][0]': 1,
      'c.d[1]': 5,
      'c.d[2]': 12,
    },
    initialErrors: {
      password: 'Initial error, from backend as example',
    },
    validate: values => ({
      email: !values.email && 'email is required',
      password: !values.password && 'password is required',
    }),
    onSubmit: values => {
      console.log(values);
    },
  };

  return (
    <Form {...form}>
      {({ handleSubmit, ...state }) => (
        <form onSubmit={handleSubmit}>
          <pre>{JSON.stringify(state, 0, 2)}</pre>
          <p>Use Form Example</p>
          <Field
            type="text"
            name="email"
            component={({ error, ...props }) => (
              <div>
                <input {...props} />
                {error}
              </div>
            )}
            validate={value => {
              if (value && value.length < 3) {
                return 'Email length should be more 3 symbols';
              }
            }}
          />

          <Field
            type="password"
            name="password"
            component={({ error, ...props }) => (
              <div>
                <input {...props} />
                {error}
              </div>
            )}
            validate={value => {
              if (value && value.length < 3) {
                return 'Password length should be more 3 symbols';
              }
            }}
          />

          <Field
            type="checkbox"
            name="remember"
            component={({ error, ...props }) => (
              <div>
                <input {...props} />
                {error}
              </div>
            )}
            validate={value => {
              console.log(value);
              if (!value) {
                return 'Should be checked';
              }
            }}
          />

          <input type="submit" />
        </form>
      )}
    </Form>
  );
};

render(<UseFormExample />, document.getElementById('app'));
