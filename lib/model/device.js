'use strict';

const lirc = require('lirc_node'),
      {name} = require('../../package'),
      debug = require('debug')(`${name}#device`),
      States = require('./states');

const SEND_DELAY_MS = 500,
      RECEIVE_DELAY_MS = 0;

class Device {

  constructor (config) {
    this.config = config;
    this.irsend = (new lirc.IRSend());
    this.irsend.setAddress(this.config.lircd_address);
    const send = this.send.bind(this);
    const addReceiveListener = this.addReceiveListener.bind(this);
    this.states = new States(this.config, send, addReceiveListener);
  }

  get id () {
    return this.config.id;
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

  send (key, sendFor) {
    return new Promise(resolve => {
      debug(`will send ${key} to ${this.config.lirc_id}`);
      if (typeof sendFor === 'number') {
        this.irsend.send_start(this.config.lirc_id, key, () => {
          setTimeout(() => {
            this.irsend.send_stop(this.config.lirc_id, key, () => {
              setTimeout(() => {
                resolve();
              }, this.sendDelay);
            });
          }, sendFor);
        });
      } else {
        this.irsend.send_once(this.config.lirc_id, key, () => {
          setTimeout(() => {
            resolve();
          }, this.sendDelay);
        });
      }
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
