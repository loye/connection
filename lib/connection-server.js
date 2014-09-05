// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : 


var util = require('util');
var events = require('events');
var net = require('net');

var Endpoint = require('./endpoint').Endpoint;
//var WebSocket = require('ws');


function ConnectionServer(endpoint) {
  events.EventEmitter.call(this);

  if (!(endpoint instanceof Endpoint)) endpoint = new Endpoint(endpoint);
  console.log(endpoint);

  listen(endpoint);
}
util.inherits(ConnectionServer, events.EventEmitter);

function listen(endpoint) {
  net.createServer(function (c) {

  }).listen(endpoint.port, endpoint.ip || endpoint.host);
}

//exports
module.exports.ConnectionServer = ConnectionServer;
