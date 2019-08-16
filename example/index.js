import React from 'react';
import { render } from 'react-dom';
import { Form, Field } from '../src';
import OwnParser from '../src/helpers/parser';

const exampleObj2 = {
  'values.email': 'test@test.te',
  'values.a.b': 1,
  'values.c.d[0][0]': 1,
  'values.c.d[1]': 5,
  'values.c.d[2]': 12,
  'values.e.f[0]': 'g',
  'values.h.i[0].j': 1,
  'values.h.i[1].k': 2,
  'values.h.i[2].l': 3,
  'values.h.i[3].m[0].n[0]': 1,
  'values.h.i[3].m[0].n[1]': 2,
  'values.h.i[3].m[0].n[2]': 3,
  'values.h.i[4].o[0].p': 1,
  'values.h.i[4].o[0].r[0]': 200,
  'values.h.i[4].o[0].r[1]': 301,
  'values.h.i[4].o[0].r[2]': 403,
  'values.h.i[4].o[1].p': 2,
  'values.h.i[4].o[1].r[0]': 200,
  'values.h.i[4].o[1].r[1]': 301,
  'values.h.i[4].o[1].r[2]': 403,
};

const parser2 = new OwnParser(exampleObj2);

const UseFormExample = () => {
  const form = {
    initialValues: {
      email: 'test@test.te',
      a: { b: 1 },
      c: { d: [[1], 5, 12] },
      'e.f[0]': 'g',
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
          <pre>{JSON.stringify(parser2.parse(), 0, 2)}</pre>
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
