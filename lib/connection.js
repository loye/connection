// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : Connection


var util = require('util');
var stream = require('stream');

var Endpoint = require('./endpoint');


//Connection(endpoint<Endpoint>[, options<Object>][, connectionListener<function(Connection)>])
function Connection(endpoint, options, connectionListener) {
  if (!(this instanceof Connection)) return new Connection(endpoint, options, connectionListener);

  stream.Duplex.call(this);

  if (endpoint && !(endpoint instanceof Endpoint)) {
    endpoint = new Endpoint(endpoint);
  }
  if (typeof options === 'function') {
    connectionListener = options;
    options = undefined;
  }
  this.endpoint = endpoint;
  this.options = options || {};
  if (typeof connectionListener === 'function') {
    this.on('connect', connectionListener);
  }
  this.status = {sent: 0, received: 0};

  this.on('_read_data', function (data) {
    this.push(data);
    this.status.received += data.length;
  });

  if (endpoint) {
    //connect
    connect.call(this);
  }
}
util.inherits(Connection, stream.Duplex);

function connect() {
  this.options.port = this.endpoint.port;
  this.options.host = this.endpoint.host;
  switch (this.endpoint.protocol) {
    case Endpoint.PROTOCOL.SSL:
    case Endpoint.PROTOCOL.HTTPS:
    case Endpoint.PROTOCOL.SSH:
    case Endpoint.PROTOCOL.SFTP:
      this._client = require('tls').connect(this.options, function () {
        this._client.on('data', ondata.bind(this));
        this.on('_write_data', function (data, cb) {
          this._client.write(data, cb);
        });
        this.connected = true;
        this.emit('connect', this);
      }.bind(this));
      break;

    case Endpoint.PROTOCOL.WS:
    case Endpoint.PROTOCOL.WSS:
      this._client = new (require('ws'))(this.endpoint.url, this.options).on('open', function () {
        this._client.on('message', ondata.bind(this));
        this.on('_write_data', function (data, cb) {
          this._client.send(data, {binary: true}, cb);
        });
        this.connected = true;
        this.emit('connect', this);
      }.bind(this));
      break;

    default:
      this._client = require('net').connect(this.options, function () {
        this._client.on('data', ondata.bind(this));
        this.on('_write_data', function (data, cb) {
          this._client.write(data, cb);
        });
        this.connected = true;
        this.emit('connect', this);
      }.bind(this))
  }
}

function ondata(data) {
  this.emit('_read_data', data);
}

Connection.prototype._write = function (chunk, encoding, callback) {
  var self = this;
  if (!self.connected) {
    this.once('connect', function () {
      self._write(chunk, encoding, callback);
    });
  } else {
    var data = typeof chunk === 'string' ? new Buffer(chunk, encoding) : chunk;
    this.emit('_write_data', data, function (err) {
      !err && (this.status.sent += data.length);
      typeof callback === 'function' && callback.call(null, err);
    }.bind(this));
  }
};

Connection.prototype._read = function (n) {
};

Connection.prototype.bind = function (conn) {

  return this;
};

Connection.prototype.close = function () {

  return this;
};


//exports
module.exports = Connection;
