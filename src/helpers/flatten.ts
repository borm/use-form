function typeOf(operand: any) {
  return Object.prototype.toString.call(operand).slice(8, -1).toLowerCase();
}

function isArray(array: any) {
  return typeOf(array) === 'array';
}

function isObject(object: any) {
  return typeOf(object) === 'object';
}

const { keys } = Object;
export default function flatten(obj: {
  [key: string]: any;
}): { [key: string]: any } {
  if (!isObject(obj)) {
    throw new Error();
  }
  function recur(
    accumulator: { [key: string]: any },
    key: string,
    value: any,
  ): { [key: string]: any } {
    if (isObject(value)) {
      const objKeys = keys(value);
      if (objKeys.length) {
        objKeys.forEach((v) => {
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
    {},
  );
}
