'use strict';

const State = require('../../lib/model/state');

class MyState extends State {

  get initial () {
    return this.values[0];
  }

}

module.exports = MyState;
