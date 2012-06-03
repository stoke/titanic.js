var io = require('socket.io'),
  director = require('director'),
  http = require('http'),
  routes = require('./routes.js'),
  Logger = require('./logger.js'),
  fs = require('fs'),
  Context = require('./context.js');

// initialize http server, using director for serving files and socket.io for communication
function Server(opts) {
  this.opts = opts || {};
  this.port = this.opts.port || 8080;
  this.app = null;
  this.io = null;
  this.mainfile = null;
};

Server.prototype.serve = function(file, index) {
  var ext, match, permised = ['css', 'js', 'html'];
  
  if (!index)
    index = file;
  
  if (index[0] !== '/')
    index = '/'+index;
  
  match = /\.(.+?)$/.exec(file);
  
  if (match === null)
    throw new Error("No extension");
  
  ext = match[1];
  
  if (!~permised.indexOf(ext))
    throw new Error("Unknown extension");
  
  routes[index] = {
    get: function() {
      var mime,
        ts = fs.readFileSync(ext+'/'+file, 'utf8');
      
      switch (ext) {
        case 'html':
          mime = 'text/html';
          break;
        
        case 'css':
          mime = 'text/css';
          break;
        
        case 'js':
          mime = 'application/javascript';
          break;
      }
      
      this.res.writeHead(200, {'Content-Type': mime});
      this.res.end(ts);
    }
  }
}
    
Server.prototype.listen = function(callback) {
  var self = this;  
  this.router = new director.http.Router(routes);
  this.app = http.createServer(function(req, res) {
    self.router.dispatch(req, res, function (err) {
      if (err) {
        res.writeHead(404);
        res.end();
      }
    });
  });
  
  this.io = io.listen(this.app, {'logger': Logger});
  this.app.listen(this.port);
 
  this.io.sockets.on('connection', function(socket) {
    socket.on('ready', function() {
      var context = new Context(socket);
      callback(null, context); // return a context object, this is the BASE for wui
    });
  });
  
  return null; // In future, will return something if an error happen
};

module.exports = Server;
