export default function typeOf(operand: any) {
  return Object.prototype.toString.call(operand).slice(8, -1).toLowerCase();
}

export function isArray(array: any) {
  return typeOf(array) === 'array';
}

export function isObject(object: any) {
  return typeOf(object) === 'object';
}
