var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

// exports.handleRequest = function (req, res) {
//   res.end(archive.paths.list);
// };


var actions = {
  'GET': function(request, response){
    if(request.url === '/'){
      // use index.html
      console.log("request.url home");
      httpHelpers.serveAssets(response, archive.paths.siteAssets + "/index.html", response.end);

    } else { // not home dir
      console.log("request.url other urls");
      if(archive.isUrlArchived(request.url, function(exists){ return exists; })){ // file is is archivedSites
        httpHelpers.readContent(archive.paths.archivedSites + "/" + request.url, function(error, content) { 
          response.end(content);
        });

      } else {
      console.log("REQUESTED URL IS NOT ARCHIVED!");
        response.writeHead(404, httpHelpers.headers);
        response.end();
      }
    }
  },
  'POST': function(request, response){
    console.log("Posting");
    httpHelpers.collectData(request, function(data){
      archive.addUrlToList(data.url);
      response.writeHead(302, httpHelpers.headers);
      response.end();
    });
  },
  // 'OPTIONS': function(request, response){
  //   // utils.sendResponse(response);
  // }
};

exports.handleRequest = function (request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);
  
  var action = actions[request.method];
  if(action) {
    action(request, response);
  } else {
    response.writeHead(404, httpHelpers.headers);
    response.end();
  }
};