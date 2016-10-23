'use strict';

const chai = require('chai'),
      Loop = require('./loop'),
      Linear = require('./linear');

      let state;

describe('Loop', () => {

  before(() => {
    const config = {
      id: 'foo',
      values: ['foo', 'bar', 'baz'],
      keys: {}
    };
    const send = () => {
      return new Promise(function(){});
    };
    state = new Loop(config, send);
  });

  describe('#constructor', () => {

    it('extends `Linear`', () => {
      chai.expect(state instanceof Linear).to.be.true;
    });

  });

  describe('events', () => {

    it('has the expected structure', () => {
      const events = [
        {name: 'setfoo', from: 'baz', to: 'foo'},
        {name: 'setbar', from: 'foo', to: 'bar'},
        {name: 'setbaz', from: 'bar', to: 'baz'},
      ];
      chai.expect(state.events).to.deep.equal(events);
    });

  });

});
