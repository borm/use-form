type ValueType = any;

type SerializerObjectType = {
  [key: string]: ValueType;
};

type ResultArrayType =
  | Array<ResultObjectType | ValueType>
  | Array<Array<ResultObjectType | ValueType>>;

interface ResultObjectType {
  [key: string]: ValueType | ResultObjectType | ResultArrayType;
}

export default function nested(object: SerializerObjectType = null): ResultObjectType {
  if (Object(object) !== object || Array.isArray(object)) {
    return object;
  }
  const regex = /\.?([^.\[\]]+)|\[(\d+)\]/g;
  const result: ResultObjectType = {};
  // tslint:disable-next-line:forin
  for (const p in object) {
    let cur = result;
    let prop = '';
    let m;
    // tslint:disable-next-line:no-conditional-assignment
    while (m = regex.exec(p)) {
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
      prop = m[2] || m[1];
    }
    cur[prop] = object[p];
  }
  return result[''] || result;
}
