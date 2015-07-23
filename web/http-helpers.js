var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};


exports.readContent = function(path, callback){
  fs.readFile(path , 'utf8', function (error, content){
    if(error){
      return callback(error);
    } else {
      callback(null, content);
    }
  });
};

exports.collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    console.log(data + '   ======    data before adding "chunk" to it');
    data += chunk;
    console.log(data + ' ==== after adding "chunk" to it');
  });
  
  request.on('end', function(){
    console.log(data + ' ==== after the "on end"');
    callback(JSON.parse(data));
    console.log(data + ' ==== after the parsing');
  });
};


// As you progress, keep thinking about what helper functions you can put here!
