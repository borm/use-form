# use-form 

```In development```

[![NPM version](https://img.shields.io/npm/v/use-form.svg?style=flat)](https://www.npmjs.com/package/use-form)
[![GitHub code size](https://img.shields.io/github/languages/code-size/borm/use-form)](https://github.com/borm/use-form)
[![GitHub repo size](https://img.shields.io/github/repo-size/borm/use-form)](https://github.com/borm/use-form)

## Install

Install with [npm](https://www.npmjs.com/):

[![NPM monthly downloads](https://img.shields.io/npm/dm/use-form.svg?style=flat)](https://npmjs.org/package/use-form)
[![NPM total downloads](https://img.shields.io/npm/dt/use-form.svg?style=flat)](https://npmjs.org/package/use-form)
```sh
$ npm install --save use-form
```

## Usage
[![NPM Peer Dependencies](https://img.shields.io/npm/dependency-version/use-form/peer/react)](https://www.npmjs.com/package/react/v/16.9.0)
[![NPM Peer Dependencies](https://img.shields.io/npm/dependency-version/use-form/peer/react-dom)](https://www.npmjs.com/package/react-dom/v/16.9.0)

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
      {({ handleReset, handleSubmit, ...state }) => (
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
          <input type="reset" onClick={handleReset} />
          <input type="submit" />
        </form>
      )}
    </Form>
  );
};

render(<UseFormExample />, document.getElementById('app'));

```

## About
Pull requests, stars, bugs and feature requests:

[![GitHub pull requests](https://img.shields.io/github/issues-pr/borm/use-form)](https://github.com/borm/use-form/pulls)
![GitHub stars](https://img.shields.io/github/stars/borm/use-form)
[![GitHub issues](https://img.shields.io/github/issues/borm/use-form?label=create%20an%20issue)](https://github.com/borm/use-form/issues/new)

##License
[![GitHub license](https://img.shields.io/github/license/borm/use-form?style=flat)](https://github.com/borm/use-form/blob/master/LICENSE)
