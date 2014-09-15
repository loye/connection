// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : ConnectionServer


var util = require('util');
var events = require('events');
var net = require('net');
var tls = require('tls');
var WebSocket = require('ws');

var Endpoint = require('./endpoint');
var Connection = require('./connection');


//ConnectionServer
function ConnectionServer(connectionListener) {
  events.EventEmitter.call(this);

  if (typeof connectionListener === 'function') {
    this.on('connection', connectionListener);
  }
}
util.inherits(ConnectionServer, events.EventEmitter);

//listen(endpoint<Endpoint>[, options<Object>][, connectionListener<function>])
ConnectionServer.prototype.listen = function (endpoint, options, connectionListener) {
  if (!(endpoint instanceof Endpoint)) {
    endpoint = new Endpoint(endpoint);
  }
  if(typeof options === 'function'){
    connectionListener = options;
    options = undefined;
  }

  this.endpoint = endpoint;
  this.options = options;
  if (typeof connectionListener === 'function') {
    this.on('connection', connectionListener);
  }

  if (this._server) {
    //stop listening
  }

  listen(this, endpoint, options);

  return this;
};

function listen(self, endpoint, options) {
  switch (endpoint.protocol) {
    case Endpoint.PROTOCOL.SSL:
    case Endpoint.PROTOCOL.HTTPS:
    case Endpoint.PROTOCOL.SSH:
    case Endpoint.PROTOCOL.SFTP:
      this._server = tls.createServer(options, function (c) {
        self.emit('connection', new Connection().bind({
          protocol: endpoint.protocol,
          connection: c
        }));
      }).listen(endpoint.port, endpoint.ip || endpoint.host);
      break;

    case Endpoint.PROTOCOL.WS:
    case Endpoint.PROTOCOL.WSS:
      //todo
      this._server = new WebSocket.Server(options).on('connection', function (c) {
        self.emit('connection', new Connection().bind({
          protocol: endpoint.protocol,
          connection: c
        }));
      });
      break;

    default:
      this._server = net.createServer(options, function (c) {
        self.emit('connection', new Connection().bind({
          protocol: endpoint.protocol,
          connection: c
        }));
      }).listen(endpoint.port, endpoint.ip || endpoint.host);
  }
}


//exports
module.exports = ConnectionServer;
