import { isObject, isArray } from './typeOf';

const { keys } = Object;
export default function deserialize(obj: {
  [key: string]: any;
}): { [key: string]: any } {
  function recur(
    accumulator: { [key: string]: any },
    key: string,
    value: any
  ): { [key: string]: any } {
    if (isObject(value)) {
      const objKeys = keys(value);
      if (objKeys.length) {
        objKeys.forEach(v => {
          recur(accumulator, `${key}.${v}`, value[v]);
        });
        return accumulator;
      }
    }

    if (isArray(value)) {
      if (value.length) {
        value.forEach((v: any, i: number) => {
          recur(accumulator, `${key}[${i}]`, v);
        });
        return accumulator;
      }
    }

    accumulator[key] = value;
    return accumulator;
  }

  return keys(obj).reduce(
    (accumulator, key) => ({
      ...accumulator,
      ...recur(accumulator, key, obj[key]),
    }),
    {}
  );
}
