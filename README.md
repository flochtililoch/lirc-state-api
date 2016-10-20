# LIRC-HTTP-API

## tl;dr
Control your infra-red remote controlled devices with a REST API!

*This is a work-in-progress*

## Description
The purpose of this module is to allow manipulation via API of states from dumb, infra-red controlled devices (i.e. TVs, fan, etc...). Sending infra-red signals to change the state of a device, as well as listening for infra-red signals from these devices' remote controls is easy, [LIRC](http://www.lirc.org) package on Linux allows to do just that. However, there's no practical way of reading a state for these devices. If variations of states is finite, it is fairly simple to reproduce a model representation of each of these states using a [Finite-State Machine](https://en.wikipedia.org/wiki/Finite-state_machine). Paired with an infra-red signals listener and emitter, we can allow querying and manipulation of these states, end-goal being, building rich User-Interface, and making these dumb devices smarter.

## TODO
See project [V1 Dev](https://github.com/flochtililoch/lirc-http/projects/1).

## Configuration
*TODO*

## Model

### Devices

Representation of the devices LIRC remotes are controlling.
Each device has an identifier, a given name, and a list of states.

### States

Representation of various states devices can have.
A state has an identifier, a type and a list of values.

#### Examples:

*A TV can have:*
- **power** state with `on` and `off` values.
- **source** state with `tv`, `hdmi1`, `hdmi2`, `composite` values.
- **mute** state with `on` and `off` values.
- **volume** state with a range from `1` to `50`.

*A Fan can have:*
- **power** state with `on` and `off` values.
- **rotate** state with `on` and `off` values.
- **air** state with a range from `1` to `10`.

*A Speaker can have:*
- **power** state with `on` and `off` values.
- **mute** state with `on` and `off` values.
- **volume** state with a range from `1` to `50`.


## API

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

#### Request Header:

- `X-Lirc-State-Sync`: (Boolean, optional, default to true) *(not implemented yet)*
Useful when specifically set to `false`. Use this to initialize the internal state representation of the device without actually sending the infrared command.


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
