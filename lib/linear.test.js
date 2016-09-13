'use strict';

const chai = require('chai'),
      Linear = require('./linear');

let state;

describe('Linear', () => {

  before(() => {
    const config = {
      id: 'foo',
      values: ['foo', 'bar', 'baz'],
      keys: {}
    };
    const send = () => {
      return new Promise(function(){});
    };
    state = new Linear(config, send);
  });

  describe('events', () => {

    it('has the expected structure', () => {
      const events = [
        {name: 'setfoo', from: 'bar', to: 'foo'},
        {name: 'setbar', from: ['foo', 'baz'], to: 'bar'},
        {name: 'setbaz', from: 'bar', to: 'baz'}
      ];
      chai.expect(state.events).to.deep.equal(events);
    });

  });

});
