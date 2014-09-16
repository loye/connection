// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : 


//exports
exports.Endpoint = require('./lib/endpoint');
exports.Connection = require('./lib/connection');
exports.ConnectionServer = require('./lib/connection-server');

exports.listen = function (endpoint, options, connectionListener) {
  return new exports.ConnectionServer(endpoint, options, connectionListener);
};

exports.connect = function (endpoint, options, connectionListener) {
  return new exports.Connection(endpoint, options, connectionListener);
};


//test
if (require.main === module) {
  var fs = require('fs');
  exports.listen('ws://localhost:1337', {
    key: fs.readFileSync('certs/localhost.key'),
    cert: fs.readFileSync('certs/localhost.crt'),
    requestCert: true,
    ca: [ fs.readFileSync('certs/root_ca.crt') ]

  }, function (conn) {
    //console.log('server:', conn);
    conn.pipe(conn);
  });

  exports.connect('ws://localhost:1337', {
      //key: fs.readFileSync('certs/localhost.key'),
      //cert: fs.readFileSync('certs/localhost.crt'),
      //ca: [ fs.readFileSync('certs/root_ca.crt') ]
    }, function (conn) {
      //console.log('client:', conn);
      process.stdin.pipe(conn).pipe(process.stdout);
    }
  );
}
