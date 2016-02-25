'use strict';
var util          = require('util');
var EventEmitter  = require('events').EventEmitter;
var debug         = require('debug')('meshblu-wemo-motion:index');
var _             = require('lodash');
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
  self.preValue = undefined;
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
  debug("setOptions: %j", options);
  self.options = options;
  for(var udnClient in self.wemo._clients) {
    self.wemo._clients[udnClient].removeAllListeners();
    delete self.wemo._clients[udnClient];
  }
  self.client = undefined;
  self.preValue = undefined;
  self.wemo.discover(function(deviceInfo) {
    debug('Device searched: %s', self.options.friendlyName);
    debug('%s: %s', deviceInfo.deviceType.split(':')[3], deviceInfo.friendlyName);
    if (deviceInfo.deviceType.split(':')[3] === 'sensor' && deviceInfo.friendlyName === self.options.friendlyName)
    {
      debug('Create WeMo client: %s', deviceInfo.friendlyName);
      self.client = self.wemo.client(deviceInfo);
      self.client.on('binaryState', function(value) {
        value = (value === "1") ? true : false;
        if (self.preValue == undefined || self.preValue != value)
        {
          debug('State changed: %s', value);
          self.preValue = value;
          self.emit('message', { "devices": ['*'], "topic": 'state-changed', "payload": { "motion": value } });
        }
      });
    }
  });
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
