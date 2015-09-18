# Meshblu Wemo motion sensor Plugin #
A plugin for connecting your Belkin Wemo motion sensor to Meshblu.

It's intended to be used with Gateblu, but works great as a standalone application as well.

The options schema and the message schema is auto published to the meshblu device when the plugin starts.

This plugin can send event messages. An example of event message is given in the bottom of this document.

## Installation ##
It's recommend to be used with Gateblu, but if you want to run it by itself, you'll need to register a device with Meshblu and create a meshblu.json in the root of the meshblu-wemo-motion directory that looks like the following:

```
{
  "uuid":   "<your meshblu-wemo-motion uuid>",
  "token":  "<your meshblu-wemo-motion token>",
  "server": "meshblu.octoblu.com",
  "port":   "80"
}
```

Then run:
```
npm install
npm start
```

## Options Schema ##
```
{
  "type": "object",
  "properties": {
    "friendlyName": {
      "type": "string",
      "required": true
    }
  }
}
```

## Event Message ##
A event message will look like:
```
{
  "devices": [ "*" ],
  "payload": {
    "motion": true
  },
  "topic": "state-changed",
  "fromUuid": "<uuid of meshblu-wemo-motion>"
}
```
