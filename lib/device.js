'use strict';

const lirc = require('lirc_node'),
      {name} = require('../package'),
      debug = require('debug')(`${name}#device`),
      States = require('./states');

const SEND_DELAY_MS = 500,
      RECEIVE_DELAY_MS = 500;

const irsend = (new lirc.IRSend());

class Device {

  constructor (config) {
    this.id = config.id;
    this.lircId = config.lirc_id;
    this.name = config.name;
    this.sendDelay = SEND_DELAY_MS || config.sendDelay;
    this.receiveDelay = RECEIVE_DELAY_MS || config.receiveDelay;
    const send = this.send.bind(this);
    const addReceiveListener = this.addReceiveListener.bind(this);
    this.states = new States(config, send, addReceiveListener);
  }

  serialize () {
    const {id, name} = this;
    const states = this.states.serialize();
    return {id, name, states};
  }

  send (key) {
    return new Promise(resolve => {
      debug(`will send ${key} to ${this.lircId}`);
      irsend.send_once(this.lircId, key, () => {
        setTimeout(() => {
          resolve();
        }, this.sendDelay);
      });
    });
  }

  addReceiveListener (key, action) {
    const handler = () => {
      debug(`received ${key} for ${this.lircId}`);
      action();
    };
    lirc.addListener(key, this.lircId, handler, this.receiveDelay);
  }

}

module.exports = Device;
