var events = ['blur', 'change', 'click', 'dblclick', 'focus', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'keydown', 'keypress', 'keyup', 'select']; // from w3c

function Input(opts) {
  this.opts = opts || {};
  this.opts.tag = 'input';
  this.events = {};
  this.id = null;
  this.context = null;
};

Input.prototype.addEvent = function(event, callback) {
  this.events[event] = callback;
};

Input.prototype.getValue = function(callback) {
  var err;
  
  if (!this.context)
    throw new Error('Input not yet added');
  
  this.context.getValue(this.id, callback);
};

Input.prototype.setValue = function(value) {
  var err;
  
  if (!this.context)
    throw new Error('Input not yet added');
  
  this.context.setValue(this.id, value);
};
  
// Creating aliases
events.forEach(function(x) {
  Input.prototype[x] = function(callback) { this.addEvent.apply(this, [x, callback]); }
});

module.exports = Input;