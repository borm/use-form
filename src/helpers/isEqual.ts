// Compare two items
const compare = (a: object, b: object): boolean => {
  // Get the object type
  const itemType = Object.prototype.toString.call(a);

  // If an object or array, compare recursively
  if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
    if (!isEqual(a, b)) {
      return false;
    }
  } else {
    // If the two items are not the same type, return false
    if (itemType !== Object.prototype.toString.call(b)) {
      return false;
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (itemType === '[object Function]') {
      if (a.toString() !== b.toString()) {
        return false;
      }
    } else {
      if (a !== b) {
        return false;
      }
    }
  }
};

const isEqual = (value: any, other: any) => {
  // Get the value type
  const type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) {
    return false;
  }

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
    return false;
  }

  // Compare the length of the length of the two items
  const valueLen =
    type === '[object Array]' ? value.length : Object.keys(value).length;
  const otherLen =
    type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) {
    return false;
  }

  // Compare properties
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) {
        return false;
      }
    }
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) {
          return false;
        }
      }
    }
  }

  // If nothing failed, return true
  return true;
};

export default isEqual;
