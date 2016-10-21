'use strict';

const State = require('./state'),
      {assert} = require('./utils');

class Linear extends State {

  get events () {
    let from1 = this.values.slice(0, this.values.length - 1);
    from1.unshift(undefined);
    let from2 = this.values.slice(1, this.values.length);
    from2.push(undefined);

    let from = this.values.map((value, index) => {
      if (from1[index] === undefined) {
        return from2[index];
      }

      if (from2[index] === undefined) {
        return from1[index];
      }

      return [from1[index], from2[index]];
    });

    return this.values.map((value, index) => {
      return {
        name: this.action(value),
        from: from[index],
        to: value,
      };
    });
  }

  get initial () {
    return this.values[0].toString();
  }

  get currentIndex () {
    return this.indexOf(this.state.current);
  }

  get current () {
    return this.state.current;
  }

  indexOf (value) {
    return this.values.indexOf(value);
  }

  direction (toIndex) {
    const diff = toIndex - this.currentIndex;
    return diff / Math.abs(diff);
  }

  nextValue (value) {
    const index = this.indexOf(value);
    assert(index >= 0, `value ${value} does not exist in this state.`);
    const nextIndex = this.currentIndex + this.direction(index);
    return this.values[nextIndex];
  }

  key (from, to) {
    return this.keys[parseInt(from, 10) > parseInt(to, 10) ? 'down' : 'up'];
  }

  up () {
    this.setValue(this.values[this.currentIndex + 1]);
  }

  down () {
    this.setValue(this.values[this.currentIndex - 1]);
  }

}

module.exports = Linear;
