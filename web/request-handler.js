var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

// exports.handleRequest = function (req, res) {
//   res.end(archive.paths.list);
// };

exports.handleRequest = function (request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  // if the request's url is merely a '/', it's in the home directory
  
  if(request.method === 'GET'){
    if(request.url === '/'){
      // use index.html
      console.log("request.url home");
      httpHelpers.readContent(archive.paths.siteAssets + "/index.html", function(error, content) { 
        response.end(content);
      });
    } else {
      console.log(archive.isUrlArchived(request.url) + 'THIS IS THE FUNCTION invocation');
      if(!archive.isUrlArchived(request.url)){
      console.log("request.url archived");

        response.writeHead(404, httpHelpers.headers);
        response.end();
      } else {
      console.log("request.url other urls");
        httpHelpers.readContent(archive.paths.archivedSites + request.url, function(error, content) { 
          response.end(content);
        });
      }
    }
  } else if (request.method === 'POST') {
    httpHelpers.collectData(request, function(data){
      archive.addUrlToList(data.url);
      response.writeHead(302, httpHelpers.headers);
      response.end();
    });
  }

};