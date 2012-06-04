var util = require('./util.js');

function Context(socket, server) {
  var self = this;
  
  this.server = server;
  this.socket = socket;
  this.events = {};
  this.currentElement = null; // Needed for apply
  
  this.socket.on('event', function(data) {
    self.scheduler(data);
  });
};

Context.prototype.getHTML = function(callback) {
  this.socket.emit('html');
  
  this.socket.on('html', function(data) {
    callback(null, data); 
  });
};

Context.prototype.setHTML = function(html) {
  this.socket.emit('html', {html: html});
};

Context.prototype.add = function(elements) {
  var self = this, items = {elements: []}, events = {events: []};
  
  if (!Array.isArray(elements)) { // single insertion
    elements = [elements];
  }
  
  elements.forEach(function(element) {
    var opts = element.opts, event;
    
    if (opts.id !== false && !opts.id) {
      opts.id = util.random_string();
      element.id = opts.id;
    }
    
    element.context = self;
    
    items.elements.push(opts);
    
    // element.events is an hash like {'click': function ...}, we will transform this into {'id': {'click': function()...}}
    self.events[opts.id] = {};
    
    for (var i in element.events) {
      if (element.events.hasOwnProperty(i)) {
        self.events[opts.id][i] = element.events[i];
        event = {};
        event[opts.id] = i;
        events.events.push(event);
      }
    }
  });
  
  items.action = 'add';
  self.socket.emit('element', items);
  
  if (Object.keys(events).length !== 0) // If there are events
    self.socket.emit('event', events); 
    
  return elements;
};

// Just an add for "br" element -- will have an id, to fix
Context.prototype.insertBreak = function() {
  this.add({opts: {tag: 'br'}});
};

Context.prototype.getValue = function(id, callback) {
  var self = this;
  if (!callback) {
    callback = id;
    id = this.currentElement.id;
  }
  
  this.socket.emit('get_value', {element: id});
  this.socket.on('value', function(data) {
    callback(data);
    self.socket.removeAllListeners('value'); // Everything is async, no concurrency problems. loving nodejs
  });
};

Context.prototype.setValue = function(id, value) {
  if (!value) {
    value = id;
    id = this.currentElement.id;
  }
  
  this.socket.emit('set_value', {element: id, value: value});
};

Context.prototype.addStyleSheet = function(css) {
  this.socket.emit('css', css);
};

Context.prototype.addLocalStyleSheet = function(css) {
  this.server.serve(css);
  this.addStyleSheet(css);
};

Context.prototype.addScript = function(js) {
  this.socket.emit('js', js);
};

Context.prototype.addLocalScript = function(js) {
  this.server.serve(js);
  this.addScript(js);
};

// Event Scheduler
Context.prototype.scheduler = function(data) {
  if (typeof this.events[data.element.id] !== "undefined" && typeof this.events[data.element.id][data.event] !== "undefined") {
    this.currentElement = data.element;
    this.events[data.element.id][data.event].apply(this);
    this.currentElement = null;
  }
};

module.exports = Context;