'use strict';

const Device = require('./device');

class Devices {

  constructor (config) {
    this.devices = [];
    for (let i = 0; i < config.length; i++) {
      const device = new Device(config[i]);
      this.devices.push(device);
    }
  }

  getDevice(id) {
    return this.devices.filter((device) => {
      return device.id === id;
    })[0];
  }

  serialize() {
    return this.devices.map((device) => device.serialize());
  }

}


module.exports = Devices;
