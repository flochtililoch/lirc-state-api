/*global get put expectation:true*/

'use strict';

const OK = 'responds 200 OK',
      NOK = 'responds 400 BAD REQUEST';

const devicesUrl = '/devices',
      deviceUrl = `${devicesUrl}/tv`,
      statesUrl = `${deviceUrl}/states`,
      statesUrls = {
        mute: `${statesUrl}/mute`,
        source: `${statesUrl}/source`,
        volume: `${statesUrl}/volume`,
        power: `${statesUrl}/power`,
      };

const state = {
  mute: {id: 'mute', value: false},
  source: {id: 'source', value: 'tv'},
  volume: {id: 'volume', value: 0},
  power: {id: 'power', value: false},
};

const badRequestReason = state => `State ${state} cannot change, unmet dependencies.`;

describe('Devices index', () => {
  it(OK, () => get(devicesUrl).sends.ok(expectation('devices')));
});

describe('Devices show', () => {
  it(OK, () => get(deviceUrl).sends.ok(expectation('devices/tv')));
});

describe('Devices states index', () => {
  it(OK, () => get(statesUrl).sends.ok(expectation('devices/tv/states')));
});

describe('Devices states show', () => {
  describe('Mute', () => {
    it(OK, () => get(statesUrls.mute).sends.ok(state.mute));
  });
  describe('Source', () => {
    it(OK, () => get(statesUrls.source).sends.ok(state.source));
  });
  describe('Volume', () => {
    it(OK, () => get(statesUrls.volume).sends.ok(state.volume));
  });
  describe('Power', () => {
    it(OK, () => get(statesUrls.power).sends.ok(state.power));
  });
});

describe('Devices states update', () => {
  describe('when not changing values', () => {
    describe('Mute', () => {
      it(OK, () => put(statesUrls.mute, {value: false}).sends.ok(state.mute));
    });
    describe('Source', () => {
      it(OK, () => put(statesUrls.source, {value: 'tv'}).sends.ok(state.source));
    });
    describe('Volume', () => {
      it(OK, () => put(statesUrls.volume, {value: 0}).sends.ok(state.volume));
    });
    describe('Power', () => {
      it(OK, () => put(statesUrls.power, {value: false}).sends.ok(state.power));
    });
  });
  describe('when changing values', () => {
    describe('with unmet dependencies', () => {
      describe('Mute', () => {
        it(NOK, () => put(statesUrls.mute, {value: true}).sends.badRequest({reason: badRequestReason('mute')}));
      });
      describe('Source', () => {
        it(NOK, () => put(statesUrls.source, {value: 'hdmi1'}).sends.badRequest({reason: badRequestReason('source')}));
      });
      describe('Volume', () => {
        it(NOK, () => put(statesUrls.volume, {value: 1}).sends.badRequest({reason: badRequestReason('volume')}));
      });
    });
    describe('without dependencies', () => {
      describe('Power', () => {
        const value = true;
        it(OK, () => put(statesUrls.power, {value}).sends.ok({...state.power, value}));
      });
    });
    describe('with met dependencies', () => {
      describe('Mute', () => {
        const value = true;
        it(OK, () => put(statesUrls.mute, {value}).sends.ok({...state.mute, value}));
      });
      describe('Source', () => {
        const value = 'hdmi1';
        it(OK, () => put(statesUrls.source, {value}).sends.ok({...state.source, value}));
      });
      describe('Volume', () => {
        const value = 1;
        before(() => put(statesUrls.mute, {value: false}));
        it(OK, () => put(statesUrls.volume, {value}).sends.ok({...state.volume, value}));
      });
    });
  });
});
