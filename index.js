// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : 


//exports
exports.Endpoint = require('./lib/endpoint');
exports.Connection = require('./lib/connection');
exports.ConnectionServer = require('./lib/connection-server');

exports.listen = function (endpoint, options, connectionListener) {
  return new exports.ConnectionServer().listen(endpoint, options, connectionListener);
};

exports.connect = function (endpoint, options, connectionListener) {
  return new exports.Connection(endpoint, options, connectionListener);
};


//test
if (require.main === module) {
  exports.listen('tcp://localhost:1337', function (conn) {
    console.log('server:', conn);
    conn.pipe(conn);
  });

  exports.connect('tcp://localhost:1337', function (conn) {
    console.log('client:', conn);
    process.stdin.pipe(conn).pipe(process.stdout);
  });
}
