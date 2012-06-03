// Slightly modified version of socket.io default logger
// Configured to be silent

function toArray(enu) { // from socket.io util.js
  var arr = [];

  for (var i = 0, l = enu.length; i < l; i++)
    arr.push(enu[i]);

  return arr;
};

var levels = [
    'error'
  , 'warn'
  , 'info'
  , 'debug'
];

var Logger = function (opts) {
  opts = opts || {}
  this.colors = false !== opts.colors;
  this.level = 3;
  this.enabled = true;
};

Logger.prototype.log = function (type) {}; // blank function
levels.forEach(function (name) {Logger.prototype[name] = function () {this.log.apply(this, [name].concat(toArray(arguments)));};});
module.exports = new Logger;