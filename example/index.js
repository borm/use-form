import React from 'react';
import { render } from 'react-dom';
import { Form, Field } from '../src';

class OwnParser {
  constructor(object) {
    this.objectToParse = object;
  }

  static statuses = {
    INITIAL: 'INITIAL',
    OBJECT_KEY: 'OBJECT_KEY',
    ARRAY_INDEX: 'ARRAY_INDEX',
    ARRAY_INDEX_END: 'ARRAY_INDEX_END',
  };

  static actions = {
    DOT: 'DOT',
    BRACE_LEFT: 'BRACE_LEFT',
    BRACE_RIGHT: 'BRACE_RIGHT',
    INDEX: 'INDEX',
    NAME: 'NAME',
    FINISH: 'FINISH',
  };

  objectToParse = null;

  result = null;

  keyOriginal = null;

  value = null;

  _getAction = currentKey => {
    if (currentKey === '.') {
      return OwnParser.actions.DOT;
    }

    if (currentKey === '[') {
      return OwnParser.actions.BRACE_LEFT;
    }

    if (currentKey === ']') {
      return OwnParser.actions.BRACE_RIGHT;
    }

    if (/^\d+$/.test(currentKey)) {
      return OwnParser.actions.INDEX;
    }

    if (typeof currentKey === 'undefined') {
      return OwnParser.actions.FINISH;
    }

    if (/^[a-zA-Z]+$/.test(currentKey) && typeof currentKey !== 'undefined') {
      return OwnParser.actions.NAME;
    }
  };

  _parseItem = (result, keyCurrent = '', currentIndex = 0, status = OwnParser.statuses.INITIAL) => {
    const currentKey = this.keyOriginal[currentIndex];
    const action = this._getAction(currentKey);

    const graph = {
      [OwnParser.statuses.INITIAL]: {
        [OwnParser.actions.NAME]: () => {
          if (!this.result) {
            this.result = {};
            result = this.result;
          }
          this._parseItem(result, `${keyCurrent}${currentKey}`, currentIndex + 1, OwnParser.statuses.OBJECT_KEY);
        },
        [OwnParser.actions.BRACE_LEFT]: () => {
          if (!this.result) {
            this.result = [];
            result = this.result;
          }

          this._parseItem(this.result, '', currentIndex + 1, OwnParser.statuses.ARRAY_INDEX);
        },
      },
      [OwnParser.statuses.OBJECT_KEY]: {
        [OwnParser.actions.DOT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            result[keyCurrent] = {};
          }

          this._parseItem(result[keyCurrent], '', currentIndex + 1, OwnParser.statuses.INITIAL);
        },
        [OwnParser.actions.BRACE_LEFT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            result[keyCurrent] = [];
          }

          this._parseItem(result[keyCurrent], '', currentIndex + 1, OwnParser.statuses.ARRAY_INDEX);
        },
        [OwnParser.actions.FINISH]: () => {
          result[keyCurrent] = this.value;
        },
        [OwnParser.actions.NAME]: () => {
          this._parseItem(result, `${keyCurrent}${currentKey}`, currentIndex + 1, OwnParser.statuses.OBJECT_KEY);
        },
      },
      [OwnParser.statuses.ARRAY_INDEX]: {
        [OwnParser.actions.INDEX]: () => {
          this._parseItem(result, `${keyCurrent}${currentKey}`, currentIndex + 1, OwnParser.statuses.ARRAY_INDEX);
        },
        [OwnParser.actions.BRACE_RIGHT]: () => {
          this._parseItem(result, keyCurrent, currentIndex + 1, OwnParser.statuses.ARRAY_INDEX_END);
        },
      },
      [OwnParser.statuses.ARRAY_INDEX_END]: {
        [OwnParser.actions.BRACE_LEFT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            result[keyCurrent] = [];
          }

          this._parseItem(result[keyCurrent], '', currentIndex + 1, OwnParser.statuses.ARRAY_INDEX);
        },
        [OwnParser.actions.FINISH]: () => {
          result[keyCurrent] = this.value;
        },
        [OwnParser.actions.DOT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            result[keyCurrent] = {};
          }

          this._parseItem(result[keyCurrent], '', currentIndex + 1, OwnParser.statuses.INITIAL);
        },
      },
    };

    graph[status][action]();
  };

  parse = () => {
    Object.keys(this.objectToParse).forEach(key => {
      this.keyOriginal = key;
      this.value = this.objectToParse[key];
      this._parseItem(this.result);
    });

    return this.result;
  };
}

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
console.log(JSON.stringify(parser2.parse()));


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
            {JSON.stringify(parser2.parse(), 0, 2)}
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
