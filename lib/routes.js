// Some director routes for serving files
var fs = require('fs');

function clientjs() {
  var js = fs.readFileSync('js/client.js', 'utf8');
  
  this.res.writeHead(200, { 'Content-Type': 'application/javascript' });
  this.res.end(js);
}

function index() {
  var index = fs.readFileSync('html/index.html', 'utf8');
  
  this.res.writeHead(200, { 'Content-Type': 'text/html' });
  this.res.end(index);
}

function util() {
  var util = fs.readFileSync('js/util.js', 'utf8');
  
  this.res.writeHead(200, { 'Content-Type': 'application/javascript' });
  this.res.end(util);
}

module.exports = {
  '/client.js': {
    get: clientjs
  },
  
  '/index.html': {
    get: index
  },
  
  '/': {
    get: index
  }
  
  '/util.js': {
    get: util
  }
}