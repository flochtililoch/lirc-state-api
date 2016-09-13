'use strict';

const State = require('../../lib/state');

class MyState extends State {

  get initial () {
    return this.values[0];
  }

}

module.exports = MyState;