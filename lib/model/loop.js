'use strict';

const Linear = require('./linear');

class Loop extends Linear {

  get events () {
    let from = this.values.slice(0, this.values.length - 1);
    from.unshift(this.values.at(this.values.length - 1));

    return this.values.map((value, index) => {
      return {
        name: this.action(value.id),
        from: from[index].id,
        to: value.id,
      };
    });
  }

  direction () {
    return 1;
  }

  get initial () {
    return this.values.at(0).id;
  }

  key () {
    return this.keys.next;
  }

  next() {
    const isLastValue = this.values.length - 1 === this.currentIndex;
    const value = this.values.at(isLastValue ? 0 : this.currentIndex + 1);
    if (!value) {
      return Promise.reject('No value');
    }
    return this.setValue(value.value);
  }

}

module.exports = Loop;
