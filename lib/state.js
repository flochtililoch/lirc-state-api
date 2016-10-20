'use strict';

const
  StateMachine = require('javascript-state-machine'),
  utils = require('./utils'),
  {assert, assertString, assertObject, assertArray, assertFunction} = utils,
  {name} = require('../package'),
  debug = require('debug')(`${name}#state`),
  topairs = require('lodash.topairs');

const UNDEFINED_STATE = 'none';

class State {

  constructor (config, send, addReceiveListener) {
    assert(
      this.constructor !== State,
      '`State` is an abstract class and should not be instanciated'
    );
    assertObject(config, '`config` should be an object');
    assertString(config.id, '`config.id` should be a string with at least one character');
    assertArray(config.values, '`config.values` should be an array with at least two values', 2);
    assertObject(config.keys, '`config.keys` should be an object');
    assertFunction(send, '`send` should be a function');

    this.id = config.id;
    this.values = config.values;
    this.send = send;
    this.keys = config.keys;

    this.state = StateMachine.create({
      initial: this.initial,
      events: this.events,
      callbacks: {
        onleavestate: this.leave.bind(this),
      }
    });
    topairs(this.keys).forEach(([action, key]) => {
      addReceiveListener(key, this[action].bind(this));
    });
  }

  get dependencies () {
    return this._dependencies ? this._dependencies : [];
  }

  set dependencies (dependencies) {
    this._dependencies = dependencies;
  }

  get initial () {
    assert(false, 'not implemented');
  }

  get current () {
    assert(false, 'not implemented');
  }

  nextValue () {
    assert(false, 'not implemented');
  }

  key () {
    assert(false, 'not implemented');
  }

  action (value) {
    return `set${value}`;
  }

  leave (_, from, to) {
    if (from !== UNDEFINED_STATE) {
      const key = this.key(from, to);
      debug(`State ${this.id} leaving: ${from} for ${to}`);
      this.send(key).then(() => {
        this.state.transition();
      });
      return StateMachine.ASYNC;
    }
  }

  go (value) {
    return new Promise((resolve, reject) => {
      const go = () => {
        if (this.unmetDependencies().length) {
          const reason = `State ${this.id} cannot change, unmet dependencies.`;
          debug(reason);
          return reject(reason);
        }

        if (this.state.current === value) {
          this.onafterevent = undefined;
          debug(`State ${this.id} set to expected value: ${value}`);
          return resolve();
        }

        let action = this.action(value);
        if (!this.state.can(action)) {
          const nextValue = this.nextValue(value);
          debug(`State ${this.id} cannot go to value: ${value}. Going to ${nextValue} instead.`);
          action = this.action(nextValue);
        }

        this.state.onafterevent = () => {
          go(value);
        };

        debug(`State ${this.id} going to ${value}.`);
        this.state[action]();
      };

      go();
    });
  }

  unmetDependencies() {
    return this.dependencies.filter(dependency => !dependency.met());
  }

  serialize() {
    const {id, state} = this;
    const value = state.current;
    return {id, value};
  }

}

module.exports = State;
