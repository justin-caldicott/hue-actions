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
curl -X POST --data-binary @path/to/hue-actions.yml http://yourMachineIp:14201/
```

Example `hue-actions.yml`:

```yml
sensors:
  - name: ventilation-boost
    type: CLIPGenericFlag
    onAction:
      type: http
      url: 'http://...'
      method: POST
      body:
        someProperty: 'foo'
    offAction:
      - type: series/parallel/random/random-no-repeats
        actions:
          - type: http
            url: 'http://...'
            method: PUT
            body:
              someProperty: 'foo'
  - name: bathroom-amp-volume
    type: CLIPGenericStatus
    changeAction:
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
