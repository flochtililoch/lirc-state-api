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

  key () {
    return this.keys.next;
  }

  next () {
    const isLastValue = this.values.length - 1 === this.currentIndex;
    return this.setValue(this.values.at(isLastValue ? 0 : this.currentIndex + 1));
  }

}

module.exports = Loop;
