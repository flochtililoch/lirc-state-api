'use strict';

const lirc = require('lirc_node'),
      {name} = require('../../package'),
      debug = require('debug')(`${name}#device`),
      States = require('./states');

const SEND_DELAY_MS = 500,
      RECEIVE_DELAY_MS = 0;

const irsend = (new lirc.IRSend());

class Device {

  constructor (config) {
    this.config = config;
  }

  get id () {
    return this.config.id;
  }

  get states () {
    if (!this._states) {
      const send = this.send.bind(this);
      const addReceiveListener = this.addReceiveListener.bind(this);
      this._states = new States(this.config, send, addReceiveListener);
    }
    return this._states;
  }

  get sendDelay () {
    if (this.config.send_delay !== undefined) {
      return this.config.send_delay;
    }
    return SEND_DELAY_MS;
  }

  get receiveDelay () {
    if (this.config.receive_delay !== undefined) {
      return this.config.receive_delay;
    }
    return RECEIVE_DELAY_MS;
  }

  getStates () {
    return this.states;
  }

  setStates (states) {
    return new Promise((resolve, reject) => {
      this.busy = true;
      this.states.setStates(states).then(() => {
        this.busy = false;
        resolve(this.states);
      }).catch(error => {
        this.busy = false;
        reject(error);
      });
    });
  }

  getState (id) {
    return this.states.getState(id);
  }

  setState (id, state) {
    return new Promise((resolve, reject) => {
      this.busy = true;
      this.states.setState(id, state).then(() => {
        this.busy = false;
        resolve(this.states.getState(id));
      }).catch(error => {
        this.busy = false;
        reject(error);
      });
    });
  }

  serialize () {
    const {id, name} = this.config;
    const states = this.states.serialize();
    return {id, name, states};
  }

  send (key) {
    return new Promise(resolve => {
      debug(`will send ${key} to ${this.config.lirc_id}`);
      irsend.send_once(this.config.lirc_id, key, () => {
        setTimeout(() => {
          resolve();
        }, this.sendDelay);
      });
    });
  }

  addReceiveListener (key, action) {
    const handler = () => {
      if (!this.busy) {
        debug(`received ${key} for ${this.config.lirc_id}, updating state`);
        action();
      } else {
        debug(`received ${key} for ${this.config.lirc_id} while busy`);
      }
    };
    lirc.addListener(key, this.config.lirc_id, handler, this.receiveDelay);
  }

}

module.exports = Device;
