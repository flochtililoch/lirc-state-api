'use strict';

const Linear = require('./linear');

class Loop extends Linear {

  get events () {
    let from = this.values.slice(0, this.values.length - 1);
    from.unshift(this.values[this.values.length - 1]);

    return this.values.map((value, index) => {
      return {
        name: this.action(value),
        from: from[index],
        to: value,
      };
    });
  }

  direction () {
    return 1;
  }

  key () {
    return this.keys.next;
  }

  next () {
    const isLastValue = this.values.length - 1 === this.currentIndex;
    this.setValue(this.values[isLastValue ? 0 : this.currentIndex + 1]);
  }

}

module.exports = Loop;
