'use strict';

class Value {

  constructor (rawValue) {
    this.id = String(rawValue);
    this.value = rawValue;
  }

}

module.exports = Value;
