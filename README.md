# use-form [![NPM version](https://img.shields.io/npm/v/use-form.svg?style=flat)](https://www.npmjs.com/package/use-form) [![NPM monthly downloads](https://img.shields.io/npm/dm/use-form.svg?style=flat)](https://npmjs.org/package/use-form) [![NPM total downloads](https://img.shields.io/npm/dt/use-form.svg?style=flat)](https://npmjs.org/package/use-form)

> In development

## Install

Install with [npm](https://www.npmjs.com/):
```sh
$ npm install --save use-form
```

## Usage
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

## About
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/borm/use-form/issues/new).

### License
[MIT License](LICENSE).