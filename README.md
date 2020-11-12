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
      'user.password': 'password@test.te',
      user: {
        email: 'email@test.te',
      },
      color: ['red'],
      remember: [true],
    },
    initialErrors: {
      'user.password': 'Initial error, from backend as example',
    },
    validate: values => ({
     user: {
       email: !values['user.email'] && 'email is required',
     },
     sections: !values.sections && 'sections is required',
     'user.password': !values.user?.password && 'password is required',
   }),
    onSubmit: values => {
      alert(JSON.stringify(values));
    },
  };

  return (
    <Form {...form}>
      {({ handleReset, handleSubmit, ...state }) => (
        <form
            ref={() => {
              form.current = { reset };
            }}
            onSubmit={handleSubmit}
          >
            <p>Use Form Example</p>
    
            <button type="button" onClick={() => setState(state + 1)}>
              setState {state}
            </button>
    
            <fieldset>
              <legend>Email:</legend>
              <Field
                type="text"
                name="user.email"
                component={({ input, meta: { error }, ...props }) => (
                  <>
                    <input {...input} {...props} />
                    <p className="error">{error}</p>
                  </>
                )}
                validate={value => {
                  if (value && value.length < 3) {
                    return 'Email length should be more 3 symbols';
                  }
                }}
                onFocus={event => {}}
                onBlur={event => {}}
                onChange={event => {}}
              />
            </fieldset>
            <fieldset>
              <legend>Password:</legend>
              <Field
                type="password"
                name="user.password"
                component={({ input, meta: { error }, ...props }) => (
                  <>
                    <input {...input} {...props} />
                    <p className="error">{error}</p>
                  </>
                )}
                validate={value => {
                  if (value && value.length < 3) {
                    return 'Password length should be more 3 symbols';
                  }
                }}
              />
            </fieldset>
            <fieldset>
              <legend>Color:</legend>
              <Field
                type="select"
                name="color"
                multiple
                component={({ input, meta: { error }, ...props }) => (
                  <>
                    <select {...input} {...props}>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                    </select>
                    <p className="error">{error}</p>
                  </>
                )}
                validate={value => {
                  if (value && value.length < 2) {
                    return 'You should select 2 options min';
                  }
                }}
              />
            </fieldset>
            <fieldset>
              <legend>Color 0:</legend>
              <Field
                type="text"
                name="color[0]"
                component={({ input, meta: { error } }) => (
                  <>
                    <p>{input.value}</p>
                    <p className="error">{error}</p>
                  </>
                )}
              />
            </fieldset>
            <fieldset>
              <legend>Sections:</legend>
              <Field
                type="select"
                name="sections"
                component={({ input, meta: { error }, ...props }) => (
                  <>
                    <select {...input} {...props}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                    <p className="error">{error}</p>
                  </>
                )}
              />
            </fieldset>
            <fieldset>
              <legend>Remember [0]:</legend>
              <Field
                type="checkbox"
                name="remember[0]"
                component={({ input, meta: { error }, ...props }) => (
                  <>
                    <label htmlFor="remember">
                      <input id="remember" {...input} {...props} />
                      Remember me?
                    </label>
                    <p className="error">{error}</p>
                  </>
                )}
                validate={value => {
                  if (!value) {
                    return 'Should be checked';
                  }
                }}
              />
            </fieldset>
    
            <fieldset>
              <legend>Remember [1]:</legend>
              <Field
                type="checkbox"
                name="remember[1]"
                component={({ input, meta: { error }, ...props }) => (
                  <>
                    <label htmlFor="remember1">
                      <input id="remember1" {...input} {...props} />
                      Remember me?
                    </label>
                    <p className="error">{error}</p>
                  </>
                )}
                validate={value => {
                  if (!value) {
                    return 'Should be checked';
                  }
                }}
              />
            </fieldset>
    
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
