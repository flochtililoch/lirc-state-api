'use strict';

const {spawn} = require('child_process'),
      lirc = require('lirc_node');

lirc.IRReceive._setInputListener(() => spawn('./node_modules/lirc_node/irwsimulator.sh'));

require('..');
