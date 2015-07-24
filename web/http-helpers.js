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

exports.sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
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

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  exports.readContent(asset, function(error, content) { 
    callback(content);
  });
};

exports.collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    console.log("collecting" + data + " ------ data type:" + typeof data );
    data += chunk;
  });
  
  request.on('end', function(){
    console.log("ending" + data + " ------ data type:" + typeof data );
    callback({url: data.slice(4)});
    console.log("after end");
  });
};


// As you progress, keep thinking about what helper functions you can put here!
