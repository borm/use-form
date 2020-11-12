import React, { useRef, useState } from 'react';
import { render } from 'react-dom';
import { Form, Field } from '../src';

const UseFormExample = () => {
  const [state, setState] = useState(0);
  const form = useRef({});

  const handleReset = () => {
    form.current.reset({ values: {}, errors: { email: 'Required!' } });
  };

  return (
    <Form
      {...{
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
        validate: values => {
          // console.log(values);
          return {
            user: {
              email: !values['user.email'] && 'email is required',
              // password: !values.user?.password && 'password is required',
            },
            // 'user.email': !values['user.email'] && 'email is required',
            sections: !values.sections && 'sections is required',
            'user.password': !values.user?.password && 'password is required',
          };
        },
        onSubmit: values => {
          alert(JSON.stringify(values));
        },
      }}
    >
      {({ handleReset: reset, handleSubmit, ...props }) => {
        return (
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

            <pre>
              {JSON.stringify(
                {
                  values: props.values,
                  errors: props.errors,
                  touched: props.touched,
                },
                0,
                2
              )}
            </pre>
          </form>
        );
      }}
    </Form>
  );
};

render(<UseFormExample />, document.getElementById('app'));
