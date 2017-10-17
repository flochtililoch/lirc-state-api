'use strict';

const State = require('./state'),
      {assert} = require('../utils/assert');

class Linear extends State {

  get events () {
    let from1 = this.values.slice(0, this.values.length - 1);
    from1.unshift(undefined);
    let from2 = this.values.slice(1, this.values.length);
    from2.push(undefined);

    let from = this.values.map((value, index) => {
      if (from1[index] === undefined) {
        return from2[index].id;
      }

      if (from2[index] === undefined) {
        return from1[index].id;
      }

      return [from1[index].id, from2[index].id];
    });

    return this.values.map((value, index) => {
      return {
        name: this.action(value.id),
        from: from[index],
        to: value.id,
      };
    });
  }

  get initial () {
    return this.values.at(0).id;
  }

  get currentIndex () {
    return this.indexOf(this.current);
  }

  indexOf (value) {
    return this.values.indexOf(value);
  }

  direction (toIndex) {
    const diff = toIndex - this.currentIndex;
    return diff / Math.abs(diff);
  }

  next (value) {
    const index = this.indexOf(value);
    assert(index >= 0, `value ${value} does not exist in this state.`);
    const nextIndex = this.currentIndex + this.direction(index);
    return this.values.at(nextIndex);
  }

  key (from, to) {
    return this.keys[parseInt(from, 10) > parseInt(to, 10) ? 'down' : 'up'];
  }

  up () {
    const value = this.values.at(this.currentIndex + 1);
    if (!value) {
      return Promise.reject('Maximum value reached');
    }
    return this.setValue(value.value);
  }

  down () {
    const value = this.values.at(this.currentIndex - 1);
    if (!value) {
      return Promise.reject('Minimum value reached');
    }
    return this.setValue(value.value);
  }

}

module.exports = Linear;
