# LIRC-HTTP-API

*This is a work-in-progress*



# Model

## Devices

Representation of the devices LIRC remotes are controlling.
Each device has an identifier, a given name, and a list of states.

# States

Representation of various states devices can have.
A state has an identifier, a type and a list of values.

Examples:

A TV can have:
- *power* state with `on` and `off` values.
- *source* state with `tv`, `hdmi1`, `hdmi2`, `composite` values.
- *mute* state with `on` and `off` values.
- *volume* state with a range from `1` to `50`.

A Fan can have:
- *power* state with `on` and `off` values.
- *rotate* state with `on` and `off` values.
- *air* state with a range from `1` to `10`.

A Speaker can have:
- *power* state with `on` and `off` values.
- *mute* state with `on` and `off` values.
- *volume* state with a range from `1` to `50`.


# API

## Devices Index

### Request:

```json
GET /devices
```

### Response:

```json
{
  devices: [
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


## Show Device

### Request:

```json
GET /devices/:id
```

### Response:

```json
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

## Show Device's States

### Request:

```json
GET /devices/:id/states
```

### Response:

```json
[
  {
    "id": ...,
    "value": ...
  }
]

## Update Device States

### Request:

```json
PATCH /devices/:id/states
```

```json
[
  {
    "id": ...,
    "value": ...
  },
  ...
]
```

### Request Header:

- `X-Lirc-State-Sync`: (Boolean, optional, default to true)
Useful when specifically set to `false`. Use this to initialize the internal state representation of the device without actually sending the infrared command.


## Update Device State

### Request:

```json
PUT /:id/states/:id
```

```json
{
  "value": ...
}
```
