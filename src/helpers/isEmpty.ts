
/**
 * Test whether a value is "empty".
 * https://github.com/ianstormtaylor/is-empty
 * @param {any} val
 * @return {Boolean}
 */

export default function isEmpty(val: any) {
  // Null and Undefined...
  if (val == null) return true;

  // Booleans...
  if ('boolean' == typeof val) return false;

  // Numbers...
  if ('number' == typeof val) return val === 0;

  // Strings...
  if ('string' == typeof val) return val.length === 0;

  // Functions...
  if ('function' == typeof val) return val.length === 0;

  // Arrays...
  if (Array.isArray(val)) return val.length === 0;

  // Errors...
  if (val instanceof Error) return val.message === '';

  // Objects...
  if (val.toString == Object.prototype.toString) {
    switch (val.toString()) {

      // Maps, Sets, Files and Errors...
      case '[object File]':
      case '[object Map]':
      case '[object Set]': {
        return val.size === 0
      }

      // Plain objects...
      case '[object Object]': {
        for (let key in val) {
          if (Object.prototype.hasOwnProperty.call(val, key)) return false;
        }

        return true
      }
    }
  }

  // Anything else...
  return false
}