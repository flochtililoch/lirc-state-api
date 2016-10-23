'use strict';

const packageName = require('../../package').name,
      debug = require('debug')(`${packageName}#utils/assert`);

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

module.exports = {assert, assertString, assertObject, assertArray, assertFunction};
