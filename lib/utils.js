'use strict';

const packageName = require('../package').name,
      debug = require('debug')(`${packageName}#util`);

const assert = (condition, message) => {
  if (!condition) {
    debug(`${condition} is not valid, sending error with message`);
    throw new Error(message);
  }
};

const assertString = (string, message, minLength = 0) => {
  assert(typeof string === 'string' && string.length > minLength, message);
};

const assertObject = (object, message) => {
  assert(typeof object === 'object' && object !== null, message);
};

const assertArray = (array, message, minLength = 0) => {
  assert(
    typeof array === 'object' && array !== null && array.length >= minLength,
    message
  );
};

const assertFunction = (fn, message) => {
  assert(typeof fn === 'function', message);
};

const waterfall = tasks => {
  return tasks.reduce((promiseAccumulator, task) => {
    return promiseAccumulator = promiseAccumulator.then(task);
  }, Promise.resolve([]));
};

const processArgv = (knownArgs) => {
  const SEPARATOR = '=';
  let argsMap = {}, args = {};

  for (let arg in knownArgs) {
    if (knownArgs.hasOwnProperty(arg)) {
      knownArgs[arg].forEach(name => argsMap[name] = arg);
    }
  }

  process.argv.slice(2).forEach(arg => {
    const [name, value] = arg.split(SEPARATOR),
          key = argsMap[name] ? argsMap[name] : name;
    args[key] = value;
  });

  return args;
};

module.exports = {
  assert,
  assertString,
  assertObject,
  assertArray,
  assertFunction,
  waterfall,
  processArgv,
};
