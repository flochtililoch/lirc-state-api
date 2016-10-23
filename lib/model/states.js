'use strict';

const Dependency = require('./dependency'),
      {assert} = require('../utils/assert'),
      {waterfall} = require('../utils/flow');

const states = {
  linear: require('./linear'),
  loop: require('./loop')
};

class States {

  constructor (config, send, addReceiveListener) {
    this.states = config.states.map (state => new states[state.type](state, send, addReceiveListener));

    config.dependencies.forEach (dependency => {
      const dependencies = dependency.depends.map(state => {
        return new Dependency(this.getState(state.id), state.values);
      });
      dependency.states.forEach(id => {
        this.getState(id).dependencies = dependencies;
      });
    });
  }

  getState (id) {
    return this.states.filter (state => {
      return state.id === id;
    })[0];
  }

  serialize () {
    return this.states.map ((state) => state.serialize());
  }

  setStates (states) {
    // Validate states
    states.forEach(state => {
      assert(this.getState(state.id), `unknown state: ${state.id}`);
    });

    // Sort states by lowest dependencies first
    const sortedStates = states.sort((thisState, thatState) => {
      return this.getState(thisState.id).dependencies.length - this.getState(thatState.id).dependencies.length;
    });

    // Update
    return waterfall(sortedStates.map(state => {
      return () => {
        return this.getState(state.id).setValue(state.value);
      };
    }));
  }

}

module.exports = States;
