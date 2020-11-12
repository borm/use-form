import typeOf from './typeOf';

export default function get(
  obj: { [key: string]: any },
  path: string,
  defaultValue?: any
) {
  return (
    path
      .match(/([^[.\]])+/g)
      .reduce(
        (acc, key) =>
          typeOf(acc).is('array', 'object') ? acc[key] : undefined,
        obj
      ) || defaultValue
  );
}
