var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require('../web/http-helpers.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){

  httpHelpers.readContent(exports.paths.list, function(error, urls){

    console.log(urls + 'here are the urls!!!!!!!!');



    callback(urls.split('\n'));
  });  

};

exports.isUrlInList = function(url){

  return exports.readListOfUrls.indexOf(url) !== -1;

};

exports.addUrlToList = function(url){

  fs.appendFile(exports.paths.list, url + "\n", function(error) { 
    if (error){
      console.log(error);
    }
  });

};

exports.isUrlArchived = function(url){

  var fullPath = exports.paths.archivedSites + url;

  var result = false;

  fs.stat(fullPath, function(err, stat) {
    if(err == null) {
        console.log('File exists');
        result = true;
    }
  });
  
  return result;

};

exports.downloadUrls = function(){
};
