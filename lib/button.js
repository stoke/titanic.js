var events = ['blur', 'click', 'dblclick', 'focus', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'keydown', 'keypress', 'keyup']; // from w3c

function Button(opts) {
  this.opts = opts || {};
  this.opts.tag = 'button';
  this.events = {};
  this.id = null;
  this.context = null;
};

Button.prototype.addEvent = function(event, callback) {
  this.events[event] = callback;
};

// Just an alias
Button.prototype.getValue = function(callback) {
  var err;
  
  if (!this.context) {
    err = new Error('Button not yet added');
    return callback(err);
  }
  
  this.context.getValue(this.id, callback);
};
  
// Just an alias
Button.prototype.setValue = function(value) {
  var err;
  
  if (!this.context) {
    err = new Error('Button not yet added');
    return callback(err);
  }
  
  this.context.setValue(this.id, value);
};
  
// Creating aliases
events.forEach(function(x) {
  Button.prototype[x] = function(callback) { this.addEvent.apply(this, [x, callback]); }
});

module.exports = Button;