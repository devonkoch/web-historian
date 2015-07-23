var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!


var actions = {
  'GET': function(request, response){
    if(request.url === '/'){
      // use index.html
      httpHelpers.serveAssets(response, archive.paths.siteAssets + "/index.html", function(content){
        httpHelpers.sendResponse(response, content);
      });

    } else { // not home dir
      archive.isUrlArchived(request.url, function(exists){ 
        if(exists) {
          httpHelpers.serveAssets(response, archive.paths.archivedSites + request.url, function(content){
            httpHelpers.sendResponse(response, content);
          });
        } else {
          httpHelpers.sendResponse(response, null, 404);
        }
      });
    }
  },
  'POST': function(request, response){
    httpHelpers.collectData(request, function(data){
      archive.addUrlToList(data.url);
      httpHelpers.sendResponse(response, null, 302);
    });
  },
  'OPTIONS': function(request, response){
    // utils.sendResponse(response);
    
  }
};

exports.handleRequest = function (request, response) {

  
  var action = actions[request.method];
  if(action) {
    action(request, response);
  } else {
    httpHelpers.sendResponse(response, null, 404);
  }
};