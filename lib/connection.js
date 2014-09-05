// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : Connection


var util = require('util');
var stream = require('stream');
//var WebSocket = require('ws');

var Endpoint = require('./endpoint').Endpoint;
var ConnectionServer = require('./connection-server').ConnectionServer;


function Connection(endpoint) {
  if (!(this instanceof Connection)) return new Connection(endpoint);
  if (!(endpoint instanceof Endpoint)) endpoint = new Endpoint(endpoint);

  stream.Duplex.call(this);




  //this.status = { sent: 0, received: 0 };


}
util.inherits(Connection, stream.Duplex);

//function onopen() {
//
//}
//
//function onerror(err) {
//  this.emit('error', err);
//}

(function (proto) {
  proto._write = function (chunk, encoding, callback) {
    var self = this;
    if (!this.connected) {
      this.once('connect', function () {
        self._write(chunk, encoding, callback);
      });
    } else {
      var data = typeof chunk === 'string' ? new Buffer(chunk, encoding) : chunk;


    }
  };

  proto._read = function (n) { };

  proto.close = function () {
    this.status.closing = true;


    return this;
  };

})(Connection.prototype);


function listen(endpoint, onconnection) {
  var server = new ConnectionServer(endpoint);
  typeof onconnection === 'function' && server.on('connection', onconnection);
  return server;
}

function connect(endpoint, onconnect) {
  var conn = new Connection(endpoint);
  typeof onconnect === 'function' && conn.on('connect', onconnect);
  return conn;
}


//exports
Connection.listen = listen;
Connection.connect = connect;
module.exports.Connection = Connection;
module.exports.Endpoint = Endpoint;
module.exports.ConnectionServer = ConnectionServer;

if (require.main === module) {
  listen('tcp://localhost:1337', function (conn) {
    console.log('server:', conn);
  });

  connect('tcp://localhost:1337', function (conn) {
    console.log('client:', conn);
  });
}