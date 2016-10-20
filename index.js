#! /usr/bin/env node

'use strict';

const express = require('express'),
      bodyParser = require('body-parser'),
      lirc = require('lirc_node');

const Devices = require('./lib/devices'),
      {processArgv, assert} = require('./lib/utils');

const argsMap = {
        port: ['-p', '--port'],
        config: ['-c', '--config', '--conf'],
      },
      args = processArgv(argsMap);

assert(args.config, `Configuration path must be passed via ${argsMap.config.join(', ')} argument.`);
const config = require(args.config);

lirc.init();

const devices = new Devices(config),
      app = express(),
      port = args.port || 3001;

app.use(bodyParser.json());
app.listen(port, () => console.log(`listening on port ${port}`));

app.get('/devices', (_, response) => {
  response.send(devices.serialize());
});

app.get('/devices/:deviceid', (request, response) => {
  const device = devices.getDevice(request.params.deviceid);
  response.send(device.serialize());
});

app.get('/devices/:deviceid/states', (request, response) => {
  response.send(devices.getDevice(request.params.deviceid).states.serialize());
});

app.patch('/devices/:deviceid/states', (request, response) => {
  const device = devices.getDevice(request.params.deviceid);
  device.states.setStates(request.body).then(() => {
    response.send(device.states.serialize());
  }).catch((reason) => {
    response.status(400).send({reason});
  });
});

app.get('/devices/:deviceid/states/:stateid', (request, response) => {
  const {deviceid, stateid} = request.params;
  const state = devices.getDevice(deviceid).states.getState(stateid);
  response.send(state.serialize());
});

app.put('/devices/:deviceid/states/:stateid', (request, response) => {
  const {deviceid, stateid} = request.params;
  const state = devices.getDevice(deviceid).states.getState(stateid);
  state.go(request.body.value);
  response.send(state.serialize());
});
