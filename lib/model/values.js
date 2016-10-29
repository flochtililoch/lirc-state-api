'use strict';

const Value = require('./value');

class Values {

  constructor (rawValues) {
    this.values = rawValues.map(value => new Value(value));
  }

  get length () {
    return this.values.length;
  }

  ids () {
    return this.values.map(value => value.id);
  }

  getValue (id) {
    return this.values.filter (value => {
      return value.id === id;
    })[0];
  }

  indexOf (value) {
    return this.values.indexOf(this.getValue(Value.idFromRawValue(value)));
  }

  at (index) {
    return this.values[index];
  }

  map (fn) {
    return this.values.map(fn);
  }

  slice (begin, end) {
    return this.values.slice(begin, end);
  }

}

module.exports = Values;
