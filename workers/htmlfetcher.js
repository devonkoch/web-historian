// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require('http-request');

module.exports.fetchHTML = function(url, callback){
  // shorthand syntax, buffered response
  http.get(url, function (err, res) {
    if (err) {
      console.error(err);
      return;
    }
    
    callback(res.buffer.toString());
    // console.log(res.code);
  });
};