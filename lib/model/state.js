'use strict';

const
  StateMachine = require('javascript-state-machine'),
  topairs = require('lodash.topairs'),
  {assert, assertString, assertObject, assertArray, assertFunction} = require('../utils/assert'),
  {name} = require('../../package'),
  debug = require('debug')(`${name}#state`),
  Values = require('./values');


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
    this.values = new Values(config.values);
    this.send = send;
    this.sendFor = config.send_for || null;
    this.keys = config.keys;

    this.fsm = StateMachine.create({
      initial: this.initial,
      events: this.events,
      callbacks: {
        onleavestate: this.leave.bind(this),
      }
    });
    topairs(this.keys).forEach(([action, key]) => {
      addReceiveListener(key, () => {
        this.receiving = true;
        this[action]().then(() => {
          this.receiving = false;
        }).catch(debug);
      });
    });
  }

  get dependencies () {
    return this._dependencies ? this._dependencies : [];
  }

  set dependencies (dependencies) {
    this._dependencies = dependencies;
  }

  get current () {
    return this.values.getValue(this.fsm.current).value;
  }

  get initial () {
    assert(false, 'not implemented');
  }

  next () {
    assert(false, 'not implemented');
  }

  key () {
    assert(false, 'not implemented');
  }

  action (value) {
    return `set${value}`;
  }

  leave (_, from, to) {
    if (from !== UNDEFINED_STATE && !this.receiving) {
      const key = this.key(from, to);
      debug(`State ${this.id} leaving: ${from} for ${to}`);
      this.send(key, this.sendFor).then(() => {
        this.fsm.transition();
      });
      return StateMachine.ASYNC;
    }
  }

  setValue (value) {
    return new Promise((resolve, reject) => {
      const setValue = () => {
        if (this.current === value) {
          this.onafterevent = undefined;
          debug(`State ${this.id} set to expected value: ${value}`);
          if (this.fsm.transition !== null) {
            const reason = 'State transition did not complete';
            debug(reason);
            return reject(reason);
          }
          return resolve(this);
        }

        if (this.unmetDependencies().length) {
          const reason = `State ${this.id} cannot change, unmet dependencies.`;
          debug(reason);
          return reject(reason);
        }

        let action = this.action(value);
        if (!this.fsm.can(action)) {
          const nextValue = this.next(value);
          debug(`State ${this.id} cannot set value: ${value}. Setting ${nextValue.id} instead.`);
          action = this.action(nextValue.id);
        }

        this.fsm.onafterevent = () => {
          debug(`State ${this.id} onafter callback.`);
          setValue();
        };

        debug(`State ${this.id} setting to ${value}.`);
        return this.fsm[action]();
      };

      setValue();
    });
  }

  unmetDependencies() {
    return this.dependencies.filter(dependency => !dependency.met());
  }

  serialize() {
    const {id} = this;
    const value = this.current;
    return {id, value};
  }

}

module.exports = State;
