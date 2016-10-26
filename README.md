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

## Configuration
*TODO*

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

