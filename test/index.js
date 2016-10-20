'use strict';

const {spawn} = require('child_process'),
      lirc = require('lirc_node');

lirc.IRReceive._setInputListener(() => spawn('./test/mocks/irw.js'));

require('..');
