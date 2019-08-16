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

export default class OwnParser {
  constructor(object: SerializerObjectType) {
    this.objectToParse = object;
  }

  objectToParse: SerializerObjectType = null;

  result: ResultType = null;

  keyOriginal: string = null;

  value: ValueType = null;

  _getAction = (currentKey: string) => {
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

  _parseItem = (
    result: ResultType,
    keyCurrent: string = '',
    currentIndex: number = 0,
    status: statuses = statuses.INITIAL
  ) => {
    const currentKey = this.keyOriginal[currentIndex];
    const keyCurrentNumber: number = parseInt(keyCurrent, 10);
    const action = this._getAction(currentKey);

    const graph: {
      [key: string]: {
        [key: string]: Function;
      };
    } = {
      [statuses.INITIAL]: {
        [actions.NAME]: () => {
          if (!this.result) {
            this.result = {};
            result = this.result;
          }
          this._parseItem(
            result,
            `${keyCurrent}${currentKey}`,
            currentIndex + 1,
            statuses.OBJECT_KEY
          );
        },
        [actions.BRACE_LEFT]: () => {
          if (!this.result) {
            this.result = [];
            result = this.result;
          }

          this._parseItem(
            this.result,
            '',
            currentIndex + 1,
            statuses.ARRAY_INDEX
          );
        },
      },
      [statuses.OBJECT_KEY]: {
        [actions.DOT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            (result as ResultObjectType)[keyCurrent] = {};
          }

          this._parseItem(
            (result as ResultObjectType)[keyCurrent] as ResultType,
            '',
            currentIndex + 1,
            statuses.INITIAL
          );
        },
        [actions.BRACE_LEFT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            (result as ResultObjectType)[keyCurrent] = [];
          }

          this._parseItem(
            (result as ResultObjectType)[keyCurrent] as ResultType,
            '',
            currentIndex + 1,
            statuses.ARRAY_INDEX
          );
        },
        [actions.FINISH]: () => {
          (result as ResultObjectType)[keyCurrent] = this.value;
        },
        [actions.NAME]: () => {
          this._parseItem(
            result,
            `${keyCurrent}${currentKey}`,
            currentIndex + 1,
            statuses.OBJECT_KEY
          );
        },
      },
      [statuses.ARRAY_INDEX]: {
        [actions.INDEX]: () => {
          this._parseItem(
            result,
            `${keyCurrent}${currentKey}`,
            currentIndex + 1,
            statuses.ARRAY_INDEX
          );
        },
        [actions.BRACE_RIGHT]: () => {
          this._parseItem(
            result,
            keyCurrent,
            currentIndex + 1,
            statuses.ARRAY_INDEX_END
          );
        },
      },
      [statuses.ARRAY_INDEX_END]: {
        [actions.BRACE_LEFT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            (result as ResultArrayType)[keyCurrentNumber] = [];
          }

          this._parseItem(
            (result as ResultArrayType)[keyCurrentNumber] as ResultType,
            '',
            currentIndex + 1,
            statuses.ARRAY_INDEX
          );
        },
        [actions.FINISH]: () => {
          (result as ResultArrayType)[keyCurrentNumber] = this.value;
        },
        [actions.DOT]: () => {
          if (!result.hasOwnProperty(keyCurrent)) {
            (result as ResultObjectType)[keyCurrent] = {};
          }

          this._parseItem(
            (result as ResultObjectType)[keyCurrent] as ResultType,
            '',
            currentIndex + 1,
            statuses.INITIAL
          );
        },
      },
    };

    graph[status][action]();
  };

  parse() {
    Object.keys(this.objectToParse).forEach(key => {
      this.keyOriginal = key;
      this.value = this.objectToParse[key];
      this._parseItem(this.result);
    });

    return this.result;
  }
}
