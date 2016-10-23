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
    state.setValue(request.body.value).then(() => {
      response.send(state.serialize());
    }).catch((reason) => {
      response.status(400).send({reason});
    });
  });
};
