// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : Connection


var util = require('util');
var stream = require('stream');
//var WebSocket = require('ws');

function Connection() {
  stream.Duplex.call(this);

  this.status = { sent: 0, received: 0 };


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
      this.once('connection', function () {
        self._write(chunk, encoding, callback);
      });
    } else {
      //var data = typeof chunk === 'string' ? new Buffer(chunk, encoding) : chunk;


    }
  };

  proto._read = function (n) { };

  proto.close = function () {
    this.status.closing = true;


    return this;
  };

})(Connection.prototype);

Connection.listen = function (options) {


};

Connection.connect = function (endpoint) {


};


//exports
module.exports = Connection;
