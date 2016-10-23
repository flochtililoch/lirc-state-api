'use strict';

const waterfall = tasks => {
  return tasks.reduce((promiseAccumulator, task) => {
    return promiseAccumulator = promiseAccumulator.then(task);
  }, Promise.resolve([]));
};

module.exports = {waterfall};
