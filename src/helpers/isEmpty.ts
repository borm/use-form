/**
 * isEmpty
 * @param {any} val
 * @return {Boolean}
 */

export default function isEmpty(val: any) {
  // Undefined...
  if ('undefined' === typeof val) return true;

  // Strings...
  if ('string' == typeof val) return val.length === 0;

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