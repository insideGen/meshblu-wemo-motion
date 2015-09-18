'use strict';
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;
var debug         = require('debug')('meshblu-wemo-motion');
var Wemo          = require('wemo-client');

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {}
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    friendlyName: {
      type: 'string',
      required: true
    }
  }
};

var Plugin = function() {
  var self = this;
  self.options = {};
  self.messageSchema = MESSAGE_SCHEMA;
  self.optionsSchema = OPTIONS_SCHEMA;
  self.wemo = new Wemo();
  self.client = undefined;
  return self;
}
util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message) {
  var self = this;
  var payload = message.payload;
  //self.emit('message', {devices: ['*'], topic: 'echo', payload: payload});
};

Plugin.prototype.onConfig = function(device) {
  var self = this;
  self.setOptions(device.options||{});
};

Plugin.prototype.setOptions = function(options) {
  var self = this;
  self.options = options;
  if (self.client && self.wemo._clients[self.client.UDN]) {
    self.wemo._clients[self.client.UDN].removeAllListeners();
    delete self.wemo._clients[self.client.UDN];
  }
  self.wemo.discover(function(deviceInfo) {
    //console.log(deviceInfo.friendlyName);
    if (deviceInfo.deviceType.split(':')[3] === 'sensor' && deviceInfo.friendlyName === self.options.friendlyName)
    {
      //console.log('Create WeMo client: ', deviceInfo.friendlyName);
      self.client = self.wemo.client(deviceInfo);
      self.client.on('binaryState', function(value) {
        //console.log('state changed: ', value);
        self.emit('message', {devices: ['*'], topic: 'state-changed', payload: {motion: (value === "1") ? true : false}});
      });
    }
  });
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
