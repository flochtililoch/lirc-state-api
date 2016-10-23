'use strict';

class Dependency {

  constructor (state, values) {
    this.state = state;
    this.values = values;
  }

  met () {
    return this.values.indexOf(this.state.current) >= 0;
  }

  serialize() {
    return {
      state: this.state.serialize(),
      values: this.values
    };
  }

}

module.exports = Dependency;
