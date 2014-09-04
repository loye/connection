// Author       : Lijian Qiu
// Email        : loye.qiu@gmail.com
// Description  : 


function Endpoint(url) {
  if (!(this instanceof Endpoint)) return new Endpoint(url);

  var p;

  if (typeof  url === 'string') {
    //parse url
    var rr = /^(?:([\w]+):\/\/)?([^\/\:]+)(?:\:(\d+))?(\/[^\s]*)?$/.exec(url);
    if (rr) {
      p = {
        type: rr[1],
        host: rr[2],
        port: rr[3],
        path: rr[4],
        url: rr['input']
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
}

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


//exports
module.exports = Endpoint;


//test
if (require.main = module) {
  ['ws://localhost:1337/test'].forEach(function (item) {
    var endpoint = new Endpoint(item);
    console.log(endpoint);
  });
}
