import { isObject, isArray } from './typeOf';

const { keys } = Object;
export default function deserialize(obj: object) {
  function recur(accumulator: object, key: string, value: any) {
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

    // TODO
    // eslint-disable-next-line no-param-reassign
    // @ts-ignore
    accumulator[key] = value;
    return accumulator;
  }

  return keys(obj).reduce(
    (accumulator, key) => ({
      ...accumulator,
      // TODO
      // @ts-ignore
      ...recur(accumulator, key, obj[key]),
    }),
    {}
  );
}
