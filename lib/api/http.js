'use strict';

module.exports = (app, devices) => {
  app.get('/devices', (_, response) => {
    response.send(devices.serialize());
  });

  app.get('/devices/:deviceid', (request, response) => {
    const device = devices.getDevice(request.params.deviceid);
    response.send(device.serialize());
  });

  app.get('/devices/:deviceid/states', (request, response) => {
    const states = devices.getDevice(request.params.deviceid).getStates();
    response.send(states.serialize());
  });

  app.patch('/devices/:deviceid/states', (request, response) => {
    const device = devices.getDevice(request.params.deviceid);
    device
      .setStates(request.body)
      .then((states) => response.send(states.serialize()))
      .catch((reason) => response.status(400).send({reason}));
  });

  app.get('/devices/:deviceid/states/:stateid', (request, response) => {
    const {deviceid, stateid} = request.params;
    const state = devices.getDevice(deviceid).getState(stateid);
    response.send(state.serialize());
  });

  app.put('/devices/:deviceid/states/:stateid', (request, response) => {
    const {deviceid, stateid} = request.params;
    devices
      .getDevice(deviceid)
      .setState(stateid, request.body.value)
      .then(state => response.send(state.serialize()))
      .catch((reason) => response.status(400).send({reason}));
  });
};
