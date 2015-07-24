var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
var http = require('http-request');
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
          console.log("url isn't archived");
          httpHelpers.sendResponse(response, null, 404);
        }
      });
    }
  },
  'POST': function(request, response){
    console.log("POST");
    httpHelpers.collectData(request, function(data){

      archive.isUrlInList(data.url, function(urlInList){
        if(urlInList){
          // return content of the url
          httpHelpers.serveAssets(response, archive.paths.archivedSites + "/" + data.url, function(content){
            httpHelpers.sendResponse(response, content);
          });          

        } else {
          archive.addUrlToList(data.url);
          archive.downloadUrls([data.url]);
          archive.writeToExistingFile(data.url);
          // TODO: use html fetcher to scrape the content at the url
          httpHelpers.serveAssets(response, archive.paths.siteAssets + "/loading.html", function(content){
            httpHelpers.sendResponse(response, content, 302);
          });
      }
    });
    });
  },
  'OPTIONS': function(request, response){
    console.log("Options");
    httpHelpers.sendResponse(response);
  }
};

exports.handleRequest = function (request, response) {
  
  console.log("we're getting a request atm: " + request.method);
  
  var action = actions[request.method];

  
  if(action) {
    action(request, response);
  } else {
    console.log("action not found");
    httpHelpers.sendResponse(response, null, 404);
  }
};