'use strict';

class Value {

  constructor (rawValue) {
    this.id = Value.idFromRawValue(rawValue);
    this.value = rawValue;
  }

  static idFromRawValue (rawValue) {
    return String(rawValue);
  }

}

module.exports = Value;
