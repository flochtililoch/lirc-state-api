#! /usr/bin/env node

'use strict';

const express = require('express'),
      bodyParser = require('body-parser'),
      lirc = require('lirc_node');

const Devices = require('./lib/model/devices'),
      {assert} = require('./lib/utils/assert'),
      {processArgv} = require('./lib/utils/cli'),
      httpApi = require('./lib/api/http');

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

httpApi(app, devices);
