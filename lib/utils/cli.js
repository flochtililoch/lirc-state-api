'use strict';

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

module.exports = {processArgv};
