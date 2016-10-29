'use strict';

const mocksPath = '../../test/mocks';

const chai = require('chai'),
      sinon = require('sinon'),
      proxyquire = require('proxyquire'),
      StateMachine = require('javascript-state-machine'),
      Values = require(`${mocksPath}/values`);

const State = proxyquire('./state', {'./values': Values}),
      MyState = proxyquire(`${mocksPath}/my_state`, {'../../lib/model/state': State});

let state, config, expectedEvents, spy, send, statemachineInstance;

describe('State', () => {

  afterEach(() => {
    sinon.sandbox.restore();
  });

  describe('#constructor', () => {

    describe('when not extended', () => {
      it('throws an error', () => {
        chai.expect(() => {
          new State();
        }).to.throw('`State` is an abstract class and should not be instanciated');
      });
    });

    describe('when extended', () => {

      describe('with invalid parameters', () => {

        it('throws an error when config is undefined or null', () => {
          chai.expect(() => {
            state = new MyState();
          }).to.throw('`config` should be an object');
          chai.expect(() => {
            state = new MyState(null);
          }).to.throw('`config` should be an object');
        });

        it('throws an error when `config.id` is undefined or null', () => {
          chai.expect(() => {
            state = new MyState({});
          }).to.throw('`config.id` should be a string with at least one character');
          chai.expect(() => {
            state = new MyState({id: null});
          }).to.throw('`config.id` should be a string with at least one character');
        });

        it('throws an error when `config.id` is empty string', () => {
          chai.expect(() => {
            state = new MyState({id: ''});
          }).to.throw('`config.id` should be a string with at least one character');
        });

        it('throws an error when `config.values` is invalid', () => {
          chai.expect(() => {
            state = new MyState({id: 'foo'});
          }).to.throw('`config.values` should be an array with at least two values');

          chai.expect(() => {
            state = new MyState({id: 'foo', values: null});
          }).to.throw('`config.values` should be an array with at least two values');

          chai.expect(() => {
            state = new MyState({id: 'foo', values: []});
          }).to.throw('`config.values` should be an array with at least two values');

          chai.expect(() => {
            state = new MyState({id: 'foo', values: ['foo']});
          }).to.throw('`config.values` should be an array with at least two values');
        });

        it('throws an error when `config.keys` is invalid', () => {
          chai.expect(() => {
            state = new MyState({id: 'foo', values: ['foo', 'bar']});
          }).to.throw('`config.keys` should be an object');

          chai.expect(() => {
            state = new MyState({id: 'foo', values: ['foo', 'bar'], keys: null});
          }).to.throw('`config.keys` should be an object');

        });

        it('throws an error when `send` is invalid', () => {
          chai.expect(() => {
            state = new MyState({id: 'foo', values: ['foo', 'bar'], keys: {}});
          }).to.throw('`send` should be a function');

          chai.expect(() => {
            state = new MyState({id: 'foo', values: ['foo', 'bar'], keys: {}, send: null});
          }).to.throw('`send` should be a function');

        });

      });

      describe('with valid parameters', () => {

        before(() => {
          config = {
            id: 'foo',
            values: ['foo', 'bar', 'baz'],
            keys: {}
          };
          expectedEvents = [
            {name: 'setfoo', from: 'bar', to: 'foo'},
            {name: 'setbar', from: ['foo', 'baz'], to: 'bar'},
            {name: 'setbaz', from: 'bar', to: 'baz'}
          ];
          send = function() {};
          statemachineInstance = function() {};
          spy = sinon.sandbox.stub(StateMachine, 'create', () => {
            return statemachineInstance;
          });
          state = new MyState(config, send);
        });

        it('stores `id` as an instance property', () => {
          chai.expect(state.id).to.equal(config.id);
        });

        it('keeps a reference to a `Values` object, instanciated with `config.values`', () => {
          chai.expect(state.values).to.be.instanceof(Values);
          chai.expect(state.values.values).to.deep.equal(config.values);
        });

        it('creates an instance of StateMachine with the correct parameters', () => {
          chai.expect(spy.calledOnce).to.be.true;
          chai.expect(spy.calledWith({
            initial: config.values[0],
            events: expectedEvents
          }));
          chai.expect(state.fsm).to.equal(statemachineInstance);
        });

      });

    });

  });

});
