// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : ConnectionServer


var util = require('util');
var events = require('events');

var Endpoint = require('./endpoint');
var Connection = require('./connection');


//ConnectionServer(endpoint<Endpoint>[, options<Object>][, connectionListener<function>])
function ConnectionServer(endpoint, options, connectionListener) {
  events.EventEmitter.call(this);

  if (!(endpoint instanceof Endpoint)) {
    endpoint = new Endpoint(endpoint);
  }
  if (typeof options === 'function') {
    connectionListener = options;
    options = undefined;
  }

  this.endpoint = endpoint;
  this.options = options || {};
  if (typeof connectionListener === 'function') {
    this.on('connection', connectionListener);
  }

  listen.call(this);
}
util.inherits(ConnectionServer, events.EventEmitter);

function listen() {
  var self = this, endpoint = this.endpoint, options = this.options;
  switch (endpoint.protocol) {
    case Endpoint.PROTOCOL.SSL:
    case Endpoint.PROTOCOL.HTTPS:
    case Endpoint.PROTOCOL.SSH:
    case Endpoint.PROTOCOL.SFTP:
      self._server = require('tls').createServer(options, function (c) {
        var connection = new Connection().on('_write_data', function (data, cb) {
          c.write(data, cb);
        });
        c.on('data', function (data) {
          connection.emit('_read_data', data);
        });
        connection.connected = true;
        self.emit('connection', connection);
      }).listen(endpoint.port, endpoint.host);
      break;

    case Endpoint.PROTOCOL.WS:
    case Endpoint.PROTOCOL.WSS:
      options.server || (options.server = createHttpServer(endpoint.protocol === Endpoint.PROTOCOL.WSS, options)
        .listen(endpoint.port, endpoint.host));

      self._server = new (require('ws')).Server(options).on('connection', function (c) {
        var connection = new Connection().on('_write_data', function (data, cb) {
          c.send(data, {binary: true}, cb);
        });
        c.on('message', function (data) {
          connection.emit('_read_data', data);
        });
        connection.connected = true;
        self.emit('connection', connection);
      });
      break;

    default:
      self._server = require('net').createServer(options, function (c) {
        var connection = new Connection().on('_write_data', function (data, cb) {
          c.write(data, cb);
        });
        c.on('data', function (data) {
          connection.emit('_read_data', data);
        });
        connection.connected = true;
        self.emit('connection', connection);
      }).listen(endpoint.port, endpoint.host);
  }
}

function createHttpServer(isHttps, options) {
  return isHttps
    ? require('https').createServer(options, onHttpRequest)
    : require('http').createServer(onHttpRequest);
}

function onHttpRequest(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Connection is working.\r\n');
}

//exports
module.exports = ConnectionServer;
