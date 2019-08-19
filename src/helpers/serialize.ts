type ValueType = string | boolean | number | null;

type SerializerObjectType = {
  [key: string]: ValueType;
};

type ResultArrayType =
  | Array<ResultObjectType | ValueType>
  | Array<Array<ResultObjectType | ValueType>>;

interface ResultObjectType {
  [key: string]: ValueType | ResultObjectType | ResultArrayType;
}

type ResultType = ResultObjectType | ResultArrayType;

enum statuses {
  INITIAL,
  OBJECT_KEY,
  ARRAY_INDEX,
  ARRAY_INDEX_END,
}

enum actions {
  DOT,
  BRACE_LEFT,
  BRACE_RIGHT,
  INDEX,
  NAME,
  FINISH,
}

const getAction = (currentKey: string) => {
  if (currentKey === '.') {
    return actions.DOT;
  }

  if (currentKey === '[') {
    return actions.BRACE_LEFT;
  }

  if (currentKey === ']') {
    return actions.BRACE_RIGHT;
  }

  if (/^\d+$/.test(currentKey)) {
    return actions.INDEX;
  }

  if (typeof currentKey === 'undefined') {
    return actions.FINISH;
  }

  if (
    /^[a-zA-Z0-9]+$/.test(currentKey) &&
    typeof currentKey !== 'undefined'
  ) {
    return actions.NAME;
  }
};

class Serializer {
  private readonly objectToParse: SerializerObjectType = null;

  private result: ResultType = null;

  private keyOriginal: string = null;

  private value: ValueType = null;

  constructor(object: SerializerObjectType) {
    this.objectToParse = object;
  }

  public parse() {
    Object.keys(this.objectToParse).forEach((key) => {
      this.keyOriginal = key;
      this.value = this.objectToParse[key];
      this.parseItem(this.result);
    });

    return this.result || {};
  }

  private parseItem = (
    result: ResultType,
    keyCurrent: string = '',
    currentIndex: number = 0,
    status: statuses = statuses.INITIAL,
  ) => {
    const currentKey = this.keyOriginal[currentIndex];
    const keyCurrentNumber: number = parseInt(keyCurrent, 10);
    const action = getAction(currentKey);

    const graph: {
      [key: string]: {
        [key: string]: () => void;
      };
    } = {
      [statuses.INITIAL]: {
        [actions.NAME]: () => {
          if (!this.result) {
            this.result = {};
            result = this.result;
          }
          this.parseItem(
            result,
            `${keyCurrent}${currentKey}`,
            currentIndex + 1,
            statuses.OBJECT_KEY,
          );
        },
        [actions.BRACE_LEFT]: () => {
          if (!this.result) {
            this.result = [];
            result = this.result;
          }

          this.parseItem(
            this.result,
            '',
            currentIndex + 1,
            statuses.ARRAY_INDEX,
          );
        },
      },
      [statuses.OBJECT_KEY]: {
        [actions.DOT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            (result as ResultObjectType)[keyCurrent] = {};
          }

          this.parseItem(
            (result as ResultObjectType)[keyCurrent] as ResultType,
            '',
            currentIndex + 1,
            statuses.INITIAL,
          );
        },
        [actions.BRACE_LEFT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            (result as ResultObjectType)[keyCurrent] = [];
          }

          this.parseItem(
            (result as ResultObjectType)[keyCurrent] as ResultType,
            '',
            currentIndex + 1,
            statuses.ARRAY_INDEX,
          );
        },
        [actions.FINISH]: () => {
          (result as ResultObjectType)[keyCurrent] = this.value;
        },
        [actions.NAME]: () => {
          this.parseItem(
            result,
            `${keyCurrent}${currentKey}`,
            currentIndex + 1,
            statuses.OBJECT_KEY,
          );
        },
      },
      [statuses.ARRAY_INDEX]: {
        [actions.INDEX]: () => {
          this.parseItem(
            result,
            `${keyCurrent}${currentKey}`,
            currentIndex + 1,
            statuses.ARRAY_INDEX,
          );
        },
        [actions.BRACE_RIGHT]: () => {
          this.parseItem(
            result,
            keyCurrent,
            currentIndex + 1,
            statuses.ARRAY_INDEX_END,
          );
        },
      },
      [statuses.ARRAY_INDEX_END]: {
        [actions.BRACE_LEFT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            (result as ResultArrayType)[keyCurrentNumber] = [];
          }

          this.parseItem(
            (result as ResultArrayType)[keyCurrentNumber] as ResultType,
            '',
            currentIndex + 1,
            statuses.ARRAY_INDEX,
          );
        },
        [actions.FINISH]: () => {
          (result as ResultArrayType)[keyCurrentNumber] = this.value;
        },
        [actions.DOT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            (result as ResultObjectType)[keyCurrent] = {};
          }

          this.parseItem(
            (result as ResultObjectType)[keyCurrent] as ResultType,
            '',
            currentIndex + 1,
            statuses.INITIAL,
          );
        },
      },
    };

    graph[status][action]();
  }
}

export default function serialize(object: SerializerObjectType = null) {
  const serializer = new Serializer(object);
  return serializer.parse();
}
