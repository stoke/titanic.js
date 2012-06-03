var crypto = require("crypto");

function random_string(len) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz", rands = "", n, randn, ms = new Date().getTime(), md5;
  md5 = crypto.createHash('md5');
  len = len || 32;
  
  for (n=0; n<len; n++) {
    randn = Math.abs(Math.floor(Math.random() * chars.length-1)); 		
    rands += chars[randn];
  }

  rands = md5.update(ms+rands).digest('hex').substr(0, len);
  return rands;
}

exports.random_string = random_string;