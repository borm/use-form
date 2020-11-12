const typeOf = (operand: any) => ({
  is: (...types: string[]) =>
    types.includes(
      Object.prototype.toString
        .call(operand)
        .slice(8, -1)
        .toLowerCase()
    ),
});

export function isArray(array: any) {
  return typeOf(array).is('array');
}

export function isObject(object: any) {
  return typeOf(object).is('object');
}

export default typeOf;
