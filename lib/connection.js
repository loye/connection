// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : Connection


var util = require('util');
var stream = require('stream');
var net = require('net');
var tls = require('tls');
var WebSocket = require('ws');

var Endpoint = require('./endpoint');


//Connection(endpoint<Endpoint>[, options<Object>][, connectionListener<function>])
function Connection(endpoint, options, connectionListener) {
  if (!(this instanceof Connection)) return new Connection(endpoint, options, connectionListener);

  stream.Duplex.call(this);

  //this.status = { sent: 0, received: 0 };

  if (endpoint && !(endpoint instanceof Endpoint)) {
    endpoint = new Endpoint(endpoint);
  }
  if (typeof options === 'function') {
    connectionListener = options;
    options = undefined;
  }
  this.endpoint = endpoint;
  this.options = options;
  if (typeof connectionListener === 'function') {
    this.on('connect', connectionListener);
  }

  if (endpoint) {
    connect(endpoint);
  }
}
util.inherits(Connection, stream.Duplex);

Connection.prototype._write = function (chunk, encoding, callback) {
  var self = this;
  if (!this.connected) {
    this.once('connect', function () {
      self._write(chunk, encoding, callback);
    });
  } else {
    var data = typeof chunk === 'string' ? new Buffer(chunk, encoding) : chunk;


  }
};

Connection.prototype._read = function (n) { };

Connection.prototype.bind = function (conn) {

};


Connection.prototype.close = function () {

  return this;
};

function connect(endpoint) {


}


//exports
module.exports = Connection;
