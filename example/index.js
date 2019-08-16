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
    <React.Fragment>
      <select
        onChange={() => {
          console.log(1);
        }}
        onFocus={() => {
          console.log(2);
        }}
        onBlur={() => {
          console.log(3);
        }}
        multiple
      >
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>

      <Form {...form}>
        {({ handleSubmit, ...state }) => (
          <form onSubmit={handleSubmit}>
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
              onFocus={() => {
                console.log('onFocus');
              }}
              onBlur={() => {
                console.log('onBlur');
              }}
              onChange={event => {
                console.log(event);
                console.log('changed');
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
              onFocus={() => {
                console.log('onFocus');
              }}
              onBlur={() => {
                console.log('onBlur');
              }}
              onChange={event => {
                console.log(event);
                console.log('changed');
              }}
            />

            <Field
              type="select"
              name="color"
              multiple
              component={({ error, ...props }) => (
                <div>
                  <select {...props}>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                  {error}
                </div>
              )}
              validate={value => {
                if (value && value.length < 2) {
                  return 'You should select 2 options min';
                }
              }}
              onChange={event => {
                console.log(event);
                console.log('changed');
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
              onFocus={() => {
                console.log('onFocus');
              }}
              onBlur={() => {
                console.log('onBlur');
              }}
              onChange={event => {
                console.log(event);
                console.log('changed');
              }}
            />

            <input type="submit" />

            <pre>{JSON.stringify(state, 0, 2)}</pre>
          </form>
        )}
      </Form>
    </React.Fragment>
  );
};

render(<UseFormExample />, document.getElementById('app'));
