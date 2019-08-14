## use-form

> In development

```jsx
import React from 'react';
import { render } from 'react-dom';
import { Form, Field } from 'use-form';

const UseFormExample = () => {
  const form = {
    initialValues: {
      email: 'test@test.te',
      a: { b: 1 },
      c: { d: [[1], 5, 12] },
      'e.f[0]': 'g'
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
          <pre>
            {JSON.stringify(state, 0, 2)}
          </pre>
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

          <input type="submit" />
        </form>
      )}
    </Form>
  );
};

render(<UseFormExample />, document.getElementById('app'));

```
