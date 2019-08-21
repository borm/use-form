import React, { Fragment, useState } from 'react';
import { render } from 'react-dom';
import { Form, Field } from '../src';

const UseFormExample = () => {
  const [state, setState] = useState(0);

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
      {({ handleReset, handleSubmit, errors, values }) => (
        <form onSubmit={handleSubmit}>
          <p>Use Form Example</p>

          <button type="button" onClick={() => setState(state + 1)}>
            setState {state}
          </button>

          <fieldset>
            <legend>Email:</legend>
            <Field
              type="text"
              name="email"
              component={({ error, ...props }) => (
                <Fragment>
                  <input {...props} />
                  <p className="error">{error}</p>
                </Fragment>
              )}
              validate={value => {
                if (value && value.length < 3) {
                  return 'Email length should be more 3 symbols';
                }
              }}
              onFocus={event => {
                // onFocus
              }}
              onBlur={event => {
                // onBlur
              }}
              onChange={event => {
                // onChange
              }}
            />
          </fieldset>
          <fieldset>
            <legend>Password:</legend>
            <Field
              type="password"
              name="password"
              component={({ error, ...props }) => (
                <Fragment>
                  <input {...props} />
                  <p className="error">{error}</p>
                </Fragment>
              )}
              validate={value => {
                if (value && value.length < 3) {
                  return 'Password length should be more 3 symbols';
                }
              }}
              onFocus={event => {
                // onFocus
              }}
              onBlur={event => {
                // onBlur
              }}
              onChange={event => {
                // onChange
              }}
            />
          </fieldset>
          <fieldset>
            <legend>Color:</legend>
            <Field
              type="select"
              name="color"
              multiple
              component={({ error, ...props }) => (
                <Fragment>
                  <select {...props}>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                  <p className="error">{error}</p>
                </Fragment>
              )}
              validate={value => {
                if (value && value.length < 2) {
                  return 'You should select 2 options min';
                }
              }}
              onChange={event => {
                // onChange
              }}
            />
          </fieldset>
          <fieldset>
            <legend>Remember:</legend>
            <Field
              type="checkbox"
              name="remember"
              component={({ error, ...props }) => (
                <Fragment>
                  <label htmlFor="remember">
                    <input id="remember" {...props} />
                    Remember me?
                  </label>
                  <p className="error">{error}</p>
                </Fragment>
              )}
              validate={value => {
                if (!value) {
                  return 'Should be checked';
                }
              }}
              onFocus={event => {
                // onFocus
              }}
              onBlur={event => {
                // onBlur
              }}
              onChange={event => {
                // onChange
              }}
            />
          </fieldset>

          <input type="reset" onClick={handleReset} />
          <input type="submit" />

          <pre>{JSON.stringify({ errors, values }, 0, 2)}</pre>
        </form>
      )}
    </Form>
  );
};

render(<UseFormExample />, document.getElementById('app'));
