# hue-actions

Simple binding of CLIP sensor state to http and command line actions.

Only CLIPGenericFlag and CLIPGenericStatus virtual sensors supported currently.

Default port of 14201 is not configurable currently.

## Usage

### Installation

On a machine where you want run hue-actions:

- Install node 18 or above
- Install the tool with `npm install -g hue-actions`

### Quick start

```sh
hue-actions gateway set <YOUR_GATEWAY_IP> <YOUR_GATEWAY_API_KEY>
```

From any machine with access to the machine running hue-actions:

```sh
curl -H "apikey: YOUR_GATEWAY_API_KEY" -X PUT --data-binary @some-path-to/hue-actions.yml http://some-host:14201/config
```

Note: The gateway apikey is used to also authenticate requests to PUT /config.

Example `hue-actions.yml`:

```yml
sensors:
  - name: ventilation-boost
    type: CLIPGenericFlag
    actions:
      flag:
        true:
          type: http
          url: 'http://...'
          method: POST
          body:
            someProperty: 'foo'
        false:
          type: series/parallel/random/random-no-repeats
          actions:
            - type: http
              url: 'http://...'
              method: PUT
              body:
                someProperty: 'foo'
  - name: bathroom-amp-volume
    type: CLIPGenericStatus
    actions:
      status:
        type: http
        url: 'http://.../httpapi.asp?command=setPlayerCmd:vol:{value}'
        method: GET
```

## Contributing

Please raise issues for any bugs/feature requests.

Testing has been through actual use with a good number of sensors/actions. There are no automated tests yet. Can hopefully add some soonish.

## Release process

Update the version number in `package.json` and:

```sh
yarn build
npm publish
```
