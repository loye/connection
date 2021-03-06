// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : Endpoint, parsing url to Endpoint object
//                url format: [protocol://][username[:[password]]@]host[:port][path]


//regExp for url
//  [protocol://][username[:[password]]@]host[:port][path]
var REGEXP_URL = /^(?:([\w]+):\/\/)?(?:([^\s:]+)(?::([^\s]*))?@)?([^\/:\s]+)(?::(\d+))?(\/[^\s]*)?$/;

//well known protocol enum
var PROTOCOL = Endpoint.PROTOCOL = {
  TCP: 'tcp',
  SSL: 'ssl',
  HTTP: 'http',
  HTTPS: 'https',
  WS: 'ws',
  WSS: 'wss',
  TELNET: 'telnet',
  SSH: 'ssh',
  FTP: 'ftp',
  SFTP: 'sftp'
};

//Endpoint(url: <string>)
//  { protocol: <string>,
//    [username: <string>,]
//    [password: <string>,]
//    [host:     <string>,]
//    [ip:       <string>,]
//    port:      <number>,
//    [path:     <string>,]
//    url:       <string> }
function Endpoint(url) {
  if (!(this instanceof Endpoint)) return new Endpoint(url);

  var p;
  if (typeof url === 'string') {
    //parse url
    var rr = REGEXP_URL.exec(url);
    if (rr) {
      p = {
        protocol: rr[1],
        username: rr[2],
        password: rr[3],
        host: rr[4],
        port: rr[5],
        path: rr[6],
        url: rr[0]
      };
    }
  } else if (typeof url === 'object') {
    p = url;
  }
  p || (p = {});

  this.protocol = (p.protocol && p.protocol.toLowerCase()) || PROTOCOL.TCP;
  p.username && (this.username = p.username);
  p.password && (this.password = p.password);
  this.host = p.host || 'localhost';
  this.port = p.port || defaultPort(this.protocol);
  p.path && (this.path = p.path);
  p.url && (this.url = p.url);
}

Endpoint.validateUrl = function (url) {
  return typeof url === 'string' && REGEXP_URL.test(url);
};

function defaultPort(protocol) {
  if (protocol === PROTOCOL.HTTP || protocol === PROTOCOL.WS) {
    return 80;
  } else if (protocol === PROTOCOL.HTTPS || protocol === PROTOCOL.WSS) {
    return 443;
  } else if (protocol === PROTOCOL.FTP) {
    return 21;
  } else if (protocol === PROTOCOL.SSH) {
    return 22
  } else if (protocol === PROTOCOL.TELNET) {
    return 23
  }
  return 0;
}

//exports
module.exports = Endpoint;
