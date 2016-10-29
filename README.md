# LIRC-STATE-API

## tl;dr
API to manipulate the states of infrared controlled devices.

*This is a work-in-progress*

## Description
The purpose of this module is to offer an API allowing manipulation of dumb, infrared controlled devices (i.e. TVs, fan, etc...). Sending infra-red signals to change the state of a device, as well as listening for infra-red signals from these devices' remote controls is done using [LIRC](http://www.lirc.org). Keeping track of these devices' states changes is done using a javascript implementation of [Finite-State Machine](https://en.wikipedia.org/wiki/Finite-state_machine).
Assumptions here is made that devices to control with this API have a finite number of states.
Currently, two types of states are modeled: *Linear* and *Loop*. These states are represented by an array of every possible values (at least two values required).

### Linear state
Useful to represent an information that is changed in a linear way via two remote control buttons (usually increment / decrement).

### Loop state
Useful to represent an information that is is changed via a single button. Actions on this button only moves the state to its next possible value, until the end is reached. Next press brings the state back to its first value.

#### Examples:

*A TV can have:*
- **power** state with `on` and `off` values. (*loop*)
- **source** state with `tv`, `hdmi1`, `hdmi2`, `composite` values. (*loop*)
- **mute** state with `on` and `off` values. (*loop*)
- **volume** state with a range from `1` to `50`. (*linear*)

*A Fan can have:*
- **power** state with `on` and `off` values. (*loop*)
- **rotate** state with `on` and `off` values. (*loop*)
- **air** state with a range from `1` to `10`. (*linear*)

*A Speaker can have:*
- **power** state with `on` and `off` values. (*loop*)
- **mute** state with `on` and `off` values. (*loop*)
- **volume** state with a range from `1` to `50`. (*linear*)

## Setup

### Pre-requisite
LIRC must be up and running. See [Open Source Universal Remote](http://opensourceuniversalremote.com) for details on how to set it up. Alternatively, you can also run LIRC on a [docker image on a Raspberry pi](https://hub.docker.com/r/flochtililoch/armv6l-lirc/) / [Raspberry pi 2/3](https://hub.docker.com/r/flochtililoch/armv7l-lirc/).

### Configuration file
The configuration is expressed in a JSON file via an array of javascript objects, each representing a device.

### Device configuration

#### Required properties:
- `id`: *string* used as a resource identifier.
- `lirc_id`: *string* maps to the remote control id as specified in the LIRC configuration.
- `name`: *string* user friendly name representing the device.
- `states`: *array* [state objects](#state-configuration).

#### Optional properties:
- `send_delay`: *integer* (milliseconds, default to 500).
- `receive_delay`: *integer* (milliseconds, default to 0).
- `dependencies`: *array* [dependency objects](#dependency-configuration).

### State configuration

#### Required properties:
- `id`: *string* used as a resource identifier.
- `type`: *string* Possible values: [`loop`](#loop-state), [`linear`](#linear-state)
- `values`: *array* List of all values the state can take.
- `keys`: *object*. [keys object](#keys-configuration).

### Keys configuration

#### Required properties for states of type `loop`:
- `next`: *string* LIRC key id that moves the state to its next value.

#### Required properties for states of type `linear`:
- `up`: *string* LIRC key id that move the state up.
- `down`: *string* LIRC key id that move the state down.

### Dependency configuration

#### Required properties:
- `states`: *array* of states with dependencies.
- `depends`: *array*  of dependencies objects, containing two keys: `id` (matching the actual state `id`) and values (list of values the state should be set to).


### Example configuration
```json
[
  {
    "id": "tv",
    "lirc_id": "TV",
    "name": "TV",
    "send_delay": 500,
    "receive_delay": 0,
    "states": [
      {
        "id": "power",
        "type": "loop",
        "values": [false, true],
        "keys": {
          "next": "KEY_POWER"
        }
      },
      {
        "id": "mute",
        "type": "loop",
        "values": [false, true],
        "keys": {
          "next": "KEY_MUTE"
        }
      },
      {
        "id": "volume",
        "type": "linear",
        "values": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "keys": {
          "up": "KEY_VOLUMEUP",
          "down": "KEY_VOLUMEDOWN"
        }
      },
      {
        "id": "source",
        "type": "loop",
        "values": ["tv", "hdmi1", "hdmi2", "composite"],
        "keys": {
          "next": "KEY_CYCLEWINDOWS"
        }
      }
    ],
    "dependencies": [
      {
        "states": ["mute", "volume", "source"],
        "depends": [
          {
            "id": "power",
            "values": [true]
          }
        ]
      },
      {
        "states": ["volume"],
        "depends": [
          {
            "id": "mute",
            "values": [false]
          }
        ]
      }
    ]
  },
  {
    "id": "fan",
    "lirc_id": "FAN",
    "name": "Fan",
    "states": [
      {
        "id": "power",
        "type": "loop",
        "values": [false, true],
        "keys": {
          "next": "KEY_POWER"
        }
      },
      {
        "id": "rotate",
        "type": "loop",
        "values": [false, true],
        "keys": {
          "next": "KEY_MOVE"
        }
      },
      {
        "id": "air",
        "type": "linear",
        "values": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "keys": {
          "up": "BTN_GEAR_UP",
          "down": "BTN_GEAR_DOWN"
        }
      },
      {
        "id": "timer",
        "type": "linear",
        "values": ["off", "15min", "30min", "45min"],
        "keys": {
          "up": "KEY_UP",
          "down": "KEY_DOWN"
        }
      }
    ],
    "dependencies": [
      {
        "states": ["rotate", "air", "timer"],
        "depends": [
          {
            "id": "power",
            "values": [true]
          }
        ]
      }
    ]
  }
]
```

## Model

### Devices

Representation of the devices LIRC remotes are controlling.
Each device has an identifier, a given name, and a list of states.

### States

Representation of various states devices can have.
A state has an identifier, a type and a list of values.


## HTTP REST API

### Devices Index

#### Request:

```
GET /devices
```

#### Response:

```
{
  "devices": [
    {
      "id": ...,
      "name": ...,
      "states": [
        {
          "id": ...,
          "value": ...
        }
      ]
    }
  ]
}
```

### Show Device

#### Request:

```
GET /devices/:id
```

#### Response:

```
{
  "id": ...,
  "name": ...,
  "states": [
    {
      "id": ...,
      "value": ...
    },
    ...
  ]
}
```

### Show Device's States

#### Request:

```
GET /devices/:id/states
```

#### Response:

```
[
  {
    "id": ...,
    "value": ...
  },
  ...
]
```

### Update Device States

#### Request:

```
PATCH /devices/:id/states
```

```
[
  {
    "id": ...,
    "value": ...
  },
  ...
]
```

### Update Device State

#### Request:

```
PUT /:id/states/:id
```

```
{
  "value": ...
}
```

## TODO
See project [V1 Dev](https://github.com/flochtililoch/lirc-state-api/projects/1).

