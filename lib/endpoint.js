// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : 


function Endpoint(url) {
  if (!(this instanceof Endpoint)) return new Endpoint(url);

  var p;
  if (typeof  url === 'string') {
    //parse url
    var rr = REGEXP_URL.exec(url);
    if (rr) {
      p = {
        type: rr[1],
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

  this.type = (p.type && p.type.toLowerCase()) || TYPE.TCP;
  this.port = p.port || (this.type === TYPE.WS ? 80 : this.type === TYPE.WSS ? 443 : 0);
  p.host && (this.host = p.host);
  (p.ip && (this.ip = p.ip)) || (p.host || (this.ip = '127.0.0.1'));
  p.url && (this.url = p.url);
  p.path && (this.path = p.path);
  p.username && (this.username = p.username);
  p.password && (this.password = p.password);
}

Endpoint.validateUrl = function (url) {
  return typeof url === 'string' && REGEXP_URL.test(url);
};

//type enum
var TYPE = Endpoint.TYPE = {
  TCP: 'tcp',
  SSL: 'ssl',
  WS: 'ws',
  WSS: 'wss',
  HTTP: 'http',
  HTTPS: 'https',
  FTP: 'ftp'
};

//regExp for url
//  [type://][username:password@]host[:port][path]
var REGEXP_URL = /^(?:([\w]+):\/\/)?(?:([^\s\:]+)\:([^\s]+)@)?([^\/\:\s]+)(?:\:(\d+))?(\/[^\s]*)?$/;

//exports
module.exports = Endpoint;
